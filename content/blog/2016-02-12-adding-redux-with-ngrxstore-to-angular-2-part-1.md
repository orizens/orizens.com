---
id: 946
title: 'Adding Redux with NgRx/Store to Angular (2+) - Part 1'
date: 2016-02-12T12:20:18+00:00
author: Oren Farhi 
templateKey: blog-post
layout: post
guid: http://orizens.com/wp/?p=946
permalink: /topics/adding-redux-with-ngrxstore-to-angular-2-part-1/
dsq_thread_id:
  - "4573231539"
image: ../img/uploads/2016/02/reducer.jpg
categories:
  - Angular
  - es2015
  - javascript
  - ngrx
  - redux
  - typescript
---
The recent trend in state management has rise thanks to the popular library - <a href="http://redux.js.org/" target="_blank">Redux</a>. I was very interested in integrating a redux solution to angular in my <a href="http://echotu.be" target="_blank">Echoes Player project</a>. I followed few examples that I have found <a href="https://github.com/ngrx/store" target="_blank">NgRx.js</a>. These are my first steps with integrating it to Echoes.<!--more-->

## Short Intro To Redux

**UPDATED: RC.6, 9/1/2016**

In a one liner - Redux implements the concept of state management using Flux design pattern. It does that using pure functions (reducers) that return a new state given a certain event (type of action) and its event data (payload of action).

The benefits of using Redux are:

  1. state is becoming predictable
  2. keeping logics detached from the rest of the application
  3. writing tests is easy
  4. Time Travel for any scenario becomes a breeze
  5. Components should become stateless

## NgRx.js for Angular (+2)

<a href="https://github.com/ngrx/store" target="_blank">NgRx.js</a> is a library for state management inspired by Redux. It exposes few objects that implements the core concepts of Redux: **Store**, **Action**, **Reducer** and more.

Lets start adding NgRx to Echoes Player.

### Creating the main Store

First, I created a new directory in "**src/app/core/store**" for defining the store. In this directory i'm defining the store, storing the reducers and defining the data model structure of Echoes.

The **index.ts** is:

```typescript
import { compose } from "@ngrx/core/compose";
// reducers
import {videos} from './youtube-videos';
// Echoes State
let EchoesStore = {
  videos: []
};

export default compose(
)({ videos });
```

In order to attach this store to the app, i'm importing it in the **app.module.ts** (i'm using the excellent <a href="https://github.com/AngularClass/angular2-webpack-starter" target="_blank">Angular2Class angular2 starter kit</a>) as such:

```typescript
// other imports were removed for this example
import { Store, StoreModule } from '@ngrx/store';
import { store } from './core/store';

import { App } from './app.component';
/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
 bootstrap: [ App ],
 declarations: [
 // others removed for this post
 App,
 YoutubeVideos,
 ],
 imports: [
 // others removed for this post
 StoreModule.provideStore(store)
 ],
 providers: [ 
 // others removed for this post
 actions
 ]
})
export class AppModule {}

```

### Creating a Reducer

The first reducer that I have created handles the videos search results. Currently, it handles **3 actions**: add, remove and reset.

Notice how the "**videos**" function is a pure function: it gets **2 arguments** and is expected to return a value.

```typescript
import { ActionReducer, Action } from '@ngrx/store';

export const ADD = 'ADD';
export const REMOVE = 'REMOVE';
export const RESET = 'RESET';

export interface EchoesVideos extends Array<GoogleApiYouTubeSearchResource>{};

export const videos: ActionReducer<GoogleApiYouTubeSearchResource[]> = (state: EchoesVideos = [], action: Action) => {

    switch (action.type) {
        case ADD:
            return addVideos(state, action.payload);

        case REMOVE:
            return state;

        case RESET:
            return [];

        default:
            return state;
    }
}

export function addVideos(state: EchoesVideos, videos: GoogleApiYouTubeSearchResource[]) {
    return state.concat(videos);
}
```

The main (and currently only) action that is implemented here is the "**add**" action with addVideos function. The "**addVideos**" function simply returns a new array that includes a copy of the source array concatenated with a new videos array.

### Using Store In Angular2 Component

In order to use the ngrx store in the "**youtube-videos.ts**" component, I need to import the Store - which is a "**singletone**" object, and inject it.

```typescript
// youtube-videos.ts
import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { EchoesState } from '../core/store';
import { Observable } from 'rxjs/Observable';

@Component({
 selector: 'youtube-videos',
 template: require('./youtube-videos.html'),
 changeDetection: ChangeDetectionStrategy.OnPush
})
export class YoutubeVideos {
	videos$: Observable<EchoesVideos>;

	constructor(private youtubeSearch: YoutubeSearch, public store: Store<any>) {
		this.videos$ = store.select(state => state.videos);
	}
        ngOnInit(){
                this.search('')
        }
//....more code
}
```

I also imported the "**ChangeDetectionStrategy**", so I can instruct angular to evaluate changes once.

In order to use the result of the youtube search action, I attach the store's reducer result to the "**videos**" property in this class. Since this operation is async, the template of youtube-videos component has been defined with a pipe of **async**:

```typescript


### Using Store in Angular2 Service

The real action of dispatching action to the store comes from the youtube.search service.

I first import the Store and the actions needed for new states:

```typescript
import { Store } from '@ngrx/store';
import { ADD } from '../store/youtube-videos';
```

Similarly to the youtube-videos component, the "**Store**" is injected to this service constructor and attached to the "**this.store**" context.

In order to update the store state, once the response is ready, the "**ADD**" event is dispatched with the expected payload:

```typescript
search(query: string, dontReset: Boolean){
	const isNewSearch = query && query !== this._config.get('q');
	const shouldBeReset = !dontReset;

	if (shouldBeReset || isNewSearch) {
		this._config.set('pageToken', '');
	}
	if (query && query.length) {
		this._config.set('q', query);
	}
	return this.http.get(this.url, { search: this._config })
		// .map((res: Response) => res.json())
		.toPromise()
		.then((response) => response.json())
		.then((response) => {
			let itemsAmount = this.items.length;
			this.nextPageToken = response.nextPageToken;
			this.store.dispatch({ type: ADD, payload: [ ...response.items ] })
			return response;
		});
}
```

This closes a circle and invokes the "**videos**" reducer mentioned above, which afterwards updates the youtube-videos components, which in turn, displays the current state of the "**store.videos**" property.

## What's Next

This is merely just the beginning of integrating NgRx to Echoes. Right after the start, I noticed the benefits of using it. There are more decisions to take in this project using ngrx as well as adding more reducers.

As always, [Echoes](http://echotu.be) is an open source project. The [source code is available on github](http://github.com/orizens/echoes-ng2).

Thanks for reading :).