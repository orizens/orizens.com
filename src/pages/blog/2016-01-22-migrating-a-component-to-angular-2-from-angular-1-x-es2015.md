---
id: 920
title: 'Migrating A Component To Angular (2+): From Angular 1.x &#038; Es2015'
date: 2016-01-22T13:16:33+00:00
author: Oren Farhi 
templateKey: blog-post
layout: post
guid: http://orizens.com/wp/?p=920
permalink: /topics/migrating-a-component-to-angular-2-from-angular-1-x-es2015/
dsq_thread_id:
  - "4513538123"
image: ../../img/uploads/2016/01/ng1ng2migrate.jpg
categories:
  - Angular
  - AngularJS
  - es2015
  - learning
  - typescript
  - webpack
tags:
  - angular.js
  - angular2
  - es2015
  - learning
  - typescript
  - webpack
---
Following <a href="http://orizens.com/wp/categories/angular/" target="_blank">Echoes Player article series about angular & ES2015</a>, I decided to develop this project with angular2. I intend to write a series of articles about my experiments with angular2. In this post, i&#8217;m sharing first insights about starting with angular2 and converting the youtube-media component written with angular1 and ES2015 to angular2 and typescript.<!--more-->

## Angular (+2) environment setup

In order to start Echoes Player development with Angular (+2), I cloned AngularClass repository <a href="https://github.com/AngularClass/angular2-webpack-starter" target="_blank">angular2 webpack starter</a> boilerplate. The initial setup is pretty straight forward. I followed the quick start instructions and got a fully working environment that enables me to start playing with angular2.

<a href="http://echotu.be" target="_blank">Echoes Player</a> is an <a href="http://github.com/orizens/echoes" target="_blank">open source media player</a> for searching and playing videos from youtube (no ads).

### Customising the angular2 starter

In <a href="https://github.com/orizens/echoes/issues/84" target="_blank">Echoes Player angular1 ES2015</a> version, i&#8217;m using a slightly different directory structure (which I wrote about and present in the <a href="https://github.com/orizens/angular-es2015-styleguide" target="_blank">angualr1 ES2015 style guide</a>).

In order to align with the first version of Echoes and ease <a href="http://orizens.com/wp/topics/5-steps-to-prepare-your-angular-1-code-to-angular-2/" target="_blank">the migration process</a>, I added a new &#8220;core&#8221; directory, where I differentiate between core components and core services that the application will consume.

I also added a less loader to webpack-config in order to support loading less files. However, currently, the app loads the production style.css file of Echoes.

I also added a copy instruction to webpack-config to handle the fontAwesome fonts directory that i&#8217;m using to copy src/fonts into webpack dev server directory in development mode.

## Converting YoutubeMedia Component

I created a new directory in &#8220;**core/components/youtube-media**&#8220;. I&#8217;m using the convention of naming the directory name the same as the selector of the component. It makes it easier to spot and find it.

From this point, in this article, i&#8217;ll refer to Echoes angular1 with ES2015 as &#8220;**echoes1**&#8220;, while referring to the new angular2 conversion, &#8220;**echoes2**&#8220;.

### File Naming

In echoes1, i&#8217;m using these file naming for the youtube-media component:

  * index.js
  * youtube.media.less
  * youtube.media.tpl.html

Note: This is in contrary to other components, where I use the &#8220;kebab&#8221; notation / dash (meaning, I should change that in echoes1 as well).

In echoes2, I  updated the files:

  * youtube-media.**ts** (former: index.js)
  * youtube-media.less
  * youtueb-media.html

I find it easier to maintain and spot the youtube-media.ts file in my code editor, other than using just plain &#8220;index.js&#8221;. Also note, I&#8217;m using the &#8220;ts&#8221; extension now for &#8220;typescript&#8221; files rather than &#8220;js&#8221; for ES2015 javascript.

I decided to drop the &#8220;tpl&#8221; postfix, since in 99% of cases, the project uses &#8220;html&#8221; extension for templates.

### Defining Angular (+2) Component for YoutubeMedia

In echoes1, the index.js imports only the template file, where the other component definitions are objects and functions.

In echoes2, the story is different.

