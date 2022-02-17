import less from 'gulp-less';
import autoPrefixer from 'gulp-autoprefixer';
import { dest, parallel, src } from 'gulp';
import cleanCss from 'gulp-clean-css';
import path from 'path';
import { outDir } from '../../build/utils/paths';
import { withTaskName } from '../../build/utils';

const css = src('./src/*.less')
  .pipe(less())
  .pipe(autoPrefixer({ cascade: false }))
  .pipe(cleanCss());
const font = src('./src/fonts/**').pipe(cleanCss());


export default parallel(
  withTaskName('copyCssToLib', () => {
    return css.pipe(dest(path.resolve(outDir, 'lib/theme-chalk/css')));
  }),
  withTaskName('copyCssToEs', () => {
    return css.pipe(dest(path.resolve(outDir, 'es/theme-chalk/css')));
  }),
  withTaskName('copyFontToLib', () => {
    return font.pipe(dest(path.resolve(outDir, 'lib/theme-chalk/fonts')));
  }),
  withTaskName('copyFontToEs', () => {
    return font.pipe(dest(path.resolve(outDir, 'es/theme-chalk/fonts')));
  })
);

