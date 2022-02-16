import { series } from 'gulp';
import { run, withTaskName } from './utils';
export default series(
  withTaskName('clean', () => run('rm -rf ./dist')),
  // withTaskName('build', () => run('pnpm build --parallel --filter ./packages')),
  withTaskName('buildFullComponents', () => run('pnpm build buildFullComponents'))
);

export * from './full-components';
