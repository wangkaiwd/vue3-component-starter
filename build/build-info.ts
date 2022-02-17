import path from 'path';
import { outDir } from './utils/paths';

export const buildConfig = {
  esm: {
    module: 'ESNext',
    format: 'es',
    output: {
      name: 'es',
      path: path.resolve(outDir, 'es')
    }
  },
  cjs: {
    module: 'CommonJS',
    format: 'cjs',
    output: {
      name: 'lib',
      path: path.resolve(outDir, 'lib')
    }
  }
};
