---
id: 351
title: OOP Javascript, Jquery, Binding events and keep the context
date: 2011-01-13T06:56:15+00:00
author: Oren Farhi 
templateKey: blog-post
layout: post
guid: http://orizens.com/wp/?p=351
permalink: /blog/oop-javascript-jquery-binding-events-and-keep-the-contex/
dsq_thread_id:
  - "754314708"
categories:
  - javascript
  - jquery
---
When developing in oop javascript style, I usually create classes which handle certain data, page behaviors and interaction. To achieve some of that, adding events to a class such as: click, keyup etc, is quite common.
  
There was one issue I struggled with while developing in oop javascript - keeping the context of the class when binding events to it.
  
<!--more-->


  



  
This is one way to create a class in javascript:

```typescript
function Grid(id) {
	this.id = id;
	this.init();
}
Grid.prototype = {
	init: function ()
	{
		//- some statements
		this.addEvents()
	},
	
	addEvents: function ()
	{
		$(this.id).bind('click', this.onClick);
	},
	
	onClick: function (ev)
	{
		this.handleCellClick()
	},

	handleCellClick: function ()
	{
		
	}	
}
```

Now, what's wrong with the code above?
  
The call of "this.handleCellClick" won't be executed - "this" isn't referred to the Grid class, but rather to clicked DOM object (may it be a td or a div). Jquery's bind doesn't keep the context/scope of the object.

## Keep the context

After digging into the bind method in [jquery api](http://api.jquery.com/bind/), I found a quite simple solution which i tend to use a lot.
  
The "bind" method can get 3 parameters: event name, data to pass with the callback function (as a json object) and a callback function. So, how so I use it to keep the context?
  
We can add the context of the class "this" to the data object, and refer to in the callback function:

```typescript
function Grid(id) {
	this.id = id;
	this.init();
}
Grid.prototype = {
	init: function ()
	{
		//- some statements
		this.addEvents()
	},
	
	addEvents: function ()
	{
		$(this.id).bind('click', {context: this}, this.onClick);
	},
	
	onClick: function (ev)
	{
		//- do something
		var self = ev.data.context;
		self.handleCellClick();
	},
	
	handleCellClick: function ()
	{
		//- some statements
	}
	
}

```

With this simple solution, you can keep the context of the class when handling jquery events, or sending any other context and refer to them as well.