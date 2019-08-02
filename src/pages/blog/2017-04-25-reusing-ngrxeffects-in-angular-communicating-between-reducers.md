---
id: 1246
title: Reusing ngrx/effects in Angular (communicating between reducers)
date: 2017-04-25T09:17:09+00:00
author: Oren Farhi 
templateKey: blog-post
layout: post
guid: http://orizens.com/wp/?p=1246
permalink: /topics/reusing-ngrxeffects-in-angular-communicating-between-reducers/
post_grid_post_settings:
  - 'a:10:{s:9:"post_skin";s:4:"flat";s:19:"custom_thumb_source";s:93:"./img/plugins/post-grid/assets/frontend/css/images/placeholder.png";s:17:"font_awesome_icon";s:0:"";s:23:"font_awesome_icon_color";s:7:"#737272";s:22:"font_awesome_icon_size";s:4:"50px";s:17:"custom_youtube_id";s:0:"";s:15:"custom_vimeo_id";s:0:"";s:21:"custom_dailymotion_id";s:0:"";s:14:"custom_mp3_url";s:0:"";s:20:"custom_soundcloud_id";s:0:"";}'
dsq_thread_id:
  - "5757320729"
image: ../../img/uploads/2017/04/effects-reuse.jpg
categories:
  - Angular
  - ngrx
  - ngrx-effects
  - open source
tags:
  - angular2
  - ngrx
---
After upgrading my <a href="http://github.com/orizens/echoes-player" target="_blank" rel="noopener noreferrer">open source project</a>, &#8220;<a href="http://echoesplayer.com" target="_blank" rel="noopener noreferrer">Echoes Player</a>&#8220;, to work with the latest stable angular-cli 1.0 version (<a href="http://orizens.com/wp/topics/guidelines-for-developing-with-angular-ngrxstore-ngrxeffects-aot/" target="_blank" rel="noopener noreferrer">wrote an article about it</a>), I set down to refactor the application's code. I always like to look at implementations few times and experiment with several approaches. This time, I wanted to take advantage of <a href="https://github.com/ngrx/effects" target="_blank" rel="noopener noreferrer">ngrx/effects</a> observables and understand how those can be reused. In this post I'm sharing my take on reusing ngrx/effects in order to communicate between two different reducers.<!--more-->

## Preface

The refactor of the code was done in the process of adding a &#8220;**repeat**" feature for the &#8220;Echoes Player" controls interface. Until this feature was released, the playlist in the player played the playlist repeatedly. As good as it sounds, the music never stops in &#8220;Echoes Player", however, I wanted to add the ability to choose between &#8220;party" mode (repeat) and &#8220;only once" mode. To make it clear enough: The YouTube player doesn't have a dynamic & customized playlist feature like the one in &#8220;Echoes Player".

### The Components & Service In This Scenario

