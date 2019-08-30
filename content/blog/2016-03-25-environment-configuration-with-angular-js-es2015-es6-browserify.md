---
id: 976
title: 'Environment Configuration with Angular.js, ES2015 / ES6 & Browserify'
date: 2016-03-25T10:24:08+00:00
author: Oren Farhi 
templateKey: blog-post
layout: post
guid: http://orizens.com/wp/?p=976
permalink: /topics/environment-configuration-with-angular-js-es2015-es6-browserify/
dsq_thread_id:
  - "4691977801"
image: ../img/uploads/2016/03/config.jpg
categories:
  - AngularJS
  - browserify
  - es2015
tags:
  - angular.js
  - es2015
---
After converting <a href="http://github.com/orizens/echoes" target="_blank">Echoes Player project</a> to use ES2015, I was searching for a comfortable way to have separate environment configurations. In this post I present the solution that works for me best.

## <!--more-->Why Environment Variables / Configuration Is Good

There are many times where we need to have one place where several variables are defined, and upon its values, the app can perform operations - let it be actions, display components and more. Usually these are called environment variables. In nodejs platform, these can be access via the "**process.env.NAME\_OF\_VARIABLE**".

In example, the most common usage of different values are referring to the environments: production and development. It is a common practice to prefer different settings in apps in these environments.

Another common separate environment is test environment configuration. We might want to have debug enabled, setting an api url that is relevant to testing and others as well.

## The Challenge For Echoes Project

Before I dive into the several solutions that I found, I'de like to describe the current use of environment variables in my open source project - <a href="http://echotu.be" target="_blank">Echoes Player</a>.

Currently, to optimize angularjs v1.x in production, you can disable debug information. This will save your app few DOM operations like adding/changing classes - and will prevent some repaints and hopefully reflows as well. Disabling the debug information also removes certain global references such as accessing "**scope**" through "**angular.element**". Setting the debug information to off should be applied in the "**config**" phase of the app:

```typescript
function config ($compileProvider) {
	$compileProvider.debugInfoEnabled(false);
}
```

Since I converted the code of Echoes Player to ES2015, The challenge in this case was finding a way to load the appropriate module in build that is relevant to the environment. I'm also using <a href="http://browserify.org/" target="_blank">browserify</a> for compiling the code - so the challenge was also finding a proper way to integrate the solution to the build process.

## Available Solutions for Environment Variables

During my search for an appropriate solution, I found various methods that I can use. First, I was looking for a way to have separate configurations in json files.

### gulp-ng-constant

<a href="https://github.com/guzart/gulp-ng-constant" target="_blank">gulp-ng-constant</a> allows to generate an angular module from a json file. At first this seemed like a proper solution to what I was looking for, however, since I'm using browserify for compiling the files - there were too many operations and changes to make in the build process. Also, currently, generating actual angular code is not the way that I want to go with.

### envify

<a href="https://github.com/hughsk/envify" target="_blank">envify</a> is a transform for browserify which replaces references of "**process.env.***" to a string. At first, I seemed like a really good candidate, however, its last update is a year ago and it didn't work with my current build.

## Selected Solution

Finally, after much thought, I had the solution right there, without using another module.

I added these settings to the browserify build code. The idea is adding the relevant environment file to the build process. This code creates the relevant path of the desired environment config file:

```typescript
const Environments = {
  DEFAULT: 'dev',
  DEVELOPMENT: 'dev',
  PRODUCTION: 'production',
  TEST: 'test'
}
const currentEnvironment = process.env.ENV !== undefined ? process.env.ENV : Environments.DEFAULT;
const configuraionFile = `./src/config/${currentEnvironment}.config.js`;
```

Later on this file, I just added the "configurationFile" path to the browserify bundler code:

```typescript
let bundler = browserify({
    entries: ['./src/app.js', configuraionFile],
    debug: true,
    cache: {},
    packageCache: {},
    fullPaths: isDevMode
});
```

Currently, these configuration files includes the a "config" function which is defined on the app's namespace. Although this is not the defacto way to define a separate configuration file, it is good enough for the purpose of this project. In a more scalable perspective, I would have created a file that exports a literal object or an angular module that can be consumed at config phase and then use it.

This is the "**production.config.js**" that is loaded when the build process compiles the code for a release:

```typescript
import angular from 'angular';

angular.module('echoes')
    .config(config);

/* @ngInject */
function config ($compileProvider) {
	$compileProvider.debugInfoEnabled(false);
}
```

The full source code is <a href="http://github.com/orizens/echoes" target="_blank">available on github</a>.