First, I import the necessary annotations and directives that the component will use:

<pre class="lang:js decode:true">import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass } from '@angular/common';</pre>

#### Component Definition

Second, I have to define the component&#8217;s properties.

In echoes1, a plain object is used:

<pre class="lang:default decode:true ">var directive = {
	selector: 'youtube-media',
	restrict: 'E',
	template,
	replace: true,
	scope: {
		onPlay: '&',
		onQueue: '&',
		onAdd: '&',
		video: '='
	},
	controller,
	controllerAs: '$ctrl',
	bindToController: true
};</pre>

I&#8217;m not actually using the &#8220;selector&#8221; property, but rather using it when defining the directive.

In echoes2, this definition is shorter:

<pre class="lang:default decode:true">@Component({
	selector: 'youtube-media',
	template: require('./youtube-media.html'),
	inputs: [
		'media'
	],
	outputs: [
	 	'play',
	 	'queue',
	 	'add'
	],
	directives: [ NgClass ]
})</pre>

Notice that the &#8220;**scope**&#8221; attributes have been divided to its proper definition properties: &#8216;**media**&#8216; is expected to be passed as a binding from outside. The events that this component expose are: &#8216;**play**&#8216;, &#8216;**queue**&#8216; and &#8216;**add**&#8216;.

#### Controller/Class Definition

In echoes1, the controller is as:

<pre class="lang:default decode:true">function controller () {
	var vm = this;
	vm.playVideo = playVideo;
	vm.queueVideo = queueVideo;
	vm.add = add;
	vm.showDesc = false;
	vm.toggle = toggle;
	vm.isPlaying = false;

	function playVideo (media){
		vm.onPlay({ media });
	}

	function queueVideo(media) {
		vm.onQueue({ media });
	}

	function add (video) {
		vm.onAdd({ media });
	}

	function toggle (showDesc) {
		vm.showDesc = !showDesc;
	}
}</pre>

In echoes2, the controller is a class and it&#8217;s exported. The default properties are defined and initiated in the class definition.

The &#8220;**video**&#8221; property with the &#8220;**@Input()**&#8221; annotation is optionally defined here (just to make a point). This definition can be either instead of the &#8220;**inputs**&#8221; array in the component definition. However, defining it here with the correct type, will aid if the code editor is content aware and supports Typescript parsing. The same goes for the events that are defined with &#8220;EventEmitter&#8221;.

In angular2, access to the external bind property &#8220;media&#8221;, can be accessed in &#8220;**ngOnInit**&#8221; **hook method** (ng2 terminology) rather than in the constructor. The 2 string properties, likeCount and viewCount are converted to numbers, so it can be formatted later in the template using Angular (+2) pipes (the equivalent to AngularJS filters).

<pre class="lang:default decode:true">export class YoutubeMedia {
	@Input() media: any;
	@Output() play = new EventEmitter();
	@Output() queue = new EventEmitter();
	@Output() add = new EventEmitter();

	showDesc = false;
	isPlaying = false;

	constructor () {

	}

	ngOnInit(){
		this.media.statistics.likeCount = parseInt(this.media.statistics.likeCount);
		this.media.statistics.viewCount = parseInt(this.media.statistics.viewCount);
	}

        playVideo (media) {
    	        this.play.next(media);
	}

	queueVideo(media) {
		this.queue.next(media);
	}

	add (media) {
		this.add.next(media);
	}

	toggle (showDesc) {
		this.showDesc = !showDesc;
	}
}</pre>

#### Template Conversion

In echoes1, the template is (I dropped the social share feature for now):

