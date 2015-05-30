'use strict';

// Gulp things
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var sequence = require('run-sequence');
var merge = require('merge-stream');

// Browserify
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

// AWS Deployment
var fs = require('fs');
var path = require('path');
var parallelize = require("concurrent-transform");

// BrowserSync
var browserSync = require('browser-sync');
var reload = browserSync.reload;

// Other modules
var del = require('del');
var spawn = require('child_process').spawn;
var glob = require('glob');
var argv = require('yargs').argv;

var onError = function (err) {
    console.log(err.message);
    this.emit('end');
};

/**
 * Compiling assets
 */

// Building the JS files
gulp.task('clean:scripts', function (cb) {
  del(['serve/assets/js'], cb);
});

gulp.task('scripts', ['clean:scripts'], function () {
  return browserify('./src/assets/scripts/main.js')
    .bundle()
    .on('error', onError)
    .pipe(source('main.js'))
    .pipe(gulp.dest('serve/assets/js'))
    .pipe(reload({stream: true}));

});

// Building the CSS files
gulp.task('clean:styles', function (cb) {
  del(['serve/assets/css'], cb);
});

gulp.task('styles', ['clean:styles'], function () {
  // Looks at the style.scss file for what to include and creates a style.css file
  return gulp.src(['src/assets/styles/main.less', 'src/assets/styles/sandbox-output.less'])
    .pipe($.plumber({
      errorHandler: onError
    }))
    .pipe($.less({
      paths: ['./node_modules']
    }))
    // AutoPrefix your CSS so it works between browsers
    .pipe($.autoprefixer('last 1 version', { cascade: true }))
    // Directory your CSS file goes to
    .pipe(gulp.dest('serve/assets/css/'))
    // Outputs the size of the CSS file
    .pipe($.size({title: 'styles'}))
    // Injects the CSS changes to your browser since Jekyll doesn't rebuild the CSS
    .pipe(reload({stream: true}));
});

// Moving images over
gulp.task('images', function () {
  return gulp.src('src/assets/images/**/*.*')
    .pipe($.changed('serve/assets/img'))
    .pipe(gulp.dest('serve/assets/img'))
    .pipe(reload({stream: true}));
});

// Any other assets
var assetsPath = [
  'src/assets/**',
  '!src/assets/images/**',
  '!src/assets/images',
  '!src/assets/scripts/**',
  '!src/assets/scripts',
  '!src/assets/styles/**',
  '!src/assets/styles'
];

gulp.task('assets', function () {
  return gulp.src(assetsPath)
    .pipe($.changed('serve/assets'))
    .pipe(gulp.dest('serve/assets'))
    .pipe(reload({stream: true}));
});

/**
 * Building the site
 */
// Runs the build command for Jekyll to compile the site locally
// This will build the site with the production settings
gulp.task('jekyll:dev', $.shell.task('bundle exec jekyll build'));

// Almost identical to the above task, but instead we load in the build configuration
// that overwrites some of the settings in the regular configuration so that you
// don't end up publishing your drafts or future posts
gulp.task('jekyll:prod', $.shell.task('bundle exec jekyll build --config _config.yml,_config.build.yml'));

gulp.task('clean:full-build', function (cb) {
  del(['serve/**/*', 'src/.jekyll-metadata', 'site/**/*'], cb);
});

gulp.task('clean:build', function (cb) {
  del(['serve/assets'], cb);
});

gulp.task('all-assets', ['scripts', 'styles', 'images', 'assets'], function () { });

