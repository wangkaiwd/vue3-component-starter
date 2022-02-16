import { series } from 'gulp';
import { run, withTaskName } from './utils';

export default series(
  withTaskName('clean', async () => run('rm -rf ./dist')),
  withTaskName('build', async () => run('pnpm build --parallel --filter ./packages'))
);
