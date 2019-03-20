---
id: 946
title: 'Adding Redux with NgRx/Store to Angular (2+) &#8211; Part 1'
date: 2016-02-12T12:20:18+00:00
author: Oren Farhi 
templateKey: blog-post
layout: post
guid: http://orizens.com/wp/?p=946
permalink: /topics/adding-redux-with-ngrxstore-to-angular-2-part-1/
dsq_thread_id:
  - "4573231539"
image: ../../img/uploads/2016/02/reducer.jpg
categories:
  - Angular
  - es2015
  - javascript
  - ngrx
  - redux
  - typescript
---
The recent trend in state management has rise thanks to the popular library &#8211; <a href="http://redux.js.org/" target="_blank">Redux</a>. I was very interested in integrating a redux solution to angular in my <a href="http://echotu.be" target="_blank">Echoes Player project</a>. I followed few examples that I have found <a href="https://github.com/ngrx/store" target="_blank">NgRx.js</a>. These are my first steps with integrating it to Echoes.<!--more-->

## Short Intro To Redux

**UPDATED: RC.6, 9/1/2016**

In a one liner &#8211; Redux implements the concept of state management using Flux design pattern. It does that using pure functions (reducers) that return a new state given a certain event (type of action) and its event data (payload of action).

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

First, I created a new directory in &#8220;**src/app/core/store**&#8221; for defining the store. In this directory i&#8217;m defining the store, storing the reducers and defining the data model structure of Echoes.

The **index.ts** is:

<pre class="lang:js decode:true">import { compose } from "@ngrx/core/compose";
// reducers
import {videos} from './youtube-videos';
// Echoes State
let EchoesStore = {
  videos: []
};

export default compose(
)({ videos });</pre>

In order to attach this store to the app, i&#8217;m importing it in the **app.module.ts** (i&#8217;m using the excellent <a href="https://github.com/AngularClass/angular2-webpack-starter" target="_blank">Angular2Class angular2 starter kit</a>) as such:

<pre class="lang:js decode:true">// other imports were removed for this example
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
</pre>

### Creating a Reducer

The first reducer that I have created handles the videos search results. Currently, it handles **3 actions**: add, remove and reset.

Notice how the &#8220;**videos**&#8221; function is a pure function: it gets **2 arguments** and is expected to return a value.

<pre class="lang:js decode:true">import { ActionReducer, Action } from '@ngrx/store';

export const ADD = 'ADD';
export const REMOVE = 'REMOVE';
export const RESET = 'RESET';

export interface EchoesVideos extends Array&lt;GoogleApiYouTubeSearchResource&gt;{};

export const videos: ActionReducer&lt;GoogleApiYouTubeSearchResource[]&gt; = (state: EchoesVideos = [], action: Action) =&gt; {

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
}</pre>

The main (and currently only) action that is implemented here is the &#8220;**add**&#8221; action with addVideos function. The &#8220;**addVideos**&#8221; function simply returns a new array that includes a copy of the source array concatenated with a new videos array.

### Using Store In Angular2 Component

In order to use the ngrx store in the &#8220;**youtube-videos.ts**&#8221; component, I need to import the Store &#8211; which is a &#8220;**singletone**&#8221; object, and inject it.

<pre class="lang:default decode:true">// youtube-videos.ts
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
	videos$: Observable&lt;EchoesVideos&gt;;

	constructor(private youtubeSearch: YoutubeSearch, public store: Store&lt;any&gt;) {
		this.videos$ = store.select(state =&gt; state.videos);
	}
        ngOnInit(){
                this.search('')
        }
//....more code
}</pre>

I also imported the &#8220;**ChangeDetectionStrategy**&#8220;, so I can instruct angular to evaluate changes once.

In order to use the result of the youtube search action, I attach the store&#8217;s reducer result to the &#8220;**videos**&#8221; property in this class. Since this operation is async, the template of youtube-videos component has been defined with a pipe of **async**:

<pre class="lang:xhtml decode:true">&lt;youtube-list [list]="videos$ | async" (play)="playSelectedVideo($event)"&gt;&lt;/youtube-list&gt;</pre>

### Using Store in Angular2 Service

The real action of dispatching action to the store comes from the youtube.search service.

I first import the Store and the actions needed for new states:

<pre class="lang:default decode:true ">import { Store } from '@ngrx/store';
import { ADD } from '../store/youtube-videos';</pre>

Similarly to the youtube-videos component, the &#8220;**Store**&#8221; is injected to this service constructor and attached to the &#8220;**this.store**&#8221; context.

In order to update the store state, once the response is ready, the &#8220;**ADD**&#8221; event is dispatched with the expected payload:

<pre class="lang:js decode:true ">search(query: string, dontReset: Boolean){
	const isNewSearch = query && query !== this._config.get('q');
	const shouldBeReset = !dontReset;

	if (shouldBeReset || isNewSearch) {
		this._config.set('pageToken', '');
	}
	if (query && query.length) {
		this._config.set('q', query);
	}
	return this.http.get(this.url, { search: this._config })
		// .map((res: Response) =&gt; res.json())
		.toPromise()
		.then((response) =&gt; response.json())
		.then((response) =&gt; {
			let itemsAmount = this.items.length;
			this.nextPageToken = response.nextPageToken;
			this.store.dispatch({ type: ADD, payload: [ ...response.items ] })
			return response;
		});
}</pre>

This closes a circle and invokes the &#8220;**videos**&#8221; reducer mentioned above, which afterwards updates the youtube-videos components, which in turn, displays the current state of the &#8220;**store.videos**&#8221; property.

## What&#8217;s Next

This is merely just the beginning of integrating NgRx to Echoes. Right after the start, I noticed the benefits of using it. There are more decisions to take in this project using ngrx as well as adding more reducers.

As always, [Echoes](http://echotu.be) is an open source project. The [source code is available on github](http://github.com/orizens/echoes-ng2).

Thanks for reading :).