gulp.task('optimise', function () {
  var revAll = new $.revAll({
    dontRenameFile: ['.html', '.xml', /^\/assets\/files\//, '.txt']
  });

  return gulp.src('serve/**')
    .pipe($.if('*.js', $.uglify({preserveComments: 'some'})))
    // Minify CSS
    .pipe($.if('*.css', $.minifyCss()))
    // Minify HTML
    .pipe($.if('*.html', $.htmlmin({
      removeComments: true,
      removeCommentsFromCDATA: true,
      removeCDATASectionsFromCDATA: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: true,
      removeRedundantAttributes: true
    })))
    .pipe(revAll.revision())
    .pipe(gulp.dest('site'))
});

gulp.task('build', ['clean:build'], function () {
  sequence('jekyll:dev', 'all-assets');
});

gulp.task('publish', ['clean:full-build'], function() {
  sequence('jekyll:prod', 'all-assets', 'optimise');
});

/**
 * Watching and reloading
 */
gulp.task('watch', function () {
  gulp.watch(['src/**/*', '!src/assets/**/*', '!src/bower/**/*'], function () {
    sequence('jekyll:dev', reload);
  });
  gulp.watch(['src/assets/styles/**'], ['styles']);
  gulp.watch(['src/assets/scripts/**'], ['scripts']);
  gulp.watch(['src/assets/images/**'], ['images']);
  gulp.watch(assetsPath, ['assets']);
});

gulp.task('serve', function () {
  browserSync({
    notify: true,
    server: {
      baseDir: 'serve'
    },
    open: false,
    ghostMode: {
      clicks: false,
      forms: false,
      scroll: true
    }
  });
});

gulp.task('serve:prod', function () {
  browserSync({
    notify: false,
    server: {
      baseDir: 'site'
    },
    open: false,
    ghostMode: {
      clicks: false,
      forms: false,
      scroll: true
    }
  });
});

/**
 * Rebuilding of presentation assets
 */
var presentationPath = argv.pres;

gulp.task('presentation-scripts', function () {
});

gulp.task('presentation-styles', function () {
});

gulp.task('presentation-build', function () {
});

gulp.task('presentation-build:all', function () {
  // Get all files
  // Build them all
});

gulp.task('presentation-watch', function () {
});



/**
 * Depoyment
 */
gulp.task('deploy', function () {
  // Generate the needed credentials (bucket, secret key etc) from a "hidden" JSON file
  var credentials = JSON.parse(fs.readFileSync('aws-credentials.json', 'utf8'));
  var publisher = $.awspublish.create(credentials);
  // Give your files the proper headers
  var headers = {
    'Cache-Control': 'max-age=0, no-transform, public',
    'Content-Encoding': 'gzip'
  };

  gulp.src('site/**/*')
    .pipe($.awspublishRouter({
      routes: {
        '^assets/(?:.+)\\.(?:js|css)$': {
          key: '$&',
          headers: {
            'Cache-Control': 'max-age=315360000, no-transform, public',
            'Content-Encoding': 'gzip'
          }
        },

        '^assets/(?:.+)\\.(?:jpg|png|gif)$': {
          key: '$&',
          headers: {
            'Cache-Control': 'max-age=315360000, no-transform, public',
            'Content-Encoding': 'gzip'
          }
        },

        '^assets/fonts/(?:.+)\\.(?:eot|svg|ttf|woff)$': {
          key: '$&',
          headers: {
            'Cache-Control': 'max-age=315360000, no-transform, public'
          }
        },

        '^.+\\.html': {
          key: '$&',
          headers: {
            'Cache-Control': 'max-age=0, no-transform, public',
            'Content-Encoding': 'gzip'
          }
        },
        '^.+$': '$&'
      }
  }))
  // Gzip the files for moar speed
  .pipe($.awspublish.gzip())
  // Parallelize the number of concurrent uploads, in this case 30
  .pipe(parallelize(publisher.publish(), 30))
  // Have your files in the system cache so you don't have to recheck all the files every time
  .pipe(publisher.cache())
  // Synchronize the contents of the bucket and local (this deletes everything that isn't in local!)
  .pipe(publisher.sync())
  // And print the ouput, glorious
  .pipe($.awspublish.reporter());
  // And update the default root object
  //.pipe($.cloudfront(credentials));
});

/**
 * Default task
 */
gulp.task('default', function () {
  sequence('build', 'watch', 'serve');
});




