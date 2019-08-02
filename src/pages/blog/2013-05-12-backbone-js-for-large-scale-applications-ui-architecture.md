---
id: 566
title: 'Backbone.js for large scale applications - UI Architecture'
date: 2013-05-12T09:26:43+00:00
author: Oren Farhi 
templateKey: blog-post
layout: post
guid: http://orizens.com/wp/?p=566
permalink: /topics/backbone-js-for-large-scale-applications-ui-architecture/
dsq_thread_id:
  - "1282546357"
image: ../../img/uploads/2013/05/echotube1.jpg
categories:
  - backbone
  - patterns
tags:
  - architecture
  - backbone
  - javascript
  - open source
  - patterns
---
In my early days as a developer, even before Backbone.js was released, I was eager to learn about good conventions and best practices for organizing code and workflows.
  
I knew that somewhere, someone managed to recognize a good pattern that will scale in maintainable code, reusable pieces of code and a good & solid "framework" to place this code.
  
Overtime, I read few articles & watched several talks about software architecture that are relevant to front end development. In this post, I'm covering a journey I had (and still have) with some of the above as well as the overall front end architecture concept behind my latest project <a title="Echoes Media Center - Alternative UI & UX for youtube" href="http://echotu.be" target="_blank">Echoes Media Center</a> along with Backbone.js methodology.
  
<!--more-->

## How Do I Start with Backbone.js?

First, I like to stick to the concept of Justin Meyer, author JavaScriptMVC: "The secret to building large apps is never build large apps. Break your applications into small pieces. Then, assemble those testable, bite-sized pieces into your big application".
  
I've realized that Backbone.js implements a certain concept of the well known and used design pattern - MVC.
  
When I started working on <a title="Echoes Media Center - Alternative UI & UX for youtube" href="http://echotu.be" target="_blank">Echoes Media Center</a> I wanted to apply best practices in the architecture of this application - one that I can make use for any application. I wanted to find a good and solid application framework.
  
After reading several articles, I decided to brainstorm the concept of MVC and have a more thorough look into it - to see how I can use it wisely enough.
  
I took the very simple concept that Backbone.js applied to Models and Views.
  
This is a simple Backbone Model that represents of single youtube video:

<pre class="brush:js">var YoutubeItemModel = Backbone.Model.extend({
		defaults: {
			//- custom properties not related to json response
			likeCountDisplay: 0,
			time: 0,
			mediaType: 'video',
			isPlaying: false
		},

		initialize: function() {
			//- convert rating to 2 numbers after the decimal point
			var likeCount = this.get('likeCount') || 0,
				duration = this.get('duration');
			//- format the likeCount with comma each 3 numbers
			this.set("likeCountDisplay", _(likeCount).formatNumberWithComma());
			this.set('time', _(duration).secondsToHms());
		}
	});
</pre>

This is the Backbone View object that uses the above model:

<pre class="brush:js">var YoutubeItemView = Backbone.View.extend({
		tagName: 'li',
		
		className: 'youtube-item span3 nicer-ux ux-maker',
		
		template: _.template($("#youtube-item-template").html()),

		events: {
			'click .media-title': 'selectMedia',
			'click .media-desc': 'toggleInformation'
		},

		initialize: function() {
			this.listenTo(this.model, 'change:isPlaying', this.render);
		},

		render: function() {
			this.$el.html( this.template(this.model.toJSON()) );
			return this;
		},

		selectMedia: function(ev) {
			this.model.set('isPlaying', true);
		},

		toggleInformation: function() {
			this.$el.toggleClass('show-description');
		},

		destroy: function() {
			this.undelegateEvents();
			this.remove();
		}
	});
</pre>

This is the view's associated template:

<pre class="brush: html"></pre>


  

  
Combining these two results in a simple small MVC module based on Backbone.js. It is important to understand that the Backbone.View object is actually in the role of the "classic" controller of MVC, while the "template" that is referenced in this object plays the role of the "classic" view of MVC.
  
This concept appealed to me in the sense that whenever I update or change the model, the view will take care to reflect the changes in the UI.
  
