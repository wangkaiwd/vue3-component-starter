import glob from 'fast-glob';
import { cRoot, outDir, projectRoot, tsConfig } from './utils/paths';
import path from 'path';
import { ModuleFormat, OutputOptions, rollup } from 'rollup';
import { buildConfig } from './build-info';
import { createInputConfig, pathRewrite } from './utils/rollupConfig';
import { parallel } from 'gulp';
import { Project } from 'ts-morph';
import fs from 'fs/promises';
import { parse } from '@vue/compiler-sfc';

const buildComponent = async (dir: string) => {
  const bundle = await rollup(createInputConfig(path.resolve(cRoot, `${dir}/index.ts`)));
  return Promise.all(Object.entries(buildConfig).map(([module, config]) => {
    const outputOptions: OutputOptions = {
      format: config.format as ModuleFormat,
      file: path.resolve(config.output.path, 'components', dir, 'index.js'),
      exports: 'named',
      paths: pathRewrite(config.output.name)
    };
    return bundle.write(outputOptions);
  }));
};

const build = async () => {
  const dirs = await glob('*', { cwd: cRoot, onlyDirectories: true });
  const tasks = dirs.map(buildComponent);
  return Promise.all(tasks);
};

const genTypes = async () => {
  const project = new Project({
    compilerOptions: {
      emitDeclarationOnly: true,
      outDir,
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
  const sourceFiles = [];
  // await Promise.all
  await Promise.all(filePaths.map(async (filePath) => {
    if (filePath.endsWith('.vue')) {
      const source = await fs.readFile(filePath, 'utf-8');
      const { descriptor } = parse(source);
      const { script } = descriptor;
      if (script) {
        const scriptContent = script.content;
        sourceFiles.push(project.createSourceFile(filePath + '.ts', scriptContent));
      }
    }
    if (filePath.endsWith('.ts')) {
      project.addSourceFileAtPath(filePath);
    }
  }));
  await project.emit({ emitOnlyDtsFiles: true });
};

// task: an asynchronous JavaScript function
// parallel/series: return a function of the composed tasks or functions
export const buildComponents = parallel(genTypes);
