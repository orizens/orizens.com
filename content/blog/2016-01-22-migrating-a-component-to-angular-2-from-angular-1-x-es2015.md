---
id: 920
title: 'Migrating A Component To Angular (2+): From Angular 1.x & Es2015'
date: 2016-01-22T13:16:33+00:00
author: Oren Farhi 
templateKey: blog-post
layout: post
guid: http://orizens.com/wp/?p=920
permalink: /blog/migrating-a-component-to-angular-2-from-angular-1-x-es2015/
dsq_thread_id:
  - "4513538123"
image: ../img/uploads/2016/01/ng1ng2migrate.jpg
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
Following <a href="http://orizens.com/wp/categories/angular/" target="_blank">Echoes Player article series about angular & ES2015</a>, I decided to develop this project with angular2. I intend to write a series of articles about my experiments with angular2. In this post, i'm sharing first insights about starting with angular2 and converting the youtube-media component written with angular1 and ES2015 to angular2 and typescript.<!--more-->

## Angular (+2) environment setup

In order to start Echoes Player development with Angular (+2), I cloned AngularClass repository <a href="https://github.com/AngularClass/angular2-webpack-starter" target="_blank">angular2 webpack starter</a> boilerplate. The initial setup is pretty straight forward. I followed the quick start instructions and got a fully working environment that enables me to start playing with angular2.

<a href="http://echotu.be" target="_blank">Echoes Player</a> is an <a href="http://github.com/orizens/echoes" target="_blank">open source media player</a> for searching and playing videos from youtube (no ads).

### Customising the angular2 starter

In <a href="https://github.com/orizens/echoes/issues/84" target="_blank">Echoes Player angular1 ES2015</a> version, i'm using a slightly different directory structure (which I wrote about and present in the <a href="https://github.com/orizens/angular-es2015-styleguide" target="_blank">angualr1 ES2015 style guide</a>).

In order to align with the first version of Echoes and ease <a href="http://orizens.com/wp/blog/5-steps-to-prepare-your-angular-1-code-to-angular-2/" target="_blank">the migration process</a>, I added a new "core" directory, where I differentiate between core components and core services that the application will consume.

I also added a less loader to webpack-config in order to support loading less files. However, currently, the app loads the production style.css file of Echoes.

I also added a copy instruction to webpack-config to handle the fontAwesome fonts directory that i'm using to copy src/fonts into webpack dev server directory in development mode.

## Converting YoutubeMedia Component

I created a new directory in "**core/components/youtube-media**". I'm using the convention of naming the directory name the same as the selector of the component. It makes it easier to spot and find it.

From this point, in this article, i'll refer to Echoes angular1 with ES2015 as "**echoes1**", while referring to the new angular2 conversion, "**echoes2**".

### File Naming

In echoes1, i'm using these file naming for the youtube-media component:

  * index.js
  * youtube.media.less
  * youtube.media.tpl.html

Note: This is in contrary to other components, where I use the "kebab" notation / dash (meaning, I should change that in echoes1 as well).

In echoes2, I  updated the files:

  * youtube-media.**ts** (former: index.js)
  * youtube-media.less
  * youtueb-media.html

I find it easier to maintain and spot the youtube-media.ts file in my code editor, other than using just plain "index.js". Also note, I'm using the "ts" extension now for "typescript" files rather than "js" for ES2015 javascript.

I decided to drop the "tpl" postfix, since in 99% of cases, the project uses "html" extension for templates.

### Defining Angular (+2) Component for YoutubeMedia

In echoes1, the index.js imports only the template file, where the other component definitions are objects and functions.

In echoes2, the story is different.

First, I import the necessary annotations and directives that the component will use:

```typescript
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass } from '@angular/common';
```

#### Component Definition

Second, I have to define the component's properties.

In echoes1, a plain object is used:

```typescript
var directive = {
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
};
```

I'm not actually using the "selector" property, but rather using it when defining the directive.

In echoes2, this definition is shorter:

```typescript
@Component({
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
})
```

Notice that the "**scope**" attributes have been divided to its proper definition properties: &#8216;**media**&#8216; is expected to be passed as a binding from outside. The events that this component expose are: &#8216;**play**&#8216;, &#8216;**queue**&#8216; and &#8216;**add**&#8216;.

#### Controller/Class Definition

In echoes1, the controller is as:

```typescript
function controller () {
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
}
```

In echoes2, the controller is a class and it's exported. The default properties are defined and initiated in the class definition.

The "**video**" property with the "**@Input()**" annotation is optionally defined here (just to make a point). This definition can be either instead of the "**inputs**" array in the component definition. However, defining it here with the correct type, will aid if the code editor is content aware and supports Typescript parsing. The same goes for the events that are defined with "EventEmitter".

In angular2, access to the external bind property "media", can be accessed in "**ngOnInit**" **hook method** (ng2 terminology) rather than in the constructor. The 2 string properties, likeCount and viewCount are converted to numbers, so it can be formatted later in the template using Angular (+2) pipes (the equivalent to AngularJS filters).

