import { tsConfig } from './paths';
import vue from 'rollup-plugin-vue';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import ts from 'rollup-plugin-typescript2';
import { ModuleFormat, OutputOptions, rollup } from 'rollup';
import path from 'path';
import { buildConfig } from '../build-info';

export const createInputConfig = (input: string | string[]) => {
  return {
    input,
    external: (id: string) => /^vue/.test(id) || /^@sppk/.test(id),
    plugins: [
      // vue need to put first position
      vue(),
      resolve(),
      commonjs(),
      ts({
        tsconfig: tsConfig,
        tsconfigOverride: {
          compilerOptions: {
            sourceMap: false
          }
        }
      }),
    ]
  };
};

// usage as following
// import { Icon } from '@sppk/components/icon' -> import {} from '@sppk/components/${format}/starter/components/icon'
export const pathRewrite = (format: string) => {
  return (id: string) => id.replace('@sppk', `@sppk/components-starter/${format}`);
};
export const buildByRollup = async (input: string | string[], outPutFile: string) => {
  const bundle = await rollup(createInputConfig(input));
  return Promise.all(Object.values(buildConfig).map((config) => {
    const outputOptions: OutputOptions = {
      format: config.format as ModuleFormat,
      file: path.join(config.output.path, outPutFile),
      exports: 'named',
      paths: pathRewrite(config.output.name)
    };
    return bundle.write(outputOptions);
  }));
};
