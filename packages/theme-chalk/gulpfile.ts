import less from 'gulp-less';
import autoPrefixer from 'gulp-autoprefixer';
import { dest, parallel, src } from 'gulp';
import cleanCss from 'gulp-clean-css';
import path from 'path';
import { outDir } from '../../build/utils/paths';

const copyFullCss = () => {
  return src('./css/*.less')
    .pipe(less())
    .pipe(autoPrefixer({ cascade: false }))
    .pipe(cleanCss()).pipe(dest(path.resolve(outDir, `theme-chalk/css`)));
};
const copyFullFont = () => {
  return src('./fonts/**').pipe(cleanCss()).pipe(dest(path.resolve(outDir, `theme-chalk/fonts`)));
};
export default parallel(
  copyFullCss,
  copyFullFont
);

