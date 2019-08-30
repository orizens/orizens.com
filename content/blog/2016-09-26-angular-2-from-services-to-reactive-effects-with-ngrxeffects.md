---
id: 1067
title: 'Angular (2+): From Services To Reactive Effects With Ngrx/Effects'
date: 2016-09-26T19:08:53+00:00
author: Oren Farhi 
templateKey: blog-post
layout: post
guid: http://orizens.com/wp/?p=1067
permalink: /topics/angular-2-from-services-to-reactive-effects-with-ngrxeffects/
dsq_thread_id:
  - "5175425324"
image: ../img/uploads/2016/09/ngrxeffect2.jpg
categories:
  - Angular
  - functional code
  - ngrx
  - ngrx-effects
tags:
  - angular2
  - ngrx
  - ngrx/effects
---
In a former article, I wrote <a href="http://orizens.com/wp/topics/angular-2-ngrxstore-ngrxeffects-intro-to-functional-approach-for-a-chain-of-actions/" target="_blank">an introduction for integrating ngrx/effects with Angular (+2)</a> - a functional approach for reacting to a chain of events. Since then, based on this approach, I defined more side effects for several actions in my open source project, <a href="http://github.com/orizens/echoes-ng2" target="_blank">Echoes Player</a>. It has really proven itself to be worthwhile in terms of logics architecture and code organization. In this post, I share more insights on working with <a href="https://github.com/ngrx/effects/tree/v2" target="_blank">ngrx/effects version 2</a> (currently in beta) and how show a real app use case where I applied it.<!--more-->

## The User Profile Component

_[UPDATED: October, 5th, 2016]_ This article's focus is on the <a href="http://orizens.github.io/echoes-ng2/#/user" target="_blank">user profile component in Echoes Player</a>.  This component is rendered on the "**My Playlists**" screen and its goal is to allow the user to sign in to the youtube account and display his/hers playlists.

This component involves several actions:

  1. authorize the user
  2. fetch user profile
  3. fetch all user playlists
  4. display all playlists

In order to achieve these, the user profile component uses theses services:

  1. **UserManager** - fetch any user profile related information
  2. **Authorization** - authorize the user in youtube and google sign in
  3. **Ngrx/Store** - connect the "**playlist**" and "**user**" reducers to the view

There are more actions in this component which require other services to be included:

  1. nowPlaylistActions - to queue a list of videos to now playlist
  2. youtubePlayerActions - to play the first video of a list of videos
  3. nowPlaylistService - to update the index of the selected video to be played

We're going to focus on the first 3 services which allow sign-in and displaying the user's playlists.

## Separating Service & Ngrx/Effects Responsibilities

Before I refactored the user profile service, it was responsible for few operations:

  1. loading the google api for **authorization**
  2. attaching a click handler for a **sign-in** button
  3. **authorizing** the user
  4. **fetching** user playlists
  5. more logics for fetching the **next page** of playlists (maximum size of playlists is 50)

Obviously, the code structure can be better - I wanted to achieve a lot in a limited time and knowledge, and using these tools was just with a preliminary knowledge. I felt from the start that this implementation should be organized and authored in a different way. The **UserProfile** service achieved too much of its purpose.

And so as time passed by, I began refactoring this service and the relevant files around it. I realized that the user profile service can be regarded as actually a data provider service. It focus on getting the current authorized user profile related data.

Before we dive into the main refactoring of this service and its related effects, lets go through the responsibilities that have been taken out of this service:

### Authorization, Gapi Loader & Sign In Handler

The authorization process has been extracted to its own service in the app's core services as well as the gapi (google api) loader.

**GapiLoader** is an observable service which can be subscribed in order to be notified once the desired google api has been loaded. In this case, I wanted to make a reusable service that can be agnostic to the api's it loads while returning an **observable**. Google Api is a **3rd party** api with a **Promise** base api. For that, I used the **Observable** Object to create a custom observable:

```typescript
@Injectable()
export class GapiLoader {
  private _api: Observable<any>;

  constructor() { }

  load (api: string) {
    return this.createApi(api);
  }
  private _loadApi (api: string, observer) {
    const gapiAuthLoaded = window.gapi && window.gapi.auth2 && window.gapi.auth2.getAuthInstance();
    if (gapiAuthLoaded && gapiAuthLoaded.currentUser) {
      return observer.next(gapiAuthLoaded);
    }
    window.gapi.load(api, response => observer.next(response));
  }

  private createApi (api) {
    this._api = new Observable(observer => {
      const isGapiLoaded = window.gapi && window.gapi.load;
      const onApiLoaded = () => this._loadApi(api, observer);
      if (isGapiLoaded) {
        onApiLoaded();
      } else {
        window['apiLoaded'] = onApiLoaded;
      }
    });
    return this._api;
  }
}
```

There's some **Typescript** here. Clearly, aside from the constructor method, the only public method that is allowed to be used is the "**load**" method, which takes an api name and simply returns an observable that the consumer can subscribe to.

