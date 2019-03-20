---
id: 456
title: 'Backbone.View Patterns &#8211; The Relationship with &#8220;Model&#8221;'
date: 2012-07-09T06:39:21+00:00
author: Oren Farhi 
templateKey: blog-post
layout: post
guid: http://orizens.com/wp/?p=456
permalink: /topics/backbone-view-patterns-the-relationship-with-model/
shareaholic_disable_share_buttons:
  - "0"
shareaholic_disable_open_graph_tags:
  - "0"
dsq_thread_id:
  - "757231591"
image: ../../img/uploads/2012/07/IMG_20120709_094753_Satya_Sparkly_Hassel_1.jpg
categories:
  - backbone
  - javascript
  - patterns
---
Backbone&#8217;s View class exists for displaying a certain data. On of its main purposes is to manifest data objects (JSON) to its DOM presentation. For that, tying a model to a view is one good relationship that should exists in any Backbone based application. Lets understand what are the benefits of this relationship might be.<!--more-->

## Tying Model to View

Tying a model to a view can be done in more than one way.

### External Reference

When creating a new instance for a view, a ready made backbone model can be passed in the arguments. With this way, you can pass any model to the view (this assumes the view is very generic in its implementation).

<pre class="brush:js">var myMoneyData = { /* json data object */ };
var userExpenses = new ExpensesView({ model: myMoneyData });</pre>

### Encapsulated Reference

I tried to think of a correct title for this method. In this method, we are passing a json object to the view, and the view is responsible for initializing the model. This can be appropriate for creating encapsulated modules that you usually hand on to other developers &#8211; while giving them a simple API for using your module.

<pre class="brush:js">var myMoneyData = { /* json data object */ };

var ExpensesView = Backbone.View.extend({
	initialize: function() {
		this.model = new MoneyAccount(this.options.model);
		//- tying the model's change event to the view's render method
		this.model.on("change", this.render, this);
	}
});

var userExpenses = new ExpensesView({ model: myMoneyData });</pre>

Notice that I have also made another &#8220;living&#8221; connection between the model and view. This is also a common use of tying a model to view.

## Model &#8220;Change&#8221; Event

Another key in the relationship of Model & View is tying the view to the model&#8217;s change event. what is a &#8220;change&#8221; event?
  
Whenever a model&#8217;s data is updated &#8211; let it be by a the &#8220;fetch&#8221; method or manually by some other code, the model&#8217;s fires a custom event &#8220;change&#8221; &#8211; much like a simple jquery custom event.
  
So, a common pattern for a view is to listen to a model&#8217;s change event and invoke the render method to reflect the changes in the DOM & the UI.
  
One doesn&#8217;t necessarily has to re-render the whole view. you can choose to re-render only parts of the view with other dedicated render methods &#8211; and for this listening to specific &#8220;change&#8221; events would also fit:

<pre class="brush:js">var ExpensesView = Backbone.View.extend({
	initialize: function() {
		this.model = new MoneyAccount(this.options.model);
		//- tying the model's change event to the view's render method
		this.model.on("change:permissions", this.renderExpenses, this);
		this.model.on("change:commisions", this.renderCommisions, this);
	}
});</pre>

## Model to Template

One of the simplest uses of models and views is populating a view&#8217;s template with the model&#8217;s data. The [&#8220;render&#8221;](http://orizens.com/wp/topics/backbone-view-patterns-the-render-method/ "Backbone.View Patterns – the “render” method") method compiles both template and model&#8217;s json data:

<pre class="brush:js">var SomeView = Backbone.View.extend({
	template: _.template("#some-template"),

	render: function() {
		$(this.el).html(this.template(this.model.toJSON()));
		return this;
	}
});</pre>

## The Moral of View & Model Story

There maybe other ways to implement the relationship of Backbone&#8217;s View & Model. I find the above ones an organized method followed by best practices of organizing code and application flow.
  
It&#8217;s important to realize that Backbone&#8217;s View class is a Unit of View rather than then the classic MVC View. It acts as a controller &#8211; hence the necessary bondage between the View & Model.
  
Remember &#8211; a Backbone&#8217;s View purpose is to present a certain data in the UI &#8211; and usually &#8211; reflect a Model&#8217;s data of part of it in the UI.