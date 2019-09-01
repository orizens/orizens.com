---
id: 456
title: 'Backbone.View Patterns - The Relationship with "Model"'
date: 2012-07-09T06:39:21+00:00
author: Oren Farhi 
templateKey: blog-post
layout: post
guid: http://orizens.com/wp/?p=456
permalink: /blog/backbone-view-patterns-the-relationship-with-model/
shareaholic_disable_share_buttons:
  - "0"
shareaholic_disable_open_graph_tags:
  - "0"
dsq_thread_id:
  - "757231591"
image: ../img/uploads/2012/07/IMG_20120709_094753_Satya_Sparkly_Hassel_1.jpg
categories:
  - backbone
  - javascript
  - patterns
---
Backbone's View class exists for displaying a certain data. On of its main purposes is to manifest data objects (JSON) to its DOM presentation. For that, tying a model to a view is one good relationship that should exists in any Backbone based application. Lets understand what are the benefits of this relationship might be.<!--more-->

## Tying Model to View

Tying a model to a view can be done in more than one way.

### External Reference

When creating a new instance for a view, a ready made backbone model can be passed in the arguments. With this way, you can pass any model to the view (this assumes the view is very generic in its implementation).

```typescript
var myMoneyData = { /* json data object */ };
var userExpenses = new ExpensesView({ model: myMoneyData });
```

### Encapsulated Reference

I tried to think of a correct title for this method. In this method, we are passing a json object to the view, and the view is responsible for initializing the model. This can be appropriate for creating encapsulated modules that you usually hand on to other developers - while giving them a simple API for using your module.

```typescript
var myMoneyData = { /* json data object */ };

var ExpensesView = Backbone.View.extend({
	initialize: function() {
		this.model = new MoneyAccount(this.options.model);
		//- tying the model's change event to the view's render method
		this.model.on("change", this.render, this);
	}
});

var userExpenses = new ExpensesView({ model: myMoneyData });
```

Notice that I have also made another "living" connection between the model and view. This is also a common use of tying a model to view.

## Model "Change" Event

Another key in the relationship of Model & View is tying the view to the model's change event. what is a "change" event?
  
Whenever a model's data is updated - let it be by a the "fetch" method or manually by some other code, the model's fires a custom event "change" - much like a simple jquery custom event.
  
So, a common pattern for a view is to listen to a model's change event and invoke the render method to reflect the changes in the DOM & the UI.
  
One doesn't necessarily has to re-render the whole view. you can choose to re-render only parts of the view with other dedicated render methods - and for this listening to specific "change" events would also fit:

```typescript
var ExpensesView = Backbone.View.extend({
	initialize: function() {
		this.model = new MoneyAccount(this.options.model);
		//- tying the model's change event to the view's render method
		this.model.on("change:permissions", this.renderExpenses, this);
		this.model.on("change:commisions", this.renderCommisions, this);
	}
});
```

## Model to Template

One of the simplest uses of models and views is populating a view's template with the model's data. The ["render"](http://orizens.com/wp/blog/backbone-view-patterns-the-render-method/ "Backbone.View Patterns – the “render” method") method compiles both template and model's json data:

```typescript
var SomeView = Backbone.View.extend({
	template: _.template("#some-template"),

	render: function() {
		$(this.el).html(this.template(this.model.toJSON()));
		return this;
	}
});
```

## The Moral of View & Model Story

There maybe other ways to implement the relationship of Backbone's View & Model. I find the above ones an organized method followed by best practices of organizing code and application flow.
  
It's important to realize that Backbone's View class is a Unit of View rather than then the classic MVC View. It acts as a controller - hence the necessary bondage between the View & Model.
  
Remember - a Backbone's View purpose is to present a certain data in the UI - and usually - reflect a Model's data of part of it in the UI.