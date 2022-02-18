import { Project } from 'ts-morph';
import path from 'path';
import { projectRoot, tsConfig } from './paths';
import glob from 'fast-glob';
import fs from 'fs/promises';
import { parse } from '@vue/compiler-sfc';
import { pathRewrite } from './rollupConfig';

interface Options {
  cwd: string;
  outDir: string;
  replace?: (source: string) => string;
  skipFileDependencyResolution?: boolean;
}

export const generateTypes = async ({
  cwd,
  outDir,
  replace = pathRewrite('es'),
  skipFileDependencyResolution = false
}: Options) => {
  const project = new Project({
    compilerOptions: {
      // must to config declaration:true
      declaration: true,
      emitDeclarationOnly: true,
      outDir,
      rootDir: cwd,
      baseUrl: projectRoot,
      paths: {
        '@sppk/*': ['packages/*'],
      },
      preserveSymlinks: true,
    },
    tsConfigFilePath: tsConfig,
    skipFileDependencyResolution,
    skipAddingFilesFromTsConfig: true,
  });
  const filePaths = await glob('**/*', {
    cwd,
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
      // fixme: there directly replace may be occur problem, improve to replace import or require statement better
      await fs.writeFile(filePath, replace(outputFile.getText()), 'utf8');
    });
    await Promise.all(subTasks);
  });
  await Promise.all(tasks);
};
