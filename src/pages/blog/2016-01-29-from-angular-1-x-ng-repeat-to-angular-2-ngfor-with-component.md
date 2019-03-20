---
id: 930
title: From Angular 1.x ng-repeat to Angular (2+) NgFor with Component
date: 2016-01-29T11:13:44+00:00
author: Oren Farhi 
templateKey: blog-post
layout: post
guid: http://orizens.com/wp/?p=930
permalink: /topics/from-angular-1-x-ng-repeat-to-angular-2-ngfor-with-component/
dsq_thread_id:
  - "4533393955"
image: ../../img/uploads/2016/01/ng2for.jpg
categories:
  - Angular
  - es2015
  - javascript
  - learning
  - open source
  - typescript
tags:
  - angular.js
  - angular2
  - es2015
  - javascript
  - learning
  - typescript
---
In the recent article, I wrote about the <a href="http://orizens.com/wp/topics/migrating-a-component-to-angular-2-from-angular-1-x-es2015/" target="_blank">migration process of a component that is based on AngularJS.x and ES2015</a>. Since then, I continued migrating <a href="http://echotu.be" target="_blank">Echoes Player</a> to Angular (+2). In this post i&#8217;m sharing the migration process of the youtube-list component &#8211; which uses the youtube-media component, as well as implementing a smart component with Angular (+2).<!--more-->

## The Youtube-List Component

The goal for this process was to reuse the recent youtube-media component and create a youtube-list component. Echoes Player main feature is displaying a list of youtube videos like the following:

<img class="size-large wp-image-931 alignnone" src=".../../img/uploads/2016/01/Screen-Shot-2016-01-29-at-11.18.58-AM-1024x640.png" alt="Screen Shot 2016-01-29 at 11.18.58 AM" width="697" height="436" srcset=".../../img/uploads/2016/01/Screen-Shot-2016-01-29-at-11.18.58-AM-1024x640.png 1024w, .../../img/uploads/2016/01/Screen-Shot-2016-01-29-at-11.18.58-AM-300x188.png 300w, .../../img/uploads/2016/01/Screen-Shot-2016-01-29-at-11.18.58-AM-768x480.png 768w" sizes="(max-width: 697px) 100vw, 697px" />

The AngularJS.x ES2015 implementation of youtube-list is a <a href="https://github.com/orizens/angular-es2015-styleguide#srccorecomponents" target="_blank">core/component</a> element. It is relatively a minimal component which reuse the youtube-media component. The template uses &#8220;ng-repeat&#8221; to render a list of videos:

<pre class="lang:xhtml decode:true">&lt;ul&gt;
	&lt;youtube-media 
		ng-repeat="video in vm.videos track by $index"
		video="video"
		on-play="vm.playSelectedVideo(video)"
		on-queue="vm.queueSelectedVideo(video)"
		on-add="vm.add(video)"&gt;
	&lt;/youtube-media&gt;
&lt;/ul&gt;</pre>

This is the directive definition:

<pre class="lang:c# decode:true ">import template from './youtube-list.tpl.html';

// Usage:
//	&lt;youtube-list videos on-select="func(video)" on-queue="func(video)"&gt;&lt;/youtube-list&gt;
/* @ngInject */
export default function youtubeList() {
	var directive = {
		restrict: 'E',
		replace: true,
		template,
		scope: {
			videos: '=',
			onSelect: '&',
			onQueue: '&',
			onAdd: '&'
		},
		bindToController: true,
		controllerAs: 'vm',
		controller: class YoutubeList {
			constructor () {}

			playSelectedVideo (video){
				this.onSelect({ video });
			}

			queueSelectedVideo (video) {
				this.onQueue({ video });
			}

			add (video) {
				this.onAdd({ video });
			}
		}
	}
	return directive;
}</pre>

## The Angular (+2) YoutubeList Component

The result of this component in Angular (+2) is not so far from its AngularJS.x version. However, the migration process of this component involves few points to consider.

### Importing Relevant Dependencies

With Angular (+2), each dependancy must be defined. That includes:

  1. angular&#8217;s 2 built in directives: NgFor (instead of ng-repeat)
  2. the youtube-media component
  3. angular&#8217;s 2 annotations & docorators (@Component, @Input etc..)

Let&#8217;s import all of these:

<pre class="lang:default decode:true  ">import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgFor } from '@angular/common';
import { YoutubeMedia } from '../youtube-media/youtube-media';</pre>

Note: &#8220;<a href="https://angular.io/docs/ts/latest/api/common/NgFor-directive.html" target="_blank">NgFor</a>&#8221; is the new &#8220;ng-repeat&#8221; in Angular (+2). More on that below.

