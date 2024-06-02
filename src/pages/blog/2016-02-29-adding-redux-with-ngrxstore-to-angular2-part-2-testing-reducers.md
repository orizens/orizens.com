---
id: 956
title: 'Adding Redux with NgRx/store to Angular (2+) - Part 2 (Testing Reducers)'
pubDate: 2016-02-29T15:38:56+00:00
author: Oren Farhi 
# templateKey: blog-post
layout: '@/templates/BasePost.astro'
# guidhttp://orizens.com/wp/?p=956
# permalink: /blog/adding-redux-with-ngrxstore-to-angular2-part-2-testing-reducers/
dsq_thread_id:
  - "4621939384"
imgSrc: /images/blog/2016/02/ngrxpart2.jpg
tags:
  - angular2
  - ngrx
  - typescript
---
In my <a href="http://orizens.com/wp/blog/adding-redux-with-ngrxstore-to-angular-2-part-1/" target="_blank">recent article about adding redux with ngrx/store to angular2</a>, I showed a nice example of integrating this awesome state management library to my <a href="http://github.com/orizens/echoes" target="_blank">open source project</a> <a href="http://echoesplayer.netlify.app" target="_blank">Echoes Player</a>. Since then, I really wanted to integrate youtube player into <a href="http://github.com/orizens/echoes-ng2" target="_blank">this angular2 version</a>. In this post, I'm sharing my insights on achieving using ngrx/store, working with more than one reducer in angular2 and testing reducers as well.<!--more-->

## Creating a Youtube Player Reducer

First, I defined and created a reducer for the youtube player in Echoes. This approach of defining first the reducer helps me to design what data the app needs for this feature and how I'd like to use it.

At First, I defined the actions for this player's reducer:

```typescript
import {Reducer, Action} from '@ngrx/store';

export const PLAY = 'PLAY';
export const QUEUE = 'REMOVE';
export const TOGGLE_PLAYER = 'TOGGLE_PLAYER';
```

Now, I chose to define the data structure of the player as well as the initial state that I want it to be when the app starts:

```typescript
let initialPlayerState = {
    mediaId: 'NONE',
    index: 0,
    media: {
        snippet: { title: 'No Media Yet' }
    },
    showPlayer: true
}
```

Similar to the previously "**videos**" reducer (from my <a href="http://orizens.com/wp/blog/adding-redux-with-ngrxstore-to-angular-2-part-1/" target="_blank">last article about ngrx/store</a>), I defined a reducer for the player. It is a pure function that expects to get a state object and an **Action** object. The action object will always include an "**action.type**" of this action. It can also include an "action.payload" if the action suppose to pass data.

For better readability and perhaps easier maintenance, I like to keep the creation of a new state in small functions, which I can test as well. Those are the "**playVideo**" and "**toggleVisibility**" functions. Remember - a reducer should return a new state and shouldn't mutate the old state object.

All in all, the "**player**" reducer function can also be tested (which is described later in this article):

```typescript
export const player: Reducer<any> = (state: Object = initialPlayerState, action: Action) => {

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
}
```

## Testing Reducers in Ngrx/store and Angular2

I've written before that I like to write tests. Testing reducers turned out to be quite simple - a reducer is a function that gets an input and should always return an output. Lets see how we can test the new player reducer.

First, we need to setup the relevant testing utils that we're going to use - using jasmine for testing:

```typescript
import {
  it,
  inject,
  injectAsync,
  describe,
  expect,
  beforeEachProviders,
  TestComponentBuilder
} from 'angular2/testing';

```

Next, we should import the relevant reducer, its actions and a mock file that i'm going to use in the tests:

```typescript
import { player } from './youtube-player';
import { PLAY, QUEUE, TOGGLE_PLAYER } from './youtube-player';
import { YoutubeMediaMock } from '../../../../test/mocks/youtube.media.item';
```

The actual tests ("**it**" functions) invoke the "**player**" reducer function, each time with a different action, payload (which is optional) and then, asserts the expected result.

I could check these operations manually inside the browser, but - Testing is fun - someone is doing it for me :).

