import { parallel, series } from 'gulp';
import { OutputOptions, rollup } from 'rollup';
import path from 'path';
import { csRoot, outDir } from './utils/paths';
import { buildByRollup, createInputConfig } from './utils/rollupConfig';
import { generateTypes } from './utils/generateTypes';
import { run } from './utils';

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
// cwd,outDir
const generateEntryTypes = async () => {
  await generateTypes({
    cwd: csRoot,
    outDir: path.resolve(outDir, 'types/entry'),
    replace: (source) => {
      return source.replace('@sppk', '.');
    },
    skipFileDependencyResolution: true
  });
};

const copyEntryTypes = () => {
  const copy = (format: string) => {
    const src = path.resolve(outDir, 'types/entry/*');
    const dest = path.resolve(outDir, format);
    return () => run(`cp -r ${src} ${dest}`);
  };
  return parallel(copy('es'), copy('lib'));
};
export const buildFullComponents = parallel(buildFull, buildEntry, series(generateEntryTypes, copyEntryTypes()));