### Define The Component and its dependencies

This code defines how the youtube-list component will be used, its template, its input and which directives it consumes.

<pre class="lang:default decode:true ">@Component({
	selector: 'youtube-list',
	template: require('./youtube-list.html'),
	inputs: [
		'list'
	],
	directives: [NgFor, YoutubeMedia ]
})</pre>

Notice how &#8220;NgFor&#8221; is injected to this component&#8217;s directives array. If it&#8217;s not defined as such, Angular (+2) template engine won&#8217;t use it.

### The YoutubeList Controller Class

The controller class in Angular (+2) of this component, is quite similar to its AngularJS.x version. The noticeable addition is the definition of the events that this component exposes.

<pre class="lang:default decode:true ">export class YoutubeList {
	@Output() play = new EventEmitter();
	@Output() queue = new EventEmitter();
	@Output() add = new EventEmitter();

	constructor () {}

	playSelectedVideo (media) {
		this.play.next(media);
	}

	queueSelectedVideo (media) {
		this.queue.next(media);
	}

	addVideo (media) {
		this.add.next(media);
	}
}</pre>

### Youtubelist Component Template

This component&#8217;s template is quite simple. It repeats the youtube-media component following the &#8220;list&#8221; property.

<pre class="lang:default decode:true ">&lt;youtube-media
	*ngFor="#media of list"
	[media]="media"
	(play)="playSelectedVideo(media)"
	(queue)="queueSelectedVideo(media)"
	(add)="addVideo(media)"&gt;
&lt;/youtube-media&gt;</pre>

Lets overview the &#8220;**NgFor**&#8221; directive usage in this template.

First, you notice that i&#8217;m using the syntactic sugar form of **ngFor** using the &#8220;*****&#8220;. It makes it easier to read (and yes &#8211; it&#8217;s valid html attribute). <a href="https://angular.io/docs/ts/latest/guide/template-syntax.html#!#star-template" target="_blank">This &#8220;*&#8221; form</a> is almost similar to the AngularJS.x &#8220;**ng-repeat**&#8220;. The value of this attribute is actually almost similar for <a href="http://devdocs.io/javascript/statements/for...of" target="_blank">ES2015 &#8220;for of&#8221;</a> loop, however, with little **micro-syntax** inside.

The &#8220;**#**&#8221; sign, is used to defined local in-context variable that will be used throughout the iteration, which we can reference to in other places inside the template. In this template, the &#8220;**media**&#8221; variable is used to reference each time a different item in the list array.

The exposed events: &#8220;**play**&#8220;, &#8220;**queue**&#8221; and &#8220;**add**&#8220;, pass the relevant &#8220;**media**&#8221; variable that was eventually clicked inside the youtube-media component.

## Using the YoutubeList Component

Using this component should be simple. I designed it so I can use it like so:

<pre class="lang:default decode:true ">&lt;youtube-list [list]="videos" (play)="playSelectedVideo($event)"&gt;&lt;/youtube-list&gt;</pre>

Notice how the &#8220;**play**&#8221; event passes the &#8220;**$event**&#8221; argument &#8211; which will eventually be the selected media. This is a very important point to realise. In contrary to the &#8220;**ngFor**&#8220;, there&#8217;s is no reference in this context to a &#8220;**video**&#8221; property, but rather only to &#8220;**videos**&#8221; array. Referencing &#8220;**media**&#8221; here won&#8217;t work (as we&#8217;ve probably did in AngularJS.x).

In practice, I created a &#8220;**youtube-videos**&#8221; smart component &#8211; a component that is rendered without any attributes, and it is attached to a certain route (currently the index route). This component initiates an http request call to youtube&#8217;s api and upon response, saves the result in a &#8220;**videos**&#8221; property.

## Final Thoughts

You can follow the full code commits of <a href="https://github.com/orizens/echoes-ng2/issues/4" target="_blank">youtube-list commits in github</a>.

<a href="http://github.com/orizens/echoes-ng2" target="_blank">Echoes Player with ng2</a> is an open source project that you can follow, fork and overview at github.

If you&#8217;re still using AngularJS.x and looking to migrate in the future to Angular (+2), I encourage you to start writing <a href="https://github.com/orizens/angular-es2015-styleguide" target="_blank">AngularJS.x with ES2015 and following a style guide</a>. You can overview the <a href="https://github.com/orizens/echoes/tree/es2015" target="_blank">ES2015 branch of Echoes</a> (at production <a href="http://echotu.be" target="_blank">http://echotu.be</a>) to see it in action.