---
id: 904
title: From Angular ES5 Directive To Angular ES2015 Component (ES6)
date: 2016-01-01T15:22:08+00:00
author: Oren Farhi 
templateKey: blog-post
layout: post
guid: http://orizens.com/wp/?p=904
permalink: /topics/from-angular-es5-directive-to-angular-es2015-component/
dsq_thread_id:
  - "4452173992"
image: ../../img/uploads/2016/01/now-playlist.jpg
categories:
  - AngularJS
  - architecture
  - es2015
  - javascript
  - learning
  - thoughts
tags:
  - angular.js
  - angular2
  - es2015
  - javascript
---
Recently, I started refactoring <a href="http://echotu.be" target="_blank">Echoes Player</a>, my <a href="http://github.com/orizens/echoes" target="_blank">open source project</a>, from angular ES5 to AngularJS with ES2015 (former ES6). I'm following several concepts and i'de like to share the process of converting an AngularJS directive  written with es5 to an AngularJS component using ES2015.<!--more-->

## Why Using ES2015 With Angular 1

I think that one of the most important reasons to <a href="http://orizens.com/wp/topics/angular-2-to-typescript-or-to-es5/" target="_blank">start using ES2015</a> with AngularJS is in preparing current AngularJS code to migration, when the time comes, to Angular (+2) code.

I've written before about <a href="http://orizens.com/wp/topics/5-steps-to-prepare-your-angular-1-code-to-angular-2/" target="_blank">5 steps to prepare your AngularJS code to Angular (+2)</a>, and <a href="http://orizens.com/wp/topics/3-more-steps-to-prepare-your-angular-1-code-to-angular-2/" target="_blank">3 more steps</a> to follow as well.

ES2015 is the new and current standard for writing javascript. It has taken a very long time to close the spec, however, now that the spec is closed, more and more libraries, frameworks, blog posts and tutorials are using it.

<a href="https://babeljs.io/docs/learn-es2015/" target="_blank">ES2015 features</a> a very nice collection of new syntax and new methods for achieving several operations in less code (sometimes), more readable code and new types for handling collections (like Map and Set).

Moreover, Angular (+2) is written with ES2015 and Typescript. This will assist in code migration to Angular (+2).

Lets Start!

## 1. Angular 1 With ES5

I'll use one of the modules i've written in Echoes Player with ES2015, and will convert it to a directive/component with ES2015.

<a href="http://echotu.be" target="_blank">Echoes Player</a> is a media player that is based on youtube api (it's open source as well). In its layout, it consists a sidebar, a top search bar and a content area. The sidebar include the &#8220;now playing" playlist that lists the tracks that currently queued to play.

Since I added this feature fast, I didn't create a module for it - I used angular's directives (ng-repeat) and added few more properties to the controller of this scope.

### &#8220;Now Playlist" Html Template

taken from the <a href="https://github.com/orizens/echoes/blob/560ee66b6b2b27d90f61f23711cdfcb0234aafff/src/index.html#L150" target="_blank">index.html</a> file:

```typescript
<ul id="user-playlists" class="nav nav-list xux-maker xnicer-ux user-playlists"
	ng-class="{ 
		'transition-in': vm.playlists.length,
		'slide-down': vm.showPlaylistSaver 
	}"
	sv-root sv-part="vm.playlists"
	sv-on-sort="vm.updateIndex($item, $indexTo)"
	>
	<li class="user-playlist"
		ng-class="{ 'active': vm.nowPlaying.index === $index}"
		ng-repeat="video in vm.playlists | filter:vm.playlistSearch"
		sv-element>
		<a class="" title="{{:: video.snippet.title }}"
			ng-click="vm.playVideo(video, $index)">
			{{ $index + 1 }})
			<img class="video-thumb" draggable="false" ng-src="{{:: video.snippet.thumbnails.default.url }}" sv-handle title="Drag to sort">
			<span class="video-title">{{:: video.snippet.title }}</span>
			<span class="badge badge-info">{{:: video.time }}</span>
			<span class="label label-danger ux-maker" title="Remove From Playlist"
				ng-click="vm.remove($event, video, $index)"><i class="fa fa-remove"></i></span>
		</a>
	</li>
</ul>
```

Aside from using angular's built-in directives, this tracks in this playlist are draggable (i'm using the angular-sortable-view module). The tracks can be removed from this list as well.

