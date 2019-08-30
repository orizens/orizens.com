---
id: 683
title: 'Decluttering Your Web Application Using angular.js & grunt.js - Part 1'
date: 2014-05-20T20:07:00+00:00
author: Oren Farhi 
templateKey: blog-post
layout: post
guid: http://orizens.com/wp/?p=683
permalink: /topics/decluttering-your-web-application-using-angular-js-grunt-js-part-1/
dsq_thread_id:
  - "2700450190"
image: ../img/uploads/2014/05/IMG_20140520_225515.jpg
categories:
  - AngularJS
  - backbone
  - Grunt.js
  - nodejs
  - patterns
  - requirejs
tags:
  - angular.js
  - architecture
  - Grunt.js
  - node.js
  - requirejs
---
Developing a well structured application wasn't so straight forward for me when I started. Sure, using <a href="http://backbonejs.com" title="Backbone.js" target="_blank">Backbone.js</a>, <a href="https://angularjs.org/" title="Angular.js" target="_blank">angular.js</a>, <a href="http://requirejs.org/" title="Require.js" target="_blank">require.js</a> contributed some benefits. Overtime, I stepped into automation with grunt.js. I discovered the true beauty in structuring and organising any code base to be modular enough - so both development & production will fit to my coding lifestyle. 

<!--more-->

Usually, a lot of developers use angular's seed or yeoman's default angular generator to scaffold an angular app. While this generator does generated the angular's seed modular project, It's still has few drawbacks (i.e, no less support) for keeping modules separated.
	  
There are steps you can take to make this seed or your own application structure organized as needed and support a stream lined work flow.

In this first post, I want to share few concepts I use in my daily client development (currently, angular.js):

  1. organizing files and folders
  2. automated work flow for working with less
  3. keeping html files templates for directives as separated files as prepare it for production

This makes my development experience much more solid, automated - and yes - quite fun.

## Structure

My app is structured to be module based. Lets start with directory structure:

```typescript
MyApp/
-- 	src/
-- 	grunt/
-- 	test/
--	Gruntfile.js
--	bower.json
--	package.json

```

The main modules of the application environment are placed each in its own sandbox.
  
"src" holds the source code for the client. All 3rd party libraries and app code goes in here.
  
"grunt" holds organized separated configuration for each grunt module as I wrote in <a href="http://orizens.com/wp/topics/decluttering-your-gruntfile-js/" title="Decluttering your Gruntfile.js (organizing grunt)" target="_blank">declutter Gruntfile.js using grunt.js</a>.
  
"test" holds everything related to test the "src" code (usually the javascript logics).

Modularize with Angular.js
  
Lets focus on the "src" directory.

```typescript
src/
--	common
----	services/
----	directives/
----	resources/
--	app
----	dashboard/
----	guests/
------		guests.ctrl.js
------		guests.tpl.html
------		guests.less
----	tables/
----	app.js
----	styles/

```

I like the "package by feature" development concept. This is why i like having a "common" directory, where all data providers and common consumed services (factories, resources and others) can be used from anywhere in the app. To make a long story short - the "common" modules are consumed by the app modules.

My app, requires the various application modules with dependency injection when it is defined:

```typescript
angular.module('MyApp', [
	'guests',
	'dashboard',
	'tables',
	'resources.metadata',
	'resources.updates'
]);

```</p> 

## Organizing Less Compilation

I.e, The concept of "package by features" dictates the concept of keeping all relevant files of the guests module in one folder. This means that all js, less and html files relevant to a certain module - are placed in the same directory. 

The "guests.ctrl.js" also holds the guests module configuration. This is the point where the module ask to consume any "common" services, resources or directives.

A common question that arises is - how do I get the "less" files to be added and compiled each time I create a new file or edit an existing one?
	  
The answer is quite simple - I use Grunt.js to automate this process:

  1. include any cross application "less" dependencies (bootstrap.less, font-awesome.less, variables.less etc..)
  2. concatenate all less files from anywhere to one temporary file
  3. for debugging purposes, keep a source map file for each "less" file
  4. recompile all when there's a change or a new less
  5. finally, output the results to a style.css file
  6. refresh the browser 

To be more specific, I use these grunt modules to automate all of the above:

  1. grunt-include-source
  2. assemble-less
  3. grunt-contrib-watch

I created a "app.tpl.less" file in the root of "src" directory which imports cross application environment files as well as configuration for importing all "less" from the app's common and modules directories.

