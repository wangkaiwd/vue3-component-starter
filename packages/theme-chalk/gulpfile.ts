import less from 'gulp-less';
import autoPrefixer from 'gulp-autoprefixer';
import { dest, parallel, series, src } from 'gulp';
import cleanCss from 'gulp-clean-css';
import path from 'path';
import { outDir } from '../../build/utils/paths';
import { withTaskName } from '../../build/utils';

const css = () => src('./css/*.less')
  .pipe(less())
  .pipe(autoPrefixer({ cascade: false }))
  .pipe(cleanCss());
const font = () => src('./fonts/**').pipe(cleanCss());

const copyFullCss = (format: string, type: string) => {
  return css().pipe(dest(path.resolve(outDir, `${format}/theme-chalk/${type}`)));
};
const copyFullFont = (format: string, type: string) => {
  return font().pipe(dest(path.resolve(outDir, `${format}/theme-chalk/${type}`)));
};
export default parallel(
  withTaskName('copyCssToEs', () => {
    return copyFullCss('es', 'css');
  }),
  withTaskName('copyCssToLib', () => {
    return copyFullCss('lib', 'css');
  }),
  withTaskName('copyFontToEs', () => {
    return copyFullFont('es', 'fonts');
  }),
  withTaskName('copyFontToLib', () => {
    return copyFullFont('lib', 'fonts');
  })
);