### &#8220;Now Playlist" Controller

The controller for this template is defined above the &#8220;ul" element. This is the &#8220;**UserPlaylistsCtrl**" that can be found in the <a href="https://github.com/orizens/echoes/blob/d08fd328914fdf3b40b04aed756481a090319c74/src/app/user-playlists/user-playlists.ctrl.js#L9" target="_blank">user-playlists.ctrl.js</a>:

```typescript
(function() {
    'use strict';

    angular
        .module('echoes')
        .controller('UserPlaylistsCtrl', UserPlaylistsCtrl);

    /* @ngInject */
    function UserPlaylistsCtrl($http, YoutubePlayerSettings, UserPlaylists) {
        var vm = this;
        vm.title = 'UserPlaylistsCtrl';
        // used by "Now Playlist"
        vm.playlists = YoutubePlayerSettings.nowPlaylist;
        vm.playVideo = playVideo;
        vm.nowPlaying = YoutubePlayerSettings.nowPlaying;
        // used by "Now Playlist"
        vm.playlistSearch = '';
        // used by "Now Playlist"
        vm.remove = remove;
        vm.clearPlaylist = YoutubePlayerSettings.clear;
        vm.togglePlaylistSaver = togglePlaylistSaver;
        vm.showPlaylistSaver = false;
        vm.onPlaylistSave = onPlaylistSave;
        // used by "Now Playlist"
        vm.updateIndex = updateIndex;

        function playVideo (video, index) {
            vm.nowPlaying.index = index;
            YoutubePlayerSettings.playVideoId(video);
        }

        function remove ($event, video, index) {
            $event.stopPropagation();
            YoutubePlayerSettings.remove(video, index);
        }

        function togglePlaylistSaver () {
            vm.showPlaylistSaver = !vm.showPlaylistSaver;
        }

        function onPlaylistSave () {
            togglePlaylistSaver();
            UserPlaylists.list();
        }

        function updateIndex ($item, $indexTo) {
            if ($item.id === vm.nowPlaying.media.id) {
                vm.nowPlaying.index = $indexTo;
            }
        }
    }
})();
```

This controller serves other purposes beside the now playlist feature. The relevant properties and functions that the now playlist uses, are marked with a comment above it.

## 2. Decisions Taken Before Converting ES5 to Es2015

The inspiration for refactoring the code comes from <a href="https://github.com/AngularClass/NG6-starter" target="_blank">angular-class boilerplate of using angular with es2015</a>. In the process of refactoring this code and converting it to ES2015, I had to decide how to isolate the several features in this area. Creating the &#8220;**Now Playlist**" component is one of these decisions.

### Defining A New Component For &#8220;Now Playlist"

First, I wanted to redefine the html template to be used as a **web-component** (or rather an html tag). After much thought, I came up with this component:

```typescript
<now-playlist videos="nowPlaying.playlist" 
	filter="nowPlaying.playlistSearch"
	on-select="nowPlaying.playVideo(video)" 
	on-remove="nowPlaying.removeVideo($event, video, $index)"
	on-sort="nowPlaying.updateIndex($item, $indexTo)"
></now-playlist>
```

I decided to expose the relevant attributes in order to keep the logics in one <a href="https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.aanidwnn4" target="_blank">&#8220;smart" component</a> (the &#8220;now-playing" component) and keeping this component as stateless as possible.

### Creating Files For &#8220;Now Playlist" Component

