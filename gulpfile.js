'use strict';

var gulp = require('gulp');   // Вызов Gulpjs
var sass = require('gulp-sass'); // Компилятор Libsass
var rigger = require('gulp-rigger'); // Импортирует файл в другой файл
var imagemin = require('gulp-imagemin'); // Сжимает картинки
var pngquant = require('imagemin-pngquant'); // Дополнение к Imagemin
var spritesmith = require('gulp.spritesmith'); // Генерация спрайтов
var browserSync = require("browser-sync"),  // Localhost сервер с livereload и туннелью на localhost
    reload = browserSync.reload;


gulp.task('sprite', function() {
    var spriteData =
        gulp.src('source/img/icons/*.*')
            .pipe(spritesmith({
                imgName: 'sprite.png',
                cssName: 'sprite.scss',
                cssFormat: 'scss',
                algorithm: 'binary-tree',
                cssVarMap: function(sprite) {
                    sprite.name = 's-' + sprite.name
                }
            }));

    spriteData.img.pipe(gulp.dest('source/img/sprite/'));
    spriteData.css.pipe(gulp.dest('source/sass/'));
});

gulp.task('html', function () {
  gulp.src('source/*.html')
    .pipe(rigger())
    .pipe(gulp.dest('dist/'))
    .pipe(reload({stream: true}));
});

gulp.task('sass', function () {
  gulp.src('source/sass/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist/css/'))
    .pipe(reload({stream: true}));
});

gulp.task('image', function () {
  gulp.src('source/img/**/*.*')
    .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()],
        interlaced: true
    }))
    .pipe(gulp.dest('dist/img/'))
    .pipe(reload({stream: true}));
});


gulp.task('build', [
    'html',
    'sass',
    'image'
]);


gulp.task('watch', function () {
  gulp.watch('source/**/*.html', ['html']);
  gulp.watch('source/sass/main.scss', ['sass']);
  gulp.watch('source/img/**/*.*', ['image']);
});


var config = {
    server: {
        baseDir: "dist/"
    },
    tunnel: false,
    host: 'localhost',
    port: 9000,
    logPrefix: "Sage"
};


gulp.task('webserver', function () {
    browserSync(config);
});


gulp.task('default', ['build', 'webserver', 'watch']);