The consumer of this service is the **Authorization** service. It is injected with the **gapiLoader** service, so it can load the relevant api for authorizing a google user - &#8216;**auth2**&#8216; api. Once the **gapiLoader** has loaded the auth2 api, the subscribed function is invoked, so it can continue to try and authorize the user. Even more than that, this function reacts to the gapiLoader's observable stream. If at some point, the user signs out, this function should handle that. However, this is not regarded for now.

```typescript
@Injectable()
export class Authorization {
	private isSignedIn: boolean = false;
	private _googleAuth: any;

	constructor(
		private zone: NgZone,
		private store: Store<EchoesState>,
		private gapiLoader: GapiLoader,
		private userProfileActions: UserProfileActions
		) {
		this.loadAuth();
	}

	loadAuth () {
		// attempt to SILENT authorize
		this.gapiLoader
			.load('auth2')
			.subscribe(authInstance => {
				if (authInstance && authInstance.currentUser) {
					return this._googleAuth = authInstance;
				}
				this.authorize()
					.then(GoogleAuth => {
						const isSignedIn = GoogleAuth.isSignedIn.get();
						const authResponse = GoogleAuth.currentUser.get();
						const hasAccessToken = authResponse.getAuthResponse().hasOwnProperty('access_token');
						this._googleAuth = GoogleAuth;
						if (isSignedIn && hasAccessToken) {
							this.zone.run(() => this.handleSuccessLogin(authResponse));
						}
					});
			});
	}

	authorize () {
		const authOptions = {
			client_id: `${CLIENT_ID}.apps.googleusercontent.com`,
			scope: 'profile email https://www.googleapis.com/auth/youtube'
		};
		return window.gapi.auth2.init(authOptions);
	}
}
```

I won't go in detail of the code that runs in the "then" block, since, currently, google's &#8216;**auth2**&#8216; api doesn't allow to "silently" authenticate the user as it did in the previous version of "**auth**" (at least, in the client side). <del>so this code currently doesn't trigger the <strong>signIn</strong> function (if you are familiar with a way to silently authenticate the user with auth2 - please do let me know in the comments or through the contact page).</del> _[UPDATED: October, 5th, 2016]_ I added the "**scope**" entry to the authOptions in the "**authorize**". Now, if the user is already authenticated, the "**loadAuth**" runs the "**handleSuccessLogin**"  and sends the authResponse as if the user clicked the sign-in button.

The **signIn** function is an **important** take out of the user profile service. It eliminated the code in the user profile service which attached a click handler for signing in the user (a copy paste from google's guide).  Once the signIn process has successfully been completed, the app needs to save the access token.

I use **ngrx/store** in order to dispatch an action for saving the token. Notice that I use NgZone to wrap the "**handleSuccessLogin**" function handler since the google authorization signIn api is external to angular (I wrote about <a href="http://orizens.com/wp/topics/angular-2-ngzone-intro-the-new-scope-apply/" target="_blank">using NgZone for 3rd party external api</a> before):

```typescript
export class Authorization {
// ....
signIn () {
		const run = (fn) => (r) => this.zone.run(() => fn.call(this, r));
		const scope = 'profile email https://www.googleapis.com/auth/youtube';
		const signOptions = { scope };
		if (this._googleAuth) {
			this._googleAuth
				.signIn(signOptions)
				.then(
					run(this.handleSuccessLogin),
					run(this.handleFailedLogin)
				);
		}
	}

	handleSuccessLogin(response) {
		const token = response.getAuthResponse().access_token;
		this.isSignedIn = true;
		this.store.dispatch(this.userProfileActions.updateToken(token));
	}
//...
}
```

### Fetching User Playlists - Loop with Ngrx/Effects

Now comes the fun part - using **reactive programming** with a declarative effects style. In the old code, the user profile service was responsible for saving the user's access token, fetching the playlists and handle several calls for fetching more playlists of the amount si higher than 50 (google's api limit).

I consider this flow to be a candidate for declaring this logic in an effects object - which is known as a side effect. As a reminder, a side effect usually should be declared when an action should be followed by another action. To simply put - this is a reactive system - the system should always apply 2 or more actions in a cascading order. With **ngrx/effects** we apply reactive programming in a declarative style.

For the first **side effect**, whenever the token is updated in the user profile store, this actions should follow:

  1. the user profile service should be updated with the **new token**
  2. the user profile service should **fetch** the user's playlists
  3. the new **data** from the playlists request has to be **saved** an operate on another side effect

These 3 actions are defined in the first effect:

```typescript
@Injectable()
export class UserProfileEffects {

  constructor(
    private actions$: Actions,
    private userProfileActions: UserProfileActions,
    private userProfile: UserProfile
  ){}

  @Effect() updateToken$ = this.actions$
    .ofType(UserProfileActions.UPDATE_TOKEN)
    .map(action => action.payload)
    .map((token: string) => this.userProfile.setAccessToken(token))
    .switchMap(string => this.userProfile.getPlaylists(true))
    .map(response => this.userProfileActions.updateData(response));
...
}
```

