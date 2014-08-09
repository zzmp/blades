var bower     = require('./bower.json'),
    sh        = require('shelljs'),
    gulp      = require('gulp'),
    notify    = require('gulp-notify'),
    jshint    = require('gulp-jshint'),
    stylish   = require('jshint-stylish'),
    mocha     = require('gulp-mocha'),
    concat    = require('gulp-concat'),
    uglify    = require('gulp-uglify');

var dependencies = [];

var paths = JSON.parse(
  sh.exec('./node_modules/.bin/bower list --paths --json', { silent: true })
    .output);

for (var dependency in paths)
  if (dependency in bower.dependencies)
    dependencies.push(paths[dependency]);

var paths = {
  blades: ['./src/*.js'],
  preamble: ['./build/preamble.js'],
  postamble: ['./build/postamble.js'],
  tests: ['./tests/**/*.js'],
  dependencies: dependencies,
};

// lint scripts
gulp.task('lint', function () {
  return gulp.src(paths.blades)
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
  gulp.src(dependencies.concat(paths.preamble, paths.blades, paths.postamble))
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
  gulp.watch(paths.blades, ['lint', 'test', 'build']);
  gulp.watch(paths.tests, ['test']);
});

// kick it all off
gulp.task('default', ['lint', 'test', 'build', 'watch']);
