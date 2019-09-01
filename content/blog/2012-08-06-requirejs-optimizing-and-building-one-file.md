---
id: 475
title: 'RequireJS - Optimizing and Building One File'
date: 2012-08-06T08:31:44+00:00
author: Oren Farhi 
templateKey: blog-post
layout: post
guid: http://orizens.com/wp/?p=475
permalink: /blog/requirejs-optimizing-and-building-one-file/
shareaholic_disable_share_buttons:
  - "0"
shareaholic_disable_open_graph_tags:
  - "0"
dsq_thread_id:
  - "794310652"
image: ../img/uploads/2012/08/IMG_20120806_113635_Anne_Burn_Dirt.jpg
categories:
  - backbone
  - javascript
  - nodejs
  - requirejs
---
<a href="http://requirejs.org/" title="requirejs module loader" target="_blank">requirejs</a> is a wonderful framework which allows to manage script dependencies in javascript quite easy. The idea is simple: each javascript module (object or class) is defined in a separate file. This method of organizing the code, gives ease the development process in finding code, maintaining it and also enforce (in some way) good practice for loose coupling.
  
However, if modules are divided to separate files, it means that we need to load all js files. That means that it might be lots of http requests which can lead to overload on servers, low performance and others.
  
In this post I want to show how requirejs allows us to minify all files into one master file.
  
<!--more-->

## Typical Structure of a RequireJS Web Application

When writing a web app using requirejs, it's important to separate each module to its own file. So, a typical file may look like this (I used backbone for this example):

```typescript
//- SearchModel.js
define(
//- dependencies
['underscore', 'backbone'], 

//- callback
function(_, Backbone) {
	var SearchModel = Backbone.Model.extend({
		defaults: {
			page: 1,
			name: 'highest_rating',
			step: 9
		},
		initialize: function() {}

	});

	return SearchModel;
});
```

The folder structure of the application may be as followed:

```typescript
- app
	- css
	- img
	- js
		- models
			SearchModel.js
		- views
			Search.js
	main.js
	index.html
```

<!--RndAds-->


  
So, the js folder might include hundreds of js files - and we wouldn't want to load all of them one by one. Locally it works fine, but serving it for others when remotely will result in low user experience and performance.

## Preparations for building one master file

It is a good practice to keep any build related files and generally, ant other files that are not required for the application, in a separate dedicated folder.

  1. Install <a title="nodejs" href="http://nodejs.org/" target="_blank">nodejs</a>.
  2. Create a new folder outside your application and name it - "build" or some other name related to build. In this folder we'll keep the files that are necessary to the build process.
  3. Download <a title="r.js build tool" href="http://requirejs.org/docs/download.html#rjs" target="_blank">r.js</a> file and put inside the "build" folder.

<!--RndAds-->


  
Now we're going to create a configuration file for the build process. This file includes information that is relevant for the build process. It tells the build where to start, what to do etc.
  
Create a new file inside the "build" folder and name it: "app.build.js".
  
this is a working example of my app.build.js file:
  


Please notice that the files of my application are located in the "app" folder. Additional options for this build json can be found in the <a href="https://github.com/jrburke/r.js/blob/master/build/example.build.js" title="example.build.js configuration file" target="_blank">r.js example github</a>.

## Running The Build

All you have to do now is open your console (i.e, cmd in windows), navigate to the "build" folder and run this command:

```typescript


You can find the new files in the folder that is defined in the "dir" property in app.build.js.
  
Additional help configuration can be found on the <a href="http://requirejs.org/docs/optimization.html" target="_blank">requirejs optimizer page</a>.
  
<!--RndAds-->

## Bonus: Automating Build Process with SublimeText

Since i'm working with <a href="http://orizens.com/wp/blog/javascript-ides-yes/" title="Javascript IDE’s? yes!" target="_blank">SublimeText</a> for code editing, I would like to have the option to build my project from. Fortunately, it's easy to accomplish.

  1. From sublime's menu, go to -> **Tools -> Build System -> New Build System &#8230;**. 
  2. Paste this code to the new created file:</p> ```typescript
{
	"cmd": ["node r.js -o app.build.js"],
	"shell": true
}
```

  3. Save the new configuration build with a preferred name - I used **"RequireJS Optimization"**. 

To use it, make sure the new reuqirejs build is checked in this menu - Tools -> Build System.
  
Press **"Ctrl + B"** or **Tools -> Build**.