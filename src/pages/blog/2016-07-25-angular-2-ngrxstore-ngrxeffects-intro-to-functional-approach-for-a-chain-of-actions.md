---
id: 1018
title: 'Angular (2+), Ngrx/Store & Ngrx/Effects - Intro To Functional Approach For A Chain Of Actions'
pubDate: 2016-07-25T05:42:19+00:00
author: Oren Farhi 
# templateKey: blog-post
layout: '@/templates/BasePost.astro'
# guidhttp://orizens.com/wp/?p=1018
# permalink: /blog/angular-2-ngrxstore-ngrxeffects-intro-to-functional-approach-for-a-chain-of-actions/
imgSrc: /images/blog/2016/07/ngrxeffect.jpg
tags:
  - angular2
  - architecture
  - javascript
  - ngrx
---
The Ngrx projects adds functional approach to various interesting architectural implementations. I wrote about my experience with <a href="http://orizens.com/wp/blog/adding-redux-with-ngrxstore-to-angular-2-part-1/" target="_blank">storing data using ngrx/store</a> and <a href="http://orizens.com/wp/blog/adding-redux-with-ngrxstore-to-angular2-part-2-testing-reducers/" target="_blank">testing this approach in Angular (+2)</a> based app. Since then, I've had the chance of exploring this land of ngrx further more. I've found [ngrx/effects](https://github.com/ngrx/effects) to be an elegant and quite functional solution for expressing a series of actions which depend on each other. In this post, I explain a use case for using ngrx/effects in my <a href="http://github.com/orizens/echoes" target="_blank">open source app</a>, <a href="http://echoesplayer.netlify.app" target="_blank">Echoes Player</a>,  and show the benefits that I found, after using it.

<!--more-->

## What is Wrong With Promises in Angular (+2)

_[**UPDATED**: 12/2/16, with **ngrx/effects 2**)_ This title is a little bit overwhelmed - however, after seeing the "light" from another perspective - I allow myself to say that I prefer to use promises as the last implementation approach nowadays when using ngrx/store.

Usually, we're using promises in order to fetch data (async), save new data or generally, update a state with a REST api - CRUD operations. we've come a long way with promises - promises features few benefits:

  1. context based "callbacks"
  2. a way perform several dependent operations
  3. one central point to handle errors wherever it occurs in this chain of operations (referring to bullet 2)

With these benefits, or this "power", there, "comes great responsibility":

  1. same chain might occur in other files
  2. code might become, again, nested context based functions, which might lead to poor readability
  3. same redundant code is written (sometimes&#8230;), which might lead to writing more functions to approach the same code (wrapper functions, getters, etc..)
  4. most of the time, we'll need to update the current state of the app according to the response of this actions
  5. logics of handling the state of the app, might be written inside services - which might be hard to test

To sum up, promises are good and perhaps better than simple ajax based callbacks - however - we can make it better.

<a href="http://echoesplayer.netlify.app" target="_blank">Echoes Player</a> is a media player which is based on youtube api (production app in written with AngularJS). Its layout is a common layout of a dashboard app -

  1. a top navbar for search
  2. left sidebar for showing the now playlist (and currently navigating)
  3. right content pane - shows the current view of navigation (list of videos/playlists)
  4. fixed bottom toolbar - shows the player and player's controls.<figure id="attachment_1023" class="thumbnail wp-caption alignnone" style="width: 970px">

<img class="wp-image-1023 size-full" src="...//images/blog/2016/07/ng2-ngrx2Fstore-game-of-states-FOR-PUBLISH-2.png" alt="stateless components in Echoes Player" width="960" height="720" srcset="...//images/blog/2016/07/ng2-ngrx2Fstore-game-of-states-FOR-PUBLISH-2.png 960w, ...//images/blog/2016/07/ng2-ngrx2Fstore-game-of-states-FOR-PUBLISH-2-300x225.png 300w, ...//images/blog/2016/07/ng2-ngrx2Fstore-game-of-states-FOR-PUBLISH-2-768x576.png 768w, ...//images/blog/2016/07/ng2-ngrx2Fstore-game-of-states-FOR-PUBLISH-2-640x480.png 640w" sizes="(max-width: 960px) 100vw, 960px" /><figcaption class="caption wp-caption-text">stateless components in Echoes Player</figcaption></figure> 

The user can click on "Queue" in any media card in order to add the media the now playlist.

I've started porting <a href="http://github.com/orizens/echoes-ng2" target="_blank">Echoes Player to Angular (+2)</a> in order to experiment with Angular (+2) and various interesting solutions - among - ngrx/store and ngrx/effects. The above screenshot is taken from a talk I gave recently (<a href="http://www.meetup.com/AngularJS-IL/events/231885788/" target="_blank">AngularJs-IL , July 2016</a>) about <a href="http://www.slideshare.net/orizens/ng2-amp-ngrx2-fstore-game-of-states-for-publish" target="_blank">Angular (+2) and ngrx/store</a> - I also took the chance to introduce the concept of ngrx/effects.

## Before Ngrx/Effects: Using Promises

The component that manages the right pane is "**youtube-videos.component.ts**". handling the "**Queue**" event was implemented with this code in the "**queueSelectedVideo**" function:

```typescript
// "imports" omitted to focus on the relevant code for this example
@Component({
  selector: 'youtube-videos.youtube-videos'
})
export class YoutubeVideos implements OnInit {
  videos$: Observable<EchoesVideos>;
  playerSearch$: Observable<PlayerSearch>;

  constructor(
    private youtubeSearch: YoutubeSearch,
    private nowPlaylistService: NowPlaylistService,
    private store: Store<EchoesState>,
    public youtubePlayer: YoutubePlayerService
  ) {
    this.videos$ = store.select(state => state.videos);
    this.playerSearch$ = store.select(state => state.search)
  }

  playSelectedVideo (media: GoogleApiYouTubeSearchResource) {
    this.youtubePlayer.playVideo(media);
    this.queueSelectedVideo(media)
      .then(videoResource => this.nowPlaylistService.updateIndexByMedia(videoResource));
  }

  queueSelectedVideo (media: GoogleApiYouTubeSearchResource) {
    return this.nowPlaylistService.queueVideo(media.id.videoId);
  }
}

```

The "**queueSelectedVideo**" function calls the queueVideo function on the nowPlaylistService. In this implementation, the "**playSelectedVideo**" function also uses the queueSelectedVideo and it's easy to understand that this function return a promise (spot the "then").

The reason for using a promise here is - in order to display more data on the selected video that is "destined" to queue, I had to make an api call to another youtube api and only then, add this media to the now playlist sidebar.

"**queueVideo**" function, simply, dispatch an action once the promise has been resolved:

```typescript
// now-playlist.service.ts
// imports omitted 
@Injectable()
export class NowPlaylistService {
	public playlist$: Observable<YoutubeMediaPlaylist>;

	constructor(public store: Store<any>,
		private youtubeVideosInfo: YoutubeVideosInfo
		) {
		this.playlist$ = this.store.select(state => state.nowPlaylist);
	}

	queueVideo (mediaId: string) {
		return this.youtubeVideosInfo.api.list(mediaId)
      .then(response => {
        this.store.dispatch({ type: QUEUE, payload: response.items[0] });
        return response.items[0];
			});
	}
}
```

This code is simple and works great. However, there might be few challenges that will be hard to implement with this approach:

  1. what if I'de like to display a notification that an action is in progress? api response might take time&#8230;
  2. what if i'de like to make another api call to further add data to the media?
  3. what id i'de like to display a notification or do something else once the now-playlist has been updated?
  4. how can I understand the chain of actions that suppose to perform with the "queueVideo" story?

## After Ngrx/Effects: A New Approach To Express Logics and Actions

<a href="https://github.com/ngrx/effects" target="_blank">Ngrx/Effects</a> comes to play in situations. But first, lets understand what is an Effect.

Effects relates to the term "**side effect**" - a function has a side effect if it "_modifies some state or has an observable interaction_" ([wikipedia](https://en.wikipedia.org/wiki/Side_effect_(computer_science))). With our case, we can say that the queue video action eventually modifies the state of now-playlist, has a side effect of initiating an api call to a service and then, upon response (success or error) and will initiate another action.

See? there is a chain reaction which originated in one action - this chain reaction should always occur in Echoes Player app whenever the "**Queue**" action is raised.

The 2nd fact to notice here is that [ngrx/store](https://github.com/ngrx/store) is based on <a href="https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md" target="_blank">observables</a>. Ngrx/Effects is based on theses observables and operates by subscribing to its changes. The discovery and understanding on how to use Ngrx/Effects, led me to refactor the code for now playlist and its dependent services, while hardening the logics more and separating it to a higher degree from services.

Lets see how ngrx solves the above challenges while including the benefits of promises.

First, now I created a new class to be used as an action creator - functions which will return an Action object. i.e, the "**now-playlist.actions.ts**" is:

```typescript
import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

@Injectable()
export class NowPlaylistActions {
  static QUEUE_LOAD_VIDEO = 'QUEUE_LOAD_VIDEO';
  queueLoadVideo(media): Action {
    return {
      type: NowPlaylistActions.QUEUE_LOAD_VIDEO,
      payload: media
    }
  }
// other functions omitted for this post
}
```

the "**youtube-videos.component.ts**" has been revamped to use these action creators functions. Now, this component just dispatch actions with "**playSelectedVideo**" and "**queueSelectedVideo**". There are no logics or ajax resolving here:

```typescript
// imports omitted for this post
@Component({
  selector: 'youtube-videos.youtube-videos'
})
export class YoutubeVideos implements OnInit {
  videos$: Observable<EchoesVideos>;
  playerSearch$: Observable<PlayerSearch>;

  constructor(
    private youtubeSearch: YoutubeSearch,
    private nowPlaylistService: NowPlaylistService,
    private store: Store<EchoesState>,
    private nowPlaylistActions: NowPlaylistActions,
    private playerActions: PlayerActions,
    public youtubePlayer: YoutubePlayerService
  ) {
    this.videos$ = store.select(state => state.videos);
    this.playerSearch$ = store.select(state => state.search)
  }

  playSelectedVideo (media: GoogleApiYouTubeSearchResource) {
    this.store.dispatch(this.playerActions.loadAndPlay(media));
    // This dispatch an action as well)
    this.nowPlaylistService.updateIndexByMedia(media.id.videoId);
    this.store.dispatch(this.nowPlaylistActions.queueLoadVideo(media))
  }

  queueSelectedVideo (media: GoogleApiYouTubeSearchResource) {
    this.store.dispatch(this.nowPlaylistActions.queueLoadVideo(media));
  }
}

```

Lets focus on the new flow of "**queueSelectedVideo**".

Along side the refactored code, I created a new directory for effects. This is the "**now-playlist.effects.ts**":

```typescript
// imports omitted for this post
@Injectable()
export class NowPlaylistEffects {

  constructor(
    private store$: StateUpdates<EchoesState>,
    private nowPlaylistActions: NowPlaylistActions,
    private nowPlaylistService: NowPlaylistService,
    private youtubeVideosInfo: YoutubeVideosInfo
  ){}

  @Effect() queueVideoReady$ = this.store$
    .ofType(NowPlaylistActions.QUEUE_LOAD_VIDEO)
    .map<GoogleApiYouTubeSearchResource>(action => action.payload)
    .switchMap(media => this.youtubeVideosInfo.fetchVideoData(media.id.videoId)
      .map(media => this.nowPlaylistActions.queueVideo(media))
      .catch(() => Observable.of(this.nowPlaylistActions.queueFailed(media)))
    );
}
```

There a new decorator - "**@Effect()**" - which is used to what I call -  a side effect "**story**". In my opinion, the code is almost a simple story from which I can understand a chain of reactions:

  1. when the action **QUEUE\_LOAD\_VIDEO** (the new queue video) has been dispatched
  2. take the payload and pass it on to the next operation
  3. use api to fetch more data on the relevant video and return a <span style="text-decoration: underline;"><strong>new</strong></span> observable so it can subscribed to: 
      1. if response returned successfully - dispatch the final action as queue video.
      2. if an error occurred - update the state with an action as a fail to queue.

Lets see the benefits this implementation allows - similarly to the benefits of promises:

  1. context based callbacks achieved via a call to promises in the context (still - fat arrows are used in here)
  2. I defined 2 actions (ngrx/store) and 1 call to a service - dependent operations performed together.
  3. error is handled wherever it happens while updating the state of the app as well (bonus!)

Moreover, now, I can update the state of the app and react to several states with this approach - requesting to queue a video (imagine a "_loading more video data&#8230;_" spinner) and adding the video to the queue ("_added to the queue_!" message). On the contrary, if the video has been deleted and an error will be returned by the api, a proper message can be displayed to the user (not implemented for now - but relatively very easy to add).

## Summary

I find ngrx/effects a very interesting and neat approach to group logics which involves a chain reactions of several actions. It promotes readability of the code, think "twice" about your app's design - to both logics and visual.

Another useful outcome I experienced - writing with ngrx/Effects in mind, promotes creating smaller **SMART** components (**container** components) - in which, these components communicates with the store through action creators - reducing the components "logics" to bare minimum calls of actions.

I intend to explore ngrx/effects further - testing effects, using effects dynamically as well as exploring alternatives.

You can explore <a href="http://github.com/orizens/echoes-ng2" target="_blank">Echoes Player with Angular (+2)</a>, [Echoes Player with Angular (+2)](http://github.com/orizens/echoes) and off course, user the actual production app at - <http://echoesplayer.netlify.app>

### Last NOTE:

book my recent session to your teams for **FREE**

Register for a full day workshop on Angular (+2) & Ngrx/Store:
  
<a class="linkified" title="http://goo.gl/EJmm7q" href="http://goo.gl/EJmm7q" target="_blank" rel="nofollow">http://goo.gl/EJmm7q</a>
  
* companies may book a workshop for teams

<img class="alignnone wp-image-1028 " src="...//images/blog/2016/07/a55ebfb8-5bb9-499e-a7d3-58b8e27faab2-original.png" alt="a55ebfb8-5bb9-499e-a7d3-58b8e27faab2-original" width="640" height="480" srcset="...//images/blog/2016/07/a55ebfb8-5bb9-499e-a7d3-58b8e27faab2-original.png 960w, ...//images/blog/2016/07/a55ebfb8-5bb9-499e-a7d3-58b8e27faab2-original-300x225.png 300w, ...//images/blog/2016/07/a55ebfb8-5bb9-499e-a7d3-58b8e27faab2-original-768x576.png 768w, ...//images/blog/2016/07/a55ebfb8-5bb9-499e-a7d3-58b8e27faab2-original-640x480.png 640w" sizes="(max-width: 640px) 100vw, 640px" />