```typescript
describe('The Youtube Player reducer', () => {
    it('should return current state when no valid actions have been made', () => {
        const state = { mediaId: 'mocked...' };
        const actual = player(state, {type: 'INVALID_ACTION', payload: {}});
        const expected = state;
        expect(actual).toBe(expected);
    });

    it('should set the new media id by the new PLAYED youtube media item', () => {
        const state = { mediaId: 'mocked', media: {}};
        const actual = player(state, { type: PLAY, payload: YoutubeMediaMock });
        const expected = state;
        expect(actual.mediaId).toBe(YoutubeMediaMock.id.videoId);
    });

    it('should toggle visibility of the player', () => {
        const state = { mediaId: 'mocked', showPlayer: false;
        const actual = player(state, { type: TOGGLE_PLAYER, payload: true });
        const expected = state;
        expect(actual.showPlayer).toBe(expected.showPlayer);
    });
});
```

## Connecting the Reducer To A Component

Now, we need to use this reducer in Echoes Player. For that, I created a youtube player component. It should play a youtube media when it's picked and display the played media title in the bottom bar.

The youtube-player component, registers to the youtube-player store in the constructor function and updates its player property whenever an action of this reducer is performed. This action lets the player display the title of the currently played media:

```typescript
import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
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
		playerService.player$.subscribe((player) => this.player = player);
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
}
```

Notice How I use the "**subscribe**" (this is **rxjs** method) method in order to register to a change in the player store, which will eventually, will render the media title to the youtube player template. Within this callback function, I can also instruct the player to either play/pause/queue - however, currently, the "**player**" store structure doesn't have a property for "**player.state**" - I'm still not sure that this is the correct way to achieve this and still investigating this practice. If you have any idea/suggestion - please let me know (in this article comments, the <a href="http://orizens.com/wp/contact" target="_blank">contact page</a> or the <a href="http://github.com/orizens/echoes-ng2" target="_blank">github repository</a>).

The "**playerService**" is a service to interact with the youtube player instance (3rd party module). In order to instruct the player to play a certain media from the video thumbs list, the "**youtube-videos**" component invokes the "**playVideo**" method of this service. This method ("**playVideo**") also dispatches the action "**PLAY**" and updates the "**player**" state:

file: **src/app/youtube-videos/youtube-videos.ts**

```typescript
playSelectedVideo(media) {
	this.youtubePlayer.playVideo(media);
}
```

The "**playVideo()**" method in the youtube-player service plays the video through the youtube player api and updates the store:

```typescript
playVideo(media: GoogleApiYouTubeSearchResource) {
	this.player.loadVideoById(media.id.videoId);
	this.play();
	this.store.dispatch({ type: PLAY, payload: media });
}
```

Using this method, I'm just updating the current state of the player - indicating the media that is playing at the moment. I'm still looking for a way to dispatch a "**PLAY_MEDIA**" action, which will eventually, invoke the 3rd party youtube player module to play the expected media that is sent as a payload in this action.

## Final Thoughts

Here is a final screenshot of the player playing a media and displaying it's title:

<img class="alignleft size-large wp-image-959" src="...//images/blog/2016/02/Screen-Shot-2016-02-29-at-5.34.35-PM-1024x640.png" alt="Screen Shot 2016-02-29 at 5.34.35 PM" width="697" height="436" srcset="...//images/blog/2016/02/Screen-Shot-2016-02-29-at-5.34.35-PM-1024x640.png 1024w, ...//images/blog/2016/02/Screen-Shot-2016-02-29-at-5.34.35-PM-300x188.png 300w, ...//images/blog/2016/02/Screen-Shot-2016-02-29-at-5.34.35-PM-768x480.png 768w" sizes="(max-width: 697px) 100vw, 697px" />

&nbsp;

There's still a lot more to rxjs that can be explored. I just touch the surface of it in this post.

As always, this post's specific code is <a href="https://github.com/orizens/echoes-ng2/tree/28992dbf1685988bde4e3b38319714849cda9ad2" target="_blank">available on github</a>, the rest of the most latest code of <a href="http://github.com/orizens/echoes-ng2" target="_blank">Echoes Player is on the master branch</a>.