---
id: 490
title: 'Backbone.View Patterns - How & Why Use Subviews'
date: 2012-09-10T07:58:30+00:00
author: Oren Farhi 
templateKey: blog-post
layout: post
guid: http://orizens.com/wp/?p=490
permalink: /topics/backbone-view-patterns-how-why-to-use-subviews/
shareaholic_disable_share_buttons:
  - "0"
shareaholic_disable_open_graph_tags:
  - "0"
dsq_thread_id:
  - "838044227"
image: ../../img/uploads/2012/09/IMG_20120910_110740_Anne_Dirt.jpg
categories:
  - backbone
  - javascript
  - patterns
tags:
  - backbone
  - javascript
---
Backbone.View is a very useful javascript class when it comes to rendering data and attach a behavior to DOM elements. Today, I cannot imagine front end javascript code without some kind of a view class.   
Often, I tend to keep my views as small as possible. Sometimes it is hard to determine what is a view and how to break big chunk of data to smaller views. In this post I want to point out some useful cases where it is beneficial to use &#8220;sub-views" and the benefits of such methodology.<!--more-->

<!--RndAds-->

## How to Identify the need for a sub view

In a <a title="Backbone.View Patterns – The Relationship with “Model”" href="http://orizens.com/wp/topics/backbone-view-patterns-the-relationship-with-model/" target="_blank">recent post</a>, I explained the relationship between Backbone's Model and View.   
When a model has an array of similar items, where each has some sort of interaction - it is a good practice to render each item as a sub - view. Using a separate view for each item gives the option to control the behavior attached to each - usually, on click I am able to get a reference to the correct model of that specific item rather than trying to get the id of the source element and start querying to DOM.   
In example, take this blog post's commenting list. If I were to define it using backbone, the Model would be:

```typescript
//- considering there's an object with comments data
var CommentsPanel = {
	postId: 44321,
	otherData: { /**/ }
	comments: [
		{ id: 1234, content: "some content", collapsed: true, name: "oren" }
		{ id: 4321, content: "some other", collapsed: true, name: "bill" }
	]
}

//- a comment model that can be created from above
var Comment = Backbone.Model.extend({
	defaults: {
		content: "",
		collapsed: true,
		thumb: 'url-to-user-thumb.png',
		name: 'user-name',
		date: 'date-published',
		liked: false
	}
});
```

Identifying that each comment is a separate module will result in a much cleaner, modular and error free code.

## Why using sub views is good?

  1. If a view of a comment has several events - attaching these events is self contained inside of every view: ```typescript
var CommentView = Backbone.View.extend({
	
	events: {
		'click .collapse': 'toggle',
		'click .reply': 'reply'
	},

	collapse: function() {
		//- 'this' is still the same context of this View
		this.trigger('comment-toggled', this.get('id'))
	}

});

```

  2. A comment might be a media comment - an audio or a video. In this case, if the comment model has an attribute of &#8216;type', it is easy for the comments panel view to create an appropriate view: ```typescript
var CommentsPanelView = Backbone.View.extend({
	
	render: function() {
		this.collection.each(function(comment){
			if (comment.get('type') == 'video') {
				this.$el.append( new CommentVideoView({ model: comment }) );
			} else {
				this.$el.append( new CommentView({ model: comment }) );
			}
		}, this);
	}

});

```

  3. This method of code organization promotes developing reusable and loosely coupled modules.

## How to manage sub views

Managing sub views with Backbone should take in consideration few issues.   
Sub view is eventually a javascript object - so, there's a need to avoid possible memory leaks.   
The main view which holds the sub views should dismiss the views when rendering new ones or whenever the main view is dismissed.   
One best practice is saving sub views in a property as such:

```typescript
var CommentsPanelView = Backbone.View.extend({
	
	initialize: function(){
		//- set views placeholder
		this.views = [];
	},

	render: function() {
		//- clean views before rendering new ones
		this.destroyViews();
		//- create new views
		this.views = this.collection.map(this.createView, this);
		this.$el.append( _.map(this.views, this.getDom, this) );
	},

	createView: function (model) {
		return new CommentView({ model: model });
	}, 

	getDom: function (view) {
		return view.render().el;
	}, 

	destroyViews: function() {
		//- call destroy method for each view
		_.invoke(this.views, 'destroy');
		this.views.length = 0;
	}
});

```

<!--RndAds-->

This is one way of managing sub views. It's important to note that each sub view can have its own sub views - so, the code above can be used as a somewhat boilerplate for views that have sub views - no matter the hierarchy level.

<!--RndAds-->