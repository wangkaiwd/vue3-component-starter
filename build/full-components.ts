import { parallel } from 'gulp';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import ts from 'rollup-plugin-typescript2';
import vue from 'rollup-plugin-vue';
import { OutputOptions, rollup } from 'rollup';
import path from 'path';
import { csRoot, outDir, projectRoot } from './utils/paths';

const tsConfig = path.resolve(projectRoot, 'tsconfig.json');

const buildFull = async () => {
  const config = {
    input: path.resolve(csRoot, 'index.ts'),
    external: (id: string) => /^vue/.test(id),
    plugins: [
      //
      vue(),
      resolve(),
      commonjs(),
      ts({
        tsconfig: tsConfig,
        tsconfigOverride: {
          compilerOptions: { sourceMap: false }
        }
      }),
    ]
  };
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
  const bundle = await rollup(config);
  return Promise.all(outputOptions.map(output => bundle.write(output)));
};
export const buildFullComponents = parallel(buildFull);

