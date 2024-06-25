---
id: 908
title: 'Setup Karma For Testing Angular 1.x Components With ES2015 & Browserify'
pubDate: 2016-01-08T11:32:43+00:00
author: Oren Farhi
layout: '@/templates/BasePost.astro'
# permalink: /blog/setup-karma-for-testing-angular-1-x-components-with-es2015-browserify/
# dsq_thread_id:
  # - "4472785736"
imgSrc: /images/uploads/2016/01/browse.jpg
tags:
  - angular.js
  - browserify
  - es2015
  - javascript
  - learning
  - tests
---
<a href="http://orizens.com/wp/blog/from-angular-es5-directive-to-angular-es2015-component/" target="_blank">Converting AngularJS.x code to use ES2015</a> is one thing. It's an iterative process that should be taken with great care. However, aside from converting the code, you should also convert the tests to the setup environment. In this article I share the setup I use for running Echoes Player tests with karma & browserify.<!--more-->

## Tests Setup

To simply put - <a href="http://orizens.com/wp/blog/my-setup-for-testing-js-with-jasmine-karma-phantomjs-angularjs/" target="_blank">I believe in writing tests for code</a>. It promotes robustness of the code that you write, healthy mentality as a developer and assurance that your code does what it's supposed to do, covering edge cases as well.

For my <a href="https://github.com/orizens/echoes" target="_blank">open source project</a>, <a href="http://echoesplayer.netlify.app" target="_blank">Echoes Player</a>, I use a testing environment setup that includes:

  * karma runner - for running tests and loading testing environments
  * Chrome - as the js engine to run the tests on
  * Phantomjs - a js engine ro run the tests in the terminal
  * jasmine - for writing tests
  * Babel - for writing ES2015 in tests

## Angular 1.x with ES2015 & Browserify

In a previous article, I <a href="http://orizens.com/wp/blog/from-angular-es5-directive-to-angular-es2015-component/" target="_blank">wrote about writing AngularJS.x with ES2015</a> and <a href="http://orizens.com/wp/blog/5-steps-to-prepare-your-angular-1-code-to-angular-2/" target="_blank">preparing AngularJS.x code to Angular (+2)</a>. Yet, browsers don't know to parse some ES2015 features - for that - the code needs to be parsed and compiled to ES5.

For <a href="http://echoesplayer.netlify.app" target="_blank">Echoes Player</a>, I'm currently using <a href="http://browserify.org/" target="_blank">browserify</a> to achieve the above (webpack is an alternative and out of the scope of this article). I'm using a modified gulp task that I've found in various projects:

```typescript
'use strict';

import gulp         from 'gulp';
import gulpif       from 'gulp-if';
import gutil        from 'gulp-util';
import source       from 'vinyl-source-stream';
import sourcemaps   from 'gulp-sourcemaps';
import buffer       from 'vinyl-buffer';
import streamify    from 'gulp-streamify';
import watchify     from 'watchify';
import browserify   from 'browserify';
import babelify     from 'babelify';
import uglify       from 'gulp-uglify';
import browserSync  from 'browser-sync';
import debowerify   from 'debowerify';
import ngAnnotate   from 'browserify-ngannotate';
import notify from 'gulp-notify';
import stringify from 'stringify';

const isDevMode = process.env.ENV && process.env.ENV === 'dev';

function handleErrors (error) {

  if( isDevMode ) {

    var args = Array.prototype.slice.call(arguments);

    // Send error to notification center with gulp-notify
    notify.onError({
      title: 'Compile Error',
      message: '<%= error.message %>'
    }).apply(this, args);

    // Keep gulp from hanging on this task
    this.emit('end');

  } else {
    // Log the error and stop the process
    // to prevent broken code from building
    console.log(error);
    process.exit(1);
  }

}

// Based on: http://blog.avisi.nl/2014/04/25/how-to-keep-a-fast-build-with-browserify-and-reactjs/
function buildScript(file) {

  let bundler = browserify({
    entries: ['./src/app.js'],
    debug: true,
    cache: {},
    packageCache: {},
    fullPaths: isDevMode // isDevMode
  });

  if ( isDevMode ) {
    bundler = watchify(bundler);

    bundler.on('update', function() {
      rebundle();
      gutil.log('Rebundle...');
    });
  }

  const transforms = [
    { 'name':babelify, 'options': {}},
    { 'name':ngAnnotate, 'options': {}}
  ];

  transforms.forEach(function(transform) {
    bundler.transform(transform.name, transform.options);
  });
  bundler.transform(stringify(['.html']));

  function rebundle() {
    const stream = bundler.bundle();
    const sourceMapLocation = global.isProd ? './' : './';

    return stream.on('error', handleErrors)
      .pipe(source(file))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(uglify())
      .pipe(sourcemaps.write(sourceMapLocation))
      .pipe(gulp.dest('.tmp'))
      .pipe(browserSync.stream());
  }
  return rebundle();
}

gulp.task('browserify', () => {
  return buildScript('bundle-bfy.js');
});
```

