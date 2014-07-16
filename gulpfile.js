var path = require('path')
  , gulp = require('gulp')
  , jade = require('gulp-jade')
  , nodemon = require('gulp-nodemon')
  , sass = require('gulp-sass')
  , minifycss = require('gulp-minify-css')
  , uglify = require('gulp-uglify')
  , concat = require('gulp-concat')
  , minifyHTML = require('gulp-minify-html')
  , templateCache = require('gulp-angular-templatecache')
  , jshint = require('gulp-jshint')
  , shell = require('gulp-shell')
  , order = require('gulp-order')
  , autoprefixer = require('gulp-autoprefixer')
  , stylish = require('jshint-stylish')
  , _ = require('lodash')

//-- Bower Dependencies -----------------------------------------------------
var bowerJsDependencies = [
  './bower_components/jquery/dist/jquery.js',
  './bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap.js',
  './bower_components/angular/angular.js',
  './bower_components/angular-resource/angular-resource.js',
  './bower_components/angular-cookies/angular-cookies.js',
  './bower_components/angular-sanitize/angular-sanitize.js',
  './bower_components/angular-animate/angular-animate.js',
  './bower_components/angular-route/angular-route.js',
  './bower_components/angular-loading-bar/build/loading-bar.js',
  './bower_components/angular-bootstrap/ui-bootstrap-tpls.js'
]

var bowerCssDependencies = [
  './bower_components/bootstrap-sass-official/vendor/assets/stylesheets/bootstrap.scss',
  './bower_components/angular-loading-bar/build/loading-bar.css'
]

var bowerImageDependencies = [
  './bower_components/bootstrap-sass-official/vendor/assets/fonts/**/*'
]

var paths = {
  scripts: ['app/scripts/**/*.js'],
  styles: ['app/styles/**/*.sass'],
  views: ['app/views/**/*'],
  public: ['app/public/**/*'],
  assets: 'api/assets'
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
    .pipe(templateCache('templatescache.js', { module: 'replanAppTemplatesCaches', standalone: true, root: './views/' }))
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

gulp.task('styles', function () {
  return gulp.src(paths.styles)
    .pipe(sass({style: 'expand', errLogToConsole: true}))
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

gulp.task('api', function () {
  gulp.src('./api/**/*.js')
    .pipe(jshint())
})

gulp.task('nodemon', function () {
  nodemon({
    script: 'server.js',
    watch: 'api',
    ignore: [ path.join(paths.assets, '**') ],
    ext: 'js',
    env: { 'NODE_ENV': 'development' },
    nodeArgs: ['--debug']
  })
    .on('change', ['api'])
    .on('restart', function () {
      console.log('restarted!')
    })
})

gulp.task('build', ['html-public', 'jade-view', 'html-template', 'scripts', 'styles', 'vendor-scripts', 'vendor-styles', 'vendor-images'])
gulp.task('default', ['nodemon', 'build', 'watch'])


gulp.task('seed', function () {
  var seeds = require('./api/db/seeds')
  seeds()
})


gulp.task('routes', function () {
  var columnify = require('columnify')
    , routes = []
    , app = require('./server')

  app._router.stack.forEach(function (route) {
    if (route.route) {
      if (route.route && route.route.methods) {
        _.forEach(route.route.methods, function (enabled, verb) {
          if (enabled) {
            routes.push({verb: '\033[90m' + verb.toUpperCase() + '\t\t ', path: '\033[36m' + route.route.path + '\033[0m'})
          }
        })
      }
    }
  })
  console.log(columnify(routes, {columns: ['verb', 'path'] }))
  process.exit()
})

gulp.task('test', shell.task([
  'npm test'
]))

gulp.task('createRelease', shell.task([
  'bin/release'
]))

gulp.task('release', function() {
  runSequence(
    'test',
    ['api', 'build'],
    'createRelease'
  )
})
