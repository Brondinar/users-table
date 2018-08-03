'use strict';

const gulp = require('gulp');
const concat = require('gulp-concat');
const browserSync = require('browser-sync');
const reload = browserSync.reload;
const less = require('gulp-less');
const debug = require('gulp-debug');
const plumber = require('gulp-plumber');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const rollup = require('gulp-better-rollup');

const params = {
	out: 'public',
	htmlSrc: 'index.html'
}

gulp.task('server', function(callback) {
	browserSync.init({
		server: params.out
	});

	gulp.watch('*.html', gulp.series('html'));
	gulp.watch('less/**/*.less', gulp.series('style'));
	gulp.watch('js/**/*.js', gulp.series('js'));

	callback();
});

gulp.task('html', function() {
	return gulp.src(params.htmlSrc)
		.pipe(gulp.dest(params.out))
		.pipe(reload({ stream: true }));
});

gulp.task('style', function() {
	return gulp.src('less/**/*.less')
		.pipe(plumber())
		.pipe(concat('style.css'))
		.pipe(less())
		.pipe(autoprefixer())
		.pipe(gulp.dest(params.out))
		.pipe(reload({ stream: true }));
});

gulp.task('js', function() {
	return gulp.src('js/main.js')
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(rollup({plugins: [babel()]}, 'iife'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(params.out))
		.pipe(reload({ stream: true }));
});

gulp.task('build', gulp.series('html', 'style', 'js'));

gulp.task('default', gulp.series('server', 'build'));