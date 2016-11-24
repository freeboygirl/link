'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var buffer = require('vinyl-buffer');
var openURL = require('open');
var lazypipe = require('lazypipe');
var rimraf = require('rimraf');
var wiredep = require('wiredep').stream;
var runSequence = require('run-sequence');
var babel = require('gulp-babel');

var srcScriptsFolder = 'src';
var distScriptsFolder = 'dist';
var demoScriptsFolder = 'demo';
var targetLibName = 'link.js';

var env = "dev";
var args = process.argv;

if (args.indexOf('-p') > -1) {
  env = 'prod';
}

function isDevMode() {
  return env === 'dev';
}

gulp.task('clean:dist', function (cb) {
  rimraf('dist', cb);
});

gulp.task('build:lib', function () {
  gulp.src(
    [
      srcScriptsFolder + '/link.prefix.js',
      srcScriptsFolder + '/parts/**/*.js',
      srcScriptsFolder + '/link.suffix.js'
    ])
    .pipe(buildScripts(targetLibName));
});

function buildScripts(destFileName) {
  return lazypipe()
    .pipe($.plumber)
    .pipe(function () {
      return $.if(isDevMode(), $.sourcemaps.init());
    })
    .pipe($.concat, destFileName)
    .pipe(babel, {
      presets: ['es2015']
    })
    .pipe(function () {
      return $.if(!isDevMode(), $.uglify({ mangle: true }));
    })
    .pipe(function () {
      return $.if(isDevMode(), $.sourcemaps.write('./'));
    })
    .pipe(gulp.dest, distScriptsFolder)
    .pipe(gulp.dest, demoScriptsFolder).call();
};

gulp.task('watch', function () {
  gulp.watch([srcScriptsFolder + '/**/*.js', 'demo/**/*.html'],
    [
      'build:lib',
      'reload'
    ]);
});

gulp.task('reload', function () {
  gulp.src('src/**/*')
    .pipe($.connect.reload());
});

gulp.task('run', function (cb) {
  runSequence(
    'clean:dist',
    'build:lib',
    'watch',
    'start:client',
    cb);
});

gulp.task('start:client', ['start:server'], function () {
  openURL('http://localhost:9009');
});

gulp.task('start:server', function () {
  $.connect.server({
    root: 'demo',
    livereload: true,
    port: 9009
  });
});


gulp.task('default', ['run']);

// for product , run gulp build -p

