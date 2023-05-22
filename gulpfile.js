import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import csso from 'postcss-csso';
import rename from 'gulp-rename';
import htmlmin from 'gulp-htmlmin';
import terser from 'gulp-terser';
import squoosh from 'gulp-libsquoosh';
import svgo from 'gulp-svgmin';
import svgstore from 'gulp-svgstore';
import {deleteAsync} from 'del';
import browser from 'browser-sync';
import { stacksvg } from "gulp-stacksvg";

// Styles

export const styles = () => {
  return gulp.src('source/sass/style.scss', { sourcemaps: true })
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}

// HTML

const html = () => {
  return gulp.src('source/*.html') // берем все файлы из папки source с расширением html

  .pipe(htmlmin({ collapseWhitespace: true })) //минифицируем файлы html

  .pipe(gulp.dest('build')) // кладем в папку build
}

// Scripts

const scripts = () => {
  return gulp.src('source/js/*.js')
  .pipe(terser()) //минифицируем файлы js
  .pipe(gulp.dest('build/js')) // кладем в папку build/js
}

// Images

const optimizeimages = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
  .pipe(squoosh())
  .pipe(gulp.dest('build/img'))
}

const copyImages = () => {
  return gulp.src(['source/img/**/*.{jpg,png}','source/img/*.{jpg,png}'])
  .pipe(gulp.dest('build/img'))
}

// WebP

const createWebp = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
  .pipe(squoosh({
    webp: {}
  }))
  .pipe(gulp.dest('build/img'))
}

// SVG

const svg = () => {
  return gulp.src(['source/img/*.svg', '!source/img/icon/*.svg'])
  .pipe(svgo())
  .pipe(gulp.dest('build/img'))
}

const sprite = () => {
  return gulp.src('source/icons/*.svg')
  .pipe(svgo())
  .pipe(svgstore({
    inlineSvg: true
  }))
  .pipe(rename('sprite.svg'))
  .pipe(gulp.dest('build/icons'))
}

const stack = () => {
  return gulp.src('source/icons/*.svg')
  .pipe(svgo())
  .pipe(stacksvg({
    output: `sprite`
  }))
  .pipe(rename('stack.svg'))
  .pipe(gulp.dest('build/icons'));
}

//Copy

const copy = (done) => {
  gulp.src ([
    'source/fonts/*.{woff2,woff}',
    'source/*.ico',
    'source/manifest.webmanifest',
    'source/favicon/*.{png,svg}',
    'source/img/logo-header-*.svg'
  ], {
    base: 'source'
  })
  .pipe (gulp.dest('build'))
  done ();
}

//Clean

const clean = () => {
  return deleteAsync('build');
}

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// Watcher

const watcher = () => {
  gulp.watch('source/sass/**/*.scss', gulp.series(styles));
  gulp.watch('source/*.html').on('change', browser.reload);
}

// Build

export const build = gulp.series(
  clean,
  copy,
  optimizeimages,
  gulp.parallel (
    styles,
    html,
    scripts,
    svg,
    sprite,
    stack,
    createWebp
  ),
);

//Default

export default gulp.series(
  clean,
  copy,
  copyImages,
  gulp.parallel (
    styles,
    html,
    scripts,
    svg,
    sprite,
    stack,
    createWebp
  ),
  gulp.series (
    server,
    watcher
  )
);

// export const dev = gulp.series (
//   clean,
//   copy,
//   copyImages,
//   gulp.parallel (
//     styles,
//     html,
//     scripts,
//     svg,
//     sprite,
//     stack,
//     createWebp
//   ),
//   gulp.series (
//     server,
//     watcher
//   )
// );