```typescript
export class YoutubeMedia {
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
}
```

#### Template Conversion

In echoes1, the template is (I dropped the social share feature for now):

```typescript
<li class="youtube-item card ux-maker col-sm-3 col-xs-12"
ng-class="{ 'show-description': $ctrl.showDesc}">
	<section class="media-title">
		
		<div class="front face">
			<div class="indicators clearfix">
				
				<span class="pull-left item-is-playing playing-{{:: $ctrl.isPlaying }}">
					<i class="las la-play"></i>Now Playing
				</span>
				
			</div>
			
			<section class="dropdown share">	
				<a class="dropdown-toggle" data-toggle="dropdown" href="">
					<span class="las la-share-alt"></span>
				</a>
				<ul class="dropdown-menu dropdown-menu-fade">
					<li>
						<a class=""
							socialshare
							socialshare-provider="google+"
							socialshare-hashtags="echotube, youtube video, nowlistening"
							socialshare-url="http://echotu.be/#/video/{{:: $ctrl.video.id }}">
							<span class="las la-google-plus-square"></span> Google+
						</a>
					</li>
					<li>
						<a class=""
							socialshare
							socialshare-provider="twitter"
							socialshare-url="http://echotu.be/#/video/{{:: $ctrl.video.id }}">
							<span class="las la-twitter-square"></span> Twitter
						</a>
					</li>
					<li>
						<a class=""
							socialshare
							socialshare-provider="facebook"
							socialshare-url="http://echotu.be/#/video/{{:: $ctrl.video.id }}">
							<span class="las la-facebook-square"></span> Facebook
						</a>
					</li>
				</ul>
			</section>

			<div rel="tooltip" class="media-thumb"
				uib-tooltip="{{:: $ctrl.video.snippet.title }}" tooltip-placement="bottom"
				ng-click="$ctrl.playVideo($ctrl.video)">
				
				<div class="thumbnail">
					<img ng-src="{{:: $ctrl.video.snippet.thumbnails.high.url}}">
				</div>
				
				<button class="btn btn-default btn-lg ux-maker play-media">
					<i class="las la-play"></i>
				</button>
			</div>

			<section class="item-actions main-actions">
				
				<h4 class="title span11">
					<a href='#/video/{{:: $ctrl.video.id}}' rel="tooltip" class="media-thumb ellipsis"
						uib-tooltip="{{:: $ctrl.video.snippet.title}}" tooltip-placement="bottom">
						{{:: $ctrl.video.snippet.title}}
					</a>
				</h4>

				<section class="media-actions clearfix">
					<button class="btn btn-link btn-xs add-to-playlist" title="Queue this video to now playlist"
						ng-click="$ctrl.queueVideo($ctrl.video)">
						<i class="las la-share"></i> Queue
					</button>
					<button class="btn btn-link btn-xs add-to-playlist" title="Add this video to a playlist"
						ng-click="$ctrl.add($ctrl.video)">
						<i class="las la-plus"></i> Add
					</button>
				</section>

				<span
					ng-click="$ctrl.toggle($ctrl.showDesc)"
					class="btn btn-default btn-xs media-desc " title="more info about this video">
					<i class="las la-info-circle"></i>
				</span>

				<span class="item-action"><i class="las la-clock-o"></i>{{:: $ctrl.video.time}}</span>

				<span class="item-likes item-action" rel="tooltip" title="Number of Likes">
					<i class="las la-thumbs-up"></i> {{:: $ctrl.video.statistics.likeCount | number}}
				</span>

				<span class="item-views item-action" rel="tooltip" title="Number of Views">
					<i class="las la-eye"></i> {{:: $ctrl.video.statistics.viewCount | number}}
				</span>

			</section>
		</div>

		<div class="description back face">
			<h4><a href='#/video/{{:: $ctrl.video.id}}' rel="tooltip" title="{{:: $ctrl.video.snippet.title}}" class="media-thumb">{{:: $ctrl.video.snippet.title}}</a></h4>
			<div ng-bind-html="::$ctrl.video.snippet.description | linky"></div>
		</div>

		<section class="item-actions close-desc">
			<span
				ng-click="$ctrl.toggle($ctrl.showDesc)"
				class="btn btn-default btn-xs media-desc " title="flip back...">
					<i class="las la-times-circle"></i>
				</span>
		</section>

	</section>

</li>
```

&nbsp;

This is the template for echoes2:

