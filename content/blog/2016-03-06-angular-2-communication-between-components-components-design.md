---
id: 963
title: 'Angular (2+) - Communication Between Components & Components Design'
date: 2016-03-06T18:58:56+00:00
author: Oren Farhi
templateKey: blog-post
layout: post
guid: http://orizens.com/wp/?p=963
permalink: /topics/angular-2-communication-between-components-components-design/
dsq_thread_id:
  - '4639629364'
image: ../img/uploads/2016/03/commucompo.jpg
categories:
  - Angular
  - architecture
  - es2015
  - javascript
  - ngrx
  - redux
  - testing
  - typescript
tags:
  - angualr2
  - architecture
  - ngrx
  - typescript
---

In the last article, I added the ability to <a href="http://orizens.com/wp/topics/adding-redux-with-ngrxstore-to-angular2-part-2-testing-reducers/" target="_blank">play a media in Echoes Player</a>. I introduced a new reducer which holds the state of the player. In this post I want to share my views regarding communication between different components - and how using the "**ngrx/store**" as a state management promotes reuse of logics, less code to write and more separation in designing components.<!--more-->

## Components Design Decisions

**UPDATED: RC.6, 9/2/2016**

<a href="http://echotu.be" target="_blank">Echoes Player</a> is an <a href="http://github.com/orizens/echoes" target="_blank">open source media player</a> (no ads included :-)) that plays videos from <a href="http://youtube.com" target="_blank">youtube</a> using its data api and the youtube iframe api. So, after adding the feature to play a video, the next feature in my list is to manage a playlist so I can play several videos in a sequence.

The orange area in the below screenshot is the now-playlist feature:

<img class="alignnone size-large wp-image-965" src=".../../img/uploads/2016/03/Screen-Shot-2016-03-06-at-5.59.50-PM-1024x640.png" alt="Screen Shot 2016-03-06 at 5.59.50 PM" width="697" height="436" srcset=".../../img/uploads/2016/03/Screen-Shot-2016-03-06-at-5.59.50-PM-1024x640.png 1024w, .../../img/uploads/2016/03/Screen-Shot-2016-03-06-at-5.59.50-PM-300x188.png 300w, .../../img/uploads/2016/03/Screen-Shot-2016-03-06-at-5.59.50-PM-768x480.png 768w" sizes="(max-width: 697px) 100vw, 697px" />

Since I have taken <a href="http://orizens.com/wp/topics/5-steps-to-prepare-your-angular-1-code-to-angular-2/" target="_blank">few steps to migrate</a> Echoes Player version that I wrote with AngularJS to Angular (+2), the components design was pretty solid for the this version with Angular (+2). Also, the code migration for these components was quite solid.

I divided this area into 2 components:

1. <span style="color: #ff9900;"><strong>Now Playlist Filter</strong></span> (<span style="color: #ff9900;">orange</span>) - this component allows to filter the playlist, clear the playlist and invoke a save playlist action.
2. <span style="color: #3366ff;"><strong>Now Playlist</strong></span> (<span style="color: #3366ff;">Blue</span>) - this component job is to display the current playlist, mark the current played video, remove videos from playlists and sort videos in this playlist (not implemented for now).

Separating this area into 2 components, keeps the separation of concerns, makes the component smaller and easy to maintain and creates a somewhat better semantics.

<img class="alignnone size-full wp-image-966" src=".../../img/uploads/2016/03/Screen-Shot-2016-03-06-at-5.51.52-PM.png" alt="Screen Shot 2016-03-06 at 5.51.52 PM" width="604" height="904" srcset=".../../img/uploads/2016/03/Screen-Shot-2016-03-06-at-5.51.52-PM.png 604w, .../../img/uploads/2016/03/Screen-Shot-2016-03-06-at-5.51.52-PM-200x300.png 200w, .../../img/uploads/2016/03/Screen-Shot-2016-03-06-at-5.51.52-PM-300x449.png 300w" sizes="(max-width: 604px) 100vw, 604px" />

## The Development Process for NowPlaylist Angular (+2) Component

