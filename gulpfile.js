var path = require('path')
  , gulp = require('gulp')
  , jade = require('gulp-jade')
  , nodemon = require('gulp-nodemon')
  , sass = require('gulp-sass')
  , minifycss = require('gulp-minify-css')
  , uglify = require('gulp-uglify')
  , autoprefixer = require('gulp-autoprefixer')
  , concat = require('gulp-concat')
  , rename = require('gulp-rename')
  , minifyHTML = require('gulp-minify-html')
  , templateCache = require('gulp-angular-templatecache')
  , jshint = require('gulp-jshint')
  , shell = require('gulp-shell')
  , order = require('gulp-order')
  , stylish = require('jshint-stylish')
  , _ = require('lodash')

//-- Bower Dependencies -----------------------------------------------------
var bowerJsDependencies = [
  './bower_components/jquery/dist/jquery.js',
  './bower_components/underscore/underscore.js',
  './bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap.js',
  './bower_components/angular/angular.js',
  './bower_components/angular-resource/angular-resource.js',
  './bower_components/angular-cookies/angular-cookies.js',
  './bower_components/angular-sanitize/angular-sanitize.js',
  './bower_components/angular-animate/angular-animate.js',
  './bower_components/angular-route/angular-route.js',
  './bower_components/angular-loading-bar/build/loading-bar.js',
  './bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
  './bower_components/angular-socket-io/socket.js',
  './bower_components/angular-route-segment/build/angular-route-segment.js',
  './bower_components/angular-animate/angular-animate.js',
  './bower_components/socket.io-client/socket.io.js',
  './bower_components/WOW/dist/wow.min.js',
  './bower_components/angular-underscore/angular-underscore.js',
  './bower_components/angular-smooth-scroll/build/ng-smoothscroll.js',
  './bower_components/angular-underscore-module/angular-underscore-module.js',
  './bower_components/ng-csv/build/ng-csv.min.js'
]

var bowerCssDependencies = [
  './bower_components/bootstrap-sass-official/vendor/assets/stylesheets/bootstrap.scss',
  './bower_components/angular-loading-bar/build/loading-bar.css',
  './bower_components/font-awesome/css/font-awesome.css',
  './bower_components/animate.css/animate.css'
]

var bowerImageDependencies = [
  './bower_components/bootstrap-sass-official/vendor/assets/fonts/**/*'
]

var paths = {
  scripts: ['frontend/scripts/**/*.js'],
  styles: ['frontend/styles/**/*.sass'],
  views: ['frontend/views/**/*'],
  public: ['frontend/public/**/*'],
}

gulp.task('html-public', function () {
  return gulp.src(paths.public)
    .pipe(gulp.dest('./public'))
})

gulp.task('jade-view', function () {
  gulp.src(paths.views)
    .pipe(jade())
    .pipe(gulp.dest('./public/views'));
});

gulp.task('html-template', ['jade-view'], function () {
  return gulp.src('./public/views/**/*')
    .pipe(minifyHTML({
      quotes: true
    }))
    .pipe(templateCache('templatescache.js', {
      module: 'replanAppTemplatesCaches',
      standalone: true,
      root: './views/'
    }))
    .pipe(gulp.dest('public/js'))
})

gulp.task('scripts', function () {
  return gulp.src(paths.scripts)
    .pipe(order([
      'app.js',
      'services/**/*',
      '*.js'
    ]))
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(concat('application.js'))
    .pipe(gulp.dest('./public/js'))
})

// Fonts
gulp.task('fonts', function() {
  return gulp.src(['bower_components/font-awesome/fonts/fontawesome-webfont.*'])
   .pipe(gulp.dest('public/fonts/'));
});

gulp.task('icons', function() {
  gulp.src('./bower_components/font-awesome/css/font-awesome.css')
    .pipe(rename('font-awesome.scss'))
    .pipe(gulp.dest('./frontend/styles/'));
});

gulp.task('styles', function () {
  return gulp.src(paths.styles)
    .pipe(sass({style: 'expand', includePaths: require('node-bourbon').includePaths, errLogToConsole: true}))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest('./public/css'))
})

//-- Merge and Minify CSS Dependencies --------------------------------
gulp.task('vendor-styles', function () {
  return gulp.src(bowerCssDependencies)
    .pipe(sass({style: 'expand', errLogToConsole: true}))
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest('./public/css'))
})

//-- Merge and Minify JS Dependencies ------------------------------------
gulp.task('vendor-scripts', function () {
  return gulp.src(bowerJsDependencies)
    .pipe(uglify({mangle: false}))
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('./public/js'))
})

gulp.task('vendor-images', function () {
  return gulp.src(bowerImageDependencies)
    .pipe(gulp.dest('./public/css'))
})


gulp.task('clean', function () {
  return gulp.src(['public', 'build'], { read: false })
    .pipe(clean())
})

gulp.task('watch', function () {
  gulp.watch(paths.views, ['jade-view', 'html-template'])
  gulp.watch(paths.public, ['html-public'])
  gulp.watch(paths.scripts, ['scripts'])
  gulp.watch(paths.styles, ['styles'])
})

gulp.task('backend', function () {
  gulp.src('./backend/**/*.js')
    .pipe(jshint())
})

gulp.task('nodemon', function () {
  nodemon({
    script: 'backend/server.js',
    watch: 'backend',
    ignore: [ ],
    ext: 'js',
    env: { 'NODE_ENV': 'development' },
    nodeArgs: ['--debug']
  })
    .on('change', ['backend'])
    .on('restart', function () {
      console.log('restarted!')
    })
})

gulp.task('build', [
  'html-public',
  'jade-view',
  'html-template',
  'scripts',
  'styles',
  'icons',
  'vendor-scripts',
  'vendor-styles',
  'fonts',
  'vendor-images'
])

gulp.task('default', ['nodemon', 'build', 'watch'])
