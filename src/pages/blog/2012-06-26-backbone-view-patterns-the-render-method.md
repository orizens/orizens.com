---
id: 429
title: 'Backbone.View Patterns &#8211; the &#8220;render&#8221; method'
date: 2012-06-26T15:08:45+00:00
author: Oren Farhi 
templateKey: blog-post
layout: post
guid: http://orizens.com/wp/?p=429
permalink: /topics/backbone-view-patterns-the-render-method/
shareaholic_disable_share_buttons:
  - "0"
shareaholic_disable_open_graph_tags:
  - "0"
dsq_thread_id:
  - "751757004"
image: ../../img/uploads/2012/06/IMG_20120626_181252_Tony_Kryptonite.jpg
categories:
  - backbone
  - javascript
  - patterns
tags:
  - backbone
  - javascript
---
Since I started working with Backbone, I discovered an amazing piece of javascript toolbox which allows me to shape my code base and organize it.
  
Backbone&#8217;s &#8220;View&#8221; class is usually a manifestation of some Model&#8217;s data &#8211; or just a really implementation of creating DOM elements with custom behavior.
  
I&#8217;ve found that I use a certain pattern in some of the views in order make it reusable in other &#8220;parent&#8221; views.
  
<!--more-->


  
One of the simplest uses of that kind of view is:
  
The render method of the a simple TableView which doesn&#8217;t use a RowView for each row can be something like:

<pre class="brush:js">var TableView = Backbone.View.extend({

	render: function() {
		this.$el.html(this.model.toJSON());
	}

});</pre>

## An Enhanced Table View

Suppose there&#8217;s a decision to construct the rows by a RowView in order to enhance the table&#8217;s behavior.
  
This RowView should be something like:

<pre class="brush:js">var RowView = Backbone.View.extend({
	events: { /* some level of behavior */ }
	render: function() {
		this.$el.html(this.model.toJSON());
		return this;
	}

});</pre>

Notice how that I added a &#8220;return this&#8221; at the end of the render method. This is a common pattern when using a backbone view: This gives us the ability to reuse the view as a sub view and also use &#8220;pre-render&#8221; for preparing it to rendering.
  
In order to use this RowView, A change is required in the TableView&#8217;s render method:

<pre class="brush:js">var TableView = Backbone.View.extend({

	render: function() {
		var rows = this.model.get("rows");
		_.each(rows, function(row){
			var rowView = new RowView({ model: row });
			this.$el.append( rowView.render().el );
		}, this);
	}

});</pre>

## What does that do?

  1. **&#8220;var rows..&#8221;** &#8211; Suppose the model of the TableView has a &#8220;rows&#8221; property which is an array of row object (json).
  2. **&#8220;_.each&#8230;&#8221;** &#8211; I&#8217;m using underscore iteration utility to loop through each of the rows. I&#8217;m also sending &#8220;this&#8221; as an argument so i&#8217;ll the function argument in this method will be called in the TableView&#8217;s context.
  3. **&#8220;var rowView&#8230;**&#8221; &#8211; i&#8217;m creating a new instance of a RowView passing it a model object which is passed as the &#8220;row&#8221; argument for this function.
  4. **&#8220;this.$el.append..&#8221;** &#8211; finally, the rowView&#8217;s DOM element is append after is has been rendered to memory. Within this line, the pattern of **&#8220;return this&#8221;** is getting useful &#8211; the rowView renders its model (it can more complex operations other than the example i put here), while afterwards, I ask for it&#8217;s output &#8211; &#8220;el&#8221; the DOM element.

## Why not&#8230;?

Maybe an eyebrow is raised with the question: why don&#8217;t you return &#8220;el&#8221; instead of &#8220;this&#8221;?
  
The answer is: you can, however &#8211; you won&#8217;t always want to append the el to an element at the point of calling the render method. Another possible answer is: the output might not be an &#8220;el&#8221; element, but rather a &#8220;canvas&#8221; element, a &#8220;file&#8221; object etc.

## Summary: The View&#8217;s &#8220;render&#8221; method Pattern

usecase: If you plan to iterate through a collection of identical models and render it.
  
pattern: for each view, construct the &#8220;render&#8221; method so it will return &#8220;this&#8221; at the end.