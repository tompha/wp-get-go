"use strict";

const Packages = {
    General: {
        gulp:           require('gulp-help')(require('gulp')),
        watch:          require('gulp-watch'),
        sourcemaps:     require('gulp-sourcemaps'),
        plumber:        require('gulp-plumber')
    },
    Styles: {
        sass:           require('gulp-sass'),
        autoprefixer:   require('gulp-autoprefixer'),
        concat:         require('gulp-concat')
    },
    Scripts: {
        babel:          require('gulp-babel'),
        browserify:     require('browserify'),
        babelify:       require('babelify'),
        uglify:         require('gulp-uglify')
    },
    Tools: {
        notifier:       require('node-notifier'),
        colors:         require('colors'),
        util:           require('gulp-util'),
        argv:           require('yargs').argv,
        source:         require('vinyl-source-stream'),
        buffer:         require('vinyl-buffer')
    }
};

const Options = {
    styles: {
        path: 'app/src/styles/main.scss',
        name: {
            development: 'theme.css',
            production:  'theme.min.css'
        },
        output: 'app/dist/styles/',
        options: {
            outputStyle: Packages.Tools.argv.compress ? 'compressed' : 'expanded'
        }
    },
    scripts: {
        output: 'app/dist/scripts/',
        targets: [
            {
                path:       'app/src/scripts/libraries/**/*.js',
                browserify: false,
                transpile:  false,
                name:       {
                    development: 'libraries.js',
                    production:  'libraries.min.js'
                }
            },
            {
                path:       'app/src/scripts/plugins/**/*.js',
                browserify: false,
                transpile:  true,
                name:       {
                    development: 'plugins.js',
                    production:  'plugins.min.js'
                }
            },
            {
                path:       'app/src/scripts/theme/app.js',
                browserify: true,
                transpile:  false,
                name:       {
                    development: 'app.js',
                    production:  'app.min.js'
                }
            }
        ]
    },
    plumber: {
        errorHandler: compilerError
    }
};

/**
 * Task definitions
 */
Packages.General.gulp.task('compile:styles', function() {
    let compress = !!Packages.Tools.argv.compress;

    Packages.General.gulp.src(Options.styles.path)
        .pipe(Packages.General.plumber(Options.plumber))
        .pipe(Packages.Styles.sass(Options.styles.options))
        .pipe(Packages.Styles.autoprefixer('last 2 versions'))
        .pipe(Packages.Styles.concat(compress ? Options.styles.name.production : Options.styles.name.development))
        // .pipe(compress ? util.noop() : sourcemap.write('maps'))
        .pipe(Packages.General.gulp.dest(Options.styles.output));
});

Packages.General.gulp.task('compile:scripts', function() {
    let compress = !!Packages.Tools.argv.compress;

    for (let i = 0, total = Options.scripts.targets.length; i < total; i++) {
        let stream;
        let target = Options.scripts.targets[i];
        let name = compress ? target.name.production : target.name.development;

        if (target.browserify) {
            stream = Packages.Scripts.browserify({
                entries: target.path,
                debug: compress,
                transform: [Packages.Scripts.babelify.configure({
                    presets: ['es2015']
                })]
            }).bundle();

            stream = stream.pipe(Packages.Tools.source(name));
            stream = stream.pipe(Packages.Tools.buffer());
        } else {
            stream = Packages.General.gulp.src(target.path);
            stream = stream.pipe(Packages.General.plumber(Options.plumber));

            if (target.transpile) {
                stream = stream.pipe(Packages.Scripts.babel({
                    presets: ['es2015'],
                    compact: compress
                }));
            }

            stream = stream.pipe(Packages.Styles.concat(name));
        }

        if (compress) {
            stream = stream.pipe(Packages.Scripts.uglify());
        }

        stream.pipe(Packages.General.gulp.dest(Options.scripts.output));
    }
});

Packages.General.gulp.task('watch:styles', function() {
    Packages.General.watch('./src/scss/**/*.scss', ['compile:styles']);
});

Packages.General.gulp.task('watch:scripts', function() {
    gulp.watch('./src/js/**/*.js', ['compile:scripts']);
});

Packages.General.gulp.task('watch', ['watch:styles', 'watch:scripts']);
Packages.General.gulp.task('compile', ['compile:styles', 'compile:scripts']);
Packages.General.gulp.task('default', ['compile']);

/**
 * Error handling
 */
function compilerError(error) {
    let errorObject = JSON.parse(JSON.stringify(error));
    let notificationArgs = {
        title: 'Compilation error'
    };

    Packages.Tools.util.log(colors.red('COMPILATION ERROR'));

    if (Object.keys(errorObject).length > 0) {
        console.log('File: ' + errorObject.relativePath);
        console.log('Line: ' + errorObject.line + ':' + errorObject.column);
        console.log(errorObject.message.replace(errorObject.relativePath + "\n", ''));
        notificationArgs.message = errorObject.relativePath + ' on line ' + errorObject.line + ':' + errorObject.column;
    } else {
        console.log(error);
    }

    Packages.Tools.notifier.notify(notificationArgs);
    this.emit('end');
}