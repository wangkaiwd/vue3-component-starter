import ts from 'gulp-typescript';
import { dest, parallel, src } from 'gulp';
import { buildConfig } from './build-info';
import { withTaskName } from './utils';
import path from 'path';
import { projectRoot } from './utils/paths';

export const buildPackages = (dirname: string, name: string) => {
  // example: build utils
  const inputs = [`${dirname}/**/*.ts`, '!gulpfile.ts', '!node_modules'];
  const tasks = Object.entries(buildConfig).map(([module, config]) => {
    return withTaskName(`build: ${name}:${module}`, async () => {
      const tsConfig = path.resolve(projectRoot, 'tsconfig.json');
      const tsProject = ts.createProject(tsConfig, { declaration: true, module: config.module, strict: false });
      const output = path.resolve(dirname, config.output.name);
      return src(inputs)
        .pipe(tsProject())
        .pipe(dest(output));
    });
  });
  return parallel(...tasks);
};