<pre class="lang:default decode:true ">&lt;li class="youtube-item card ux-maker col-sm-3 col-xs-12"
ng-class="{ 'show-description': $ctrl.showDesc}"&gt;
	&lt;section class="media-title"&gt;
		
		&lt;div class="front face"&gt;
			&lt;div class="indicators clearfix"&gt;
				
				&lt;span class="pull-left item-is-playing playing-{{:: $ctrl.isPlaying }}"&gt;
					&lt;i class="fa fa-play"&gt;&lt;/i&gt;Now Playing
				&lt;/span&gt;
				
			&lt;/div&gt;
			
			&lt;section class="dropdown share"&gt;	
				&lt;a class="dropdown-toggle" data-toggle="dropdown" href=""&gt;
					&lt;span class="fa fa-share-alt"&gt;&lt;/span&gt;
				&lt;/a&gt;
				&lt;ul class="dropdown-menu dropdown-menu-fade"&gt;
					&lt;li&gt;
						&lt;a class=""
							socialshare
							socialshare-provider="google+"
							socialshare-hashtags="echotube, youtube video, nowlistening"
							socialshare-url="http://echotu.be/#/video/{{:: $ctrl.video.id }}"&gt;
							&lt;span class="fa fa-google-plus-square"&gt;&lt;/span&gt; Google+
						&lt;/a&gt;
					&lt;/li&gt;
					&lt;li&gt;
						&lt;a class=""
							socialshare
							socialshare-provider="twitter"
							socialshare-url="http://echotu.be/#/video/{{:: $ctrl.video.id }}"&gt;
							&lt;span class="fa fa-twitter-square"&gt;&lt;/span&gt; Twitter
						&lt;/a&gt;
					&lt;/li&gt;
					&lt;li&gt;
						&lt;a class=""
							socialshare
							socialshare-provider="facebook"
							socialshare-url="http://echotu.be/#/video/{{:: $ctrl.video.id }}"&gt;
							&lt;span class="fa fa-facebook-square"&gt;&lt;/span&gt; Facebook
						&lt;/a&gt;
					&lt;/li&gt;
				&lt;/ul&gt;
			&lt;/section&gt;

			&lt;div rel="tooltip" class="media-thumb"
				uib-tooltip="{{:: $ctrl.video.snippet.title }}" tooltip-placement="bottom"
				ng-click="$ctrl.playVideo($ctrl.video)"&gt;
				
				&lt;div class="thumbnail"&gt;
					&lt;img ng-src="{{:: $ctrl.video.snippet.thumbnails.high.url}}"&gt;
				&lt;/div&gt;
				
				&lt;button class="btn btn-default btn-lg ux-maker play-media"&gt;
					&lt;i class="fa fa-play"&gt;&lt;/i&gt;
				&lt;/button&gt;
			&lt;/div&gt;

			&lt;section class="item-actions main-actions"&gt;
				
				&lt;h4 class="title span11"&gt;
					&lt;a href='#/video/{{:: $ctrl.video.id}}' rel="tooltip" class="media-thumb ellipsis"
						uib-tooltip="{{:: $ctrl.video.snippet.title}}" tooltip-placement="bottom"&gt;
						{{:: $ctrl.video.snippet.title}}
					&lt;/a&gt;
				&lt;/h4&gt;

				&lt;section class="media-actions clearfix"&gt;
					&lt;button class="btn btn-link btn-xs add-to-playlist" title="Queue this video to now playlist"
						ng-click="$ctrl.queueVideo($ctrl.video)"&gt;
						&lt;i class="fa fa-share"&gt;&lt;/i&gt; Queue
					&lt;/button&gt;
					&lt;button class="btn btn-link btn-xs add-to-playlist" title="Add this video to a playlist"
						ng-click="$ctrl.add($ctrl.video)"&gt;
						&lt;i class="fa fa-plus"&gt;&lt;/i&gt; Add
					&lt;/button&gt;
				&lt;/section&gt;

				&lt;span
					ng-click="$ctrl.toggle($ctrl.showDesc)"
					class="btn btn-default btn-xs media-desc " title="more info about this video"&gt;
					&lt;i class="fa fa-info-circle"&gt;&lt;/i&gt;
				&lt;/span&gt;

				&lt;span class="item-action"&gt;&lt;i class="fa fa-clock-o"&gt;&lt;/i&gt;{{:: $ctrl.video.time}}&lt;/span&gt;

				&lt;span class="item-likes item-action" rel="tooltip" title="Number of Likes"&gt;
					&lt;i class="fa fa-thumbs-up"&gt;&lt;/i&gt; {{:: $ctrl.video.statistics.likeCount | number}}
				&lt;/span&gt;

				&lt;span class="item-views item-action" rel="tooltip" title="Number of Views"&gt;
					&lt;i class="fa fa-eye"&gt;&lt;/i&gt; {{:: $ctrl.video.statistics.viewCount | number}}
				&lt;/span&gt;

			&lt;/section&gt;
		&lt;/div&gt;

		&lt;div class="description back face"&gt;
			&lt;h4&gt;&lt;a href='#/video/{{:: $ctrl.video.id}}' rel="tooltip" title="{{:: $ctrl.video.snippet.title}}" class="media-thumb"&gt;{{:: $ctrl.video.snippet.title}}&lt;/a&gt;&lt;/h4&gt;
			&lt;div ng-bind-html="::$ctrl.video.snippet.description | linky"&gt;&lt;/div&gt;
		&lt;/div&gt;

		&lt;section class="item-actions close-desc"&gt;
			&lt;span
				ng-click="$ctrl.toggle($ctrl.showDesc)"
				class="btn btn-default btn-xs media-desc " title="flip back..."&gt;
					&lt;i class="fa fa-times-circle"&gt;&lt;/i&gt;
				&lt;/span&gt;
		&lt;/section&gt;

	&lt;/section&gt;