### Creating A The Reducer For Now Playlist State

Since i'm using <a href="https://github.com/ngrx/store" target="_blank">ngrx/store</a> as a state management (I recommend to read on integrating ngrx/store with Angular (+2) - <a href="http://orizens.com/wp/topics/adding-redux-with-ngrxstore-to-angular-2-part-1/" target="_blank">part1</a>, <a href="http://orizens.com/wp/topics/adding-redux-with-ngrxstore-to-angular2-part-2-testing-reducers/" target="_blank">part2</a>), I started by defining the state structure that the now-playlist (including its filter). The "**initial state**" is the actual structure of the now playlist.

I defined the relevant actions that can change this state. Each action returns a new state object by creating a new empty state and merging it with the current state while eventually, appending the new and relevant properties changes of this state. This pattern follows <a href="http://redux.js.org/docs/basics/Reducers.html" target="_blank">Redux's concepts</a> which I recommend to read and get familiar with.

```typescript
import { ActionReducer, Action } from '@ngrx/store';
import { NowPlaylistActions } from './now-playlist.actions';

export * from './now-playlist.actions';

export interface YoutubeMediaPlaylist {
    videos: GoogleApiYouTubeSearchResource[],
    index: number,
    filter: string
}
let initialState: YoutubeMediaPlaylist = {
    videos: [],
    index: 0,
    filter: ''
}
export const nowPlaylist: Reducer<any> = (state: YoutubeMediaPlaylist = initialState, action: Action) => {
    let matchMedia = (media) => media.id.videoId === action.payload.id.videoId;
    let isDifferent = (media) => media.id.videoId !== action.payload.id.videoId;

    switch (action.type) {
        case NowPlaylistActions.SELECT:
            return Object.assign({}, state, { index: state.videos.findIndex(matchMedia) });

        case NowPlaylistActions.QUEUE:
            return Object.assign({}, state, { videos: [ ...state.videos, action.payload ]});

        case NowPlaylistActions.REMOVE:
            return Object.assign({}, state, { videos: state.videos.filter(isDifferent) });

        case NowPlaylistActions.UPDATE_INDEX:
            return Object.assign({}, state, { index: action.payload });

        case NowPlaylistActions.FILTER_CHANGE:
            return Object.assign({}, state, { filter: action.payload });

        case NowPlaylistActions.REMOVE_ALL:
            return Object.assign({}, state, { videos: [], filter: '', index: 0 });

        default:
            return state;
    }
}
```

Since I like writing tests, this store also includes <a href="https://github.com/orizens/echoes-ng2/blob/585a07b66aba659ed479547101797e9a4eff3773/src/app/core/store/now-playlist.spec.ts" target="_blank">a spec which indicates what operations can be done</a> and the expectations from these actions in the context of the Echoes Player application.

In order to operate on this store and to have one place where these actions are invoked, I chose to create a now-playlist service which both components will use. This approach in the **Redux** terminology is also known as <a href="http://redux.js.org/docs/basics/Actions.html" target="_blank">action creator</a>. This allows us to invoke these actions from one file only and we can test this service easily enough:

