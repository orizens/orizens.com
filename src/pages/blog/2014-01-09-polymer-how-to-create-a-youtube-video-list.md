---
id: 653
title: 'Polymer &#8211; how to create a youtube video list'
date: 2014-01-09T18:56:14+00:00
author: Oren Farhi 
templateKey: blog-post
layout: post
guid: http://orizens.com/wp/?p=653
permalink: /topics/polymer-how-to-create-a-youtube-video-list/
dsq_thread_id:
  - "2103038921"
image: ../../img/uploads/2014/01/polymer.jpg
categories:
  - html5
  - javascript
tags:
  - javascript
  - polymer
---
During the last fuseday at <a href="http://tikalk.com" target="_blank">Tikal</a>, the javascript group focused on yet another javascript stack.
  
In this post i&#8217;m sharing my experience with Google&#8217;s Polymer project led by Eric Bidelman.

<!--more-->

The Javascript stack that we used for the project was:

  * sailsjs for server side
  * Polymer for client side
  * mongodb for database
  * monogohq for cloud mongo database
  * grunt for automation tasks (build, concat, etc..)
  * nodejitsu for deploying

### Polymer &#8211; intro

Polymer is an open source project by Google, which aims to follow future standard of web components and use them in browsers today.
  
All in all, it provides good and solid polyfills for some of the standards that define web components:

  * Templates
  * HTML imports
  * Custom elements
  * Shadow DOM

So, once browser vendors implements these standards, Polymer will use the native implementation.

## Fuseday and Polymer

The project for December 2013 fuseday was to creat a youtube application which has 2 main modules:

  1. Screen &#8211; a page where a youtube video is played
  2. Remote &#8211; a page to search for youtube videos and select and control one video to be played in the Screen

So, eventually, one would open the application in 2 clients: TV for Screen, mobile device for Remote.
  
I had the challange of working with Polymer and implement the Remote module with it.

### Polymer &#8211; mantra

