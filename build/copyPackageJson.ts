import { run } from './utils';
import { csRoot, outDir } from './utils/paths';
import path from 'path';

export const copyPackageJson = () => {
  const src = path.resolve(csRoot, 'package.json');
  return run(`cp -r ${src} ${outDir}`);
};
