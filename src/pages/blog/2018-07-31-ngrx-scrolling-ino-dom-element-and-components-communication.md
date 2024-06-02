---
id: 1352
title: "Ngrx, Scrolling Into DOM Elements & Components Communication"
pubDate: 2018-07-31T04:09:35+00:00
author: Oren Farchi
layout: '@/templates/BasePost.astro'
# guidhttp://orizens.com/wp/?p=1352
# permalink: /blog/ngrx-scrolling-ino-dom-element-and-components-communication/
dsq_thread_id:
  - "6826788041"
imgSrc: /images/blog/uploads/2018/07/scroll-post.jpg
tags:
  - angular
  - architecture
  - ngrx
---

My open source app, [Echoes Player](http://github.com/orizens/echoes-player), allows to consume and create a "now" playlist - where you can queue media to the playlist that is currently playing. A somewhat not too visible feature in [Echoes](https://echoesplayer.netlify.app/) is the ability to "reveal" the now playing track in the playlist. This article shows how I integrated ngrx, angular's ng-for and the DOM's scrollTo feature to support the functionality for this feature.<!--more-->

## Now Playlist "Reveal" Feature

As a consumer of Echoes Player, I have found it useful to find the active now playing media in the "now playlist" component.

Interacting with DOM in Angular is usually achieved with the "Renderer2" service - that is considered to be one of the best practices, exposing one solid api to interact with the view - let it be DOM or other.

The "reveal" functionality is tied to the "NOW PLAYING" title, above the list of all tracks (where it also indicate the amount of total tracks in the current playlist". An active track is marked with a colored right border - depending on the applied theme - this color is matched to the primary color (blue, orange or yellow).

Simply put - Clicking this title will scroll the playlist to the active track (when possible).

## Now Playlist Store State

The now playlist state is a rather simple map which includes a list of media tracks, a filter string, a boolean repeat flag and the a string of the active media (selectedId).

```typescript
export interface INowPlaylist {
  videos: GoogleApiYouTubeVideoResource[]
  selectedId: string
  filter: string
  repeat: boolean
}

const initialState: INowPlaylist = {
  videos: [],
  selectedId: "",
  filter: "",
  repeat: false,
}
```

The reveal feature is using the "selectedId" and the list of videos to determine which DOM element it refers to.

## Now Playing Component

The "Now **Playlist**" component is a component of the "Now **Playing**" component. The "now-playlist" should get the entire "nowPlaylist" state from the store, as it needs the list of tracks and the selectedId for the reveal feature.

**BONUS** **info**: The "now-playlist-filter" also gets the "nowPlaylist" state - and so - this is a nice example which shows how these two separate components are operating on the same source of data, and manipulate it (by dispatching actions to the store) accordingly, thus, communicating via this data.

```typescript
@Component({
  selector: 'now-playing',
  styleUrls: ['./now-playing.scss'],
  template: `
  <div class="sidebar-pane">
    <now-playlist-filter
      [playlist]="nowPlaylist$ | async"
      (clear)="clearPlaylist()"
      (filter)="updateFilter($event)"
      (reset)="resetFilter()"
      (headerClick)="onHeaderClick()"
    ></now-playlist-filter>
    <now-playlist
      [playlist]="nowPlaylist$ | async"
      (select)="selectVideo($event)"
      (selectTrack)="selectTrackInVideo($event)"
      (remove)="removeVideo($event)"
    ></now-playlist>
  </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
```

The "now playlist" component is responsible for rendering the list of tracks (filtered if there's any filter), mark the current playing track. It is a presentation component, defined with an "OnPush" strategy for its change detection.

The "**scrollToActiveTrack**()" method is responsible for scrolling the container to the currently active track. The activeTrackElement property is a pointer to the active track as a DOM element. This DOM element is saved into this property when the list is rendered. I decided to save a pointer to this element during the the phase where it is rendered - the "**isActiveMedia**()" method is invoked for each track - and it gets the media id and its associated DOM element via an angular template reference achieved with "#playlistTrack".

```typescript
@Component({
  selector: "now-playlist",
  animations: [flyOut],
  encapsulation: ViewEncapsulation.None,
  styleUrls: ["./now-playlist.scss"],
  template: `
    <section class="now-playlist ux-maker">
      <ul class="nav nav-list ux-maker nicer-ux">
        <li
          class="now-playlist-track"
          #playlistTrack
          [ngClass]="{
            active: isActiveMedia(video.id, playlistTrack)
          }"
          *ngFor="
            let video of playlist.videos | search: playlist.filter;
            let index = index
          "
          [@flyOut]
        >
          <now-playlist-track
            [video]="video"
            [index]="index"
            (remove)="removeVideo($event)"
            (select)="selectVideo(video)"
            (selectTrack)="selectTrackInVideo($event)"
          ></now-playlist-track>
        </li>
      </ul>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NowPlaylistComponent implements OnChanges, AfterViewChecked {
  @Input() playlist: NowPlaylist.INowPlaylist
  @Output() select = new EventEmitter<GoogleApiYouTubeVideoResource>()
  @Output()
  selectTrack = new EventEmitter<{
    time: string
    media: GoogleApiYouTubeVideoResource
  }>()
  @Output() remove = new EventEmitter<GoogleApiYouTubeVideoResource>()

  public activeTrackElement: HTMLUListElement
  public hasActiveChanged = false

  constructor(public zone: NgZone) {}

  ngAfterViewChecked() {
    if (this.hasActiveChanged && this.activeTrackElement) {
      this.zone.runOutsideAngular(() => this.scrollToActiveTrack())
    }
  }

  ngOnChanges({ activeId }: SimpleChanges) {
    if (activeId) {
      this.hasActiveChanged = isNewChange(activeId)
    }
  }

  scrollToActiveTrack() {
    if (this.activeTrackElement) {
      this.activeTrackElement.scrollIntoView()
    }
  }

  selectVideo(media: GoogleApiYouTubeVideoResource) {
    this.select.emit(media)
  }

  removeVideo(media: GoogleApiYouTubeVideoResource) {
    this.remove.emit(media)
  }

  isActiveMedia(mediaId: string, trackElement: HTMLUListElement) {
    const isActive = this.playlist.selectedId === mediaId
    if (isActive) {
      this.activeTrackElement = trackElement
    }
    return isActive
  }

  selectTrackInVideo(trackEvent: { time; media }) {
    this.selectTrack.emit(trackEvent)
  }
}
```

## Scrolling To The Active Track

There are 2 possible scenarios where the "scrollToActiveTrack()" method is used.

### 1) AfterViewChecked Component Life Cycle

```typescript
  ngAfterViewChecked() {
    if (this.hasActiveChanged && this.activeTrackElement) {
      this.zone.runOutsideAngular(() => this.scrollToActiveTrack());
    }
  }
```

When the active media is changed via the now playlist store, the "<strong>selectedId</strong>" is updated, thus triggering a change detection down to the "now playlist component", which is the, renders the component and updates the active media in view.

This strategy is mostly useful for an initial render and for the "<strong>selectedId</strong>" is updated within the store. It was also used to trigger a scroll automatically when the next track is activated, however, ux wise, it didn't feel right and was a little bit annoying - so I decided to disable it for the time being. Nevertheless, it's a nice example which demonstrates using <a href="https://github.com/ngrx/platform/blob/master/docs/store/README.md"><strong>ngrx</strong> store</a> with auto scrolling dom elements.

To optimize performance further, other <a href="https://angular.io/guide/lifecycle-hooks">component's life cycle hooks</a> can be used for initial render only.

### 2) Using @ViewChild Decorator with Component instance method from parent component

This strategy demonstrates the usage of accessing a component's public methods, thus manipulating it directly. This can be considered a tightly coupled architecture, however, for the purpose of this feature - it achieves a nice effect easily and can be disabled without affecting the robustness of the app.

This strategy is used inside the "now playing" component. The component queries the "now playlist" component with "**@ViewChild**" decorator, thus, saving a reference to the component's instance within the "nowPlaylistComponent" property.

Now, whenever the "**onHeaderClick**()" method is invoked in response to the "now-playlist-filter" component event, the "**nowPlaylistComponent.scrollToActiveTrack**()" method is invoked directly, scrolling the playlist to the active track element.

```typescript
export class NowPlayingComponent implements OnInit {
  public nowPlaylist$: Observable<INowPlaylist>
  @ViewChild(NowPlaylistComponent) nowPlaylistComponent: NowPlaylistComponent

  constructor(
    public store: Store<EchoesState>,
    public nowPlaylistService: NowPlaylistService
  ) {}

  // ...removed code
  onHeaderClick() {
    this.nowPlaylistComponent.scrollToActiveTrack()
  }
}
```

The benefit of using this strategy is by not triggering any re-render inside the "now-playlist" component - and just using the DOM's api.

## Summary: Putting It All Together

The "**now playing**" feature is a nice component featuring few key concepts that can be achieved with Angular and ngrx:

1. using **state management** with **ngrx**
2. **sharing state** between components - using the "now playlist" state - sharing the "playlist" and "filter"
3. **communicating** between **components** - using a wrapper component (now playlist)
4. leveraging **@ViewChild** to be able to **interact** with a component's public interface, eventually interacting with **DOM** only api's

Those concepts can be further enhanced and achieved differently using other strategies. I always look for doing [things simpler](http://orizens.com/wp/blog/lessons-learned-from-creating-a-typeahead-with-rxjs-and-angular-2/) or rather different, as long as it feels intuitive, fits the [code architecture](http://orizens.com/wp/blog/decluttering-angular-components-the-proxy-pattern/) used for the app and follow best practices for creating robust code.

Echoes Player is an open source project and [entire code is available](http://github.com/orizens/echoes-player) (feel free to fork, open pull requests and suggest features) as well using the actual app at <https://echoesplayer.netlify.app/>.

If you like this article or in need for an advice for your Front End Development project, reach me out via the [contact page](http://orizens.com/contact) or get a quote free of charge through one of [consulting packages](http://orizens.com/services) i'm offering as part of my services (or click on one of them on the right, if you're using a desktop/laptop).
