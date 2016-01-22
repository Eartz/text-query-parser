var gulp = require('gulp');
var mocha = require('gulp-mocha');

gulp.task('default', function() {
    
});

gulp.task('mocha', function() {
    return gulp.src('test/test.js')
        .pipe(mocha());
});
