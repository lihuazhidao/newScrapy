var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('sass', function () {
    return sass('./style/*.scss',{sourcemap:true})
        .on('error', sass.logError)
        .pipe(sourcemaps.write('./',{
            includeContent:true,
            sourceRoot:'./style'
        }))
        .pipe(gulp.dest('./plugins'));
});


gulp.task('sass:watch', function () {
    gulp.watch('./style/*.scss', ['sass']);
});