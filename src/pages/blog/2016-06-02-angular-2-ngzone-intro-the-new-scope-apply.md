---
id: 986
title: 'Angular (2+) NgZone Intro &#8211; The new &#8220;scope.apply&#8221;'
date: 2016-06-02T07:57:34+00:00
author: Oren Farhi 
templateKey: blog-post
layout: post
guid: http://orizens.com/wp/?p=986
permalink: /topics/angular-2-ngzone-intro-the-new-scope-apply/
dsq_thread_id:
  - "4877134084"
image: ../../img/uploads/2016/06/ngzone.jpg
categories:
  - Angular
  - es2015
  - ngrx
tags:
  - angular2
  - architecture
  - es2015
  - es6
  - ngrx
---
Adding youtube player and google sign-in features to the echoes player version that I started developed with Angular (+2) was almost a no brainer. Since I took few [steps ahead in preparing](http://orizens.com/wp/topics/5-steps-to-prepare-your-angular-1-code-to-angular-2/) the [AngularJS version code to Angular (+2)](http://orizens.com/wp/topics/3-more-steps-to-prepare-your-angular-1-code-to-angular-2/), all left to do is copy and paste. However, issues started to rise once I started to check its functionality. Then I discovered NgZone.<!--more-->

## Limitations Outside Angular (+2) World

In Angular (+2), the change detection mechanism has been redesigned well enough to boost optimization and performance for several cases. This is all true when the app is running inside Angular (+2) world.

In [Echoes Player](http://echotu.be), I had to use 2 features that required interacting with external services. By external I mean that, the interactions goes outside of the Angular (+2) scope:

  1. Youtube Player sends events from youtube domain to echoes player domain.
  2. Google Sign-in sends events from google auth domain to echoes player domain.

Upon each event that is received **asynchronously**, in Echoes player scope, a chain of reactions happen and updates internal state which is managed currently with ngrx/store.

However, since these events originates in an external source &#8211; another domain &#8211; Angular (+2) change detection doesn&#8217;t recognize that the data has changed. So, with Angular (+2), we&#8217;re still left with connecting these to angular&#8217;s change detection.

## The Problems That Have Been Resolved By NgZone

I quickly noticed the problems with integrating the above external services to Echoes.

Whenever a change has been made following an external event, it wasn&#8217;t rendered unless I did a simple behavior (click) which invoked the change detection mechanism. Lets go through each problem and its solution.

### The Youtube Player Problem: No UI Update

Echoes is integrated with [youtube player iframe api](https://developers.google.com/youtube/iframe_api_reference). In order to use it, a player has to be created with the api:

<pre class="lang:js decode:true ">// youtube-player.service.ts
createPlayer (callback) {
    const store = this.store;
    const service = this;
    const defaultSizes = this.defaultSizes;
    return new window.YT.Player('player', {
        height: defaultSizes.height,
        width: defaultSizes.width,
        videoId: '',
        events: {
            onReady: () =&gt; {},
            onStateChange: onPlayerStateChange
        }
    });
}</pre>

In this process, the api creates a player object which interacts with youtube&#8217;s domain. The actual video playing is played on youtube&#8217;s domain, so, the actual player (in youtube&#8217;s domain) notifies a change thru the &#8220;**onPlayerStateChange**&#8221; callback that is passed in the constructor of this player.

Echoes uses this events in order to update the app&#8217;s player state (using [ngrx/store](https://github.com/ngrx/store)) of the current state of the player, so it can, i.e, show/hide the pause/play buttons. This is the point where i started to see the problem. The buttons wouldn&#8217;t reflect the actual state of the player.

### The Youtube Player Solution: NgZone

In order to notify angular change detection that there are changes which originated outside of the app, I has to use [NgZone](https://angular.io/docs/ts/latest/api/core/index/NgZone-class.html).

**NgZone** is a service that can be used in order to execute work (functions/code) outside or inside the angular world. Thus, in the end of these operations, Angular&#8217;s change detection is triggered, and updates whatever is necessary. I see it very similar to AngularJS &#8220;**scope.apply**&#8220;, however, more mature, optimized and performant.

In order to re-enter angular&#8217;s world, NgZone&#8217;s &#8220;**run**&#8221; function should take a function as the operation that is needed to be run, and then, the relevant changes will be rendered.

First I imported NgZone in &#8220;**youtube-player.service.ts**&#8220;:

<pre class="lang:js decode:true ">import { Injectable, NgZone } from '@angular/core';
</pre>

Then, I injected it to its constructor:

<pre class="lang:less decode:true ">constructor (public store: Store&lt;any&gt;, private zone: NgZone) {
   // now zone is available via:
   // this.zone
}</pre>

Then, I updated the &#8220;**createPlayer**&#8221; function and wrapped the &#8220;**onPlayerStateChange**&#8221; callback with NgZone&#8217;s run function. Notice that I also used the **es6/es2015** fat arrow in order to keep the &#8220;this&#8221; context so I can access the service&#8217;s zone:

<pre class="lang:js mark:11 decode:true ">createPlayer (callback) {
    const store = this.store;
    const service = this;
    const defaultSizes = this.defaultSizes;
    return new window.YT.Player('player', {
        height: defaultSizes.height,
        width: defaultSizes.width,
        videoId: '',
        events: {
            onReady: () =&gt; {},
            onStateChange: (ev) =&gt; this.zone.run(() =&gt; onPlayerStateChange(ev))
        }
    });
}</pre>

### The Google Sign-in Problem: No User&#8217;s Playlists

With this version of Echoes which is implemented with Angular (+2), I chose to experiment with [google&#8217;s web sign-in](https://developers.google.com/identity/sign-in/web/listeners) strategy. I chose assigning a handler to a button with google&#8217;s api &#8220;gapi.auth2&#8221;.

The expected use case is:

  1. the user navigates to the &#8220;my playlists&#8221; screen
  2. then clicks the google sign-in button
  3. a pop up window in google&#8217;s domain opens with details to sign in
  4. the user authorizes sign-in to echoes player
  5. the pop-up is closed and the user is back to echoes player page
  6. echoes player gets access the user&#8217;s playlists
  7. the playlists should be rendered and the sign-in button should be hidden

The code which is responsible for steps 2-5 starts with assigning a click handler and listeners the the sign-in button:

<pre class="lang:default decode:true">// user-manager.service.ts
attachSignIn() {
  if (this.auth2 && !this.isSignedIn && !this.isAuthInitiated) {
    this.isAuthInitiated = true;
    // Attach the click handler to the sign-in button
    this.auth2.attachClickHandler('signin-button', {}, this.onLoginSuccess.bind(this), this.onLoginFailed.bind(this));
  }
}</pre>

Notice that although the &#8220;**success**&#8221; and &#8220;**fail**&#8221; functions are bind with &#8220;**this**&#8221; (service) context, still, these will be invoked asynchronously outside of angular&#8217;s world &#8211; so even, the &#8220;**bind**&#8221; function isn&#8217;t the answer to this one.

After the &#8220;**success**&#8221; callback is invoked, steps 6-7 should be invoked &#8211; however &#8211; with this implementation it won&#8217;t.

### The Google Sign-in Solution: NgZone

Similar to the youtube player problem, the solution here is using NgZone&#8217;s &#8220;**run**&#8221; function. It is setup and injected in a similar manner to the &#8220;**user-manager.service.ts**&#8221; and defined as a private member. In this case, I created an expression using es6/es2015 fat arrow to reuse and simplify wrapping the relevant callbacks:

<pre class="lang:default mark:3,7 decode:true ">attachSignIn() {
  // an experssion for reuse with "this.zone"
  const run = (fn) =&gt; (r) =&gt; this.zone.run(() =&gt; fn(r));
  if (this.auth2 && !this.isSignedIn && !this.isAuthInitiated) {
    this.isAuthInitiated = true;
    // Attach the click handler to the sign-in button with "run"
    this.auth2.attachClickHandler('signin-button', {}, run(this.onLoginSuccess.bind(this)), run(this.onLoginFailed.bind(this)));
  }
}</pre>

That&#8217;s it &#8211; problem is solved for this scenario.

## What&#8217;s More With NgZone

NgZone has a lot more to offer. If there is a code that should be run, however shouldn&#8217;t affect the change detection, then the &#8220;**runOutsideAngular**&#8221; method should be used.

Moreover, NgZone emits some useful events like: onUnstable, onError and more.

Feel free to explore the [code of Echoes Player with Angular (+2)](http://github.com/orizens/echoes-ng2)