In a birds eye-view, the "browserify" gulp task handles several duties:

  1. Module loading by Loader spec (previously ES2015 Spec)
  2. ES2015 syntax with babel
  3. Annotating Modules with <a href="https://www.npmjs.com/package/browserify-ngannotate" target="_blank">ng-annotate</a> (browserify version) properly to ES2015 classes and to ES5 functions
  4. Loading html files and converting it to strings
  5. In development mode, "watching" for changes and recompiles with the 4 steps above

The final product of this task is a ES5 javascript file (browserified) bundled with all the code needed for the app to run. That includes 3rd party libraries as well.

## Setup Karma to Work With Browserify & ES2015

There are few steps needed for running the new "browserified" bundled code in karma and running the tests with it.

Since browserify creates a private scope for each module and since we're using ES2015 modules, tests need to be run inside a module aware environment and be "modularized" with browserify as well.

Fortunately, this process is easily achieved with configuring the karma.conf.js file with new plugins.

First, we need to add <a href="https://www.npmjs.com/package/karma-browserify" target="_blank">karma-browserify</a> plugin, which allows to run the specs (tests) inside browserify world. After installing this plugin with npm, make sure you do the following in karma.conf.js file:

  1. add "browserify" to the "framworks" array property.
  2. add "karma-browserify" to the "plugins" array.
  3. configure the pre-processor to browserify the specs files in the "preprocessors" property.
  4. add a new property, "browserify" which holds the configuration setting to allow **source maps** and compile specs with **babel** - so you can write specs with ES2015.

i.e., This is the setup that I use in echoes:

```typescript
var browsers = isTravis ? [ 'PhantomJS' ] : [isDebug ? 'Chrome' : 'PhantomJS2'];
var options = {
	basePath: './src',
	browsers: browsers,
	frameworks: ['browserify', 'jasmine'],
	files: [
		'../.tmp/bundle-bfy.js',
		'../bower_components/angular-mocks/angular-mocks.js',
		'core/**/*spec.js',
		'../tests/mocks/**/*mock.json'
    ],
    autoWatch: true,
    singleRun: true,
    preprocessors: {
        '../tests/mocks/**/*mock.json': ['json_fixtures'],
        'app/**/*spec.js': ['babel'],
        'app/**/*spec.js': [ 'browserify' ]
    },
    browserify: {
      debug: true,
      plugin: [ 'babelify' ]
    },
    babelPreprocessor: {
      options: {
        presets: ['es2015'],
        sourceMap: 'inline'
      }
    },
    jsonFixturesPreprocessor: {
      // strip this from the file path \ fixture name
      stripPrefix: '.+mocks/',
      // strip this to the file path \ fixture name
      // prependPrefix: 'mock/',
      // change the global fixtures variable name
      variableName: 'mocks'
    },
    plugins : [
        'karma-phantomjs2-launcher',
        'karma-phantomjs-launcher',
        'karma-chrome-launcher',
        'karma-jasmine',
        'karma-ng-html2js-preprocessor',
        'karma-mocha-reporter',
        'karma-json-fixtures-preprocessor',
        'karma-babel-preprocessor',
        'karma-browserify'
    ],
    reporters: [
    	'mocha'
    	]
};
```

That's it.

After setting up karma with these, specs will run with the ES2015.

## Final Thoughts

The full <a href="https://github.com/orizens/echoes/blob/fe8d8d8006f4f36a6bb22bbebd3237a986bbecf1/karma.conf.js" target="_blank">configuration of karma with browserify and babel, can be found in github</a>.

Although the tests run with ES2015 and the new code of AngularJS.x ES2015 based components, the old tests need to be updated according to the changes I made to the code. It should be a simpler task for testing controllers and services - since the tests will simply check functions. As for testing directives/components that render to the DOM - that's for another future post.

I hope to write about converting tests to tests Angular 1.x components written with ES2015 which covers all aspects by the <a href="https://github.com/orizens/angular-es2015-styleguide" target="_blank">style guide I wrote writing AngularJS.x components with ES2015</a> - please feel free to collaborate.

&nbsp;

&nbsp;

&nbsp;