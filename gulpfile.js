var gulp = require('gulp'),
    watch = require('gulp-watch'),
    plumber = require('gulp-plumber'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    livereload = require('gulp-livereload'),
    del = require('del'),
    path = require('path'),
    mainSrc = [
        'public/app.js',
        'public/pages/**/*.js',
        'public/shared/*.js',
        'public/shared/**/*.js',
        'public/components/**/*.js'
    ],
    loginSrc = [
        'public/appLogin.js'
    ],
    vendorSrc =[
        'public/libs/angular/angular.js',
        'public/libs/angular-animate/angular-animate.js',
        'public/libs/angular-bootstrap/ui-bootstrap-tpls.js',
        'public/libs/angular-loading-bar/build/loading-bar.js',
        'public/libs/angular-resource/angular-resource.js',
        'public/libs/angular-route/angular-route.js',
        'public/libs/angular-sanitize/angular-sanitize.js',
        'public/libs/checklist-model/checklist-model.js',
        'public/libs/ngstorage/ngStorage.js'
    ];

gulp.task('scripts', function() {
    return gulp.src(mainSrc)
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        //.pipe(jshint.reporter('fail'))
        .pipe(concat('script.js'))
        .pipe(gulp.dest('public/js'))
        .pipe(gulp.dest('target/js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('public/js'))
        .pipe(gulp.dest('target/js'))
});

gulp.task('login', function() {
    return gulp.src(loginSrc)
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        //.pipe(jshint.reporter('fail'))
        .pipe(concat('loginscript.js'))
        .pipe(gulp.dest('public/js'))
        .pipe(gulp.dest('target/js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('public/js'))
        .pipe(gulp.dest('target/js'))
});

gulp.task('vendors', function() {
    return gulp.src(vendorSrc)
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('public/js'))
        .pipe(gulp.dest('target/libs'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('public/js'))
        .pipe(gulp.dest('target/libs'));
});

gulp.task('lint', function () {
    return gulp.src(src)
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('copy', function () {
    gulp.src([ 'public/index.html',  'public/home.html']).pipe(gulp.dest('target/'));
    gulp.src([ 'public/external/*.html']).pipe(gulp.dest('target/external/'));
    gulp.src([ 'public/pages/**/*.html']).pipe(gulp.dest('target/pages/'));
    gulp.src([ 'public/libs/bootstrap-css-only/css/bootstrap.min.css', 'public/libs/angular-loading-bar/build/*.min.css', 'public/assets/**']).pipe(gulp.dest('target/assets/'));
});

gulp.task('clean', function (cb) {
    del(['target/'], cb)
});

gulp.task('deploy', ['clean'], function () {
    gulp.start('scripts', 'login', 'vendors', 'copy');
});

gulp.task('watch', function () {
    livereload.listen();
    gulp.watch([
        'public/app.js',
        'public/shared/*.js',
        'public/pages/**/*.js',
        'public/shared/**/*.js',
        'public/appLogin.js'
    ], [ 'scripts', 'login', 'vendors', 'copy']);
    gulp.watch(['public/css/**', 'public/js/**']).on('change', livereload.changed);
});