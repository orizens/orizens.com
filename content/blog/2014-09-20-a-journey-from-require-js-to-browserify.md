---
id: 711
title: A Journey From Require.js to Browserify
date: 2014-09-20T09:45:38+00:00
author: Oren Farhi 
templateKey: blog-post
layout: post
guid: http://orizens.com/wp/?p=711
permalink: /blog/a-journey-from-require-js-to-browserify/
dsq_thread_id:
  - "3035967021"
image: ../img/uploads/2014/09/sof.jpg
categories:
  - backbone
  - browserify
  - Grunt
  - Grunt.js
  - gulp.js
  - javascript
  - nodejs
  - patterns
tags:
  - architecture
  - backbone
  - browserify
  - gruntjs
  - javascript
  - learning
  - node.js
  - tools
  - underscore
---
A couple of years ago I started developing [Echoes Player](http://echotu.be) with Backbone.js, Underscore.js, Bootstrap and Require.js. Recently I migrated the code to use [browserify](http://browserify.org/), and i'd like to share the insights from this process.
  
<!--more-->

## Preface

Back then, I saw [require.js as a solution for dependency management with javascript](http://orizens.com/wp/blog/backbone-js-for-large-scale-applications-ui-architecture/ "Backbone.js for large scale applications – UI Architecture"). Later on, while not using the lazy loading ability, I took the chance of creating a [build file for whole project - concatenating all the js files to one uglified & optimized file](http://orizens.com/wp/blog/requirejs-optimizing-and-building-one-file/ "RequireJS – Optimizing and Building One File"). In the land of Backbone.js development and code organization, require.js gave the ability to implement the separation of concerns, and promoting good code practicing by creating separated files, load them to a module (let it be lazy or not) and have a sane maintenance of code.

Require.js has support both for the AMD & CommonJS specs for module definition as well as for [loading incompatible files with these specs](http://orizens.com/wp/blog/requirejs-loading-incompatible-javascript-file/ "AMD/RequireJS – Loading Incompatible JavaScript Files").

AMD syntax uses a function which wraps the module definition with whatever you choose to load. It uses a return value as the exported features  of this module.

```typescript
define([
	'jquery',
	'underscore',
	'backbone'
], function($, _, Backbone) {
	var Loader = Backbone.View.extend({
		el: '#loader',
		initialize: function() {
			this.listenTo(this.model.youtube, 'request', this.show);
			this.listenTo(this.model.youtube, 'sync', this.hide);
			this.listenTo(Backbone, 'app:loader-start', this.show);
			this.listenTo(Backbone, 'app:loader-end', this.hide);
		},
		show: function () {
			this.$el.removeClass('hidden');
		},
		hide: function(){
			this.$el.addClass('hidden');
		}
	});
	return Loader;
});
```

&nbsp;

CommonJS syntax uses the require syntax and exports modules features using the "module.exports" syntax. Node.js uses the CommonJS spec for module loading.

```typescript
var Backbone = require('backbonejs');
	
var Loader = Backbone.View.extend({
	el: '#loader',

	initialize: function() {
		this.listenTo(this.model.youtube, 'request', this.show);
		this.listenTo(this.model.youtube, 'sync', this.hide);
		this.listenTo(Backbone, 'app:loader-start', this.show);
		this.listenTo(Backbone, 'app:loader-end', this.hide);
	},

	show: function () {
		this.$el.removeClass('hidden');
	},

	hide: function(){
		this.$el.addClass('hidden');
	}
});

module.exports = Loader;
```

&nbsp;

## The Pitfalls

Overtime, The code of Echoes player started to grow big, so some modules might have to load few files. Some code became hard to maintain. I got tired of using the double variable names for syntax:

```typescript
define([
	'jquery',
	'underscore',
	'backbone',

	'views/media_search',
	'views/youtube_player',
	'views/content_layout',
	// 'views/results_navigation',
	'modules/feed-filter/feed-filter',
	'modules/user-playlists/user-playlists',
	'modules/user-profile/user-profile',
	'views/facebook/facebook_like_view',
	'views/add-to-playlists/add-to-playlists',
	'modules/sidebar/sidebar-view',
	'views/Loader',
	'views/infinite_scroller',
	'views/google/gplus-share',
	'modules/presets/presets.view',
	'modules/duration/duration.view',

	'modules/updates/updates-view'
], function(
	$, _, Backbone,
	MediaSearch, YoutubePlayer, ContentLayoutView,
	// ResultsNavigation, 
	FeedFilter, UserPlaylists, UserProfile,
	FacebookLikeView,
	AddToPlaylists,
	SidebarView,
	Loader,
	InfiniteScroll,
	GPlusShare,
	PresetsView,
	DurationView,
	UpdatesView) {
   
	var PlayerApp = Backbone.View.extend({
		el: '.container-main',
		
		initialize: function() {
			this.addStyle();
});
   
	return PlayerApp;
});
```

Looking up where this module came from in a big list was tedious and hard.

The [build process, r.js](http://orizens.com/wp/blog/requirejs-optimizing-and-building-one-file/ "RequireJS – Optimizing and Building One File"), was and is still great for the purpose of Echoes Player project. I created aliases, css optimization, dependencies, special build options and optimization. You can checkout the configuration I used recently in all of the builds.

I didn't use all the options. One feature I wasn't able to use was the sourcemaps option and using uglify 2 for minifying.

```typescript
({
	//- paths are relative to this app.build.js file
	appDir: "../echoes",
	baseUrl: "js",
	//- this is the directory that the new files will be. it will be created if it doesn't exist
	dir: ".tmp",
	shim: {
		'bootstrap': {
			deps: [ 'jquery', 'jqueryui' ],
			exports: 'jQuery'
		},

		'jqueryui': {
			deps: ['jquery'],
			exports: 'jQuery'
		},

		'underscore': {
			exports: '_'
		},

		'backbonesrc': {
			deps: [ 'underscore', 'jquery'],
			exports: 'Backbone'
		}

	},

	paths: {
		jquery: 'libs/jquery/jquery',
		jqueryui: 'libs/jquery/jquery-ui',
		bootstrap: 'libs/bootstrap/bootstrap',
		underscore: 'libs/underscore/underscore',
		backbonesrc: 'libs/backbone/backbone',
		backbone: 'libs/backbone/backbonepkg',
		vars: 'libs/environmentVars',

		safe: 'libs/backbone/backbone.safe',
		collectionView: 'libs/backbone/backbone.CollectionView',
		switcher: 'libs/backbone/backbone.switcher',
		transition: 'libs/backbone/backbone.view-transition',
		beamer: 'libs/backbone/backbone.beamer',
		
		text: 'libs/require/text',
		utils: 'libs/utils',

		templates: '../templates'
	},

	optimize: "uglify2",
	// generateSourceMaps: true,
	// preserveLicenseaComments: false,
	uglify2: {
        // toplevel: true
    },

	// mainConfigFile: '../js/config.js',
	mainConfigFile: 'js/config.js',

	optimizeCss: "standard",
	modules: [
		{
			name: "config"
		}
	],
	removeCombined: false,
	fileExclusionRegExp: /(\.git)|(app.build.js)|(.sublime-)|(.md)|(node_modules)|(package.json)|(Gruntfile.js)|(web-server.js)|(server.js)/
})
```

## Enter Browserify

I started experimenting with node.js during the last year, and I really got used to the simplified and minimal form of requiring modules, using them and export the relevant features you want.

Then [Browserify](http://browserify.org/) published.

### Browserify In a Nutshell

Node.js style in your browser. Suddenly, the code of Echoes started to shrink, or at least, in various cases, became much more maintainable.

[Browserify's website](http://browserify.org/articles.html) has a very long list of articles, how to's and more resources its github page.

Using the CommonJS style makes more sense to me than using the AMD. I was hooked and started to convert all the code of Echoes to use CommonJS style. Require.js does has support for this style, however, [the code has to be wrapped in a function and a server has to support the lazy loading feature](http://requirejs.org/docs/whyamd.html#commonjs).

Browserify has plenty of features aside from using the CommonJS style (there's also support for AMD with browserify transforms). It gives you the option to use any node.js modules in side the browser. Basically, I can use the same Backbone.js package in the backend and in the client.

### Build Process

Another neat feature of browserify is its build options. Browserify is [a command line utility](https://github.com/substack/node-browserify), and aside from all of its abilities and options, it creates one big concatenated file of all the js files that are required in the main file that has been processed by it. For this process, it can get various options which will influence the end result. Some of these are: Sourcemaps and minify.

The project still had few challenges that I had to solve:

  1. Find a way to use aliases with browserify
  2. Using "shims" for loading CommonJS in compatible files (i.e. jquery-ui)
  3. Automate the process of compiling changed js files
  4. connect the flow to a grunt build system

## Browserify with Grunt

In Echoes, I currently use Grunt.js as build system. So, solving out the challenges above was quite easy once i've found the grunt-browserify plugin. Using and configuring  backbone.js was a little bit tricky since with the CommonJS version of Backbone.js, you should specify the Backbone.$ / jQuery - so I had to define the $ method manually

```typescript
var $ = require('jquery');
var Backbone = require('backbone');
var exts = require('./backbonepkg.js');

Backbone.$ = $;
exts(Backbone);

module.exports = Backbone;
```

However, that turned out to be well fit into the overall picture, since i also needed to have support for the backbone extension manager I developed back then - [Backbone.Beamer](https://github.com/orizens/Backbone.Beamer).

### Transformations

[UPDATE 26/09/2014] While Require.js has the concept of [plugins](http://requirejs.org/docs/plugins.html "Require.js Plugins"), Browserify has the concept of transformations. It Is Awesome.

You can configure a list of transformation that code should pass through before the end result is written to the destination file. It's like filters in cameras. You still get result, after it has been digested by the filter. There's a [huge list of transformations](https://github.com/substack/node-browserify/wiki/list-of-transforms) in browserify's github wiki

Since [Echoes Player](http://echotu.be) uses underscore templates and require.js to load these (html files), I found a this great [jstify transform](https://github.com/zertosh/jstify) which does 2 important tasks:

  1. it allows loading html files with underscore template annotations, with the require method in js (awesome 1) - that can be done with require.js text plugin.
  2. it gives the option to precompile these templates, which will save computation time in the client (awesome 2).

### Closing Notes

To summarise, the transition to using browserify turned out to be a nice experience with CommonJs style, leaving a more simple roadmap to migrate the build system to gulp.js (at least, I intend to) and a great reminder to keep programming & developing in a modular style.

[UPDATE 26/09/2014] This article reflects my own personal thoughts of working with modules and dependency management in javascript as well as challenges and interests in new solutions.

Currently, [Echoes code with browserify is in its own branch. go ahead - it's open source](https://github.com/orizens/echoes/tree/browserify).