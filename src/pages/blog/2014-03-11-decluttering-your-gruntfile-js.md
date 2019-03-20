---
id: 663
title: Decluttering your Gruntfile.js (organizing grunt)
date: 2014-03-11T13:39:40+00:00
author: Oren Farhi 
templateKey: blog-post
layout: post
guid: http://orizens.com/wp/?p=663
permalink: /topics/decluttering-your-gruntfile-js/
dsq_thread_id:
  - "2407663393"
image: ../../img/uploads/2014/03/IMG_20140311_153002.jpg
categories:
  - javascript
  - tools
tags:
  - Grunt.js
  - javascript
---
[Grunt.js](http://gruntjs.com/) is a great javascript task runner. It helps you to be more productive and automate various tasks for development, testing and production.

Once you get how it works, Grunt is quite easy, and like myself, you start to look for new modules to automate any task in the project you&#8217;re working on. In this post I want to share how I organize my Gruntfile and its grunt configuration so it can be more maintainable. (level: intermediate)

<!--more-->

## The Problem with configuring grunt

Soon, after adding grunt modules, Grunt&#8217;s configuration object grows and Gruntfile.js becomes a monstrous gigantic 500 lines of configuration and settings. Sure, today we can handle these kind of files with ide navigation tricks.

However, it is very tedious and uncomfortable to manage such a configuration file. Its quite hard to find configurations, jump between them inside the file and not possible (almost) to view 2 or more configurations side by side. More important, it is not that scalable and once you want to remove a grunt module, it becomes quite a hard task to achieve.

[This is an example for such file: Gruntfile.js](https://gist.github.com/orizens/9485151)

The example of the Gruntfile.js above was generated using Yeoman, and afterwards was edited several times.

## The Solution &#8211; organize your Gruntfile.js

While I was working on creating a build task, I&#8217;ve found out that this structure of Gruntfile.js is horrible and decided to organize and declutter the file &#8211; so grunt modules can be loaded as modules.

## 1st Step &#8211; Start from scratch

First, I created an empty object and named it &#8220;gruntConfig&#8221;.

<pre class="brush:js">var gruntConfig = {};</pre></p> 

## 2nd Step &#8211; Divide configuration to modules

I created a &#8220;grunt&#8221; directory on the root of my project.
	  
For each defined configuration key, I created a file with the same name of the key.

Each file, defined a nodejs module (CommonJS style) that exports a function.
	  
This function gets a &#8220;grunt&#8221; reference argument and needs to return the configuration json that I extracted from the grunt configuration object.
	  
The idea in getting the &#8220;grunt&#8221; object as an argument is to have access to any grunt configuration properties, if needed.
  
i.e. &#8211; for the less module i created: [&#8220;grunt/less.js&#8221;](https://gist.github.com/orizens/9485171).

## 3rd Step &#8211; loading the external configurations

There are ready [grunt plugins](http://gruntjs.com/plugins) in the npm registry that can load the external configuration and initialize the configuration. However, some didn&#8217;t worked out for me and i needed a way to load selected configurations.
	  
It turned to be quite an easy and small code to write, so I ended up writing a code that requires each module (the ones I need) and adds each configuration ot the gruntConfig I created in step 1 (that&#8217;s how naming each file as the key comes in handy).
   
[This is the code that loads the external grunt configuration files](https://gist.github.com/orizens/9488045)
  
Then, I initialized grunt with:

<pre class="brush:js">grunt.initConfig(gruntConfig);</pre></p> 

## Conclusion &#8211; Enlightenment

Ever since cleaning the Gruntfile.js and organizing it in such a way, made it quite easy to add and testing new modules, removing unused modules and finding and configuring each one with ease. Moreover, maintaining the organized gruntfile.js became much more enjoyable and feasible.