The next step was to generate the appropriate boilerplate of files for this component. For generating these files, I used <a href="https://www.npmjs.com/package/gulp-dogen" target="_blank">&#8220;gulp-dogen"</a> - an npm module I wrote for this repetitive task of generating directories and files for a certain purpose.

&#8220;gulp-dogen" takes the name of the component from a cli command, then it adds this name in all of the files where you specify it, and created a new directory with the new files in it.

Finally, I came up with these files:

```typescript
index.js
now-playlist.component.js
now-playlist.ctrl.js
now-playlist.less
now-playlist.tpl.html
```

I'm using the &#8220;**index.js**" notation, similar to node.js require syntax, so I can simply import the now-playlist component as such:

```typescript
import NowPlaylist from './now-playlist';
// instead of 
import NowPlaylist from './now-playlist/index.js';
```

#### index.js - Module & Directive Defintion

This file defines the angular module and its accompanied services and directives. This is also the place for importing any dependant modules - like the angular-sortable-view module. Finally, It exports the now-playlist module, so it can be consumed by other modules.

```typescript
import angular from 'angular';
import AngularSortableView from 'angular-sortable-view/src/angular-sortable-view.js';
import nowPlaylist from './now-playlist.component.js';

export default angular.module('now-playlist', [
	    'angular-sortable-view'
    ])
    .directive('nowPlaylist', nowPlaylist)
;
```

#### now-playlist.component.js - The Directive Definition

This file includes the directive/component definition for this module. Currently, I'm using angular v.1.4.8, where the new &#8220;component" syntax for creating an element directive isn't included.

This file imports the controller and template of this directive from an external file. I defined this directive with all of the properties that will be included within the &#8220;component" syntax -

  * bindToController: true - binds external attributes to &#8220;this" context in the controller
  * restrict: &#8216;E' - since it's a &#8220;component" - it's an element tag
  * replace: true - since there is no support for real web components yet
  * controllerAs: &#8216;nowPlaylist' - this follows Angular (+2) convention as well - exposing this as the camel-case version of this element tag.

There will be less code in this file once the new &#8220;component" function is available. Also, it will need to export an object (json) rather than a function.

```typescript
import NowPlaylistCtrl from './now-playlist.ctrl.js';
import template from './now-playlist.tpl.html';

/* @ngInject */
export default function nowPlaylist() {
    // Usage:
    //  <now-playlist></now-playlist>
    // Creates:
    //
    var directive = {
        template,
        controller: NowPlaylistCtrl,
        controllerAs: 'nowPlaylist',
        scope: {
            videos: '=',
            filter: '=',
            nowPlaying: '=',
            onSelect: '&',
            onRemove: '&',
            onSort: '&'
        },
        bindToController: true,
        replace: true,
        restrict: 'E'
    };
    return directive;
}
```

#### now-playlist.ctrl.js - The Component's Controller

This file includes the logics and view model for this component's view. I used ES2015 &#8220;class" defintion, since controllers in AngularJS are created with the &#8220;new" keyword. Notice that &#8220;this" context, is overloaded with more properties that are defined as part of the scope. Apart from the &#8220;constructor" function, I created

```typescript
/* @ngInject */
export default class NowPlaylistCtrl {
    /* @ngInject */
    constructor () {
        // injected with this.videos, this.onRemove, this.onSelect, this.filter, this.nowPlaying
        this.showPlaylistSaver = false;
    }

    removeVideo($event, video, $index) {
        this.onRemove && this.onRemove({ $event, video, $index });
    }

    selectVideo (video, $index) {
        this.onSelect && this.onSelect({ video, $index });
    }

    sortVideo($item, $indexTo) {
        this.onSort && this.onSort({ $item, $indexTo });
    }
}
```

#### now-playlist.tpl.html - The Component's html

This file contains the html template that was in the index.html. Few things have changed:

  * The code now references to the &#8216;controllerAs' alias &#8220;nowPlaylist"
  * The &#8220;ul" is wrapped with a &#8220;section" element
  * The &#8220;css" classes now reflects the correct meaning - &#8220;now-playlist", &#8220;now-playlist-track"

