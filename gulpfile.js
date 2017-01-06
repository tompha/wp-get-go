/**
 * Required packages
 */
var gulp 		= require('gulp');
var sass 		= require('gulp-sass');
var sourcemap 	= require('gulp-sourcemaps');
var prefix		= require('gulp-autoprefixer');
var concat 		= require('gulp-concat');
var watch 		= require('gulp-watch');
var notifier 	= require('node-notifier');
var colors 		= require('colors');
var util 		= require('gulp-util');
var uglify 		= require('gulp-uglify');
var argv		= require('yargs').argv;
var babel		= require('gulp-babel');

/**
 * Task definitions
 */
gulp.task('styles', function() {
	gulp.src('./src/scss/main.scss')
		.pipe(sass({ outputStyle: (argv.compress ? 'compressed' : 'expanded' ) })).on('error', compilerError)
		.pipe(prefix('last 2 versions')).on('error', compilerError)
		.pipe(concat('theme.css')).on('error', compilerError)
		.pipe(argv.compress ? util.noop() : sourcemap.write('maps')).on('error', compilerError)
		.pipe(gulp.dest('./assets/css/'));
});

gulp.task('scripts', function() {
	var _targets = {
		libraries: {
			targetName: 'libraries.js',
			targetPath: './src/js/libraries/**/*.js'
		},
		plugins: {
			targetName: 'plugins.js',
			targetPath: './src/js/plugins/**/*.js'
		},
		theme: {
			targetName: 'theme.js',
			targetPath: './src/js/*.js'
		}
	};

	for (var target in _targets) {
		gulp.src(_targets[target].targetPath)
			.pipe(babel({ presets: ['es2015'], compact: false })).on('error', compilerError)
			.pipe(argv.compress ? uglify() : util.noop()).on('error', compilerError)
			.pipe(concat(_targets[target].targetName)).on('error', compilerError)
			.pipe(gulp.dest('./assets/js/'));
	}
});

gulp.task('watch', function() {
	if (!argv.nowatch) {
		gulp.watch('./scss/**/*.scss', ['styles']);
		gulp.watch('./js/**/*.js', ['scripts']);
	}
});

gulp.task('default', ['styles', 'scripts', 'watch']);

/**
 * Error handling
 */
function compilerError(error) {
    var errorObject = JSON.parse(JSON.stringify(error));
	var notificationArgs = {
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