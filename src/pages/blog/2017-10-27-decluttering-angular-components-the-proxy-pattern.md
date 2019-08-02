---
id: 1276
title: 'Decluttering Angular Components: The Proxy Pattern'
date: 2017-10-27T18:30:35+00:00
author: Oren Farhi 
templateKey: blog-post
layout: post
guid: http://orizens.com/wp/?p=1276
permalink: /topics/decluttering-angular-components-the-proxy-pattern/
post_grid_post_settings:
  - 'a:10:{s:9:"post_skin";s:4:"flat";s:19:"custom_thumb_source";s:93:"./img/plugins/post-grid/assets/frontend/css/images/placeholder.png";s:17:"font_awesome_icon";s:0:"";s:23:"font_awesome_icon_color";s:7:"#737272";s:22:"font_awesome_icon_size";s:4:"50px";s:17:"custom_youtube_id";s:0:"";s:15:"custom_vimeo_id";s:0:"";s:21:"custom_dailymotion_id";s:0:"";s:14:"custom_mp3_url";s:0:"";s:20:"custom_soundcloud_id";s:0:"";}'
dsq_thread_id:
  - "6245641675"
image: ../../img/uploads/2017/10/IMG_20170813_124752-01.jpeg
categories:
  - Angular
  - architecture
  - ngrx
tags:
  - angular2
  - architecture
  - ngrx
  - typescript
---
I like to write clear and maintainable code. To be honest - sometimes I just don't. However, I always look for how to make the code that I write to be better. While developing and enhancing my [open source media player](http://github.com/orizens/echoes-player), [Echoes Player](http://echoesplayer.com), I tend to look again at the code and think of how to make it better in terms of being reusable, clearer and maintainable. The project is build with Angular and NgRx as a state management. In contrary to examples you can find in articles about Angular and NgRx, I chose to use a similar approach of the <a href="https://en.wikipedia.org/wiki/Proxy_pattern" target="_blank" rel="noopener">Proxy Pattern</a> to make components and state management less verbose.

<!--more-->

## The Problem: Verbose Code For Components

Often, in code examples for component around the web, services and store are injected via the constructor.

```typescript
@Component({
  selector: 'playlist-view'
  // ... more code truncated
})
export class PlaylistViewComponent implements OnInit {
  nowPlaylist$ = this.store.let(NowPlaylist.getNowPlaylist$);
  
  constructor(
    public store: Store<EchoesState>, 
    private nowPlaylistActions: NowPlaylist.NowPlaylistActions,
    private nowPlaylistService: NowPlaylistService,
    private appPlayerService: AppPlayerService,
    private route: ActivatedRoute,
  ) { }
}
```

The above code is a snippet of the "**playlist-view**" component of Echoes Player. This component purpose is to display a YouTube playlist items and more metadata. A user can play or queue the whole playlist as well as play or queue specific media items.

The injection in this component's constructor is quite verbose:

  1. The **Store** is injected in order to connect the "nowPlaylist" store to this component,
  2. The **NowPlaylistActions** is injected to allow playlist related functionality: queue, play etc.
  3. The **appPlayerService** is injected to allow interaction with the player's api
  4. the **nowPlaylistService** is injected to allow youtube playlist related api calls
  5. the **ActivatedRoute** is for fetching resolved playlist data

That's a lot!

Imagine setting up a test for this component - all of these injections should be mocked or supplied for this component to function correctly. Some of these services include observables & http requests.

Also, the components has to know the Store implementation to interact with the state layer. It also has to interact with few services and be familiar with its internals.

## The Solution: A Proxy to declutter

The Proxy design pattern was suggested to solve recurring design problems and add reusable objects that can be:

  1. easy to test
  2. easy to change
  3. easy to reuse

There are more problems this design pattern may solve - the benefits come with the design and we'll discuss them soon.