To achieve this, i could simply use it like so:

<pre class="brush: js">var coolVideoModel = new YoutubeItemModel();
var coolVideoView = new YoutubeItemView({
	model: coolVideoModel
});
var video1data = {
	title: "the latest full show from the tour"
};
var video2data = {
	category: "Live",
	favoriteCount: 456
};
// the coolVideoView will rerender
// itself according to the changes of the model
coolVideoModel.set( video1data );
coolVideoModel.set( video2data );
</pre>

In that moment of understanding, I was really inspired and it became obvious to me that this very basic concept should play along with a larger module - or even a whole application.

## Minimalism and Backbone.js

Backbone.js and its minimalism approach of implementing MVC appealed to me. It seemed to be elegant, organized and to have everything in its place - including the soon to come approach for applying software architecture to a front end code.
  
I took the very simple concept that I applied to a single youtube item, and i understood that the same should be done for any module - let it be a user details card, a youtube playlist data and eventually - a music player application.
  
To my understanding and experience, I started planning the model of Echoes. I figured out that in the end, I would like to apply the same concept of that "coolVideo" code to a similar minimalstic approach:

<pre class="brush: js">var EchoesModel = new PlayerModel();
var EchoesView = new PlayerView({
	model: EchoesModel
});
// starting Echoes module to query the search api
EchoesModel.fetch();
</pre>

With this approach, I can be sure that whenever the model is updated, the changes will be applied to the UI - let it be new search results, playing a new video and asking to query my favorite videos.
  
From this point, it was quite obvious to take the "divide & conquer" approach for simplifying the big objects of "EchoesView" & "EchoesModel".

## The relevance of a Backbone.Router in Echoes

With the concept of having a clear separation of Echoes Model & View, I continued the "C" of MVC - the controller.
  
In one of my other posts, I explained <a href="http://orizens.com/wp/topics/backbone-router-the-important-role-of-a-controller/" title="Backbone Router – The important role of a Controller" target="_blank">the importance of a backbone router to function as an application controller</a> - and in Echoes case - a controller to Echoes api.
  
Soon, it appeared to me, in a minimalistic kind of a way, that it only makes sense to pass Echoes Model as a reference.

<pre class="brush:js">var EchoesModel = new PlayerModel();
var EchoesView = new PlayerView({
	model: EchoesModel
});
var EchoesRouter = new PlayerRouter({
	model: EchoesModel
})
Backbone.history.start();
</pre>

In this way, the application has One Model, and it can be access through the view (or its sub views) or through the router in the form of a url.
  
Also, with the router implemented in such a way, I can define several urls to be mapped to a certain view controller.

## Divide & Conquer - Full Architecture

Following the concept above, I decided to further simplify Echoes model to allow modular services and data that the player can supply to its views.
  
Eventually, the application model has been divided to several distinct nested models (and collections) , that, in order to allow some of the player's data model to be treated as modular data. Since the whole architecture model in Echoes attempts to stick with data driven architecture, each view may get the Echoes Model as a reference to work with. A top level view may choose to pass any sub model to its sub views to interact with. This assures that any changes to the model will be reflected in any other views that are bonded to a model's change events.
  
<figure id="attachment_575" class="thumbnail wp-caption aligncenter" style="width: 650px"><img src=".../../img/uploads/2013/05/Echoes-Backbone.js-Architecture-1.png" alt="Echoes Backbone.js Architecture Scheme" width="640" height="720" class="size-full wp-image-575" /><figcaption class="caption wp-caption-text">This drawing illustrates the general architecture concept built into Echoes</figcaption></figure>

## Final Thoughts

This architecture seems to be working great with Echoes and any other standard single page application. With this concept in mind, I achieved modular and maintainable code that can be reused for other applications as well.
  
I think that one of the most important rules to have in mind is to first think about the data (application model) and how to update it - meaning - be data driven in mind. Update the model - and the view will take care of rendering and reflecting it.
  
Overall, <a href="https://github.com/orizens/echoes" target="_blank">Echoes is an open source project</a>, and you can fork it, pull request or just read the code at github.
  
Your thoughts are welcome.