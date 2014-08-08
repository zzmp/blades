var gulp      = require('gulp'),
    notify    = require('gulp-notify'),
    jshint    = require('gulp-jshint'),
    stylish   = require('jshint-stylish'),
    mocha     = require('gulp-mocha'),
    concat    = require('gulp-concat'),
    uglify    = require('gulp-uglify');

var paths = {
  scripts: ['./src/**/*.js'],
  tests: ['./tests/**/*.js'],
  preamble: ['./build/preamble.js'],
  postamble: ['./build/postamble.js'],
};

// lint scripts
gulp.task('lint', function () {
  return gulp.src(paths.scripts)
    .pipe(jshint({ lookup: false }))
    .pipe(jshint.reporter(stylish))
    .pipe(notify({message: 'Jshint done'}));
});

// test changes
gulp.task('test', function() {
  return gulp.src(paths.tests)
    .pipe(mocha({ bail: true, reporter: 'nyan' }));
});

// build dist
gulp.task('build', function() {
  // concatenate
  console.log(paths.preamble.concat(paths.scripts, paths.postamble));
  gulp.src(paths.preamble.concat(paths.scripts, paths.postamble))
    .pipe(concat('blades.js'))
    .pipe(gulp.dest('.'));
  // minify
  gulp.src('./blades.js')
    .pipe(concat('blades.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('.'));
});

// watch all for changes
gulp.task('watch', function () {
  gulp.watch(paths.scripts, ['lint', 'test', 'build']);
  gulp.watch(paths.tests, ['test']);
});

// kick it all off
gulp.task('default', ['lint', 'test', 'build', 'watch']);
