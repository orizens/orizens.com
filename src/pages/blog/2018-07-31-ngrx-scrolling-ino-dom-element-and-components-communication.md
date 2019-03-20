---
id: 1352
title: 'Ngrx, Scrolling Into DOM Elements & Components Communication'
date: 2018-07-31T04:09:35+00:00
author: Oren Farhi
templateKey: blog-post
layout: post
guid: http://orizens.com/wp/?p=1352
permalink: /topics/ngrx-scrolling-ino-dom-element-and-components-communication/
post_grid_post_settings:
  - 'a:10:{s:9:"post_skin";s:4:"flat";s:19:"custom_thumb_source";s:93:"./img/plugins/post-grid/assets/frontend/css/images/placeholder.png";s:17:"font_awesome_icon";s:0:"";s:23:"font_awesome_icon_color";s:7:"#737272";s:22:"font_awesome_icon_size";s:4:"50px";s:17:"custom_youtube_id";s:0:"";s:15:"custom_vimeo_id";s:0:"";s:21:"custom_dailymotion_id";s:0:"";s:14:"custom_mp3_url";s:0:"";s:20:"custom_soundcloud_id";s:0:"";}'
dsq_thread_id:
  - '6826788041'
image: ../../img/uploads/2018/07/scroll-post.jpg
categories:
  - Angular
  - architecture
  - ngrx
tags:
  - angular2
  - architecture
---

