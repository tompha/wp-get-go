"use strict";

/**
 * Required packages
 */
const gulp        = require('gulp-help')(require('gulp'));
const sass        = require('gulp-sass');
const sourcemap   = require('gulp-sourcemaps');
const prefix      = require('gulp-autoprefixer');
const concat 	  = require('gulp-concat');
const watch       = require('gulp-watch');
const notifier    = require('node-notifier');
const colors      = require('colors');
const util        = require('gulp-util');
const uglify      = require('gulp-uglify');
const argv        = require('yargs').argv;
const browserify  = require('browserify');
const babelify    = require('babelify');
const source      = require('vinyl-source-stream');
const buffer      = require('vinyl-buffer');
const plumber     = require('gulp-plumber');
const browserSync = require('browser-sync').create();

/**
 * Task definitions
 */
gulp.task('compile:styles', function() {
    let stream = gulp.src('./app/styles/app.scss').pipe(plumber({
        errorHandler: function(error) {
            let errorObject = JSON.parse(JSON.stringify(error));

            util.log(colors.red('COMPILATION ERROR'));
            console.log('File: ' + errorObject.relativePath);
            console.log('Line: ' + errorObject.line + ':' + errorObject.column);
            console.log(errorObject.message.replace(errorObject.relativePath + "\n", ''));

            notifier.notify({
                title: 'Error in ' + errorObject.relativePath,
                message: errorObject.relativePath + ' on line ' + errorObject.line + ':' + errorObject.column
            });

            this.emit('end');
        }
    }));

    stream = stream.pipe(sourcemap.init());
    stream = stream.pipe(sass({ outputStyle: (argv.compress ? 'compressed' : 'expanded' ) }));
    stream = stream.pipe(prefix('last 2 versions'));
    stream = stream.pipe(concat('app.css'));
    stream = stream.pipe(argv.compress ? util.noop() : sourcemap.write());
    stream = stream.pipe(gulp.dest('./public/css/'));

    return stream.pipe(browserSync.stream());
});

gulp.task('compile:scripts', function() {
    let bundle = browserify('./app/scripts/app.js').transform(babelify, {
        presets: ['env'],
        compact: false
    }).bundle().on('error', function(error) {
        util.log(colors.red('COMPILATION ERROR'));

        let notificationArgs = {};

        if (error.hasOwnProperty('filename')) {
            console.log(error.codeFrame);
            notificationArgs['title'] = 'Error in ' + error.filename.split('/').pop();
            notificationArgs['message'] = error.filename.split('').pop() + ' on line ' + error.loc.line + ':' + error.loc.column;
        } else {
            notificationArgs['title'] = 'Script compilation error';
        }

        notifier.notify(notificationArgs);
        this.emit('end');
    });

    bundle = bundle.pipe(source('app.js'));
    bundle = bundle.pipe(buffer());
    bundle = bundle.pipe(sourcemap.init());
    bundle = bundle.pipe(argv.compress ? uglify() : util.noop());
    bundle = bundle.pipe(argv.compress ? util.noop() : sourcemap.write());
    bundle = bundle.pipe(gulp.dest('./public/js/'));

    return bundle.pipe(browserSync.stream());
});

gulp.task('watch:styles', function() {
    gulp.watch('app/styles/**/*.scss', ['compile:styles']);
});

gulp.task('watch:scripts', function() {
    gulp.watch('app/scripts/**/*.js', ['compile:scripts'], browserSync.reload());
});

gulp.task('watch:templates', function() {
    gulp.watch('**/*.php').on('change', () => browserSync.reload());
});

gulp.task('bs:sync', function() {
    browserSync.init({
        proxy: argv.proxy,
        injectChanges: true,
        debugInfo: false
    });
});

gulp.task('watch', ['bs:sync', 'watch:templates', 'watch:styles', 'watch:scripts']);
gulp.task('compile', ['compile:styles', 'compile:scripts']);

/**
 * Error handling
 */
function stylesError(error) {
    let errorObject = JSON.parse(JSON.stringify(error));
    let notificationArgs = {
        title: 'Error in ' + errorObject.relativePath
    };

    util.log(colors.red('COMPILATION ERROR'));

    if (Object.keys(errorObject).length > 0) {
        console.log('File: ' + errorObject.relativePath);
        console.log('Line: ' + errorObject.line + ':' + errorObject.column);
        console.log(errorObject.message.replace(errorObject.relativePath + "\n", ''));
        notificationArgs.message = errorObject.relativePath + ' on line ' + errorObject.line + ':' + errorObject.column;
    } else {
        console.log(error);
    }

    notifier.notify(notificationArgs);
    this.emit('end');
};