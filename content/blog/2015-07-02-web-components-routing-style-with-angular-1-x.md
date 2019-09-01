---
id: 792
title: Web Components Routing Style With Angular 1.X
date: 2015-07-02T10:11:44+00:00
author: Oren Farhi 
templateKey: blog-post
layout: post
guid: http://orizens.com/wp/?p=792
permalink: /blog/web-components-routing-style-with-angular-1-x/
dsq_thread_id:
  - "3897572600"
image: ../img/uploads/2015/07/web-components-routing.jpg
categories:
  - AngularJS
  - architecture
  - javascript
  - thoughts
tags:
  - angular.js
  - architecture
---
I really like the web components approach that has recently got a hugh attention. It's easy to design a solution that solves an encapsulated problem, while exporting it as an html tag. After working much with angular, I saw a recurring pattern in defining routes either with the default ng-router or ui-router. In this post I share my preference for consuming modules and defining them in the routing module.

<!--more-->

## Common Way for Defining Routes In Angular

All over the internet, the most common example for defining routes is something like this:

### When using ngrouter

```typescript
.when('/video/:id', {
	templateUrl: 'app/youtube-video/youtube.video.tpl.html',
	controller: 'YoutubeVideoCtrl',
	controllerAs: 'vm',
})
```

### When using ui-router

```typescript
.state('video.single', {
	url: '/video/:id',
	templateUrl: 'app/youtube-video/youtube.video.tpl.html',
	controller: 'YoutubeVideoCtrl',
	controllerAs: 'vm'
})
```

The recurring pattern that i see is defining the templateUrl, controller and controllerAs.

Now, if one develops in an angular based app with a modular approach in mind, I believe that adding a web components perspective for consuming this module will add more readability to the code.

### Clear Vision for Routing

Today, In my <a href="http://github.com/orizens/echoes" target="_blank">open source project</a> "<a href="http://echotu.be" target="_blank">open the app Echoes Player</a>", I started consuming modules in routes using this definiton:

```typescript
.when('/', {
	template: '<youtube-videos></youtube-videos>'
})
```

This way of defintion resembles the <a href="https://angular.github.io/router/" target="_blank">new angular router</a> which embraces the new web components approach.

## The Benefits Of Using Web Components Based Routing

In my opinion, it is much clearer to understand that the app should render the youtube-videos web component when the user navigates to the default root url.

Essentially, I developed the youtube-videos module without externalising it as a directive (hint: web component), and finally for using it across the app, I created a custom tag (directive) for it.

Thinking about the routing in the design phase, before coding, promotes one to think in the web components approach, and eventually, should promote a better code design and implementation.

Also, reusing this module (or rather, its externalisation web-component identity), becomes seamless and easy.

If you're using ui-router in your project and there are few ui-views in one page, the defintion may become much clearer with this approach:

```typescript
$stateProvider
    .state('home', {
        url: "",
        views: {
            "results": {
                template: "<youtube-videos></youtube-videos>"
            },
            "sidebar": {
                template: "<now-playlist></now-playlist>"
            }
        }
    });
```

## Final Notes

This way of defining routing, should be relevant regardless of the fact whether you define the route of the module inside the module (youtube.videos.routes.js) or rather in a more one place (i.e. app.routes.js).

My goal is to provide readability, ease of use, easier reuse and hopefully, minimalism.

&nbsp;

&nbsp;