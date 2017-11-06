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
const babel       = require('gulp-babel');
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
    gulp.src('./app/styles/main.scss')
        .pipe(plumber({ errorHandler: stylesError }))
        .pipe(sourcemap.init())
        .pipe(sass({ outputStyle: (argv.compress ? 'compressed' : 'expanded' ) }))
        .pipe(prefix('last 2 versions'))
        .pipe(concat('theme.css'))
        .pipe(argv.compress ? util.noop() : sourcemap.write())
        .pipe(gulp.dest('./public/css/'));
});

gulp.task('compile:scripts', function() {
    let _targets = {
        libraries: {
            targetName: 'libraries.js',
            targetPath: './app/scripts/libraries/**/*.js',
            browserify: false,
            transpile:  false
        },
        plugins: {
            targetName: 'plugins.js',
            targetPath: './app/scripts/plugins/**/*.js',
            browserify: false,
            transpile:  true
        },
        theme: {
            targetName: 'theme.js',
            targetPath: './app/scripts/theme/main.js',
            browserify: true
        }
    };

    for (let target in _targets) {
        let bundle;

        if (_targets[target].browserify) {
            bundle = browserify(_targets[target].targetPath).transform(babelify, {
                presets: ['es2015'],
                compact: false
            }).bundle().on('error', scriptsError);

            bundle = bundle.pipe(source(_targets[target].targetName));
            bundle = bundle.pipe(buffer());
        } else {
            bundle = gulp.src(_targets[target].targetPath);
            bundle = bundle.pipe(plumber({ errorHandler: scriptsError }));

            if (_targets[target].transpile) {
                bundle = bundle.pipe(babel({presets: ['es2015'], compact: false}));
            }

            bundle = bundle.pipe(concat(_targets[target].targetName));
        }

        bundle = bundle.pipe(sourcemap.init());
        bundle = bundle.pipe(argv.compress ? uglify() : util.noop());
        bundle = bundle.pipe(argv.compress ? util.noop() : sourcemap.write());
        bundle.pipe(gulp.dest('/public/js/'));
    }
});

gulp.task('watch:styles', function() {
    gulp.watch('/app/styles/**/*.scss', ['compile:styles']);
});

gulp.task('watch:scripts', function() {
    gulp.watch('/app/scripts/**/*.js', ['compile:scripts']).on('change', () => browserSync.reload());
});

gulp.task('watch:templates', function() {
    gulp.watch('./**/*.php').on('change', () => browserSync.reload());
});

gulp.task('bs:sync', function() {
    browserSync.init({
        proxy: argv.proxy,
        injectChanges: true,
        debugInfo: false
    });
});

gulp.task('watch', ['watch:styles', 'watch:scripts']);
gulp.task('compile', ['compile:styles', 'compile:scripts']);

/**
 * Error handling
 */
const stylesError = (error) => {
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

const scriptsError = (error) => {
    error = JSON.parse(error);
    let notificationArgs = {
        title: 'Error in ' + error.relativePath
    };

    util.log(colors.red('COMPILATION ERROR'));

    console.log(error);
}
function compilerError(error) {
    let errorObject = JSON.parse(JSON.stringify(error));
    let notificationArgs = {
        title: 'Compilation error'
    };

    console.log(error);

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