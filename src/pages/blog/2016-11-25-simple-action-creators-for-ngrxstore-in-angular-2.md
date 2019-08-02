---
id: 1101
title: Simple Action Creators for ngrx/store in Angular (2+)
date: 2016-11-25T10:02:47+00:00
author: Oren Farhi 
templateKey: blog-post
layout: post
guid: http://orizens.com/wp/?p=1101
permalink: /topics/simple-action-creators-for-ngrxstore-in-angular-2/
dsq_thread_id:
  - "5331052675"
post_grid_post_settings:
  - 'a:10:{s:9:"post_skin";s:4:"flat";s:19:"custom_thumb_source";s:93:"./img/plugins/post-grid/assets/frontend/css/images/placeholder.png";s:17:"font_awesome_icon";s:0:"";s:23:"font_awesome_icon_color";s:7:"#737272";s:22:"font_awesome_icon_size";s:4:"50px";s:17:"custom_youtube_id";s:0:"";s:15:"custom_vimeo_id";s:0:"";s:21:"custom_dailymotion_id";s:0:"";s:14:"custom_mp3_url";s:0:"";s:20:"custom_soundcloud_id";s:0:"";}'
image: ../../img/uploads/2016/11/action-creator.jpg
categories:
  - Angular
  - ngrx
  - typescript
tags:
  - angular2
  - ngrx
  - typescript
---
In the development of [Echoes Player](http://orizens.github.io/echoes-ng2) ([ng2 version](http://github.com/orizens/echoes-ng2)),  I'm using [ngrx/store](http://orizens.com/wp/topics/angular-2-ngrxstore-ngrxeffects-intro-to-functional-approach-for-a-chain-of-actions/) for state management and [ngrx/effects for logics](http://orizens.com/wp/topics/angular-2-ngrxstore-ngrxeffects-intro-to-functional-approach-for-a-chain-of-actions/) with [side effects](http://orizens.com/wp/topics/angular-2-from-services-to-reactive-effects-with-ngrxeffects/). I'm always looking for better and simpler ways to write code - just experimenting with how code can be written differently. In this post I like to share a nice way for defining action creator functions which support typed arguments.

## Before: Creating Action Creators

[**UPDATE 26/12/2016**]: you can now use ActionCreatorFactory via npm at <https://github.com/orizens/ngrx-action-creator-factory>

Up until now, I was using a [simple and repetitive format](http://orizens.com/wp/topics/adding-redux-with-ngrxstore-to-angular-2-part-1/) for defining action creators. This is the &#8220;YoutubeVideosActions" which includes the available actions for managing the state of the videos store in Echoes Player.

Action creators encapsulates the creation of an &#8220;**Action**" object - it makes it safer and easier to create actions by calling the function &#8220;**addVideos(newVideos)**&#8220;, which takes a videos array as the payload of this action. Another action creator is the &#8220;**removeVideo()**" function, which in this case, takes no argument and just delivers an Action object with a &#8220;**type**" property only.

```typescript
import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

@Injectable()
export class YoutubeVideosActions {
  static ADD = '[YoutubeVideos] ADD_VIDEOS';
  static REMOVE = '[YoutubeVideos] REMOVE';
  static RESET = '[YoutubeVideos] RESET';
  static UPDATE_METADATA = '[YoutubeVideos] UPDATE_METADATA';

  addVideos(videos: GoogleApiYouTubeVideoResource[]): Action {
    return {
      type: YoutubeVideosActions.ADD,
      payload: videos
    };
  }

  removeVideo(): Action {
    return {
      type: YoutubeVideosActions.REMOVE
    };
  }
}
```

it's a nice and clear way for defining action creators. However, when more actions are added, the file is getting bigger and the pattern for each action creator is repeated. This makes it hard to maintain and in my opinion, harder to have a glance at all action creators available in this file.

## After: Action Creator Factory

I started to think of a different way for defining action creators - one which will allow me to have a better readable format, write less while keeping the useful typing of the payload argument. I came up with &#8220;**ActionCreatorFactory.create()**" - it creates a action creator function while the payload type is defined after the &#8220;**create**" function.

The first argument of the create function is the action that should be encapsulated. There an optional second argument which is a default value that the payload should be assigned to is no value has been triggered with the action creator.

```typescript
import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { ActionCreatorFactory } from '../action-creator.util';

@Injectable()
export class YoutubeVideosActions {
  static ADD = '[YoutubeVideos] ADD_VIDEOS';
  static REMOVE = '[YoutubeVideos] REMOVE';
  static RESET = '[YoutubeVideos] RESET';
  static UPDATE_METADATA = '[YoutubeVideos] UPDATE_METADATA';

  addVideos = ActionCreatorFactory.create<GoogleApiYouTubeVideoResource[]>(YoutubeVideosActions.ADD);
  removeVideo = ActionCreatorFactory.create<void>(YoutubeVideosActions.REMOVE);
  reset = ActionCreatorFactory.create<void>(YoutubeVideosActions.RESET);
  updateMetaData = ActionCreatorFactory.create(YoutubeVideosActions.UPDATE_METADATA);
}

```

The create function returns a function expression which uses ngrx/store &#8220;**Action**" interface.

I'm using two useful Typescript features:

First, I'm using the &#8220;**public**" declaration in the ActionCreator class to attach both arguments to the instance. A new instance of ActionCreator is a javascript object and this aligns with the contract of the &#8220;**Action**" interface.

Second, i'm using the &#8220;**<T>**" [generic](https://www.typescriptlang.org/docs/handbook/generics.html) annotation, which allows to define a specific Type for the payload when &#8220;create" is used.

```typescript
import { Action } from '@ngrx/store';

class ActionCreator<T> implements Action {
  constructor(
    public type: string = 'NOT_SET',
    public payload?: T
  ) {}
}

export class ActionCreatorFactory {
  static create?<T>(type: string, defaultPayloadValue?: any) {
    return (payload?: T) => {
      const _payload = payload || typeof payload !== 'undefined' ? payload : defaultPayloadValue;
      return new ActionCreator<T>(type, _payload);
    }
  };
}

```

Full code for the new [YoutubeVideosActions is available on github](https://github.com/orizens/echoes-ng2/blob/master/src/app/core/store/youtube-videos/youtube-videos.actions.ts).