Considering the original design of this component, this component should do the following:

  1. Display the Playlist meta data
  2. Display the Playlist's tracks
  3. Indicate which tracks are already queued to the now playlist
  4. Allow to play/queue a playlist
  5. Allow to play/queue a specific track

The above list is the actual public api that this component expose to its template. With this in mind,  we can create a proxy object that includes each of these items and this proxy will be injected to the component.

Lets walkthrough the final implementation that includes the proxy for the playlist component:

```typescript
@Component({
  selector: 'playlist-view',
  styleUrls: ['./playlist-view.component.scss'],
  template: `
  <article>
    <app-navbar [header]="header$ | async"></app-navbar>
    <div class="row">
      <playlist-viewer class="clearfix"
        [videos]="videos$ | async"
        [ playlist ]="playlist$ | async"
        [queuedPlaylist]="nowPlaylist$ | async"
        ...
      ></playlist-viewer>
    </div>
  </article>
  `
})
export class PlaylistViewComponent implements OnInit {
  playlist$ = this.playlistProxy.fetchPlaylist(this.route);
  videos$ = this.playlistProxy.fetchPlaylistVideos(this.route);
  header$ = this.playlistProxy.fetchPlaylistHeader(this.route);
  nowPlaylist$ = this.playlistProxy.nowPlaylist$;

  constructor(private playlistProxy: PlaylistProxy, private route: ActivatedRoute) {}
  // ...
}
```

