---
id: 557
title: 'Backbone.View Patterns - rendering a collection'
date: 2013-03-21T19:21:36+00:00
author: Oren Farhi 
templateKey: blog-post
layout: post
guid: http://orizens.com/wp/?p=557
permalink: /topics/backbone-view-patterns-rendering-a-collection/
shareaholic_disable_share_buttons:
  - "0"
shareaholic_disable_open_graph_tags:
  - "0"
dsq_thread_id:
  - "1155095855"
image: ../../img/uploads/2013/03/IMG_20130321_210004_Antonio_Rainbow_Dirt1.jpg
categories:
  - backbone
  - javascript
  - patterns
tags:
  - backbone
  - javascript
  - patterns
---
Backbone.View doesn't implement the "render" method. According to [Backbone's Documentation](http://documentcloud.github.com/backbone/#View-render "Backbone Documentation"):
  
"Backbone is agnostic with respect to your preferred method of HTML templating".
  
So, when it comes to rendering a collection of items (or simply, a backbone collection), there's a need to implement a method for it. In this post, I'm sharing the best practices I learned when it comes to rendering collections with Backbone.
  
<!--more-->

## The "renderCollection" method

For rendering views we can simply add a new method to Backbone.View that will take care of rendering a Backbone.Collection instance.

```typescript
renderCollection: function(options) {
	options = options || {};
	options.target = options.target || this.$el;
	options.collection = options.collection || this.collection;
 
	//- reset views
	if (!options.add) {
		this.disposeViews();
	} else {
		this._subviews = [];
	}
 
	this._renderOptions = options;
	//- if there is a collection and a view then render it
	if (options.collection && this.view) {
		options.collection.each(this._renderView, this);
	}
	return this;
}

```

## The Pitfalls With rendering Backbone Collection

When rendering a backbone collection, we need to keep track of a few pitfalls and look ahead for few reasons:

### Container View

There's a need for a container view to hold all views of the collection.
  
This can be a Backbone.View object that will get the collection as a reference and will render <a href="http://orizens.com/wp/topics/backbone-view-patterns-how-why-to-use-subviews/" title="Backbone.View Patterns – How & Why Use Subviews" target="_blank">subviews</a> into it.
  
The "options.target" (line 3) allows us to specify a certain "target" element to append the views to.

### Tracking Views

We need to track the instances of these views in order to prevent memory leaks when destroying the container view.
  
The "reset views" block (line 6), ensures to clean any old views that were rendered the last time or creates a new placeholder for the new views.
  
The "disposeViews" method, simply cleans (the safe way) any subviews that were rendered before.

### Rendering The Collection

Finally, the method iterates the collection and uses 2 methods to render each view & model within the collection.
  
The "_renderView" method renders a view to any given model as well as appending it to the selected "target" that was configured in the "options" object.

```typescript
_renderView: function(model) {
	this._renderOptions.target.append(
		this.createView(model, this._renderOptions.args || {}).render().$el
	);
}

```

This method uses the "createView" method which instantiates a view to a given model and optional arguments (using a regular Backbone.View constructor). The newly created instance is added to the internal array (for tracking) of subviews.

```typescript
createView: function(model, options) {
	var indexOfNewView = this._subviews.length;
	this._subviews.push(new this.view(_.extend({
			model: model
		},
		options
	)));
	return this._subviews[indexOfNewView];
}

```

### Cleaning Views

Eventually, when we want to destroy the views created with the collection, we would have to clean the references to the instances.
  
To achieve that, we will use the "disposeViews" method which will take care of calling the "destroy" and "dispose" method for each view.
  
The "disposeViews" will also have to reset the temporary "this._subviews" array that holds references to the created views instances.

### What's Next?

Today (March 21st, 2013), Backbone version 1.0.0 has been released. Backbone.Collection object has been revamped with a <a href="http://backbonejs.org/#Collection-set" title="Backbone.Collection "set" Documentation">"set" method</a> (which replaced the &#8216;update' method). This method performs a "smart" update to an already existing collection, while removing and adding relevant data - as well as firing the relevant events "add" and "remove".
  
In future posts, I will elaborate on working with collection views in my media center project - <a href="http://echotu.be" title="Echoes Media Center - the new experience for media listening " target="_blank">Echoes Media Center</a> - an open source media center/player UX & UI to youtube media for personal laptops, or your living room TV.