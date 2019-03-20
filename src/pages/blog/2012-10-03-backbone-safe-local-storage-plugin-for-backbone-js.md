---
id: 520
title: 'Backbone.Safe &#8211; Local Storage Plugin for Backbone.js'
date: 2012-10-03T21:44:26+00:00
author: Oren Farhi 
templateKey: blog-post
layout: post
guid: http://orizens.com/wp/?p=520
permalink: /topics/backbone-safe-local-storage-plugin-for-backbone-js/
shareaholic_disable_share_buttons:
  - "0"
shareaholic_disable_open_graph_tags:
  - "0"
dsq_thread_id:
  - "870222802"
image: ../../img/uploads/2012/10/IMG_20121003_222215_Dirt.jpg
categories:
  - backbone
  - html5
  - javascript
  - open source
  - plugin
  - plugin
tags:
  - bcakbone
  - javascript
  - open source
  - plugin
---
This is a short post/link for <a href="http://orizens.github.com/Backbone.Safe" title="Backbone.Safe" target="_blank">Backbone.Safe</a> &#8211; a new open source plugin for Backbone.js.
  
Backbone.Safe lets you save Backbone&#8217;s models and collection to the local storage with an ease.
  
Check out how to.<!--more-->


  
All you have to do is just using &#8216;set&#8217; for Models, and &#8216;add&#8217;/&#8217;reset&#8217; actions for Collections.
  
Backbone.Safe actually listens to &#8216;change&#8217; events, as well as &#8216;add&#8217; & &#8216;reset&#8217; events in Collections, and acts upon it.
  

  

  
A unique name has to be given to each model and a collection so storage won&#8217;t be override by each other. Moreover, Backbone.Safe knows to reload data from the cache with initialization &#8211; so it will actually populate the Model or the Collection.
  
Bcakbone.Safe is an open source project hosted on <a href="http://github.com" title="Github" target="_blank">Github</a> &#8211; so you can fork it, suggest new features and contribute your voice to its development process.