&lt;/li&gt;</pre>

&nbsp;

This is the template for echoes2:

<pre class="lang:default decode:true">&lt;li class="youtube-item card ux-maker col-sm-3 col-xs-12"
	[class.show-description]="showDesc"&gt;
	&lt;section class="media-title"&gt;

		&lt;div class="front face"&gt;
			&lt;div class="indicators clearfix"&gt;

				&lt;span class="pull-left item-is-playing"&gt;
					&lt;i class="fa fa-play"&gt;&lt;/i&gt;Now Playing
				&lt;/span&gt;

			&lt;/div&gt;

			&lt;div rel="tooltip" class="media-thumb"
				title="{{ media.snippet.title }}"
				(click)="playVideo(media)"&gt;

				&lt;div class="thumbnail"&gt;
					&lt;img src="{{media.snippet.thumbnails.high.url}}"&gt;
				&lt;/div&gt;

				&lt;button class="btn btn-default btn-lg ux-maker play-media"&gt;
					&lt;i class="fa fa-play"&gt;&lt;/i&gt;
				&lt;/button&gt;
			&lt;/div&gt;

			&lt;section class="item-actions main-actions"&gt;

				&lt;h4 class="title span11"&gt;
					&lt;a href='#/video/{{ media.id }}' rel="tooltip" class="media-thumb ellipsis"
						title="{{ media.snippet.title }}"&gt;
						{{ media.snippet.title }}
					&lt;/a&gt;
				&lt;/h4&gt;

				&lt;section class="media-actions clearfix"&gt;
					&lt;button class="btn btn-link btn-xs add-to-playlist" title="Queue this video to now playlist"
						(click)="queueVideo(media)"&gt;
						&lt;i class="fa fa-share"&gt;&lt;/i&gt; Queue
					&lt;/button&gt;
					&lt;button class="btn btn-link btn-xs add-to-playlist" title="Add this video to a playlist"
						(click)="addVideo(media)"&gt;
						&lt;i class="fa fa-plus"&gt;&lt;/i&gt; Add
					&lt;/button&gt;
				&lt;/section&gt;

				&lt;span
					(click)="toggle(showDesc)"
					class="btn btn-default btn-xs media-desc " title="more info about this video"&gt;
					&lt;i class="fa fa-info-circle"&gt;&lt;/i&gt;
				&lt;/span&gt;

				&lt;span class="item-action"&gt;&lt;i class="fa fa-clock-o"&gt;&lt;/i&gt;{{ media.time}}&lt;/span&gt;

				&lt;span class="item-likes item-action" rel="tooltip" title="Number of Likes"&gt;
					&lt;i class="fa fa-thumbs-up"&gt;&lt;/i&gt; {{ media.statistics.likeCount | number:'2.0'}}
				&lt;/span&gt;

				&lt;span class="item-views item-action" rel="tooltip" title="Number of Views"&gt;
					&lt;i class="fa fa-eye"&gt;&lt;/i&gt; {{ media.statistics.viewCount | number:'2.0'}}
				&lt;/span&gt;

			&lt;/section&gt;
		&lt;/div&gt;

		&lt;div class="description back face"&gt;
			&lt;h4&gt;&lt;a href='#/video/{{ media.id}}' rel="tooltip" title="{{ media.snippet.title }}" class="media-thumb"&gt;{{ media.snippet.title}}&lt;/a&gt;&lt;/h4&gt;
			&lt;div&gt;{{ media.snippet.description }}&lt;/div&gt;
		&lt;/div&gt;

		&lt;section class="item-actions close-desc"&gt;
			&lt;span
				(click)="toggle(showDesc)"
				class="btn btn-default btn-xs media-desc " title="flip back..."&gt;
					&lt;i class="fa fa-times-circle"&gt;&lt;/i&gt;
				&lt;/span&gt;
		&lt;/section&gt;

	&lt;/section&gt;

