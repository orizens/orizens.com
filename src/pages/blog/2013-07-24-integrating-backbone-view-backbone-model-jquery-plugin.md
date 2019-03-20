---
id: 603
title: 'Integrating Backbone.View, Backbone.Model &#038; jQuery plugin'
date: 2013-07-24T06:41:24+00:00
author: Oren Farhi 
templateKey: blog-post
layout: post
guid: http://orizens.com/wp/?p=603
permalink: /topics/integrating-backbone-view-backbone-model-jquery-plugin/
dsq_thread_id:
  - "1525466120"
image: ../../img/uploads/2013/07/IMG_20130724_093318_Hagrid_Focal_Dirt.jpg
categories:
  - backbone
  - javascript
  - open source
  - patterns
  - plugin
  - requirejs
tags:
  - backbone
  - javascript
  - patterns
  - plugin
---
One of the most required features for [Echoes Player](http://echotu.be "Echoes Media Player - alternative ui for youtube") was auto complete for the search box. After reviewing few plugins, I decided to use [jqueryui auto complete plugin](http://jqueryui.com/autocomplete/ "jquery ui auto complete plugin"), as jquery-ui has been already integrated and loaded to echoes.
  
The challenge was integrating it seamlessly with Echoes Backbone.Model and the Backbone.View that manages the search view.
  
<!--more-->

<!--Ads1-->

## Import & Define

Since Echoes Player is based on <a title="Require.js Dependency Management" href="requirejs.org" target="_blank">require.js</a> for dependency management, jquery-ui should be defined in the config.js file. That is quite straight forward:

<pre class="brush:js">require.config({
	deps: ['js/main.js'],
	shim: {
		...
		'bootstrap': {
			deps: [ 'jquery', 'jqueryui' ],
			exports: 'jQuery'
		},

		'jqueryui': {
			deps: ['jquery'],
			exports: 'jQuery'
		}
		....
	},

	paths: {
		jquery: 'libs/jquery/jquery',
		jqueryui: 'libs/jquery/jquery-ui',
		...
	},
});</pre>

In the Echoes <a title="Backbone.js for large scale applications – UI Architecture" href="http://orizens.com/wp/topics/backbone-js-for-large-scale-applications-ui-architecture/" target="_blank">architecture</a> concept, the main.js is the starting point of the application, and it is asking to load &#8220;bootstrap&#8221; javascript file (aside to other plugins) which requires jquery-ui &#8211; so that is how jquery-ui is ready to be used right in the beginning of initialising the whole app:

<pre class="brush:js">require([
	'jquery',
	'bootstrap',
	'safe',
	'switcher',
	'views/player_app',
	'models/player_app',
	'routers/app_router'
], function( $, bootstrap, safe, switcher, PlayerApp, PlayerModel, AppRouter ) {
	var playerModel = new PlayerModel();
	var playerView = new PlayerApp({ model: playerModel });
	var playerRouter = new AppRouter({ model: playerModel });
});</pre>

<!--RndAds-->

## Putting the plugin into place

Since the auto complete feature belongs to the search box in [Echoes Player](http://echotu.be "Echoes Media Player - alternative ui for youtube"), it has been defined in the MediaSearch View &#8211; which is a first level view in Echoes architecture. It is defined once in the constructor of this view:

<pre class="brush:js">var MediaSearch = Backbone.View.extend({
		el: '#media-explorer',

		events: {
			'submit': 'querySearch'
		},

		initialize: function(){
			this.model.on('change:query', this.render, this);
			// cache input field
			this.$search = this.$el.find('input');
			this.render(this.model);
			this.activateAutoComplete();
		},
...
}</pre>

Google&#8217;s search service functions as the query provider for the searches, and after a little research in google, I found the appropriate url that returns json results for any query term.
  
The &#8220;activateAutoComplete&#8221; function first initiates the plugin with the standard jquery-ui auto complete:

<pre class="brush:js">activateAutoComplete: function() {
	this.$search.autocomplete({
		source: function( request, response ) {
			$.ajax({
				url: "http://suggestqueries.google.com/complete/search",
				dataType: "jsonp",
				data: {
					hl: "en",
					ds: "yt",
					oi: "spell",
					spell: "1",
					json: "t",
					client: "youtube",
					q: request.term
				},
				success: function( data ) {
					response( data[1] );
				}
			});
		},
		minLength: 2,
...</pre>

With the above configuration, the plugin suggests results as i wanted with the search view.
  
The next challenge I had was related to usability when using this auto complete feature. The expected behaviour when choosing a certain suggestion of the result (pressing enter on the result) results in 2 operations:

  * Updating the input box with the selected suggested term &#8211; This is handled by the plugin.
  * Notifying Echoes about the new query so it can fetch the appropriate results form youtube.

<!--RndAds-->

## Connecting the suggestion to the Backbone.Model

The auto complete plugin exposes a &#8220;select&#8221; function api. This function runs whenever a selection of the suggested results has been made. This function receives 2 arguments: event & ui.
  
The selected term can be retrieved from the &#8220;ui&#8221; argument by pointing to: &#8220;ui.item.value&#8221;.
  
To have easy access to Echoes Model, I binded the &#8220;select&#8221; function with the scope of the MediaSearch View &#8211; so i can access to &#8220;this.model&#8221; within this function &#8211; and update the model with the new query:

<pre class="brush:js">activateAutoComplete: function() {
	this.$search.autocomplete({
		source: function( request, response ) {
			...
		},
		minLength: 2,
		select: _.bind(function( event, ui ) {
			var term = ui.item ? ui.item.value : false;
			if (term) {
				this.model.set({ query: term });
			}
		}, this)
	});
}</pre>

There are few tweaks and code organisations that should be done in the future:

  * integrating the ajax call with a Backbone.Model or a Backbone.Collection to keep the separation of model and view.
  * converting the select function to a referenced named function defined on the view
  * Perhaps &#8211; having a more encapsulated integration with the MediaSearch View, so the plugin may be easily toggled, or for other plugins to be integrated in the same transparent way.

Overall, in this way, the autocomplete is integrated nicely into the MediaSearch view and can be easily toggled or replaced, if needed.
  
<a title="Echoes Media Player - open sourced on github" href="https://github.com/orizens/echoes" target="_blank">Echoes is an open source project</a>, and you can fork it, pull request or just read the code at github.
  
Your thoughts are welcome.