```typescript
import { Http, URLSearchParams, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { EchoesState } from "../store";
import { NowPlaylistActions, YoutubeMediaPlaylist } from '../store/now-playlist';
import { YoutubeVideosInfo } from './youtube-videos-info.service';

@Injectable()
export class NowPlaylistService {
 public playlist$: Observable<YoutubeMediaPlaylist>;

 constructor(
 public store: Store<EchoesState>,
 private youtubeVideosInfo: YoutubeVideosInfo,
 private nowPlaylistActions: NowPlaylistActions
 ) {
 this.playlist$ = this.store.select(state => state.nowPlaylist);
 }

 queueVideo (mediaId: string) {
 return this.youtubeVideosInfo.api
 .list(mediaId)
 .map(items => items[0])
 }

 queueVideos (medias: GoogleApiYouTubeVideoResource[]) {
 this.store.dispatch({ type: NowPlaylistActions.QUEUE_VIDEOS, payload: medias });
 }

 removeVideo (media) {
 this.store.dispatch({ type: NowPlaylistActions.REMOVE, payload: media });
 }

 selectVideo (media) {
 this.store.dispatch({ type: NowPlaylistActions.SELECT, payload: media });
 }

 updateFilter (filter: string) {
 this.store.dispatch({ type: NowPlaylistActions.FILTER_CHANGE, payload: filter });
 }

 clearPlaylist () {
 this.store.dispatch({ type: NowPlaylistActions.REMOVE_ALL });
 }

 selectNextIndex () {
 this.store.dispatch({ type: NowPlaylistActions.SELECT_NEXT })
 }

 getCurrent () {
 let media;
 this.playlist$.take(1).subscribe(playlist => {
 media = playlist.videos.find(video => video.id === playlist.index);
 });
 return media;
 }

 updateIndexByMedia(mediaId: string) {
 this.store.dispatch(this.nowPlaylistActions.updateIndexByMedia(mediaId));
 }
```

The "**now playlist**" store is passed to both components. Each component will operate on this playlist and will emit actions to change the state through the now playlist service.

To create the whole now playlist feature, the components are constructed in this manner:

```typescript
<div class="sidebar-pane">
	<now-playlist-filter 
           [ playlist ]="nowPlaylist"
	></now-playlist-filter>
	<now-playlist 
                [ playlist ]="nowPlaylist"
		(select)="selectVideo($event)"
		(sort)="sortVideo($event)"
	></now-playlist>
</div>
```

### Design Of "Now Playlist Filter" Component

The "**now playlist filter**" component is almost a self contained component - it gets the "**nowPlaylist**" store as an input parameter only. Inside, It operates on this playlist via the now playlist service - this is how it changes the now playlist store only:

```typescript
import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { NowPlaylistService } from '../core/services/now-playlist.service';
import { YoutubeMediaPlaylist } from '../core/store/now-playlist';

@Component({
	selector: 'now-playlist-filter',
	template: require('./now-playlist-filter.html'),
	styles: [`
		:host [hidden] {
			display: none;
		}
	`],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class NowPlaylistFilter {
	@Input() playlist: YoutubeMediaPlaylist;

	constructor(private nowPlaylistService: NowPlaylistService) {}

	handleFilterChange (searchFilter: string) {
		this.nowPlaylistService.updateFilter(searchFilter);
	}

	resetSearchFilter () {
		this.nowPlaylistService.updateFilter('');
	}

	isFilterEmpty () {
		return this.playlist.filter === '';
	}

	clearPlaylist () {
		this.nowPlaylistService.clearPlaylist();
	}
```

In contrary to using this component's template with "**ng-show**" with AngularJS, I chose to use "**\*ngIf**" in order to toggle the icons on the search field. I like the new syntax - during development it really pops out to the eye and is easy to locate.

As I've written before on <a href="http://orizens.com/wp/topics/3-more-steps-to-prepare-your-angular-1-code-to-angular-2/" target="_blank">3 more steps for preparing AngularJS code to angular2</a>, migrating the search input from "**ng-model**" and "**ng-change**" in angular1 to "**[ngModel]**" and "**input()**" in angular2 was pretty straight forward. The new addition in this code is how the "**input()**" event passes the value to the handler on the component.

I defined a local variable using the "**#**" syntax - this creates a local template reference to the input dom element - so that it can be used anywhere else in this template. So, I can just reference its value with "**searchFilter.value**". This allows me to define the function handler on the component without referencing any specific DOM api (platform) - thus - having a simpler function handler - it gets a primitive value and operates on it.

This is the template (I removed a button which is related to saving this playlist since its implemented yet):