Polymer follows one mantra: [Everything is an element](http://html5-demos.appspot.com/static/cds2013/index.html#31).
  
It tries to elimintate js boilerplate code by embracing back html standards &#8211; and for anyone who&#8217;ve been using angular&#8217;s directives &#8211; it will look much simliar in concept.
	  
All i needed for the Remote module was a simple module that will display a list of youtube items, searching youtube and controls for the currently played video. So, basically, my custom element should be in its simplest form like so:

<pre class="brush:js">&lt;youtube-list>&lt;/youtube-list>
</pre>

and for using it:

<pre class="brush:html">



	&lt;youtube-list>&lt;/youtube-list>


</pre>

Polymer provides both basic platform elements and ui widgets. For starters, I chose to focus on the platform elements and create the youtube list module.

### Polymer &#8211; platform elements

The platform elements aims to provide &#8220;tools&#8221; for various use cases: let it be ui widgets, modules and in general: any custom elements or procedures you can think of.
	  
The &#8220;youtube-list&#8221; module requires few polymer elements:

  * polymer.html &#8211; for creating polymer elements
  * polymer-ajax &#8211; for using ajax

Now, For creating the new module &#8220;youtube-list&#8221;, we start with this snippet:

<pre class="brush:js">&lt;polymer-element name="youtube-list" attributes="">
	
	&lt;template>&lt;/template>
	
&lt;/polymer-element>
</pre>

This code actually creates an incapsulated code which runs within the &#8220;youtube-list&#8221; module context.
	  
&#8220;style&#8221; tag can be used for any custom style of this module &#8211; and will be implemented to the inside contents of this element.
	  
&#8220;template&#8221; is the html markup that this module is created with. inside this tag we&#8217;ll use the &#8220;polymer-ajax&#8221; element.
	  
&#8220;script&#8221; is the js script that will define the js polymer object and will hold the logics and behaviour of this module.
	  
&#8220;attributes&#8221; may be a space seperated string of attributes that is exposed outside of this element (think of &#8220;input&#8221; attributes: &#8220;type&#8221;, &#8220;value&#8221;) &#8211; which will be defined as: attributes=&#8221;type value&#8221;

#### template

The &#8220;template&#8221; tag is part of the html5 standards and may consists html markup code with the commonly used templating syntax of mustasch/angularjs &#8211; {{ title_value }} &#8211; which is also used for data binding.
	  
The evaluation of the expressions is done towards the polymer&#8217;s element local public (defined with &#8220;this&#8221; inside the Polymer definition in the script tag) variables and attributes variables as well.
	  
The &#8216;template&#8217; tag may be nested and used. Its most common use is using it in a &#8220;repeat&#8221; expression.
	  
Much like angularjs directive &#8220;ng-repeat&#8221;, you would use the repeat like so:

<pre class="brush:js">&lt;template id="yt-list" repeat="{{item in items}}">
	

<h2 videoid="{{item.id.videoId}}">
  {{item.snippet.title}}
</h2>
	...
	...
&lt;/template>
</pre>

The polymer-ajax element is declared inside the main template tag for this module as so:

<pre class="brush:js">&lt;polymer-ajax id="ajax" url="/search/list" 
    params=''
    handleAs="json"
    on-polymer-response="{{handleResponse}}">
&lt;/polymer-ajax>
</pre>

In the next section we&#8217;ll see what the &#8220;id&#8221; attribute is used for, and how easy it is to use the polymer-ajax with js code. The &#8216;handleResponse&#8217; is a function which is defined in the script tag.

#### script

The &#8220;script&#8221; tag holds the logics of the custom element that we&#8217;ve created. Its important to note that it is not required if your custom element doesn&#8217;t have any js logics &#8211; otherwise &#8211; it&#8217;s a must.
	  
For declaring and inteacting with the new custom element &#8220;youtube-list&#8221;, we need to declare this element using the Polymer function:

<pre class="brush:js">Polymer('youtube-list', {
	ready: function() {
		this.nowPlaying = 'choose something below...';
		this.items = [{
			snippet: {
				title: 'loading...',
				description: ''
			}];
	}
});
</pre>

The &#8216;ready&#8217; function runs once Polymer has been initialized. Then, on any change to local, public properties attached to &#8220;this&#8221; context, the relevant expressions which have been defined in the template tag will be evaluated and rendered to the DOM of this element.
	  
Lets inspect the &#8220;script&#8221; more and focus on the &#8216;handleResponse&#8217; method that is defined in the polymer-ajax element.
	  
This method id defined as a method of the &#8216;youtube-list&#8217; polymer element:

<pre class="brush:js">handleResponse: function(ev, res){
	this.items = res.response.items;
	this.loading = '';
}
</pre>

Notice that all it has to do in order to update the dom with the new items is updating the &#8220;this.items&#8221; property. The rest is being taking care of by Polymer&#8217;s data binding &#8211; so the new items that were retreived from the ajax call will be rendered accrodingly.
	  
One of the many features that I like in Polymer is that it saved a reference to an element with an id attribute. Lets see how we use it here.
	  
For searching youtube videos, a form is defined in the template:

<pre class="brush:js"></pre>

First, a submit event handler is defined on Polymer&#8217;s &#8216;ready&#8217; function. Notice how I can easily refer to the search form by quering the &#8220;this.$&#8221; property. Also, the callback function sends the input&#8217;s value to the &#8216;query&#8217; method. Eventualy, the query method refers to the &#8216;ajax&#8217; element using the &#8216;this.$ajax&#8217; and runs the &#8216;go&#8217; method. The &#8216;go&#8217; method is a built in method that comes with polymer-ajax.

<pre class="brush:js">ready: function(){
....
	var that = this;
	this.$.search.addEventListener('submit', function(ev){
		that.query(that.$.query.value);
		ev.preventDefault();
	});
},
..
..

query: function(q){
  var that = this;
  this.loading = "finding your query now...";
  var params = {
  	alt: "json",
  	q: q
  };
  this.$.ajax.params = JSON.stringify(params);
  this.$.ajax.go();
}
</pre>

### Summary

Polymer was fun to experiment with. Coming from angularjs background felt just like home with its native templating engine.
	  
One of the nicest things in using polymers is seeing the actual elements in the source of the html inside the devtools. I also like the way devtools seperates the various ingridients of the custom polymer to its own files in the &#8220;sources&#8221; tab of devtools.
	  
Polymer is an interesting concept and has lots of gems to play with &#8211; both ui elements (tabs, navigation, cards, lists, menu etc..) and platform elements (ajax, animation ,localstorage etc..).
	  
Polymer truly promotes and takes the javascript module methodology to a high level in web development while exposing the future platform of html5 web components standards.
	  
The project of fuseday is [open source](https://github.com/tikalk/youtube-remote-js/blob/master/assets/polymers/youtube-list.html) and the full code is on github.