```typescript
<section class="now-playlist" ng-class="{ 
			'transition-in': nowPlaylist.videos.length,
			'slide-down': nowPlaylist.showPlaylistSaver 
		}">
	<ul class="nav nav-list xux-maker xnicer-ux"
		
		sv-root sv-part="nowPlaylist.videos"
		sv-on-sort="nowPlaylist.sortVideo($item, $indexTo)"
		>
		<li class="now-playlist-track"
			ng-class="{ 'active': nowPlaylist.nowPlaying.index === $index}"
			ng-repeat="video in nowPlaylist.videos | filter:nowPlaylist.filter"
			sv-element>
			<a class="" title="{{:: video.snippet.title }}"
				ng-click="nowPlaylist.selectVideo(video, $index)">
				{{ $index + 1 }})
				<img class="video-thumb" draggable="false" ng-src="{{:: video.snippet.thumbnails.default.url }}" sv-handle title="Drag to sort">
				<span class="video-title">{{:: video.snippet.title }}</span>
				<span class="badge badge-info">{{:: video.time }}</span>
				<span class="label label-danger ux-maker remove-track" title="Remove From Playlist"
					ng-click="nowPlaylist.removeVideo($event, video, $index)"><i class="fa fa-remove"></i></span>
			</a>
		</li>
	</ul>
</section>
```

Eventually, I also moved the relevant css/less rules to the &#8220;now-playlist.less" file.

### Usage of &#8220;Now Playlist" In A Broader Context

Finally, the area that contains the now-playlist and 2 other components, has been also refactored in the same way-

  * a small toolbar for filtering the playlist, clearing the tracks and save the playlist
  * a form component for typing a name to save the playlist to the current signed-in youtube's user

This is the smart component &#8220;**now-playing**" html template code (I still have work to do - this ng-if expression should be changed):

```typescript
<div class="sidebar-pane">
	<now-playlist-filter
		playlist="nowPlaying.playlist"
		on-save="nowPlaying.togglePlaylistSaver(show)"
		on-clear="nowPlaying.clearPlaylist()"
		on-change="nowPlaying.onFilterChange(filter)"
	></now-playlist-filter>
	<section class="playlist-saver-container clearfix" ng-if="nowPlaying.showPlaylistSaver && nowPlaying.playlist.length > 0">
		<playlist-saver class="col-md-12" tracks="nowPlaying.playlist"
			on-cancel="nowPlaying.togglePlaylistSaver()"
			on-save="nowPlaying.onPlaylistSave()"
			></playlist-saver>
	</section>
	<now-playlist videos="nowPlaying.playlist" 
		filter="nowPlaying.playlistSearch"
		on-select="nowPlaying.playVideo(video)" 
		on-remove="nowPlaying.removeVideo($event, video, $index)"
		on-sort="nowPlaying.updateIndex($item, $indexTo)"
	></now-playlist>
</div>
```

## Final Thoughts

The process of converting the code gave me the opportunity to restructure the app, rethink in a component base architecture and eliminate some of the code. Now, the code is more modularized, organized with components, defined with ES2015 and is ready for <a href="http://angular.io" target="_blank">Angular (+2)</a> - with some minimal changes I believe.

Moreover, this process should be taken step by step. It can be an iterative process and be applied to each component - one at a time.

The source code for Echoes Player with ES2015 is still a <a href="https://github.com/orizens/echoes/tree/es2015" target="_blank">work in progress</a>. The <a href="https://github.com/orizens/echoes/issues/84" target="_blank">commits are documented in #84 as well</a>.

However, this is not all. I plan on writing more articles on this process - as it contains much more preparation and adjustments.

I started gathering these concepts in an <a href="https://github.com/orizens/angular-es2015-styleguide" target="_blank">&#8220;Angular ES2015 Style Guide"</a> - You are welcome to collaborate on this style-guide - suggest and add your thoughts.