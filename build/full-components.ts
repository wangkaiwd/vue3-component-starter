import { parallel } from 'gulp';
import { OutputOptions, rollup } from 'rollup';
import path from 'path';
import { csRoot, outDir } from './utils/paths';
import { buildByRollup, createInputConfig } from './utils/rollupConfig';

const buildFull = async () => {
  const outputOptions: OutputOptions[] = [
    {
      format: 'umd',
      file: path.resolve(outDir, 'index.js'),
      name: 'ComponentsStarter',
      exports: 'named',
      globals: {
        vue: 'Vue'
      }
    },
    {
      format: 'es',
      file: path.resolve(outDir, 'index.esm.js')
    }
  ];
  const bundle = await rollup(createInputConfig(path.resolve(csRoot, 'index.ts')));
  return Promise.all(outputOptions.map(output => bundle.write(output)));
};
const buildEntry = async () => {
  const input = path.resolve(csRoot, 'index.ts');
  const outputFile = 'index.js';
  return buildByRollup(input, outputFile);
};
export const buildFullComponents = parallel(buildEntry);