```typescript
@import url('bower_components/bootstrap/less/bootstrap.less');
@import url('styles/variables.less');
@import url('styles/bootswatch.less');

@import url('bower_components/font-awesome/less/font-awesome.less');
@import url('bower_components/font-awesome/less/variables.less');
@fa-font-path: "../bower_components/font-awesome/fonts";

@import url('bower_components/less-elements/elements.less');
// @import url('../bower_components/animate.css/animate.css');
// include: "type": "less", "files": "styles/common/**/*.less"
// include: "type": "less", "files": "scripts/**/*.less"

```

The "grunt-include-source" module allows to compile this "app.tpl.less" file and output this file along with a list of less files imports from all over the app.
	  
The grunt "less.js" holds the configuration of how and where to compile the less files from/to.

```typescript
module.exports = function(grunt) {
	return {
		development: {
		  options: {
		    dumpLineNumbers: 'all',
		    sourceMap: true,
		    sourceMapFilename: '<%= yeoman.app %>/app.css.map',
		    sourceMapURL: '../app.css.map',
		    sourceMapBasepath: '<%= yeoman.app %>/',
		    outputSourceFiles: true,

		    imports: {
		      reference: [
		        "variables.less",
		        "less-elements/elements.less"
		      ]
		    }
		  },

		  files: {
		    "<%= yeoman.app %>/styles/app.css": [
		      "<%= yeoman.app %>/app.tmp.less"
		    ]
		  }
		},

		dist: {
		  options: {

		    imports: {
		      reference: [
		        "variables.less",
		        "less-elements/elements.less"
		      ]
		    }
		  },

		  files: {
		    "<%= yeoman.dist %>/<%= yeoman.app %>/styles/app.css": [
		      "<%= yeoman.dist %>/<%= yeoman.app %>/app.tmp.less"
		    ]
		  }
		}
	}
}

```

Finally, I use a regular grunt "watch" configuration to recompile and refresh the app when there's a change (edit, remove or adding a less file).

```typescript
module.export = function(grunt){
return {
	// among other statments of watch
  styles: {
      files: [
      '<%= yeoman.app %>/styles/**/*.less',
      '<%= yeoman.app %>/scripts/**/*.less'
      ],
      tasks: ['manifest', 'includeSource', 'less:development'],
    },
  }
}

```

## Directives Templates - Getting Ready For Production

I like to have a clear separation between html & js. Although writing html as a string or a multi-line is possible, It's hard to maintain and use.
	  
When developing directives, if needed, I usually write its html as a regular separated file template:

```typescript
directives
	--	navbar\
	----	navbar.mdl.js
	----	navbar.tpl.html
	
```

In order to use the template file, I have to define it within the directive:

```typescript
MyApp.directive('listHeaders', function () {
		return {
			restrict: 'A',
			replace: true,
			templateUrl: 'common/directives/list-headers.tpl.html',
			link: function (scope, element, attrs) { 
				// logics & statements
			}
		}
	});
	
```</p> 

In development mode angular loads the template file. In production, often there's a need to minify the code and concatenate all files to one file.
	  
However, we can't simply concatenate the html template file. The challenge with concatenating html files in angular is the need to define the template contents as an angular template.
	  
The solution is quite easy. Angular caches a template the first time it is used - and it does that using the "$templateCache" service. Finally, there's a map object which points each template "id" to its relevant html string contents.
	  
So, in order to prepare external templates for production (let it be directives or controller's templates), I use the grunt module "grunt-angular-templates". This module simply, generates a js code which defines all external html templates with "$templateCache" service when the app loads ("angular.run").

```typescript
module.exports = function(grunt) {
	return {
		dist:{
			cwd: '<%= yeoman.app %>',
			src:[
				'app/**/*.html',
				'common/**/*.html'
			],
			dest:'<%= yeoman.dist %>/<%= yeoman.app %>/templates.js',
			options:{
				htmlmin: { 
					collapseWhitespace: true,
					collapseBooleanAttributes: true,
					removeComments: true,
					removeStyleLinkTypeAttributes:true
				}
			}
		}
	}
}

```

## What's Next?

I tend to focus on more automated work flows I discovered grunt.js can do for development. Also, This series will include automation tasks for production using grunt.js as well.
	  
If you have any questions, suggestions or other gems you want me to clarify, please comment and i'll do my best to approach these.