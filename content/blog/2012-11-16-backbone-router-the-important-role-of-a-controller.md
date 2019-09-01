---
id: 534
title: 'Backbone Router - The important role of a Controller'
date: 2012-11-16T17:14:01+00:00
author: Oren Farhi 
templateKey: blog-post
layout: post
guid: http://orizens.com/wp/?p=534
permalink: /blog/backbone-router-the-important-role-of-a-controller/
shareaholic_disable_share_buttons:
  - "0"
shareaholic_disable_open_graph_tags:
  - "0"
dsq_thread_id:
  - "931063074"
image: ../img/uploads/2012/11/IMG_20121116_191043_Peter_Burn_Hassel.jpg
categories:
  - backbone
  - javascript
  - patterns
tags:
  - backbone
  - javascript
  - patterns
---
<a title="Backbone Router Documentation" href="http://documentcloud.github.com/backbone/#Router" target="_blank">Backbone.Router</a> is one of the most useful objects in Backbone.
  
It just has the right concept for managing url based navigation with an easy configuration setup. However, beyond being a great routing manager, it has an important role in MVC architecture when creating Backbone based applications. In this post we'll explore the Router object and its important role.<!--more-->


  
* Translation to [Serbo-Croatian](http://science.webhostinggeeks.com/backbone-ruter) language by Jovana Milutinovich

## Defining a Backbone Router

Backbone.Router uses the url as its mechanism for listening to routes changes. There are 2 possible ways to handle url navigation:

  1. Using hash navigation - http://myapp.com/#explore
  2. Using a simple url with push state enabled - meaning no hash in the url, i.e - http://myapp.com/explore - this requires a server side support as well


  

  
In this post, i'll refer to the hash navigation (first option).
  
Creating a router is as simple as these steps:

### Defining Routes

First, we need to define the possible routes that our application will handle.
  
The &#8216;routes' property is an object of route-handler values.

```typescript
var AppRouter = Backbone.Router.extend({

		routes: {
			'': 'explore',
			'explore': 'explore',

			// other optional settings
			'filter/:feedType': 'filter',
			'searches/:query': 'search',
			'play/:type/:mediaId': 'playMedia'
		},
```

Notice that we can define dynamic parameters for urls and not just static urls.
  
We can define a parameter for url with this form - ":my-parameter" - similar to the filter, searches and play url definitions.
  
These will be mapped to arguments in the handler function. Each parameter to its own argument. It is a best practice to name these arguments in the handler function the same as its defined in the url - although it's not neccessary.

### Defining Handler Functions for Routes

Each "route handler" is actually a simple javascript method such as the "explore" and "filter" methods.
  
So, if a user enters "http://myapp.com/#explore", the handler function "explore" will be invoked.

```typescript
initialize: function(attributes) {
			this.model = attributes.model;
			Backbone.history.start();
		},

		explore: function() {
			this.model.route('explore');
		},

		filter: function (feedType) {
			this.model.feed(feedType);
		}
});
```

A handler function that supposed to get parameters, such as the "filter" function, should be declared with the right parameres, and as i've mentioned before - with the same argument name (for obvious readibility reasons).
  
The initialize method isn't mapped to any route, but rather being invoked when a router is instanciated using the "new" keyword.

### Make the Router Working

That's not the end.
  
One simple line should get the router working and start listening to hash change events in the url and that's the line that I wrote in the "initialize" method:

```typescript


As a foot note, if we would like to use the HTML5 feature of "push" state with url (the second option of defining a router), we can pass a boolean argument of "pushState":

```typescript


Simply enough, we now have a working router.

## The Role of the Router in MVC

In previous versions of Backbone, the Router was actually called a Controller. In my opinion, it can play the role of any term as well as both - it's a matter of perspective.
  
It's a Router since it's job is to monitor routes of the application and trigger its assigned function handler. On the other hand, it can be used as an application level Controller, since with urls you can define a certain reflection of the application's data on the server side.
  

  

  
Backbone Router can be thought of an API access to the application's database - the Model. With this thought in mind, you can clearly keep its functionality to a minimum - handling routing events only, and notifing the application's model about it.
  
Usually, in MVC applications, the controller layer handles requests that were submited from the client, the browser, resolves the request, and pass it over to the applications data manager, which then do some operation on the model and optionally returns a response to the controller, which then, sends it back to the view - the client (i.e. browser).
  
In order for the router to work in such way, it can be pretty useful to pass a reference of the application's model or application's data manager to the router, so each function handler can pass the requested url to the model. That is why I passed the model to the &#8216;initialize' method - so we'll be able to update the model in each function handler:

```typescript
initialize: function(attributes) {
			this.model = attributes.model;
			Backbone.history.start();
	}
```

### Other uses of Router as a Controller

Currently, my preference is using the router for capturing routing events and update the application model with the relevant data - as used in my [open source project](https://github.com/orizens/echoes "My Github") [Echoes Media Center](http://echotu.be "Echoes Media Center - Alternative UI for youtube").
  
This method works out quite well on few directions:

  * It helps keeping the one responsibility concept for the router
  * Router is still testable without any views or DOM
  * Router is encapsulated and doesn't dependant on other modules except a model - similar to a Backbone.View object

The idea is having this configuration:

  1. There is one application Model.
  2. There is one application View which manages the various application's views.
  3. The Router gets a reference to this application model instance.
  4. The application View gets a reference to the application model instance
  5. This is, in a way, MVC architecture - the View and the Router (Controller) interacts with the same Model.

There are other Router implementations out there. Some interacts directly with views, some interact with a mediator object which triggers an application level event. There are also examples of using multiple seperate routers - to make code more clean and maintainable.

Beyond keeping the router modular, I found the above method to be working well with the MVC concept as well as with tests with libraries such as Jasmin. Moreover, it scales quite good and it's maintainable and easy to debug.

You're welcome to share your thoughts and comments below.

This is the full code for the code that is shown in the examples above:

```typescript
var AppRouter = Backbone.Router.extend({

	routes: {
		'': 'explore',
		'explore': 'explore',

		'filter/:feedType': 'filter',
		'searches/:query': 'search',
		'play/:mediaType/:mediaId': 'playMedia'
	},

	initialize: function(attributes) {
		this.model = attributes.model;
		Backbone.history.start();
	},

	explore: function() {
		this.model.route('explore');
		this.markNav('explore');
	},

	search: function(query) {
		//statements
	},

	playMedia: function(mediaType, mediaId) {
		//statements
	}
})
```