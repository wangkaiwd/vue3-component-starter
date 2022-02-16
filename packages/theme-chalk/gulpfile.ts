import less from 'gulp-less';
import autoPrefixer from 'gulp-autoprefixer';
import { dest, parallel, series, src } from 'gulp';
import cleanCss from 'gulp-clean-css';
import path from 'path';

const compile = () => {
  return src('./src/*.less')
    .pipe(less())
    .pipe(autoPrefixer({ cascade: false }))
    .pipe(cleanCss())
    .pipe(dest(path.resolve(__dirname, './dist/css')));
};

const copyFont = () => {
  return src('./src/fonts/**').pipe(cleanCss()).pipe(dest(path.resolve(__dirname, './dist/fonts')));
};
const copyFullStyle = () => {
  return src('./dist/**').pipe(dest(path.resolve(__dirname, '../../dist/theme-chalk')));
};
export default series(
  parallel(compile, copyFont),
  copyFullStyle
);
