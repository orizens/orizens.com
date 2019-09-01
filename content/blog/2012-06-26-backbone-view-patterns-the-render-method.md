---
id: 429
title: 'Backbone.View Patterns - the "render" method'
date: 2012-06-26T15:08:45+00:00
author: Oren Farhi 
templateKey: blog-post
layout: post
guid: http://orizens.com/wp/?p=429
permalink: /blog/backbone-view-patterns-the-render-method/
shareaholic_disable_share_buttons:
  - "0"
shareaholic_disable_open_graph_tags:
  - "0"
dsq_thread_id:
  - "751757004"
image: ../img/uploads/2012/06/IMG_20120626_181252_Tony_Kryptonite.jpg
categories:
  - backbone
  - javascript
  - patterns
tags:
  - backbone
  - javascript
---
Since I started working with Backbone, I discovered an amazing piece of javascript toolbox which allows me to shape my code base and organize it.
  
Backbone's "View" class is usually a manifestation of some Model's data - or just a really implementation of creating DOM elements with custom behavior.
  
I've found that I use a certain pattern in some of the views in order make it reusable in other "parent" views.
  
<!--more-->


  
One of the simplest uses of that kind of view is:
  
The render method of the a simple TableView which doesn't use a RowView for each row can be something like:

```typescript
var TableView = Backbone.View.extend({

	render: function() {
		this.$el.html(this.model.toJSON());
	}

});
```

## An Enhanced Table View

Suppose there's a decision to construct the rows by a RowView in order to enhance the table's behavior.
  
This RowView should be something like:

```typescript
var RowView = Backbone.View.extend({
	events: { /* some level of behavior */ }
	render: function() {
		this.$el.html(this.model.toJSON());
		return this;
	}

});
```

Notice how that I added a "return this" at the end of the render method. This is a common pattern when using a backbone view: This gives us the ability to reuse the view as a sub view and also use "pre-render" for preparing it to rendering.
  
In order to use this RowView, A change is required in the TableView's render method:

```typescript
var TableView = Backbone.View.extend({

	render: function() {
		var rows = this.model.get("rows");
		_.each(rows, function(row){
			var rowView = new RowView({ model: row });
			this.$el.append( rowView.render().el );
		}, this);
	}

});
```

## What does that do?

  1. **"var rows.."** - Suppose the model of the TableView has a "rows" property which is an array of row object (json).
  2. **"_.each&#8230;"** - I'm using underscore iteration utility to loop through each of the rows. I'm also sending "this" as an argument so i'll the function argument in this method will be called in the TableView's context.
  3. **"var rowView&#8230;**" - i'm creating a new instance of a RowView passing it a model object which is passed as the "row" argument for this function.
  4. **"this.$el.append.."** - finally, the rowView's DOM element is append after is has been rendered to memory. Within this line, the pattern of **"return this"** is getting useful - the rowView renders its model (it can more complex operations other than the example i put here), while afterwards, I ask for it's output - "el" the DOM element.

## Why not&#8230;?

Maybe an eyebrow is raised with the question: why don't you return "el" instead of "this"?
  
The answer is: you can, however - you won't always want to append the el to an element at the point of calling the render method. Another possible answer is: the output might not be an "el" element, but rather a "canvas" element, a "file" object etc.

## Summary: The View's "render" method Pattern

usecase: If you plan to iterate through a collection of identical models and render it.
  
pattern: for each view, construct the "render" method so it will return "this" at the end.