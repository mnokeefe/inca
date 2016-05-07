var gulp = require('gulp');
var postcss = require('gulp-postcss');
var sass = require('gulp-sass');
var autoprefixer = require('autoprefixer');
var connect = require('gulp-connect');
var nunjucksRender = require('gulp-nunjucks-render');
var data = require('gulp-data');
var moment = require('moment');

// Source Paths
var paths = {
  js: './src/js/**/*.js',
  css: './src/scss/**/*.scss',
  models: './src/models/**/*.json'
};

// CSS with SCSS
gulp.task('css', function () {
  var processors = [
    autoprefixer({browsers: ['last 1 version']})
  ];
  return gulp.src(paths.css)
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(processors))
    .pipe(gulp.dest('./build/css'))
    .pipe(connect.reload());
});

// HTML with Nunjucks templating
var manageEnvironment = function(environment) {
  environment.addFilter('date', function(str) {
    return moment(str).format('D MMMM YYYY');
  });
}

gulp.task('html', function() {
  return gulp.src('./src/pages/**/*.nunjucks')
  .pipe(data(function() {
    return require('./src/models/global.json')
  }))
  .pipe(nunjucksRender({
    path: 'src/templates',
    manageEnv: manageEnvironment
  }))
  .pipe(gulp.dest('./build'))
  .pipe(connect.reload());
});

// JS
gulp.task('js', function () {
  gulp.src(paths.js)
    .pipe(gulp.dest('./build/js'))
    .pipe(connect.reload());
});

// Dev Server
gulp.task('connect', function() {
  connect.server({
    root: 'build',
    port: 3000,
    livereload: true
  });
});

// Watchers
gulp.task('watch', function () {
  gulp.watch(['./src/templates/**/*.nunjucks', './src/pages/**/*.nunjucks', paths.models], ['html']);
  gulp.watch(paths.css, ['css']);
  gulp.watch(paths.js, ['js']);
});

// Default Task
gulp.task('default', ['connect', 'watch']);
