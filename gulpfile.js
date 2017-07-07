"use strict";

/**
 * Required packages
 */
const gulp        = require('gulp');
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
const babel       = require('gulp-babel');
const browserify  = require('browserify');
const babelify    = require('babelify');
const source      = require('vinyl-source-stream');
const buffer      = require('vinyl-buffer');

/**
 * Task definitions
 */
gulp.task('compile:styles', function() {
    gulp.src('./src/scss/main.scss')
    .pipe(sass({ outputStyle: (argv.compress ? 'compressed' : 'expanded' ) })).on('error', compilerError)
    .pipe(prefix('last 2 versions')).on('error', compilerError)
    .pipe(concat('theme.css')).on('error', compilerError)
    .pipe(argv.compress ? util.noop() : sourcemap.write('maps')).on('error', compilerError)
    .pipe(gulp.dest('./assets/css/'));
});

gulp.task('compile:scripts', function() {
    let _targets = {
        libraries: {
            targetName: 'libraries.js',
            targetPath: './src/js/libraries/**/*.js',
            browserify: false,
            transpile:  false
        },
        plugins: {
            targetName: 'plugins.js',
            targetPath: './src/js/plugins/**/*.js',
            browserify: false,
            transpile:  true
        },
        theme: {
            targetName: 'theme.js',
            targetPath: './src/js/theme/main.js',
            browserify: true
        }
    };

    for (let target in _targets) {
        let bundle;

        if (_targets[target].browserify) {
            bundle = browserify(_targets[target].targetPath).transform(babelify, {
                presets: ['es2015'],
                compact: false
            }).bundle();

            bundle = bundle.pipe(source(_targets[target].targetName));
            bundle = bundle.pipe(buffer());
        } else {
            bundle = gulp.src(_targets[target].targetPath);

            if (_targets[target].transpile) {
                bundle = bundle.pipe(babel({presets: ['es2015'], compact: false})).on('error', compilerError);
            }

            bundle = bundle.pipe(concat(_targets[target].targetName)).on('error', compilerError);
        }

        bundle = bundle.pipe(argv.compress ? uglify() : util.noop()).on('error', compilerError);
        bundle.pipe(gulp.dest('./assets/js/'));
    }
});

gulp.task('watch:styles', function() {
    gulp.watch('./src/scss/**/*.scss', ['compile:styles']);
});

gulp.task('watch:scripts', function() {
    gulp.watch('./src/js/**/*.js', ['compile:scripts']);
});

gulp.task('watch', ['watch:styles', 'watch:scripts']);
gulp.task('compile', ['compile:styles', 'compile:scripts']);
gulp.task('default', ['compile']);

/**
 * Error handling
 */
function compilerError(error) {
    let errorObject = JSON.parse(JSON.stringify(error));
    let notificationArgs = {
        title: 'Compilation error'
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
}