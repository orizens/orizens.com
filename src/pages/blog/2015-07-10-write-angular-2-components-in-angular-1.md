---
id: 800
title: Write Angular 2 Components In Angular 1
date: 2015-07-10T08:33:53+00:00
author: Oren Farhi 
templateKey: blog-post
layout: post
guid: http://orizens.com/wp/?p=800
permalink: /topics/write-angular-2-components-in-angular-1/
dsq_thread_id:
  - "3920946442"
image: ../../img/uploads/2015/07/fffff-e1436517082946.jpg
categories:
  - AngularJS
  - architecture
  - browserify
  - javascript
tags:
  - angular.js
  - architecture
  - browserify
  - javascript
---
Angular (+2) is a new take to the web components approach. It introduced a quite different syntax with the addition of typescript, annotations and more. Eventually, it has to be compiled to javascript, so the non-javascript syntax is transformed into plain ES5 code. After reading a post about better ES5 code for Angular (+2), the idea of experimenting with this syntax in AngularJS can be beneficial for future migration, for learning the new syntax, and perhaps, minimizing the code written with AngularJS.

<!--more-->

### Preface: The Echoes Project

<a href="http://github.com/orizens/echoes" target="_blank">Echoes</a> is an open source project that i've recently converted to AngularJS. Essentialy, It is a media player aims to delier a <a href="http://echotu.be" target="_blank">great user experience in listening and watching videos from youtube</a>. It also serves as a code playground for experimenting with various solutions.

Echoes is composed of several modules. I like the modular approach, which is described nicely with the concpet of web components. I <a href="http://orizens.com/wp/topics/web-components-routing-style-with-angular-1-x/" target="_blank">wrote before</a> about how I see and integrate this approach in some of the modules in Echoes.

### The Youtube Videos Module (Web Component)

The first impression in Echoes is the youtube videos results **grid (the area of the thumbnails)**:

[<img class=" size-large wp-image-802 aligncenter" src=".../../img/uploads/2015/07/Screen-Shot-2015-07-10-at-11.23.31-AM-1024x640.png" alt="Screen Shot 2015-07-10 at 11.23.31 AM" width="1024" height="640" />](.../../img/uploads/2015/07/Screen-Shot-2015-07-10-at-11.23.31-AM-e1436516680980.png)

youtube-videos is an anuglar module. It consumes 2 core services:

  1. **echoes-services** - which includes access to various youtube api, various core resources.
  2. **youtube-player** - a module which displays the youtube player and exposes a service to interact with.

As I wrote before, in order to use this module, I exposed it a directive, and can simply use it like so:

<pre class="lang:xhtml decode:true">&lt;youtube-videos&gt;&lt;/youtube-videos&gt;

</pre>

### Angular 1 Directive Definition

In order to user youtube-videos module as a direcive, I defined it as a quite simple directive with this code:

<pre class="lang:default decode:true">(function() {
    'use strict';

    angular
        .module('youtube.videos')
	    .directive('youtubeVideos', youtubeVideos);

        /* @ngInject */
        function youtubeVideos () {
            // Usage:
            //	&lt;youtube-videos&gt;&lt;/youtube-videos&gt;
            // Creates:
            //
            var directive = {
            	templateUrl: 'app/youtube-videos/youtube.videos.tpl.html',
                controller: 'YoutubeVideosCtrl',
                controllerAs: 'vm',
                restrict: 'E',
                replace: true
            };
            return directive;
        }
})();</pre>

Although, the code is quite minimal, during time, I thought that it can be defined better - better to readiblility and for writing less code.

After reading Pascal Precht post &#8220;<a href="http://blog.thoughtram.io/angular/2015/07/06/even-better-es5-code-for-angular-2.html" target="_blank">Even better ES5 code for Angular (+2)</a>&#8220;, I was quite happy to find out that syntactical improvments for ES5 have been integrated to the latest alpha version of Angular (+2). These improvments goes back to a more minimal code defintion in Angular (+2), while not having the need for annotations or a more complex code for creating an &#8220;annotation" object for each purpose.

### Angular (+2) Component with Angular 1

