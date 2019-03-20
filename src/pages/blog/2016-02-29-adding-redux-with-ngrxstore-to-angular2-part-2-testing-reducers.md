---
id: 956
title: 'Adding Redux with NgRx/store to Angular (2+) &#8211; Part 2 (Testing Reducers)'
date: 2016-02-29T15:38:56+00:00
author: Oren Farhi 
templateKey: blog-post
layout: post
guid: http://orizens.com/wp/?p=956
permalink: /topics/adding-redux-with-ngrxstore-to-angular2-part-2-testing-reducers/
dsq_thread_id:
  - "4621939384"
image: ../../img/uploads/2016/02/ngrxpart2.jpg
categories:
  - Angular
  - ngrx
  - redux
  - typescript
  - Uncategorized
tags:
  - angular2
  - ngrx
  - typescript
---
In my <a href="http://orizens.com/wp/topics/adding-redux-with-ngrxstore-to-angular-2-part-1/" target="_blank">recent article about adding redux with ngrx/store to angular2</a>, I showed a nice example of integrating this awesome state management library to my <a href="http://github.com/orizens/echoes" target="_blank">open source project</a> <a href="http://echotu.be" target="_blank">Echoes Player</a>. Since then, I really wanted to integrate youtube player into <a href="http://github.com/orizens/echoes-ng2" target="_blank">this angular2 version</a>. In this post, I&#8217;m sharing my insights on achieving using ngrx/store, working with more than one reducer in angular2 and testing reducers as well.<!--more-->

## Creating a Youtube Player Reducer

First, I defined and created a reducer for the youtube player in Echoes. This approach of defining first the reducer helps me to design what data the app needs for this feature and how I&#8217;d like to use it.

At First, I defined the actions for this player&#8217;s reducer:

<pre class="lang:default decode:true">import {Reducer, Action} from '@ngrx/store';

export const PLAY = 'PLAY';
export const QUEUE = 'REMOVE';
export const TOGGLE_PLAYER = 'TOGGLE_PLAYER';</pre>

Now, I chose to define the data structure of the player as well as the initial state that I want it to be when the app starts:

<pre class="lang:default decode:true ">let initialPlayerState = {
    mediaId: 'NONE',
    index: 0,
    media: {
        snippet: { title: 'No Media Yet' }
    },
    showPlayer: true
}</pre>

Similar to the previously &#8220;**videos**&#8221; reducer (from my <a href="http://orizens.com/wp/topics/adding-redux-with-ngrxstore-to-angular-2-part-1/" target="_blank">last article about ngrx/store</a>), I defined a reducer for the player. It is a pure function that expects to get a state object and an **Action** object. The action object will always include an &#8220;**action.type**&#8221; of this action. It can also include an &#8220;action.payload&#8221; if the action suppose to pass data.

For better readability and perhaps easier maintenance, I like to keep the creation of a new state in small functions, which I can test as well. Those are the &#8220;**playVideo**&#8221; and &#8220;**toggleVisibility**&#8221; functions. Remember &#8211; a reducer should return a new state and shouldn&#8217;t mutate the old state object.

All in all, the &#8220;**player**&#8221; reducer function can also be tested (which is described later in this article):

<pre class="lang:default decode:true">export const player: Reducer&lt;any&gt; = (state: Object = initialPlayerState, action: Action) =&gt; {

    switch (action.type) {
        case PLAY:
            return playVideo(state, action.payload);

        case QUEUE:
            return state;

        case TOGGLE_PLAYER:
            return toggleVisibility(state);

        default:
            return state;
    }
}

export function playVideo(state: any, media: any) {
    return {
        mediaId: media.id.videoId,
        index: 0,
        media: media,
        showPlayer: true
    }
}

export function toggleVisibility(state: any) {
    return {
        mediaId: state.mediaId,
        index: 0,
        media: state.media,
        showPlayer: !state.showPlayer
    }
}</pre>

## Testing Reducers in Ngrx/store and Angular2

I&#8217;ve written before that I like to write tests. Testing reducers turned out to be quite simple &#8211; a reducer is a function that gets an input and should always return an output. Lets see how we can test the new player reducer.

First, we need to setup the relevant testing utils that we&#8217;re going to use &#8211; using jasmine for testing:

<pre class="lang:default decode:true ">import {
  it,
  inject,
  injectAsync,
  describe,
  expect,
  beforeEachProviders,
  TestComponentBuilder
} from 'angular2/testing';
</pre>

Next, we should import the relevant reducer, its actions and a mock file that i&#8217;m going to use in the tests:

<pre class="lang:default decode:true ">import { player } from './youtube-player';
import { PLAY, QUEUE, TOGGLE_PLAYER } from './youtube-player';
import { YoutubeMediaMock } from '../../../../test/mocks/youtube.media.item';</pre>

