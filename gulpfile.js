var gulp = require('gulp');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var minifyhtml = require('gulp-minify-html');
var cleanCSS = require('gulp-clean-css');
var sass = require('gulp-sass');
var livereload = require('gulp-livereload');

var src = './public/src';
var dist = './public/dist';
var cssLib = './public/lib-css';
var jsLib = './public/lib-js';
var bowerPath = './bower_components';

var paths = {
    jslib:[
        jsLib + '/jquery.min.js',
        jsLib + '/jquery.autocomplete.min.js',
        jsLib + '/angular.min.js',
        jsLib + '/angular-route.min.js'
    ],
    js: [
        src + '/js/define.js',
        src + '/js/index.js',
        src + '/js/route.js',
        src + '/js/**/*.js'
    ],
    font:[
        bowerPath + '/bootstrap-sass/assets/fonts/bootstrap/**.*',
        bowerPath + '/font-awesome/fonts/**.*'
    ],
    scss: [],
    css: src + '/css/**/*.css',
    html: src + '/**/*.html'
};

// sass 파일 css 로 컴파일.
gulp.task('compile-sass', function () {
    return gulp.src(src + '/scss/main.scss')
        .pipe(sass({
            includePaths: [
                bowerPath + '/bootstrap-sass/assets/stylesheets',
                bowerPath + '/font-awesome/scss'
            ]
        }))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(concat('main.css'))
        .pipe(gulp.dest(dist + '/css'));
});

// 폰트
gulp.task('fonts', function () {
    return gulp.src(paths.font)
        .pipe(gulp.dest(dist + '/fonts'));
});

// js 파일 관련 Task
gulp.task('js-lint', function () {
    return gulp.src(paths.js)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// js 파일 합치기
gulp.task('combine-js', ['js-lint'], function () {
    return gulp.src(paths.jslib.concat(paths.js))
        .pipe(concat('main.js'))
        .pipe(gulp.dest(dist + '/js'));
});

// HTML 파일 압축.
gulp.task('compress-html', function () {
    return gulp.src(paths.html)
        .pipe(minifyhtml())
        .pipe(gulp.dest(dist + '/'));
});

// 파일 변경 감지 및 브라우저 재시작
gulp.task('watch', function () {
    livereload.listen();
    gulp.watch(paths.js, ['combine-js']);
    gulp.watch(paths.css, ['clean-css']);
    gulp.watch(paths.scss, ['compile-sass']);
    gulp.watch(paths.html, ['compress-html']);
    gulp.watch(dist + '/**').on('change', livereload.changed);
});

gulp.task('default', ['combine-js', 'fonts', 'compile-sass', 'compress-html', 'watch']);

/**
 * TASKS NOT USING
 */
// css 파일 합치기
gulp.task('clean-css', function () {
    return gulp.src(paths.css)
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(concat('main.css'))
        .pipe(gulp.dest(dist + '/css'));
});