```typescript
<li class="youtube-item card ux-maker col-sm-3 col-xs-12"
	[class.show-description]="showDesc">
	<section class="media-title">

		<div class="front face">
			<div class="indicators clearfix">

				<span class="pull-left item-is-playing">
					<i class="las la-play"></i>Now Playing
				</span>

			</div>

			<div rel="tooltip" class="media-thumb"
				title="{{ media.snippet.title }}"
				(click)="playVideo(media)">

				<div class="thumbnail">
					<img src="{{media.snippet.thumbnails.high.url}}">
				</div>

				<button class="btn btn-default btn-lg ux-maker play-media">
					<i class="las la-play"></i>
				</button>
			</div>

			<section class="item-actions main-actions">

				<h4 class="title span11">
					<a href='#/video/{{ media.id }}' rel="tooltip" class="media-thumb ellipsis"
						title="{{ media.snippet.title }}">
						{{ media.snippet.title }}
					</a>
				</h4>

				<section class="media-actions clearfix">
					<button class="btn btn-link btn-xs add-to-playlist" title="Queue this video to now playlist"
						(click)="queueVideo(media)">
						<i class="las la-share"></i> Queue
					</button>
					<button class="btn btn-link btn-xs add-to-playlist" title="Add this video to a playlist"
						(click)="addVideo(media)">
						<i class="las la-plus"></i> Add
					</button>
				</section>

				<span
					(click)="toggle(showDesc)"
					class="btn btn-default btn-xs media-desc " title="more info about this video">
					<i class="las la-info-circle"></i>
				</span>

				<span class="item-action"><i class="las la-clock-o"></i>{{ media.time}}</span>

				<span class="item-likes item-action" rel="tooltip" title="Number of Likes">
					<i class="las la-thumbs-up"></i> {{ media.statistics.likeCount | number:'2.0'}}
				</span>

				<span class="item-views item-action" rel="tooltip" title="Number of Views">
					<i class="las la-eye"></i> {{ media.statistics.viewCount | number:'2.0'}}
				</span>

			</section>
		</div>

		<div class="description back face">
			<h4><a href='#/video/{{ media.id}}' rel="tooltip" title="{{ media.snippet.title }}" class="media-thumb">{{ media.snippet.title}}</a></h4>
			<div>{{ media.snippet.description }}</div>
		</div>

		<section class="item-actions close-desc">
			<span
				(click)="toggle(showDesc)"
				class="btn btn-default btn-xs media-desc " title="flip back...">
					<i class="las la-times-circle"></i>
				</span>
		</section>

	</section>

</li>
```

There few noticeable changes that needs to be made:

Change the one-time binding prefixed with **"::"** to be without it.

Handling the "**controllerAs: &#8216;$ctrl'**" - either remove it or creating an alias on the ng2 class - this can be easily made with a simple

```typescript
export class YoutubeMedia {
	...
	$ctrl: any;

	constructor () {
		this.$ctrl = this;
	}
	....
}
```

but, I decided to drop it.

Handling events with the new brackets syntax - "**ng-click**" is converted to "**(click)**".

For ng-class, since I imported the NgClass directive in the component, there are 2 ways to it:

  1. Class binding - [class.the-name-of-class]="expression-should-return-boolean"
  2. Using NgClass directive - [ngClass]="{ the-name-of-class: boolean-experssion }".

By <a href="https://angular.io/docs/ts/latest/guide/template-syntax.html#!#ngClass" target="_blank">Angular (+2) ngClass docs</a>, for 1 class binding, the 1st method  (class binding) is preferred.

The last change is formatting numbers with filters in Angular (+2). There's a new syntax for filters in Angular (+2). Filters are now Pipes. The "**Number**" pipe (ng1 filter: number) should be used with the "**DecimalPipe**",  in order to format a number with commas. it should be defined as:

```typescript


The format must be defined with the appropriate digits - I followed the exact <a href="https://angular.io/docs/ts/latest/api/common/DecimalPipe-class.html" target="_blank">instructions in angular2 docs</a> to understand and define each digit.

### Using youtube-media Angular (+2) component

In **echoes1**, the youtube-media component is used as:

```typescript
<youtube-media 
	video="video"
	on-play="vm.playSelectedVideo(video)"
></youtube-media>
```

In **echoes2**, we can use the new component in echoes2 as such:

```typescript
<youtube-media 
    [media]="videoMock"
    (play)="playSelectedVideo(videoMock)"
></youtube-media>
```

## Final Thoughts

My overall experience is quite good. This "small" migration process went well enough - and still - a lot of work and exploration is left to complete the full Echoes app.

You can overview <a href="http://github.com/orizens/echoes-ng2" target="_blank">the complete code on github</a> - you can watch <a href="http://github.com/orizens/echoes-ng2/issues" target="_blank">the issues for any progress</a> on a specific component, service or other. As I stated in the beginning of this article, I intend to write a series of articles about the migration process of Echoes Player from AngularJS to Angular (+2).

I like how the component's code is very concise in its meaning, quite readable and comes with error notification support (I use <a href="http://www.sublimetext.com/" target="_blank">sublimetext</a> with the <a href="https://packagecontrol.io/packages/TypeScript" target="_blank">typescript package</a>). Also, the new template syntax is great and promotes readability.