The actual tests (&#8220;**it**&#8221; functions) invoke the &#8220;**player**&#8221; reducer function, each time with a different action, payload (which is optional) and then, asserts the expected result.

I could check these operations manually inside the browser, but &#8211; Testing is fun &#8211; someone is doing it for me :).

<pre class="lang:default decode:true ">describe('The Youtube Player reducer', () =&gt; {
    it('should return current state when no valid actions have been made', () =&gt; {
        const state = { mediaId: 'mocked...' };
        const actual = player(state, {type: 'INVALID_ACTION', payload: {}});
        const expected = state;
        expect(actual).toBe(expected);
    });

    it('should set the new media id by the new PLAYED youtube media item', () =&gt; {
        const state = { mediaId: 'mocked', media: {}};
        const actual = player(state, { type: PLAY, payload: YoutubeMediaMock });
        const expected = state;
        expect(actual.mediaId).toBe(YoutubeMediaMock.id.videoId);
    });

    it('should toggle visibility of the player', () =&gt; {
        const state = { mediaId: 'mocked', showPlayer: false;
        const actual = player(state, { type: TOGGLE_PLAYER, payload: true });
        const expected = state;
        expect(actual.showPlayer).toBe(expected.showPlayer);
    });
});</pre>

## Connecting the Reducer To A Component

Now, we need to use this reducer in Echoes Player. For that, I created a youtube player component. It should play a youtube media when it&#8217;s picked and display the played media title in the bottom bar.

The youtube-player component, registers to the youtube-player store in the constructor function and updates its player property whenever an action of this reducer is performed. This action lets the player display the title of the currently played media:

<pre class="lang:js decode:true">import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { NgModel, NgClass } from '@angular/common'
import { Observable } from 'rxjs/Observable';
import { YoutubePlayerService } from '../core/services/youtube-player.service';

@Component({
	selector: 'youtube-player',
	template: require('./youtube-player.html'),
	directives: [NgModel, NgClass]
})
export class YoutubePlayer {
	player: any;

	constructor(public playerService: YoutubePlayerService) {
		playerService.player$.subscribe((player) =&gt; this.player = player);
	}

	ngOnInit(){}

	playVideo () {
		this.playerService.play();
	}

	isPlaying () {
		return this.playerService.isPlaying();
	}

	pauseVideo () {
		this.playerService.pause();
	}

	togglePlayer () {
		this.playerService.togglePlayer();
	}
}</pre>

Notice How I use the &#8220;**subscribe**&#8221; (this is **rxjs** method) method in order to register to a change in the player store, which will eventually, will render the media title to the youtube player template. Within this callback function, I can also instruct the player to either play/pause/queue &#8211; however, currently, the &#8220;**player**&#8221; store structure doesn&#8217;t have a property for &#8220;**player.state**&#8221; &#8211; I&#8217;m still not sure that this is the correct way to achieve this and still investigating this practice. If you have any idea/suggestion &#8211; please let me know (in this article comments, the <a href="http://orizens.com/wp/contact" target="_blank">contact page</a> or the <a href="http://github.com/orizens/echoes-ng2" target="_blank">github repository</a>).

The &#8220;**playerService**&#8221; is a service to interact with the youtube player instance (3rd party module). In order to instruct the player to play a certain media from the video thumbs list, the &#8220;**youtube-videos**&#8221; component invokes the &#8220;**playVideo**&#8221; method of this service. This method (&#8220;**playVideo**&#8220;) also dispatches the action &#8220;**PLAY**&#8221; and updates the &#8220;**player**&#8221; state:

file: **src/app/youtube-videos/youtube-videos.ts**

<pre class="lang:default decode:true">playSelectedVideo(media) {
	this.youtubePlayer.playVideo(media);
}</pre>

The &#8220;**playVideo()**&#8221; method in the youtube-player service plays the video through the youtube player api and updates the store:

<pre class="lang:default decode:true ">playVideo(media: GoogleApiYouTubeSearchResource) {
	this.player.loadVideoById(media.id.videoId);
	this.play();
	this.store.dispatch({ type: PLAY, payload: media });
}</pre>

Using this method, I&#8217;m just updating the current state of the player &#8211; indicating the media that is playing at the moment. I&#8217;m still looking for a way to dispatch a &#8220;**PLAY_MEDIA**&#8221; action, which will eventually, invoke the 3rd party youtube player module to play the expected media that is sent as a payload in this action.

## Final Thoughts

Here is a final screenshot of the player playing a media and displaying it&#8217;s title:

<img class="alignleft size-large wp-image-959" src=".../../img/uploads/2016/02/Screen-Shot-2016-02-29-at-5.34.35-PM-1024x640.png" alt="Screen Shot 2016-02-29 at 5.34.35 PM" width="697" height="436" srcset=".../../img/uploads/2016/02/Screen-Shot-2016-02-29-at-5.34.35-PM-1024x640.png 1024w, .../../img/uploads/2016/02/Screen-Shot-2016-02-29-at-5.34.35-PM-300x188.png 300w, .../../img/uploads/2016/02/Screen-Shot-2016-02-29-at-5.34.35-PM-768x480.png 768w" sizes="(max-width: 697px) 100vw, 697px" />

&nbsp;

There&#8217;s still a lot more to rxjs that can be explored. I just touch the surface of it in this post.

As always, this post&#8217;s specific code is <a href="https://github.com/orizens/echoes-ng2/tree/28992dbf1685988bde4e3b38319714849cda9ad2" target="_blank">available on github</a>, the rest of the most latest code of <a href="http://github.com/orizens/echoes-ng2" target="_blank">Echoes Player is on the master branch</a>.