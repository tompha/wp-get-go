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
const imageop     = require('gulp-image-optimization');
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
            error = JSON.parse(JSON.stringify(error));

            util.log(colors.red('COMPILATION ERROR'));
            console.log('File: ' + error.relativePath);
            console.log('Line: ' + error.line + ':' + error.column);
            console.log(error.message.replace(error.relativePath + "\n", ''));

            notifier.notify({
                title: 'Error in ' + error.relativePath,
                message: error.relativePath + ' on line ' + error.line + ':' + error.column
            });

            this.emit('end');
        }
    }));

    stream = stream.pipe(sourcemap.init());
    stream = stream.pipe(sass({
        outputStyle: (argv.compress ? 'compressed' : 'expanded'),
        includePaths: ['node_modules']
    }));

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

        let notificationArgs = {
            title: 'Browserify error'
        };

        if (error.filename && error.loc) {
            console.log(error.codeFrame);
            notificationArgs['message'] = error.filename.split('').pop() + ' on line ' + error.loc.line + ':' + error.loc.column;
        } else {
            util.log(colors.yellow(error.message));
            notificationArgs['message'] = error.message;
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

gulp.task('optimise:images', function() {
    gulp.src([
        'public/images/**.png',
        'public/images/**.gif',
        'public/images/**.jpg',
        'public/images/**.jpeg'
    ]).pipe(imageop({
        progressive: true,
        optimizationLevel: 5,
        interlaced: true
    })).pipe(gulp.dest('public/images/'));
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

gulp.task('watch:images', () => {
    gulp.watch([
        'public/images/**/*.png',
        'public/images/**/*.gif',
        'public/images/**/*.jpg',
        'public/images/**/*.jpeg'
    ]).on('change' , file => gulp.src(file.path).pipe(imageop({
        progressive: true,
        optimizationLevel: 5,
        interlaced: true
    })));
});

gulp.task('bs:sync', function() {
    browserSync.init({
        proxy: argv.proxy,
        injectChanges: true,
        debugInfo: false
    });
});

gulp.task('watch', ['bs:sync', 'watch:templates', 'watch:styles', 'watch:scripts', 'watch:images']);
gulp.task('compile', ['compile:styles', 'compile:scripts', 'optimise:images']);