Following Pascal's post, I saw a great opportunity to try enbracing angular's 2 component approach  and syntax to my youtube-videos module.

First, I read through to understand how I can transform the defintion of the directive to component in Angular (+2). I came up with this new syntax for <span style="text-decoration: underline;"><strong>AngularJS</strong></span> approach for defining a module as a directive or a component based on the latest Angular (+2) ES5 syntax:

<pre class="lang:default decode:true">angular
    .Component({
        selector: 'youtube-videos',
        appInjector: [
            'echoes.services',
            'youtube.player'
        ]
    })
    .View({
        templateUrl: 'app/youtube-videos/youtube.videos.tpl.html'
    })
    .Class({
        constructor: 'YoutubeVideosCtrl'
    })</pre>

The code above works seemlessy the same of the AngularJS directive code, that with a little shim that I wrote which should be loaded right after angular.

<pre class="lang:xhtml decode:true ">&lt;script type="text/javascript" src="../bower_components/angular/angular.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript" src="../node_modules/angular2to1/index.js"&gt;&lt;/script&gt;</pre>

[angular2to1](https://github.com/orizens/angular2to1) is published as an npm module. to install it, simply use npm:

<pre class="lang:sh decode:true">npm install angular2to1</pre>

### angular2to1 Assumptions

Since the angular2to1 shim is in early stages, I have taken few assumtptions with it:

  1. a component is an element by default - unless the &#8220;selector" defines it as an attribute
  2. Currently, it supports an element and an attribute (no support for nested selectors, class selectors and multiple selectors)
  3. the resulted directive definition always use: &#8220;controller **as** vm"
  4. &#8220;bindToController" is always true (currently)
  5. Each components is defined with a private scope (scope: {}) by default (can be changed)
  6. template syntax is still AngularJS (that's why I currently prefer currently to use the templateUrl property"
  7. the &#8216;appInjector' currently uses strings rather than objects (which defers form Angular (+2))
  8. &#8220;constructor" in Class annotation, can be a reference to an actual function (rather than a string)
  9. the custom element is not &#8220;replaced" after render - so actually, the &#8220;replace" property of AngularJS directive is false by default (it can be changed, see below).

Also important to note that the **angular.Component** defintion returns an object which exposes the **directive** definition object:

<pre class="lang:default decode:true">var myAppComponent = angular.Component({
	selector: 'my-app'
	appInjector: [ 
		'core.services'
	]
});

console.log(myAppComponent._directive); // access to the _directive object definition to add or change AngularJS directive properties
</pre>

This allows you to still be able to still define AngularJS directive properties (such as &#8220;replace: true" for templates and the directive element).

### Pros

Though the angualr2to1 shim is far from complete and is lack with many other features of Angular (+2), there are few pros for using it:

  1. I can experiment with Angular (+2) ES5 syntax right now with AngularJS
  2. I can learn Angular (+2) concepts while working with AngularJS
  3. When migration time to Angular (+2) comes, it might ease the process - in which I'd like to explain in depth below.

### Easing the Migration Process to Angular (+2)

I realize the migration depends on other factors as well. However, taking few steps with AngularJS today might ease migration later.

Embracing the CommonJs module approach - with browserify (<a href="http://benclinkinbeard.com/talks/2014/ng-conf/" target="_blank">as described by Ben Clinckinbeard</a>) or webpack), takes the code to plain javascript functions that can be used regardless the framework you use.

Using the &#8220;controllerAs" enhancements (along with bindToController) directs to write the resulted code of the controller as javascript function, agnostic to any other angular or framework.

Keeping the definition of the component in a seperate file (or following Ben's slide to work with browserifiy) will help in following the seperation of concerns.

### Conclusion

Regardless Angular (+2) syntax, in my opinion, this syntax is much nicer, more minimal in it approach and still readable while following conventions (i.e, using selectors to define web components). So, I still my self using it with AngularJS.

There is still much work and other nice concepts in Angular (+2) that I hope to integrate so I can easily use it with AngularJS, and hopefully, ease the migration to Angular (+2) when the time comes.

[angular2to1 is open source and hosted on github](https://github.com/orizens/angular2to1). Please, feel free to support it, open issues and help to extend it.