&lt;/li&gt;</pre>

There few noticeable changes that needs to be made:

Change the one-time binding prefixed with **&#8220;::&#8221;** to be without it.

Handling the &#8220;**controllerAs: &#8216;$ctrl&#8217;**&#8221; &#8211; either remove it or creating an alias on the ng2 class &#8211; this can be easily made with a simple

<pre class="lang:default decode:true ">export class YoutubeMedia {
	...
	$ctrl: any;

	constructor () {
		this.$ctrl = this;
	}
	....
}</pre>

but, I decided to drop it.

Handling events with the new brackets syntax &#8211; &#8220;**ng-click**&#8221; is converted to &#8220;**(click)**&#8220;.

For ng-class, since I imported the NgClass directive in the component, there are 2 ways to it:

  1. Class binding &#8211; [class.the-name-of-class]=&#8221;expression-should-return-boolean&#8221;
  2. Using NgClass directive &#8211; [ngClass]=&#8221;{ the-name-of-class: boolean-experssion }&#8221;.

By <a href="https://angular.io/docs/ts/latest/guide/template-syntax.html#!#ngClass" target="_blank">Angular (+2) ngClass docs</a>, for 1 class binding, the 1st method  (class binding) is preferred.

The last change is formatting numbers with filters in Angular (+2). There&#8217;s a new syntax for filters in Angular (+2). Filters are now Pipes. The &#8220;**Number**&#8221; pipe (ng1 filter: number) should be used with the &#8220;**DecimalPipe**&#8220;,  in order to format a number with commas. it should be defined as:

<pre class="lang:default decode:true ">{{ media.statistics.viewCount | number:'2.0-0'}}</pre>

The format must be defined with the appropriate digits &#8211; I followed the exact <a href="https://angular.io/docs/ts/latest/api/common/DecimalPipe-class.html" target="_blank">instructions in angular2 docs</a> to understand and define each digit.

### Using youtube-media Angular (+2) component

In **echoes1**, the youtube-media component is used as:

<pre class="lang:default decode:true">&lt;youtube-media 
	video="video"
	on-play="vm.playSelectedVideo(video)"
&gt;&lt;/youtube-media&gt;</pre>

In **echoes2**, we can use the new component in echoes2 as such:

<pre class="lang:default decode:true">&lt;youtube-media 
    [media]="videoMock"
    (play)="playSelectedVideo(videoMock)"
&gt;&lt;/youtube-media&gt;</pre>

## Final Thoughts

My overall experience is quite good. This &#8220;small&#8221; migration process went well enough &#8211; and still &#8211; a lot of work and exploration is left to complete the full Echoes app.

You can overview <a href="http://github.com/orizens/echoes-ng2" target="_blank">the complete code on github</a> &#8211; you can watch <a href="http://github.com/orizens/echoes-ng2/issues" target="_blank">the issues for any progress</a> on a specific component, service or other. As I stated in the beginning of this article, I intend to write a series of articles about the migration process of Echoes Player from AngularJS to Angular (+2).

I like how the component&#8217;s code is very concise in its meaning, quite readable and comes with error notification support (I use <a href="http://www.sublimetext.com/" target="_blank">sublimetext</a> with the <a href="https://packagecontrol.io/packages/TypeScript" target="_blank">typescript package</a>). Also, the new template syntax is great and promotes readability.