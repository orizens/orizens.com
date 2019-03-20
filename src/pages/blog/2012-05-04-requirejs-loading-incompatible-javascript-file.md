---
id: 411
title: 'AMD/RequireJS &#8211; Loading Incompatible JavaScript Files'
date: 2012-05-04T07:05:32+00:00
author: Oren Farhi 
templateKey: blog-post
layout: post
guid: http://orizens.com/wp/?p=411
permalink: /topics/requirejs-loading-incompatible-javascript-file/
shareaholic_disable_share_buttons:
  - "0"
shareaholic_disable_open_graph_tags:
  - "0"
dsq_thread_id:
  - "751191652"
image: ../../img/uploads/2012/05/IMG_20120504_091043_Tony_Hassel.jpg
categories:
  - backbone
  - javascript
  - requirejs
  - underscore
tags:
  - backbone
  - javascript
  - requirejs
  - underscore
---
What do you do when you need to load javascript files with [requirejs](http://requirejs.org) when these are not compatible with the requirements?

[Tim Branyen](http://tbranyen.com) has put up a nice plugin while explaining an alternative as well.
  
<!--more-->


  
**UPDATE:** [requirejs version 2 released](https://github.com/jrburke/requirejs/wiki/Upgrading-to-RequireJS-2.0#wiki-shim "RequireJS version 2") &#8211; it includes a built in solution for the &#8220;order&#8221; plugin functionality as well as other new and useful features.
  
I&#8217;m working on a project based on [backbone](http://documentcloud.github.com/backbone) and [underscore](http://documentcloud.github.com/underscore). On the beginning, we had to find a properly compatible ports of these libraries in order to make them work with requirejs.

Soon, when both libraries released new versions, we have found out that its ports are not updated and we had to figure out the changes made to the source code in order to make the new versions compatible again with requirejs.

Obviously, this solution isn&#8217;t maintainable & good enough.

## Solution 1: The &#8220;use&#8221; Plugin

Tim Branyen has put up the &#8220;use!&#8221; plugin for requirejs. This plugin, with the proper configuration, loads incompatible javascript files:

[AMD/RequireJS Shim Plugin for Loading Incompatible JavaScript | Tim Branyen @tbranyen](http://tbranyen.com/post/amdrequirejs-shim-plugin-for-loading-incompatible-javascript)

## Solution 2: Without a Plugin

There is a method for loading incompatible javascript files without any dedicated plugin (aside for the offical &#8220;order&#8221; plugin &#8211; for special cases).
  
First, I configured requirejs with aliases to my backbone & underscore libraries to specific loaders (main.js):

<pre class="brush:js">require.config({
  paths: {
  	order: "libs/require/order",
	jquery: 'libs/jquery/jquery-min',
	underscore: 'libs/underscore/underscore-loader',
	backbone: 'libs/backbone/backbone-loader',
  }
});</pre>

I created a customized &#8220;underscore-loader.js&#8221; javascript file. This file loads the original underscore library &#8211; this gives me the option to replace underscore versions (development/production/other builds) without affecting the general application configuration (_underscore-loader.js_):

<pre class="brush:js">define(["libs/underscore/underscore-orig"], function() {
  return window._;
});</pre>

To load backbone, I had to use the [&#8220;order&#8221; plugin](http://requirejs.org/docs/1.0/docs/download.html#order) &#8211; which tells require js to load the depended files by the order of the array, and then invoking the callback. In backbone&#8217;s case, I have to specify underscore once again to make sure the underscore-orig will be loaded if it hasn&#8217;t (_backbone-loader.j_s).

<pre class="brush:js">define(["order!jquery", "order!libs/underscore/underscore-orig", "order!libs/backbone/backbone-orig"], function() {
  return window.Backbone;
});</pre>

## How to use it?

As simple as it goes:

<pre class="brush:js">define([
	'jquery',
	'underscore',
	'backbone',
], function ( $, _, Backbone ) {
	var Grid = Backbone.View.extend({

		template: _.template($("#grid-template")),

		initialize:function () {
			this.model.on("change", this.render, this);
		}
	});
})</pre>