My open source app, [Echoes Player](http://github.com/orizens/echoes-player), allows to consume and create a &#8220;now&#8221; playlist &#8211; where you can queue media to the playlist that is currently playing. A somewhat not too visible feature in [Echoes](http://echoesplayer.com) is the ability to &#8220;reveal&#8221; the now playing track in the playlist. This article shows how I integrated ngrx, angular&#8217;s ng-for and the DOM&#8217;s scrollTo feature to support the functionality for this feature.<!--more-->

## Now Playlist &#8220;Reveal&#8221; Feature

As a consumer of Echoes Player, I have found it useful to find the active now playing media in the &#8220;now playlist&#8221; component.

Interacting with DOM in Angular is usually achieved with the &#8220;Renderer2&#8221; service &#8211; that is considered to be one of the best practices, exposing one solid api to interact with the view &#8211; let it be DOM or other.

The &#8220;reveal&#8221; functionality is tied to the &#8220;NOW PLAYING&#8221; title, above the list of all tracks (where it also indicate the amount of total tracks in the current playlist&#8221;. An active track is marked with a colored right border &#8211; depending on the applied theme &#8211; this color is matched to the primary color (blue, orange or yellow).

Simply put &#8211; Clicking this title will scroll the playlist to the active track (when possible).

## Now Playlist Store State

The now playlist state is a rather simple map which includes a list of media tracks, a filter string, a boolean repeat flag and the a string of the active media (selectedId).

```typescript
export interface INowPlaylist {
  videos: GoogleApiYouTubeVideoResource[];
  selectedId: string;
  filter: string;
  repeat: boolean;
}

const initialState: INowPlaylist = {
  videos: [],
  selectedId: '',
  filter: '',
  repeat: false
};
```

The reveal feature is using the &#8220;selectedId&#8221; and the list of videos to determine which DOM element it refers to.

## Now Playing Component

The &#8220;Now **Playlist**&#8221; component is a component of the &#8220;Now **Playing**&#8221; component. The &#8220;now-playlist&#8221; should get the entire &#8220;nowPlaylist&#8221; state from the store, as it needs the list of tracks and the selectedId for the reveal feature.

**BONUS** **info**: The &#8220;now-playlist-filter&#8221; also gets the &#8220;nowPlaylist&#8221; state &#8211; and so &#8211; this is a nice example which shows how these two separate components are operating on the same source of data, and manipulate it (by dispatching actions to the store) accordingly, thus, communicating via this data.

```typescript
@Component({
  selector: 'now-playing',
  styleUrls: ['./now-playing.scss'],
  template: `
  &lt;div class="sidebar-pane"&gt;
    &lt;now-playlist-filter
      [ playlist ]="nowPlaylist$ | async"
      (clear)="clearPlaylist()"
      (filter)="updateFilter($event)"
      (reset)="resetFilter()"
      (headerClick)="onHeaderClick()"
    &gt;&lt;/now-playlist-filter&gt;
    &lt;now-playlist
      [ playlist ]="nowPlaylist$ | async"
      (select)="selectVideo($event)"
      (selectTrack)="selectTrackInVideo($event)"
      (remove)="removeVideo($event)"
    &gt;&lt;/now-playlist&gt;
  &lt;/div&gt;
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
```

The &#8220;now playlist&#8221; component is responsible for rendering the list of tracks (filtered if there&#8217;s any filter), mark the current playing track. It is a presentation component, defined with an &#8220;OnPush&#8221; strategy for its change detection.

The &#8220;**scrollToActiveTrack**()&#8221; method is responsible for scrolling the container to the currently active track. The activeTrackElement property is a pointer to the active track as a DOM element. This DOM element is saved into this property when the list is rendered. I decided to save a pointer to this element during the the phase where it is rendered &#8211; the &#8220;**isActiveMedia**()&#8221; method is invoked for each track &#8211; and it gets the media id and its associated DOM element via an angular template reference achieved with &#8220;#playlistTrack&#8221;.

```typescript
@Component({
  selector: 'now-playlist',
  animations: [flyOut],
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./now-playlist.scss'],
  template: `
  &lt;section class="now-playlist ux-maker"&gt;
    &lt;ul class="nav nav-list ux-maker nicer-ux"&gt;
      &lt;li class="now-playlist-track" #playlistTrack
        [ngClass]="{
          'active': isActiveMedia(video.id, playlistTrack)
        }"
        *ngFor="let video of playlist.videos | search:playlist.filter; let index = index"
        [@flyOut]&gt;
        &lt;now-playlist-track
          [ video ]="video"
          [ index ]="index"
          (remove)="removeVideo($event)"
          (select)="selectVideo(video)"
          (selectTrack)="selectTrackInVideo($event)"
        &gt;&lt;/now-playlist-track&gt;
      &lt;/li&gt;
    &lt;/ul&gt;
  &lt;/section&gt;
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NowPlaylistComponent implements OnChanges, AfterViewChecked {
  @Input() playlist: NowPlaylist.INowPlaylist;
  @Output() select = new EventEmitter&lt;GoogleApiYouTubeVideoResource&gt;();
  @Output()
  selectTrack = new EventEmitter&lt;{
    time: string;
    media: GoogleApiYouTubeVideoResource;
  }&gt;();
  @Output() remove = new EventEmitter&lt;GoogleApiYouTubeVideoResource&gt;();

  public activeTrackElement: HTMLUListElement;
  public hasActiveChanged = false;

  constructor(public zone: NgZone) { }

  ngAfterViewChecked() {
    if (this.hasActiveChanged && this.activeTrackElement) {
      this.zone.runOutsideAngular(() =&gt; this.scrollToActiveTrack());
    }
  }

  ngOnChanges({ activeId }: SimpleChanges) {
    if (activeId) {
      this.hasActiveChanged = isNewChange(activeId);
    }
  }

  scrollToActiveTrack() {
    if (this.activeTrackElement) {
      this.activeTrackElement.scrollIntoView();
    }
  }

  selectVideo(media: GoogleApiYouTubeVideoResource) {
    this.select.emit(media);
  }

  removeVideo(media: GoogleApiYouTubeVideoResource) {
    this.remove.emit(media);
  }

  isActiveMedia(mediaId: string, trackElement: HTMLUListElement) {
    const isActive = this.playlist.selectedId === mediaId;
    if (isActive) {
      this.activeTrackElement = trackElement;
    }
    return isActive;
  }

  selectTrackInVideo(trackEvent: { time; media }) {
    this.selectTrack.emit(trackEvent);
  }
}
```

## Scrolling To The Active Track

There are 2 possible scenarios where the &#8220;scrollToActiveTrack()&#8221; method is used.

<div>
  <h3>
    1) AfterViewChecked Component Life Cycle
  </h3>
  
  <pre class="lang:default decode:true ">ngAfterViewChecked() {
    if (this.hasActiveChanged && this.activeTrackElement) {
      this.zone.runOutsideAngular(() =&gt; this.scrollToActiveTrack());
    }
  }
</pre>
  
  <p>
    When the active media is changed via the now playlist store, the &#8220;<strong>selectedId</strong>&#8221; is updated, thus triggering a change detection down to the &#8220;now playlist component&#8221;, which is the, renders the component and updates the active media in view.
  </p>
  
  <p>
    This strategy is mostly useful for an initial render and for the &#8220;<strong>selectedId</strong>&#8221; is updated within the store. It was also used to trigger a scroll automatically when the next track is activated, however, ux wise, it didn&#8217;t feel right and was a little bit annoying &#8211; so I decided to disable it for the time being. Nevertheless, it&#8217;s a nice example which demonstrates using <a href="https://github.com/ngrx/platform/blob/master/docs/store/README.md"><strong>ngrx</strong> store</a> with auto scrolling dom elements.
  </p>
  
  <p>
    To optimize performance further, other <a href="https://angular.io/guide/lifecycle-hooks">component&#8217;s life cycle hooks</a> can be used for initial render only.
  </p>
  
  <h3>
    2) Using @ViewChild Decorator with Component instance method from parent component
  </h3>
</div>

This strategy demonstrates the usage of accessing a component&#8217;s public methods, thus manipulating it directly. This can be considered a tightly coupled architecture, however, for the purpose of this feature &#8211; it achieves a nice effect easily and can be disabled without affecting the robustness of the app.

This strategy is used inside the &#8220;now playing&#8221; component. The component queries the &#8220;now playlist&#8221; component with &#8220;**@ViewChild**&#8221; decorator, thus, saving a reference to the component&#8217;s instance within the &#8220;nowPlaylistComponent&#8221; property.

Now, whenever the &#8220;**onHeaderClick**()&#8221; method is invoked in response to the &#8220;now-playlist-filter&#8221; component event, the &#8220;**nowPlaylistComponent.scrollToActiveTrack**()&#8221; method is invoked directly, scrolling the playlist to the active track element.

```typescript
export class NowPlayingComponent implements OnInit {
  public nowPlaylist$: Observable&lt;INowPlaylist&gt;;
  @ViewChild(NowPlaylistComponent) nowPlaylistComponent: NowPlaylistComponent;

  constructor(public store: Store&lt;EchoesState&gt;, public nowPlaylistService: NowPlaylistService) { }

  // ...removed code
  onHeaderClick() {
    this.nowPlaylistComponent.scrollToActiveTrack();
  }
}
```

The benefit of using this strategy is by not triggering any re-render inside the &#8220;now-playlist&#8221; component &#8211; and just using the DOM&#8217;s api.

## Summary: Putting It All Together

The &#8220;**now playing**&#8221; feature is a nice component featuring few key concepts that can be achieved with Angular and ngrx:

1. using **state management** with **ngrx**
2. **sharing state** between components &#8211; using the &#8220;now playlist&#8221; state &#8211; sharing the &#8220;playlist&#8221; and &#8220;filter&#8221;
3. **communicating** between **components** &#8211; using a wrapper component (now playlist)
4. leveraging **@ViewChild** to be able to **interact** with a component&#8217;s public interface, eventually interacting with **DOM** only api&#8217;s

Those concepts can be further enhanced and achieved differently using other strategies. I always look for doing [things simpler](http://orizens.com/wp/topics/lessons-learned-from-creating-a-typeahead-with-rxjs-and-angular-2/) or rather different, as long as it feels intuitive, fits the [code architecture](http://orizens.com/wp/topics/decluttering-angular-components-the-proxy-pattern/) used for the app and follow best practices for creating robust code.

Echoes Player is an open source project and [entire code is available](http://github.com/orizens/echoes-player) (feel free to fork, open pull requests and suggest features) as well using the actual app at <http://echoesplayer.com>.

If you like this article or in need for an advice for your Front End Development project, reach me out via the [contact page](http://orizens.com/contact) or get a quote free of charge through one of [consulting packages](http://orizens.com/services) i&#8217;m offering as part of my services (or click on one of them on the right, if you&#8217;re using a desktop/laptop).