```typescript
<h3 class="nav-header nav-header-fluid user-playlists-filter">
	Now Playing
	<button class="btn btn-link btn-xs btn-clear" title="Clear All Tracks In Now Playlist"
		[disabled]="playlist?.videos?.length === 0"
		(click)="clearPlaylist()">
		<span class="fa fa-trash-o"></span>
	</button>
	<div class="playlist-filter pull-right">
		<i class="fa fa-search" *ngIf="isFilterEmpty()"></i>
		<i class="fa fa-remove text-danger" *ngIf="!isFilterEmpty()" (click)="resetSearchFilter()"></i>
		<input type="search"
			[value]="playlist?.filter"
			#searchFilter
			(input)="handleFilterChange(searchFilter.value)">
	</div>
</h3>
```

### Design Of The "Now Playlist" Component

This component is almost similar to the now playlist filter component. The operations of changing the state are self contained within the now-playlist service.

Apart from communicating with the now-playlist service, this component throws 2 events:

1. **select** - notifies that a video has been selected in the playlist.
2. **sort **- the user sorted the playlist (not implemented).

Eventually, the "**select**" event, allows me to instruct the player to play a video and keep this logic outside of this component.

This time, I used the "**\*ngFor**" again for rendering the playlist tracks. In contrary to the last I used this directive, this component needs to render the index number of each video in the last and apply filtering value which comes form the previous component.

In order to migrate the "**\$index**" local variable form AngularJS, I used the convention of creating a local variable with the "**#**" sign.

For filtering the "**\*ngFor**" repeater, similar to AngularJS, we can use pipe. However, In contrary to AngularJS, Angular (+2) does not include a filter/search pipe for performance reasons - <a href="https://angular.io/docs/ts/latest/cookbook/a1-a2-quick-reference.html" target="_blank">as explained in the docs</a>:

> There is no comparable pipe in Angular 2 for performance reasons. Filtering should be coded in the component. Consider building a custom pipe if the same filtering code will be reused in several templates.

However, we can easily create a filer/search pipe. I decided to create such filter since there are more components in Echoes Player that will need this feature (I intend to write a post about it soon).

Here's the full template for this component:

```typescript
<section class="now-playlist"
	[ngClass]="{
		'transition-in': playlist?.videos?.length
	}">
	<ul class="nav nav-list">
		<li class="now-playlist-track"
			[ngClass]="{
				'active': playlist?.index === index
			}"
			*ngFor="let video of playlist?.videos | search:playlist.filter ; let index = index"
			>
			<a class="" title="{{ video.snippet.title }}"
				(click)="selectVideo(video)">
				{{ index + 1 }})
				<img class="video-thumb" draggable="false" src="{{ video.snippet.thumbnails.default.url }}" title="Drag to sort">
				<span class="video-title">{{ video.snippet.title }}</span>
				<span class="badge badge-info">{{ video.time }}</span>
				<span class="label label-danger ux-maker remove-track" title="Remove From Playlist"
					(click)="removeVideo(video)"><i class="fa fa-remove"></i></span>
			</a>
		</li>
	</ul>
</section>
```

### Communication Between Components Explained

Since both components operate on the same "**nowPlaylist"** store, by nature of Angular (+2)'s change detection mechanism, as soon as this store is changed, both components will update its views and will reflect the current state of this store.

So eventually, these components are completely strange to each other, have on knowledge on each other, and still communicating via the now-playlist service, which eventually, communicates the new action to change the state of the store.

In the same way, other components in the app will be able to update the state of the now-playlist store, and like that, communicating between each other.

In my opinion, there is no actual communication between the components, but rather requesting a change in state in form a single source of truth. The design of this flow is driven by data and is changed by events.

## Final Thoughts

I chose to experiment with a slightly different design of the now-playlist feature from the AngularJS version. Another approach is to include the the now-playlist-filter component inside the now-playlist component while still incapsulating the code of the filter in a dedicated component - I plan to experiment with this implementation as well.

Communication and state sharing between components is achieved easily via using ngrx/store or a central state management solution. Also, keeping the components as stateless as possible, promotes the idea of writing logics and keeping the actual state outside of the components and creating one source of truth.

As always, the source code for this post is <a href="https://github.com/orizens/echoes-ng2/issues/12" target="_blank">available on github</a>.

&nbsp;

&nbsp;

&nbsp;