I've written before about the various components, services, reducers and side effects in &#8220;Echoes Player" and I also published a <a href="https://www.amazon.com/Reactive-Programming-Angular-ngrx-Extensions/dp/1484226194/ref=sr_1_1?ie=UTF8&qid=1492519061&sr=8-1&keywords=reactive+programming+with+angular" target="_blank" rel="noopener noreferrer">book on learning reactive programming with Angular & ngrx</a>. However, these are the main components and services that take part in the sequence for loading the next track:

  1. Now-Playing Component
  2. App-Player Component (Formerly - &#8220;Youtube-Player")
  3. Reducers: 
      1. now-playlist reducer
      2. app-player reducer (formerly - &#8220;youtube-player" reducer)
  4. Effects: 
      1. now-playlist effects
      2. app-player effects (formerly - &#8220;youtube-player" effects)
  5. Services: 
      1. Youtube Player Service

## Sequence For Loading The Next Track

The scenario for loading the next track is handled by a side effect to an action. These are the steps in the sequence:

  1. YouTube player (3rd party) API fires an event when the player stops playing the media.
  2. The &#8220;YoutubePlayerService" in the app, emits a state change event with the status of &#8220;**YT.PlayerState.ENDED**&#8220;.
  3. The &#8220;AppPlayer" component, emits a &#8220;MEDIA_ENDED" action to the now-playlist reducer.
  4. The next track is selected with regards to the &#8220;repeat" settings using a side effect with the action of &#8220;**NowPlaylistActions.SELECT**" action.
  5. The last action to be fired is for playing the selected media (if selected) with the &#8220;**AppPlayerActions.PLAY**" action.

Steps 4 and 5 are resolved in two different reducers. We could inject the &#8220;AppPlayerActions" into the now-playlist effects class, however, that breaks the &#8220;<a href="https://en.wikipedia.org/wiki/Single_responsibility_principle" target="_blank" rel="noopener noreferrer">Single Responsibility Rule (SRP)</a>" for this effects class - as it supposed to serve the now-playlist actions scenarios.

The &#8220;AppPlayer" Component is responsible for emitting the &#8220;MEDIA_ENDED" event. In the code snippet below, i'm using the **youtube-player** component (another <a href="https://www.npmjs.com/package/ng2-youtube-player" target="_blank" rel="noopener noreferrer">open source component available in npm</a> that I released as a side effect of this player) custom &#8220;change()" event to update the application with the player's state:

  1. The &#8220;onPlayerChange()" action updates the player reducer with the current state of the player.
  2. the &#8220;trackEnded()" action starts the process for checking if a next track should be played in the playlist.

<pre class="lang:default decode:true ">@Component({
  selector: 'app-player',
  template: `
  &lt;section 
    [class.show-youtube-player]="(player$ | async).showPlayer"
    [class.fullscreen]="(player$ | async).isFullscreen"&gt;
    &lt;div class="yt-player ux-maker"&gt;
    ...
      &lt;youtube-player class="nicer-ux"
        (ready)="setupPlayer($event)"
        (change)="updatePlayerState($event)"
      &gt;&lt;/youtube-player&gt;
    &lt;/div&gt;
    ...
  &lt;/section&gt;
  `
})
export class AppPlayerComponent implements OnInit {

  constructor(
    private playerService: YoutubePlayerService,
    public nowPlaylistService: NowPlaylistService,
    private playerActions: AppPlayerActions,
    private store: Store&lt;EchoesState&gt;
  ) {
  }

  updatePlayerState (event) {
    this.playerService.onPlayerStateChange(event);
    if (event.data === YT.PlayerState.ENDED) {
      this.nowPlaylistService.trackEnded();
    }
  }
}</pre>

When the &#8220;repeat" feature wasn't available, playing the next track was quite easy: the player should emit a play action and take the currently selected media to be played using the Youtube Player Service. Actually, this was the previous &#8220;updatePlayerState()" code:

<pre class="lang:default decode:true ">updatePlayerState (event) {
    this.playerService.onPlayerStateChange(event);
    if (event.data === YT.PlayerState.ENDED) {
      this.nowPlaylistService.trackEnded();
      this.store.dispatch(this.playerActions.playVideo(this.nowPlaylistService.getCurrent()));
    }
}</pre>

This worked for the purpose of just keep playing the next available track. However, to support the &#8220;repeat" feature, I had to think of another way and I wanted to think in a reactive programming style while reusing code that is already written.

### Understanding the &#8220;MEDIA_ENDED" Side Effect

The &#8220;**trackEnded()**" method invoked the &#8220;MEDIA_ENDED" action. This action is handled in the &#8220;now-playlist" reducer which runs the &#8220;**selectNextOrPreviousTrack()**&#8220;. This function updates the &#8220;selectedId" property in the reducer. If &#8220;repeat" is &#8220;on" and it's the end of the playlist, the playlist should not select the first track as the new selected track to play - an empty string indicates this state.

<pre class="lang:default decode:true">function selectNextOrPreviousTrack(state: NowPlaylistInterface, filter: string): NowPlaylistInterface {
  const videosPlaylist = state.videos;
  const currentId = state.selectedId;
  const indexOfCurrentVideo = videosPlaylist.findIndex(video =&gt; currentId === video.id);
  const isCurrentLast = indexOfCurrentVideo + 1 === videosPlaylist.length;
  const nextId = isCurrentLast
    ? getNextIdForPlaylist(videosPlaylist, state.repeat, currentId)
    : selectNextIndex(videosPlaylist, currentId, filter, state.repeat);
  return Object.assign({}, state, { selectedId: nextId });
}

function getNextIdForPlaylist(videos: GoogleApiYouTubeVideoResource[], repeat: boolean, currentId: string = '') {
  let id = '';
  if (videos.length && repeat) {
    id = videos[0].id;
  }
  return id;
}</pre>

The side effect that runs after the selected media has been updated, is supposed to emit a &#8220;selectVideo" action when the right conditions exists. To achieve that, first, it takes the latest state for the selected media object. Next, the &#8220;**filter**" operator checks whether the selected media is valid for playing the video - when the playlist is over, the &#8220;selectedId" property is set to an empty string, so in this case, there would not be any valid media object to play. This means that the side effect will not emit the &#8220;selectVideo" action if the filter function result is an invalid condition for selecting the next video.

<pre class="lang:default decode:true">@Effect()
loadNextTrack$ = this.actions$
    .ofType(NowPlaylistActions.MEDIA_ENDED)
    .map(toPayload)
    .withLatestFrom(this.store.let(getSelectedMedia$))
    .filter((states: [any, GoogleApiYouTubeVideoResource]) =&gt; states[1] && states[1].hasOwnProperty('id'))
    .map((states: [any, GoogleApiYouTubeVideoResource]) =&gt; {
      return this.nowPlaylistActions.selectVideo(states[1]);
    }).share();</pre>

This sequence just selects the next video in the playlist - it doesn't play it. Now it's time to integrate the actual action which triggers the &#8220;**PLAY**" action.

### Reusing Effect & Communication Between Reducers

Lets understand the result of creating a side effect - aka - invoking the &#8220;**@Effect()**" decorator. Eventually, the &#8220;**this.actions$**" sequence returns an observable object to the &#8220;**loadNextTrack$**" property. This means that the &#8220;**loadNextTrack$**" can be subscribed with an observer.

Notice that I added the &#8220;share()" operator at the end of the Effect's sequence. As reader Brett Coffin suggested, since both the store and the following subscribe to this effect, using &#8220;share()" will create only **one** execution for both subscription rather than running the effect chain twice.

Each &#8220;**Effects**" class is an injectable service. This gives us the opportunity to inject the &#8220;**NowPlaylistEffects**" class to the constructor of the &#8220;AppPlayer" component.

<pre class="lang:default decode:true ">constructor(
    private playerService: YoutubePlayerService,
    public nowPlaylistService: NowPlaylistService,
    private playerActions: AppPlayerActions,
    private store: Store&lt;EchoesState&gt;,
    private nowPlaylistEffects: NowPlaylistEffects
  ) {
  }</pre>

Now, in the &#8220;**ngOnInit**" life cycle, the component subscribes to the &#8220;**loadNextTrack$**" side effect and triggers a &#8220;**PLAY**" action with the payload of this action - the next selected media to play. Since the side effect filters scenarios where the track is last and repeat is not on, this subscription won't be triggered. It's important to note that defining this behavior - playing video after this side effect has triggered - will always happen - so, it's important to design and define the requirement.

<pre class="lang:default decode:true">// AppPlayerComponent
ngOnInit() {
    this.nowPlaylistEffects.loadNextTrack$
      .subscribe((action) =&gt; this.playVideo(action.payload));
}
...
playVideo (media: GoogleApiYouTubeVideoResource) {
    this.store.dispatch(this.playerActions.playVideo(media));
}
</pre>

Since the &#8220;**AppPlayerComponent**" is a container component (<a href="https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0" target="_blank" rel="noopener noreferrer"><strong>SMART</strong></a>), there's no need to unsubscribe from this subscription. Otherwise, this subscription should be disposed as:

<pre class="lang:default decode:true">// AppPlayerComponent
private nowPlaylistSub: Subscription;

ngOnInit() {
    this.store.dispatch(this.playerActions.reset());
    this.nowPlaylistSub = this.nowPlaylistEffects.loadNextTrack$
      .subscribe((action) =&gt; this.playVideo(action.payload));
}

ngOnDestroy() {
    this.nowPlaylistSub.unsubscribe();
}</pre>

That sums up the reuse of the &#8220;NowPlaylist" effects and the concept of communicating between two reducers or more. &#8220;<a href="http://echoesplayer.com" target="_blank" rel="noopener noreferrer">Echoes Player</a>" is an <a href="http://github.com/orizens/echoes-player" target="_blank" rel="noopener noreferrer">open source project</a> - feel free to **suggest** better alternatives, **feature** requests and other suggestions as well.

My new book - &#8220;<a href="http://amazon.com/Reactive-Programming-Angular-ngrx-Extensions/dp/1484226194/ref=sr_1_1?ie=UTF8&qid=1492519061&sr=8-1&keywords=reactive+programming+with+angular" target="_blank" rel="noopener noreferrer">Reactive Programming With Angular & ngrx extensions</a>" - is soon to be release through <a href="http://apress.com/us/book/9781484226193" target="_blank" rel="noopener noreferrer">Apress Media</a> (expected date is June 2017). This book walks through the creation process of a liter version of Echoes while understanding the concepts of reactive programming with RxJs, Angular and ngrx extensions - ngrx/store & ngrx/effects.

If you're looking for **Angular Consulting** / **Front End Consulting** or **High Quality Javascript Development**, please consider to approach via the promotion packages below (no strings attached):

<div class="row orizens-consulting-packages">
  <div class="col-md-4">
    <a href="https://goo.gl/RJgihR" target="_blank"><img class="alignnone size-medium consulting-package" src=".../../img/uploads/2017/12/orizens.com-banners-premium-angular-consutling.png" alt="angular consulting development" /></a>
  </div>
  
  <div class="col-md-4">
    <a href="https://goo.gl/7zg4y9" target="_blank"><img class="alignnone size-medium consulting-package" src=".../../img/uploads/2017/12/orizens.com-banners-reinvented-code-with-ng-ngrx.png" alt="angular ngrx consulting" /></a>
  </div>
  
  <div class="col-md-4">
    <a href="https://goo.gl/6iAYIi" target="_blank"><img class="alignnone size-medium consulting-package" src=".../../img/uploads/2017/12/orizens.com-reactive-ngrx.png" alt="reactive programming angular ngrx cosulting packages" /></a>
  </div>
</div>