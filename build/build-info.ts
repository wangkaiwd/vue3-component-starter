import path from 'path';
import { outDir } from './utils/paths';

export const buildConfig = {
  esm: {
    module: 'ESNext',
    output: {
      name: 'es',
      path: path.resolve(outDir, 'es')
    }
  },
  cjs: {
    module: 'CommonJS',
    output: {
      name: 'lib',
      path: path.resolve(outDir, 'lib')
    }
  }
};
