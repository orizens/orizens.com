---
id: 653
title: 'Polymer - how to create a youtube video list'
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
  
In this post i'm sharing my experience with Google's Polymer project led by Eric Bidelman.

<!--more-->

The Javascript stack that we used for the project was:

  * sailsjs for server side
  * Polymer for client side
  * mongodb for database
  * monogohq for cloud mongo database
  * grunt for automation tasks (build, concat, etc..)
  * nodejitsu for deploying

### Polymer - intro

Polymer is an open source project by Google, which aims to follow future standard of web components and use them in browsers today.
  
All in all, it provides good and solid polyfills for some of the standards that define web components:

  * Templates
  * HTML imports
  * Custom elements
  * Shadow DOM

So, once browser vendors implements these standards, Polymer will use the native implementation.

## Fuseday and Polymer

The project for December 2013 fuseday was to creat a youtube application which has 2 main modules:

  1. Screen - a page where a youtube video is played
  2. Remote - a page to search for youtube videos and select and control one video to be played in the Screen

So, eventually, one would open the application in 2 clients: TV for Screen, mobile device for Remote.
  
I had the challange of working with Polymer and implement the Remote module with it.

### Polymer - mantra

Polymer follows one mantra: [Everything is an element](http://html5-demos.appspot.com/static/cds2013/index.html#31).
  
It tries to elimintate js boilerplate code by embracing back html standards - and for anyone who've been using angular's directives - it will look much simliar in concept.
	  
All i needed for the Remote module was a simple module that will display a list of youtube items, searching youtube and controls for the currently played video. So, basically, my custom element should be in its simplest form like so:

```typescript


```

and for using it:

```typescript




	&lt;youtube-list>&lt;/youtube-list>



```

Polymer provides both basic platform elements and ui widgets. For starters, I chose to focus on the platform elements and create the youtube list module.

### Polymer - platform elements

The platform elements aims to provide &#8220;tools" for various use cases: let it be ui widgets, modules and in general: any custom elements or procedures you can think of.
	  
The &#8220;youtube-list" module requires few polymer elements:

  * polymer.html - for creating polymer elements
  * polymer-ajax - for using ajax

Now, For creating the new module &#8220;youtube-list", we start with this snippet:

```typescript

	
	&lt;template>&lt;/template>
	
&lt;/polymer-element>

```

This code actually creates an incapsulated code which runs within the &#8220;youtube-list" module context.
	  
&#8220;style" tag can be used for any custom style of this module - and will be implemented to the inside contents of this element.
	  
&#8220;template" is the html markup that this module is created with. inside this tag we'll use the &#8220;polymer-ajax" element.
	  
&#8220;script" is the js script that will define the js polymer object and will hold the logics and behaviour of this module.
	  
&#8220;attributes" may be a space seperated string of attributes that is exposed outside of this element (think of &#8220;input" attributes: &#8220;type", &#8220;value") - which will be defined as: attributes="type value"

#### template

The &#8220;template" tag is part of the html5 standards and may consists html markup code with the commonly used templating syntax of mustasch/angularjs - {{ title_value }} - which is also used for data binding.
	  
The evaluation of the expressions is done towards the polymer's element local public (defined with &#8220;this" inside the Polymer definition in the script tag) variables and attributes variables as well.
	  
The &#8216;template' tag may be nested and used. Its most common use is using it in a &#8220;repeat" expression.
	  
Much like angularjs directive &#8220;ng-repeat", you would use the repeat like so:

```typescript

	

<h2 videoid="{{item.id.videoId}}">
  {{item.snippet.title}}
</h2>
	...
	...
&lt;/template>

```

The polymer-ajax element is declared inside the main template tag for this module as so:

```typescript
&lt;polymer-ajax id="ajax" url="/search/list" 
    params=''
    handleAs="json"
    on-polymer-response="{{handleResponse}}">
&lt;/polymer-ajax>

```

In the next section we'll see what the &#8220;id" attribute is used for, and how easy it is to use the polymer-ajax with js code. The &#8216;handleResponse' is a function which is defined in the script tag.

#### script

The &#8220;script" tag holds the logics of the custom element that we've created. Its important to note that it is not required if your custom element doesn't have any js logics - otherwise - it's a must.
	  
For declaring and inteacting with the new custom element &#8220;youtube-list", we need to declare this element using the Polymer function:

```typescript
Polymer('youtube-list', {
	ready: function() {
		this.nowPlaying = 'choose something below...';
		this.items = [{
			snippet: {
				title: 'loading...',
				description: ''
			}];
	}
});

```

The &#8216;ready' function runs once Polymer has been initialized. Then, on any change to local, public properties attached to &#8220;this" context, the relevant expressions which have been defined in the template tag will be evaluated and rendered to the DOM of this element.
	  
Lets inspect the &#8220;script" more and focus on the &#8216;handleResponse' method that is defined in the polymer-ajax element.
	  
This method id defined as a method of the &#8216;youtube-list' polymer element:

```typescript
handleResponse: function(ev, res){
	this.items = res.response.items;
	this.loading = '';
}

```

Notice that all it has to do in order to update the dom with the new items is updating the &#8220;this.items" property. The rest is being taking care of by Polymer's data binding - so the new items that were retreived from the ajax call will be rendered accrodingly.
	  
One of the many features that I like in Polymer is that it saved a reference to an element with an id attribute. Lets see how we use it here.
	  
For searching youtube videos, a form is defined in the template:

```typescript


First, a submit event handler is defined on Polymer's &#8216;ready' function. Notice how I can easily refer to the search form by quering the &#8220;this.$" property. Also, the callback function sends the input's value to the &#8216;query' method. Eventualy, the query method refers to the &#8216;ajax' element using the &#8216;this.$ajax' and runs the &#8216;go' method. The &#8216;go' method is a built in method that comes with polymer-ajax.

```typescript
ready: function(){
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

```

### Summary

Polymer was fun to experiment with. Coming from angularjs background felt just like home with its native templating engine.
	  
One of the nicest things in using polymers is seeing the actual elements in the source of the html inside the devtools. I also like the way devtools seperates the various ingridients of the custom polymer to its own files in the &#8220;sources" tab of devtools.
	  
Polymer is an interesting concept and has lots of gems to play with - both ui elements (tabs, navigation, cards, lists, menu etc..) and platform elements (ajax, animation ,localstorage etc..).
	  
Polymer truly promotes and takes the javascript module methodology to a high level in web development while exposing the future platform of html5 web components standards.
	  
The project of fuseday is [open source](https://github.com/tikalk/youtube-remote-js/blob/master/assets/polymers/youtube-list.html) and the full code is on github.