Notice how the constructor injects the PlaylistProxy and the ActivatedRoute only. This makes it easier to test this component and mock only these (even the route in the case shouldn't be too hard to mock). We need to mock the route with  "**RouterTestingModule**" and the proxy with the mocked "**playlistProxySpy**":

```typescript
TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        { provide: PlaylistProxy, useValue: playlistProxySpy },
        PlaylistViewComponent
      ]
});
```

Next, on top of the constructor (these statements are actually syntactic sugar and run inside the constructor) are the display properties that this component use in its template.

Each property is an observable and they are all fetched from the proxy object - meaning, this component takes the state from the proxy object only and doesn't rely on a specific implementation (aside from using observables a state mechanism).

Next, these class methods are the public api that this component expose to the template:

```typescript
@Component({
  selector: 'playlist-view',
  styleUrls: ['./playlist-view.component.scss'],
  template: `
  <article>
    <app-navbar [header]="header$ | async"></app-navbar>
    <div class="row">
      <playlist-viewer class="clearfix"
        ...
        (playPlaylist)="playPlaylist($event)"
        (queuePlaylist)="queuePlaylist($event)"
        (playVideo)="playVideo($event)"
        (queueVideo)="queueVideo($event)"
        (unqueueVideo)="unqueueVideo($event)"
      ></playlist-viewer>
    </div>
  </article>
  `
})
export class PlaylistViewComponent implements OnInit {
  //....
  constructor(private playlistProxy: PlaylistProxy, private route: ActivatedRoute) {}

  playPlaylist(playlist: GoogleApiYouTubePlaylistResource) {
    this.playlistProxy.playPlaylist(playlist);
  }

  queuePlaylist(playlist: GoogleApiYouTubePlaylistResource) {
    this.playlistProxy.queuePlaylist(playlist);
  }

  queueVideo(media: GoogleApiYouTubeVideoResource) {
    this.playlistProxy.queueVideo(media);
  }

  playVideo(media: GoogleApiYouTubeVideoResource) {
    this.playlistProxy.playVideo(media);
  }

  unqueueVideo(media: GoogleApiYouTubeVideoResource) {
    this.playlistProxy.unqueueVideo(media);
  }
}
```

Each method of this component delegates to the relevant function inside the PlaylistProxy. Testing these methods is quite easy and mocking these is simply achieved using jasmine's "**createSpyObj**":

```typescript
playlistProxySpy = jasmine.createSpyObj('playlistProxySpy', [
      'playPlaylist',
      'queuePlaylist',
      'playVideo',
      'queueVideo',
      'fetchPlaylist',
      'fetchPlaylistVideos',
      'fetchPlaylistHeader'
]);
```

With this spy we can easily check whether function was invoke, which parameters were passed and more.

## Beyond: The Proxy to the app's proxies

The Proxy pattern goes beyond a single component. The same pattern (problem) carries through to the entire app - the "**NowPlaylistService**", the "**AppPlayerService**" and other services are in use in several components around the application.

I.e, the "**playVideo**" functionality is a core action in Echoes Player. The method used in the playlistProxy eventually dispatch two actions:

```typescript
playVideo(media: GoogleApiYouTubeVideoResource) {
    this.store.dispatch(new AppPlayer.LoadAndPlay(media));
    this.store.dispatch(new NowPlaylist.SelectVideo(media));
}
```

This method relies on the store implementation to make a video play. To reuse these lines across the application, there could be few solutions:

  1. Expose the "**PlaylistProxy**" as an application wide service
  2. Create a dedicated "**AppPlayer**" proxy (selected)

Since the "**PlaylistView**" is a feature module I chose to go with the second approach.

Similar to server-client approach, where client request data from the server using an api - "**/api/playlist/41da6521fdafs41**" - I decided to create an app wide "**AppPlayerApi**". All calls related to interact with the app player actions should use this api and not interact directly with the store. Again, this allows the code that handles these to be reused and managed in once object.

With this in mind, i'm introducing the proxy pattern as another layer for exposing the app's services to feature modules - while consuming it via a feature's proxy.

This is a snippet of the final implementation for the PlaylistProxy:

```typescript
// ... code truncated

@Injectable()
export class PlaylistProxy {
  nowPlaylist$ = this.store.let(getPlaylistVideos$);

  constructor(
    public store: Store<EchoesState>,
    private appPlayerApi: AppPlayerApi,
  ) { }

  // ... code truncated

  fetchPlaylistVideos(route: ActivatedRoute) {
    return this.toRouteData(route)
      .map((data: PlaylistData) => data.videos);
  }

  playPlaylist (playlist: GoogleApiYouTubePlaylistResource) {
    this.appPlayerApi.playPlaylist(playlist);
  }

  // ... code truncated

  playVideo(media: GoogleApiYouTubeVideoResource) {
    this.appPlayerApi.playVideo(media);
  }

  unqueueVideo(media: GoogleApiYouTubeVideoResource) {
    this.appPlayerApi.removeVideoFromPlaylist(media);
  }
}

```

## What's Next? Proxy The Store

Using this proxy approach promotes towards a reusable design for services and apis uses across the application.

This pattern may not solve other problems, however, it does instruct to think [**DRY**](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) and organize code in a way that makes sense and intuitive to use and search for.

This pattern can be similarly used for the "**Store**" layer - which benefits in not relying on a specific store implementation and also make it easier to test and mock the State layer.

I.e, instead of injecting the "**Store**" and selecting a certain slice using ngrx as in:

```typescript
export class PlaylistProxy {
  nowPlaylist$ = this.store.let(getPlaylistVideos$);

  constructor(
    public store: Store<EchoesState>,
    private appPlayerApi: AppPlayerApi,
  ) { }
  // ...
}
```

An AppStoreApi (Proxy) can be used instead, making the store agnostic to implementation and also easier to test:

```typescript
export class PlaylistProxy {
  nowPlaylist$ = this.store.getPlaylistVideos();

  constructor(
    public store: AppStoreApi,
    private appPlayerApi: AppPlayerApi,
  ) { }
  //..
}
```

Again, the code expects the store to rely on observable data structure and that's fine by me. However, this is an idea i'm still considering and still testing the benefits outcome of it.

You can view the full source code in [echoes player github repository](https://github.com/orizens/echoes-player/tree/master/src/app/containers/playlist-view).

&nbsp;

&nbsp;

&nbsp;