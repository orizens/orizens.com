---
id: 1094
title: Stepping Into The Next Level With RxJs In Angular (2+)
date: 2016-11-16T10:58:19+00:00
author: Oren Farhi 
templateKey: blog-post
layout: post
guid: http://orizens.com/wp/?p=1094
permalink: /topics/stepping-into-the-next-level-with-rxjs-in-angular-2/
dsq_thread_id:
  - "5308292343"
post_grid_post_settings:
  - 'a:10:{s:9:"post_skin";s:4:"flat";s:19:"custom_thumb_source";s:93:"./img/plugins/post-grid/assets/frontend/css/images/placeholder.png";s:17:"font_awesome_icon";s:0:"";s:23:"font_awesome_icon_color";s:7:"#737272";s:22:"font_awesome_icon_size";s:4:"50px";s:17:"custom_youtube_id";s:0:"";s:15:"custom_vimeo_id";s:0:"";s:21:"custom_dailymotion_id";s:0:"";s:14:"custom_mp3_url";s:0:"";s:20:"custom_soundcloud_id";s:0:"";}'
image: ../../img/uploads/2016/11/rxjs.jpg
categories:
  - Angular
  - functional code
  - RxJS
tags:
  - angular2
  - functional
  - ngrx
  - rxjs
  - typescript
---
Since I started developing the new version of Echoes with Angular (+2), I was vey interested in taking advantage of rxjs. To be more specific, I was interested to see how it can be used to reduce complexity and lead to a better, maintainable code. In this article i'm sharing a code refactor walk through, where I used RxJs operators to achieve better maintainable code with Angular (+2).<!--more-->

