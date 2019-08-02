---
id: 817
title: Start Writing ES 2015 in gulp.js With babel
date: 2015-10-28T07:02:28+00:00
author: Oren Farhi 
templateKey: blog-post
layout: post
guid: http://orizens.com/wp/?p=817
permalink: /topics/start-writing-es-2015-in-gulp-js-with-babel/
dsq_thread_id:
  - "4266637171"
image: ../../img/uploads/2015/10/import-gulp.jpg
categories:
  - CI
  - es2015
  - gulp.js
  - javascript
  - Uncategorized
tags:
  - ci
  - es2015
  - gulpjs
  - javascript
---
With the closed spec of es 2015 - <a href="http://babeljs.io" target="_blank">babeljs.io</a> rised as the most appropriate solution for writing es 2015 today and transforming it to es5 so all browsers can run the code. Along with that, gulp.js released a new version which supports es 2015 and allows to write tasks and code with it.<!--more-->

### [](https://github.com/tikalk/tikal_jekyll_website/blob/6d4ea9bfc31332767f752f972c71523954a39a33/_posts/2015-10-27-how-to-write-es-2015-for-gulp-js-today-with-babel.md#benefits-of-using-es-2015-with-gulp){#user-content-benefits-of-using-es-2015-with-gulp.anchor}Benefits of using es 2015 with gulp

There are few benefits from transforming the code of your project in gulp to es 2015:

  * experiment with the various features of es 2015 step by step in a non production environment
  * fat arrows syntax instead of full **function** declaration
  * use built in es 2015 **import** for requiring modules
  * and much more which is described in the <a href="https://babeljs.io/docs/learn-es2015/" target="_blank">babel's learning es 2015 guide</a>

### [](https://github.com/tikalk/tikal_jekyll_website/blob/6d4ea9bfc31332767f752f972c71523954a39a33/_posts/2015-10-27-how-to-write-es-2015-for-gulp-js-today-with-babel.md#easy-setup-of-es-2015){#user-content-easy-setup-of-es-2015.anchor}Easy Setup of es 2015

The setup takes few minutes:

  * install babel as a dependency in your project - `npm i babel-core babel-preset-es2015 --save-dev`
  * create a **.babelrc** file, and paste this code:

```typescript
{
  "presets": ["es2015"]
}
```

  * rename **gulpfile.js** to **gulpfile.babel.js**

**That's it!**

You can just run any gulp task, and it will work right out of the box. It's needless to say that the current code, if written in es5, would work as well. Now you can experiment the various features of es 2015. i.e, using the **import** keyword to require the gulp module:

<div class="highlight highlight-source-js">
  ```typescript
// instead of this code
var gulp = require('gulp');
// you can write this one
import gulp from 'gulp';
```
</div>

In my <a href="http://github.com/orizens/echoes" target="_blank">open source project</a>, <a href="http://echotu.be" target="_blank">echoes player</a>, I converted all the gulp task files to use es 2015. so, i.e, I used fat arrow callback instead of function:

<div class="highlight highlight-source-js">
  ```typescript
// gulp/style.js
import gulp from 'gulp';
import less from 'gulp-less';
import concat from 'gulp-concat';
import sourcemaps from 'gulp-sourcemaps';

// notice the fat arrow syntax instead of 'function(){ ... }'
gulp.task('style', () =&gt; {
  return gulp.src([
      './src/css/style.less',
      './src/app/**/*.less'
    ])
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(concat('style.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('.tmp'));
});
```
  
  <p>
    &nbsp;
  </p>
</div>

<div class="highlight highlight-source-js">
  <p>
    For the test task, I added the <strong>const</strong> variable keyword as well as used the fat arrow with the async callback argument:
  </p>
  
  ```typescript
// gulp/test.js
import gulp from 'gulp';
import karma from 'karma';

const isTravis = process.env.TRAVIS || false;
const pathToKarmaConf = __dirname.replace('/gulp', '');

gulp.task('test', (done) =&gt; {
  karma.server.start({
    configFile: pathToKarmaConf + '/karma.conf.js',
    singleRun: isTravis
  }, done);
});
```
  
  <p>
    <span style="font-family: Raleway, Arial, Helvetica, sans-serif; font-size: 1em; line-height: 1.5; background-color: #ffffff;">There are plenty of new features as well as syntactic sugar to experiment with in es 2015. In my opinion, some syntactic sugar is writing less code - which is good enough for me.</span>
  </p>
</div>