The "updateData" method, saves a playlists response in store. This is the json response from the getPlaylist request:

```typescript
{
  "kind": "youtube#playlistListResponse",
  "etag": "unique-id",
  "nextPageToken": "a-unique-page-token",
  "pageInfo": {
    "totalResults": 54,
    "resultsPerPage": 50
  },
  "items": [...]
}
```

Several actions should be taken upon this response arrival:

  1. On the one hand, The "**items**" array holds some of all of the user's playlists - this should be put in to the user's playlists store
  2. On the second hand, the "**nextPageToken**" value should be stored in the user's profile store

These 2 actions are decoupled and not connected to each other. In contrary to the effect that we declared for updating the token, these can be declared each in an effect. Separating them will allow to test them each on its own as well as invoke more actions, if needed:

```typescript
export class UserProfileEffects {
...
  @Effect() addUserPlaylists$ = this.actions$
    .ofType(UserProfileActions.UPDATE)
    .map(action => action.payload)
    .map((data: any) =>this.userProfileActions.addPlaylists(data.items));

  @Effect() updateNextPageToken$ = this.actions$
    .ofType(UserProfileActions.UPDATE)
    .map(action => action.payload)
    .map(data => {
      const nextPageToken = data.nextPageToken;
      return nextPageToken
        ? this.userProfileActions.updatePageToken(data.nextPageToken)
        : this.userProfileActions.userProfileCompleted();
    });
...
}
```

### Fetching Next Page of Playlists

The last action which updated the page token, does that with dispatching an event to the user profile store. In react to this action (remember **reactive programming**?), there is one more action that should be invoked: again ,getting the next page of playlists, if the page's token value is a string of some kind.

The last effect in this saga, reacts to the update action of the page token:

  1. it **updates** the page token in the user profile service
  2. it initiates a **request** to get the next page of playlists
  3. it **saves** the new response data

```typescript
export class UserProfileEffects {
...
@Effect() getMorePlaylists$ = this.actions$
    .ofType(UserProfileActions.UPDATE_NEXT_PAGE_TOKEN)
    .map(action => action.payload)
    .switchMap((pageToken: string) => {
      this.userProfile.updatePageToken(pageToken);
      return this.userProfile.getPlaylists(false);
    })
    .map(response => this.userProfileActions.updateData(response));
}
```

## Looping with Ngrx/Effects

The reactive system notion continues right after the last 3rd action. The 2 effects: addUserPlaylists$ and updateNextPageToken$ will be triggered again.

Eventually, this process will stop once there's no page token in the response.

## Starting The Whole Sign In Process

The operation which starts this whole process is clicking the sign-in button:

<img class="alignnone wp-image-1069 size-large" src=".../../img/uploads/2016/09/localhost-3000-Laptop-with-MDPI-screen-1-1024x640.png" alt="localhost-3000-laptop-with-mdpi-screen-1" width="697" height="436" srcset=".../../img/uploads/2016/09/localhost-3000-Laptop-with-MDPI-screen-1-1024x640.png 1024w, .../../img/uploads/2016/09/localhost-3000-Laptop-with-MDPI-screen-1-300x188.png 300w, .../../img/uploads/2016/09/localhost-3000-Laptop-with-MDPI-screen-1-768x480.png 768w, .../../img/uploads/2016/09/localhost-3000-Laptop-with-MDPI-screen-1.png 1536w" sizes="(max-width: 697px) 100vw, 697px" />

Upon successful authorization of the user, the chain of effects starts to react to the appropriate actions and finally, displays the user's playlists.

[<img class="alignnone wp-image-1070 size-large" src=".../../img/uploads/2016/09/localhost-3000-Laptop-with-MDPI-screen-1024x640.png" alt="localhost-3000-laptop-with-mdpi-screen" width="697" height="436" srcset=".../../img/uploads/2016/09/localhost-3000-Laptop-with-MDPI-screen-1024x640.png 1024w, .../../img/uploads/2016/09/localhost-3000-Laptop-with-MDPI-screen-300x188.png 300w, .../../img/uploads/2016/09/localhost-3000-Laptop-with-MDPI-screen-768x480.png 768w, .../../img/uploads/2016/09/localhost-3000-Laptop-with-MDPI-screen.png 1536w" sizes="(max-width: 697px) 100vw, 697px" />](.../../img/uploads/2016/09/localhost-3000-Laptop-with-MDPI-screen.png)

## Summary

Once again, **ngrx/effects** has proven to be a great declarative way for grouping side effects and taking out complex logics from services.

Organizing and declaring these effects, gives a great overview of how actions influence on other actions.

<a href="http://github.com/orizens/echoes-ng2" target="_blank">Echoes Player ng2 version</a> is an open source application hosted on github. You can try the <a href="http://orizens.github.io/echoes-ng2" target="_blank">live version</a> as well.

&nbsp;