I experimented a lot with [ngrx/store](http://orizens.com/wp/topics/adding-redux-with-ngrxstore-to-angular-2-part-1/) and [ngrx/effects](http://orizens.com/wp/topics/angular-2-ngrxstore-ngrxeffects-intro-to-functional-approach-for-a-chain-of-actions/) - these concepts led me to think differently about state management in front end development - where to [store data](http://orizens.com/wp/topics/angular-2-ngrxstore-the-ngmodel-in-between-use-case-from-angular-1/), [how to change](http://orizens.com/wp/topics/adding-redux-with-ngrxstore-to-angular2-part-2-testing-reducers/) it  and where to write [complex logics](http://orizens.com/wp/topics/angular-2-from-services-to-reactive-effects-with-ngrxeffects/) that might affect the state.

From time to time, I looked into the source code of store and effects. These concepts are implemented with RxJS. To have a better understanding of what goes under the hood, I had to dive more into RxJs. That's right - "dive more" - in a sense that I was already using RxJs with Angular HttpClient module and I even created some nifty Observables.

## The Google Sign-In Challenge

[Echoes Player](http://orizens.github.io/echoes-ng2) (ng2 version) is an [open source player](http://github.com/orizens/echoes-ng2) that I developed with Angular (+2), ngrx/store and ngrx/effects. The player allows you to search and play videos using youtube data api. Aside from having a "now playing" playlist in the left sidebar, the user can sign in with a google account, view playlists of this account and play it.

The sign-in process has been a challenge during development. There are few things that need to happen before the google sign in method can take place:

  1. assure google's "auth2" client is loaded
  2. make an authorization request
  3. sign-in the user

Aside from that, if the user is already authorized, these steps should happen behind the scenes.

## chapter 1 - the start of "authorize"

The code responsible for authorization and sign belongs to the "**authorization.service.ts**" file, which is a core (shared) service in Echoes Player (located in **src/app/core/services**). This is a snapshot ([full commit here](https://github.com/orizens/echoes-ng2/blob/6423350c319b224eabbf5b2e9a86500f01aa1134/src/app/core/services/authorization.service.ts)) of the "**loadAuth()**" function that was available during early development of the authorization service:

```typescript
loadAuth() {
    this.gapiLoader
      .load('auth2')
      .subscribe((authInstance: any) => {
        // gapi['auth2'].getAuthInstance().isSignedIn.listen(authState => {
        // 	console.log('authState changed', authState);
        // });
        if (authInstance && authInstance.currentUser) {
          return this._googleAuth = authInstance;
        }
        this.authorize()
          .then(googleAuth => {
            window.gapi['auth2'].getAuthInstance().isSignedIn.listen(authState => {
              console.log('authState changed', authState);
            });
            const isSignedIn = googleAuth.isSignedIn.get();
            const authResponse = googleAuth.currentUser.get();
            const hasAccessToken = authResponse.getAuthResponse().hasOwnProperty('access_token');
            this._googleAuth = googleAuth;
            if (isSignedIn && hasAccessToken) {
              this.zone.run(() => this.handleSuccessLogin(authResponse));
            }
          });
      });
  }

```

Few important points to understand in this function (which is not so "RxJSified", or functional enough):

"**gapiLoader**" is a service responsible for loading any google client api. It returns an observable (hot) which emits an event once the google api has been loaded. Under the hood, it uses the Rxjs Subject and use it to notify.

Inside the "**subscribe**" function, the commented code was a preparation to allow the app to refresh an authenticated user's access token (if the session is longer than 3600 seconds / 1 hour). Take a note: this function comes in later in this code snippet.

Next, if the user was already authorized, I had to stop there and save the "**authInstance**" (a google auth instance response object) so the user won't have to go through the sign in process again.

If the user is not authorized, it's time to invoke the "**authorize**" function, which invokes the google sign in and authorize process. In this code snapshot, it returned a promise through google's "**gapi.auth2**" object.

Now, there's another "nested" function handler in response to the promise. This code now register a listener to the auth instance (which was commented above). Eventually, if the user is signed-in, the "**handleSuccessLogin**" is invoked inside an NgZone context (I wrote [here about why using ngzone](http://orizens.com/wp/topics/angular-2-ngzone-intro-the-new-scope-apply/)) to get back into angular's context and apply change detection.

## chapter 2 - analyzing problems in the code

Looking at the code above, I realized it is too complex and hard to test. There's nothing functional in it and it's quite complicated with its tow nested handlers. It also blends in a promise which makes the code base inconsistent, making some functions to return an observable interface and some to return a promise interface.

I was also concerned about the "**if**" statement somewhere in the middle - it stops the execution right there returning an assignment expression which means nothing.

## chapter 3 - refactor with RxJs

### 3.1 refactor with observables

The first action I took was unifying all functions return interface to use observables as a return value rather than a promise. The "**authorize**" and  "**signIn**" have been refactored to use observables. This step requires to import the "**Observable**" object and "fromPromise" operator ([full commit here](https://github.com/orizens/echoes-ng2/blob/1f86f963ac86d34709019f5cd440a64ec95617ee/src/app/core/services/authorization.service.ts)):

```typescript
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';

// .... inside the authorization class:
authorize() {
    const authOptions = {
      client_id: `${CLIENT_ID}.apps.googleusercontent.com`,
      scope: this._scope
    };
    return Observable.fromPromise(window.gapi.auth2.init(authOptions));
  }

  signIn() {
    const run = (fn) => (r) => this.zone.run(() => fn.call(this, r));
    const signOptions = { scope: this._scope };
    if (this._googleAuth) {
      Observable.fromPromise(this._googleAuth.signIn(signOptions))
        .subscribe(this.handleSuccessLogin, this.handleFailedLogin);
    }
  }
```

### 3.2 refactor with RxJS SwitchMap

Next, I realized the "**authorize()**" can be chained to the "**load()**". Since both functions return an observable - it's the prefect use case for utilizing the "**switchMap**" operator. The "switchMap" operator in this case, maps the value of "response" to a different (or new) observable, which is then projected (is **switch**ed) to the rest of the execution. To make it more clear, "**authorize()**" initiates a request and returns an observable. "**switchMap**" waits for this "request" to emit a notification through the observable and moves on to new refactored "**subscribe()**". This is another step towards a more organized authorization flow ([full code commit](https://github.com/orizens/echoes-ng2/blob/71f1f3f3b320c13c43da2a183319aadeb681d844/src/app/core/services/authorization.service.ts)):

```typescript
loadAuth() {
  // attempt to SILENT authorize
  this.gapiLoader
    .load('auth2')
    .switchMap(response => this.authorize())
    .subscribe((googleAuth: any) => {
      window.gapi['auth2'].getAuthInstance().isSignedIn.listen(authState => {
        console.log('authState changed', authState);
      });
      const isSignedIn = googleAuth.isSignedIn.get();
      const authResponse = googleAuth.currentUser.get();
      const hasAccessToken = authResponse.getAuthResponse().hasOwnProperty('access_token');
      this._googleAuth = googleAuth;
      if (isSignedIn && hasAccessToken) {
        this.zone.run(() => this.handleSuccessLogin(authResponse));
      }
    });
}
```

### 3.3 from "if" to RxJs "filter"

Now, the authorization process started to look clearer, as a proper **stream**. The next step I wanted to refactor much is that "if" statement. It seems like a very good fit for filtering an RxJs stream. Breaking the conditions inside the if statement into smaller, testable functions, allowed to stop (filter) the stream from invoking the "**handleSuccessLogin()**" when it shouldn't run in more neatly way. To be even more useful and prevent unnecessary code to be run, I chose to apply the "filter" operator for each condition:

```typescript
loadAuth() {
  // attempt to SILENT authorize
  this.gapiLoader
    .load('auth2')
    .switchMap(response => this.authorize())
    .filter((googleAuth: GoogleAuthResponse) => this.isSignIn())
    .filter((googleAuth: GoogleAuthResponse) => this.hasAccessToken(googleAuth))
    .subscribe((googleAuth: any) => {
      window.gapi['auth2'].getAuthInstance().isSignedIn.listen(authState => {
        console.log('authState changed', authState);
      });
      this._googleAuth = googleAuth;
      this.zone.run(() => this.handleSuccessLogin(authResponse));
    });
}
```

### 3.4 simple functions with RxJS "do" operator

Now, the code is left with an assignment and attaching a listener. For these operations, the RxJs "**do**" operator is a nice fit. The "do" operator is good for intercepting in a stream in order to run some code and get back to the original stream with the observable. According to the [docs of "do"](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-do), it is concerned as a "side effect" - which perhaps is a good candidate for moving this code later to the ngrx/effects layer. This is the final refactored "**loadAuth()**" function ([full code commit](https://github.com/orizens/echoes-ng2/blob/4ee45bf75c1e0fe8f69464f9d4470d612779f911/src/app/core/services/authorization.service.ts)):

```typescript
loadAuth() {
    // attempt to SILENT authorize
    this.gapiLoader
      .load('auth2')
      .switchMap(() => this.authorize())
      .do((googleAuth: GoogleAuthResponse) => this.saveGoogleAuth(googleAuth))
      .do((googleAuth: GoogleAuthResponse) => this.listenToGoogleAuthSignIn(googleAuth))
      .filter((googleAuth: GoogleAuthResponse) => this.isSignIn())
      .filter((googleAuth: GoogleAuthResponse) => this.hasAccessToken(googleAuth))
      .map((googleAuth: GoogleAuthResponse) => googleAuth.currentUser.get())
      .subscribe((googleUser: GoogleAuthCurrentUser) => {
        this.zone.run(() => this.handleSuccessLogin(googleUser));
      });
  }
```

## Conclusions From Refactoring Code Using RxJs

This refactoring process, allowed me to dive into rxjs docs, understanding more about various use cases and adopting new perspectives when approaching code.

In my opinion, the code is much clearer than the first source. Moreover, I can think now of another few refinements I can take on this new refactored code that perhaps will make the "**loadAuth()**" process much simpler and focused - after all, it actually does load the authorization api, signs in the user and do more operations.

I have thoughts of dispatching events such as "auth success" and "sign-in success", and handle its side effects in the ngrx/effects layer - however - that is saved for another refactoring adventure.

<div>
  <div>
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
  </div>
</div>