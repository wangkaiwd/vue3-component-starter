import less from 'gulp-less';
import autoPrefixer from 'gulp-autoprefixer';
import { dest, parallel, series, src } from 'gulp';
import cleanCss from 'gulp-clean-css';
import path from 'path';
import { outDir } from '../../build/utils/paths';

const compile = () => {
  return src('./src/*.less')
    .pipe(less())
    .pipe(autoPrefixer({ cascade: false }))
    .pipe(cleanCss())
    .pipe(dest(path.resolve(outDir, 'theme-chalk/css')));
};

const copyFont = () => {
  return src('./src/fonts/**').pipe(cleanCss()).pipe(dest(path.resolve(outDir, 'theme-chalk/fonts')));
};
export default series(
  parallel(compile, copyFont),
);
