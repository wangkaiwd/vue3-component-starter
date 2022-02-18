import { parallel, series } from 'gulp';
import { run, withTaskName } from './utils';

export default series(
  withTaskName('clean', () => run('rm -rf ./dist')),
  parallel(
    // withTaskName('build', () => run('pnpm build --parallel --filter ./packages')),
    withTaskName('buildFullComponents', () => run('pnpm build buildFullComponents')),
    // withTaskName('buildComponents', () => run('pnpm build buildComponents'))
  )
);

export * from './full-components';
export * from './components';
export { tsConfig } from './utils/paths';
