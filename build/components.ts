import glob from 'fast-glob';
import { cRoot, csRoot, outDir, projectRoot, tsConfig } from './utils/paths';
import path from 'path';
import { buildByRollup, pathRewrite } from './utils/rollupConfig';
import { parallel, series } from 'gulp';
import { Project } from 'ts-morph';
import fs from 'fs/promises';
import { parse } from '@vue/compiler-sfc';
import { run } from './utils';

const buildComponent = async (dir: string) => {
  const input = path.resolve(cRoot, `${dir}/index.ts`);
  const outputFile = `components/${dir}/index.js`;
  return buildByRollup(input, outputFile);
};

const build = async () => {
  const dirs = await glob('*', { cwd: cRoot, onlyDirectories: true });
  const tasks = dirs.map(buildComponent);
  return Promise.all(tasks);
};

const genTypes = async () => {
  const project = new Project({
    compilerOptions: {
      // must to config declaration:true
      declaration: true,
      emitDeclarationOnly: true,
      outDir: path.resolve(outDir, 'types'),
      baseUrl: projectRoot,
      paths: {
        '@sppk/*': ['packages/*'],
      },
      preserveSymlinks: true,
    },
    tsConfigFilePath: tsConfig,
    skipAddingFilesFromTsConfig: true,
  });
  const filePaths = await glob('**/*', {
    cwd: cRoot,
    onlyFiles: true,
    absolute: true
  });
  const sourceFiles: any[] = [];
  // await Promise.all
  await Promise.all(filePaths.map(async (filePath) => {
    if (filePath.endsWith('.vue')) {
      const source = await fs.readFile(filePath, 'utf8');
      const { descriptor } = parse(source);
      const { script } = descriptor;
      if (script) {
        const scriptContent = script.content;
        sourceFiles.push(project.createSourceFile(filePath + '.ts', scriptContent));
      }
    }
    if (filePath.endsWith('.ts')) {
      const sourceFile = project.addSourceFileAtPath(filePath);
      sourceFiles.push(sourceFile);
    }
  }));
  await project.emit({ emitOnlyDtsFiles: true });

  const tasks = sourceFiles.map(async (sourceFile) => {
    const emitOutput = sourceFile.getEmitOutput();
    const subTasks = emitOutput.getOutputFiles().map(async (outputFile: any) => {
      const filePath = outputFile.getFilePath();
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, pathRewrite('es')(outputFile.getText()), 'utf8');
    });
    await Promise.all(subTasks);
  });
  return Promise.all(tasks);
};

const copyTypes = () => {
  const copy = (format: string) => {
    const src = path.resolve(outDir, 'types/components/*');
    const dest = path.resolve(outDir, format, 'components');
    return () => run(`cp -r ${src} ${dest}`);
  };
  return parallel(copy('es'), copy('lib'));
};

const buildComponentsEntry = async () => {
  const input = path.resolve(cRoot, 'index.ts');
  const outputFile = 'components/index.js';
  return buildByRollup(input, outputFile);
};
// task: an asynchronous JavaScript function
// parallel/series: return a function of the composed tasks or functions
export const buildComponents = series(parallel(build, buildComponentsEntry), series(genTypes, copyTypes()));
