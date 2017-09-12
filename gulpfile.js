'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var electron = require('electron-connect').server.create();

gulp.task('css', function() {
  gulp.src('./css/main.scss')
    .pipe(sass())
    .pipe(gulp.dest('./css'))

  electron.reload();
});

gulp.task('watch', function () {
  // Start browser process
  electron.start();

  // Restart browser process
  gulp.watch('main.js', electron.restart);

  // Reload renderer process
  gulp.watch(['index.js', 'index.html', 'html/*', 'js/*', 'js/libs/*', 'css/*'], electron.reload);
  gulp.watch('css/*.scss', ['css']);
});

gulp.task('default', ['watch']);
