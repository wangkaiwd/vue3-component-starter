import path from 'path';

export const projectRoot = path.resolve(__dirname, '../../');
export const outDir = path.resolve(projectRoot, 'dist');
export const csRoot = path.resolve(projectRoot, 'packages/components-starter');
export const cRoot = path.resolve(projectRoot, 'packages/components');
export const tsConfig = path.resolve(projectRoot, 'tsconfig.json');
