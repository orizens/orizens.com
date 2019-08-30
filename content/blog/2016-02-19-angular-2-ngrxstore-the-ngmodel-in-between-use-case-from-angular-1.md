---
id: 951
title: 'Angular (2+) & NgRx/store: The NgModel In Between Use Case (from Angular 1)'
date: 2016-02-19T13:51:39+00:00
author: Oren Farhi 
templateKey: blog-post
layout: post
guid: http://orizens.com/wp/?p=951
permalink: /topics/angular-2-ngrxstore-the-ngmodel-in-between-use-case-from-angular-1/
dsq_thread_id:
  - "4593261293"
image: ../img/uploads/2016/02/ngmodel.jpg
categories:
  - Angular
  - es2015
  - ngrx
  - redux
  - typescript
tags:
  - angular2
  - ngrx
  - typescript
---
In the <a href="http://orizens.com/wp/topics/adding-redux-with-ngrxstore-to-angular-2-part-1/" target="_blank">recent article</a>, I integrated ngrx/store as a redux implementation to <a href="http://github.com/orizens/echoes-ng2" target="_blank">Echoes Player</a>. Until this article, the search was static with one hard coded search query. In this article, I'm sharing my insights on migrating more features from AngularJS and implementing ng-model with ngrx.<!--more-->

## From Angular 1 To Angular (+2): NgModel Template Syntax

In <a href="http://echotu.be" target="_blank">Echoes Player</a> with <a href="http://github.com/orizens/echoes" target="_blank">AngularJS</a>, this template is part of the "search-panel" component. It renders the search box to the top of the player:

```typescript
<div class="search-panel">
	<form class="navbar-form form-search navbar-left" ng-submit="vm.search()">
		<div class="form-group">
			<input placeholder="Explore Media" type="search" class="form-control" autocomplete="off"
				ng-model="vm.params.q"
				ng-change="vm.resetPageToken()">
			<button class="btn btn-transparent btn-submit" type="submit" title="search with echoes">
				<i class="fa fa-search"></i>
			</button>
		</div>
	</form>

</div>
```

* I removed some attributes and html code to make this code simpler for this post.

The migration of the html code above is quite simple (I mentioned it in <a href="http://orizens.com/wp/topics/3-more-steps-to-prepare-your-angular-1-code-to-angular-2/" target="_blank">3 more steps to prepare your AngularJS to Angular (+2)</a>) in Angular (+2):

  1. **ng-model** is converted to **([ngModel])**
  2. **ng-change** is converted to **(input)**
  3. instead of using **ng-submit**, I used a simple **(click)** event on the search button

Notice the **ngModel** is both bind with a value (using the binding [] brackets) and both syncs back to its variable (as an event with () ) - This the 2-way binding we've been used to from AngularJS. This template goes inside the youtube-videos template. Here is the full template:

```typescript
<div class="navbar-header">
	<div class="search-panel">
		<!-- SEARCH FORM -->
		<form class="navbar-form form-search navbar-left">
			<div class="form-group">
				<input placeholder="Explore Media" type="search" class="form-control" autocomplete="off"
					[(ngModel)]="searchQuery"
					(input)="resetPageToken()"
					>
				<button class="btn btn-transparent btn-submit" type="submit" title="search with echoes"
					(click)="search()">
					<i class="fa fa-search"></i>
				</button>
			</div>
		</form>
	</div>
</div>
```

## Updating Youtube Videos Component Class

To support the new search feature, the component's class needs to be updated with:

  1. "**searchQuery**" property which will hold the search string value
  2. Updating the search function with the new "**searchQuery**"
  3. "**resetPageToken**" function which will reset the pageToken property when the search query  changes

```typescript
import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { NgModel } from '@angular/common'
import { Store} from '@ngrx/store';
import { YoutubeSearch } from '../core/services/youtube.search';
import { YoutubeList } from '../core/components/youtube-list/youtube-list';

@Component({
	selector: 'youtube-videos.youtube-videos',
	template: require('./youtube-videos.html'),
	directives: [YoutubeList, NgModel],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class YoutubeVideos {
	videos: any;
	searchQuery: string = 'tremonti';

	constructor(private youtubeSearch: YoutubeSearch, public store: Store<any>) {
		this.videos = this.store.select('videos');
		this.search();
	}

	ngOnInit(){
	}

	search () {
		this.youtubeSearch.search(this.searchQuery, false);
	}

	playSelectedVideo(media) {
		console.log('playing', media);
	}

	resetPageToken() {
		this.youtubeSearch.resetPageToken();
	}
}
```

## Updating Youtube Search Service With a New NgRx Action

The last change goes to the youtube search service - this is where the actual search logics happens and where <a href="https://github.com/ngrx/store" target="_blank">NgRx/store</a> goes into action.

I added a new function "**resetPageToken**", which purpose is to reset the pageToken property in the configuration object that is used in the youtube search request.

This function also dispatched a new action, &#8216;RESET', which resets the videos list in the store. It is also being called in the search function if a new search is request by Echoes:

```typescript
resetPageToken () {
	this._config.set('pageToken', '');
	this.store.dispatch({ type: RESET });
}
```

This is the result:

<img class="alignleft size-large wp-image-952" src=".../../img/uploads/2016/02/Screen-Shot-2016-02-19-at-3.45.55-PM-1024x640.png" alt="Screen Shot 2016-02-19 at 3.45.55 PM" width="697" height="436" srcset=".../../img/uploads/2016/02/Screen-Shot-2016-02-19-at-3.45.55-PM-1024x640.png 1024w, .../../img/uploads/2016/02/Screen-Shot-2016-02-19-at-3.45.55-PM-300x188.png 300w, .../../img/uploads/2016/02/Screen-Shot-2016-02-19-at-3.45.55-PM-768x480.png 768w" sizes="(max-width: 697px) 100vw, 697px" />

&nbsp;