---
id: 877
title: 3 More Steps To Prepare Your Angular 1 Code To Angular (2+)
date: 2015-12-18T11:04:06+00:00
author: Oren Farhi 
templateKey: blog-post
layout: post
guid: http://orizens.com/wp/?p=877
permalink: /topics/3-more-steps-to-prepare-your-angular-1-code-to-angular-2/
dsq_thread_id:
  - "4414283008"
image: ../img/uploads/2015/12/ng2.jpg
categories:
  - Angular
  - AngularJS
  - architecture
  - es2015
  - javascript
  - thoughts
tags:
  - angular.js
  - angular2
  - es2015
  - javascript
---
<a href="http://angularjs.blogspot.co.il/2015/12/angular-2-beta.html" target="_blank">Angular (+2) Beta</a> has been released just a few days ago. The most significant announcement with this beta is that the angular team are confident in using Angular (+2) for large scale applications. Following <a href="http://orizens.com/wp/topics/5-steps-to-prepare-your-angular-1-code-to-angular-2/" target="_blank">my recent post of 5 steps to prepare your AngularJS code to Angular (+2)</a>, I gathered few more steps that you can take to ease migration in the future, or rather apply it now to new code.<!--more-->

## Why Should I Consider Angular (+2)

Aside from taking a few steps to prepare the code, Angular (+2) holds a variety of benefits.

Its <a href="https://angular.io/docs/ts/latest/api/core/Component-var.html" target="_blank">component based architecture</a> leads to applying software architecture best practices right from the start.

It has broaden its capabilities and has become universal javascript framework - it can be used in server side and in mobile platforms.

One of the most important benefits of using Angular (+2) is performance (<a href="http://angularjs.blogspot.co.il/2015/12/angular-2-beta.html" target="_blank">from the blog post</a>). The angular team has put in a lot of effort to boost performance regardless the platform it runs on. The digest and change detection features along with the new template syntax has been optimized wisely enough to make changes apply fast.

Angular (+2) is build closely to the Ecmascript standards of versions 6 (2015) and 7, making the resulted code less proprietary on angular and more javascript standard.

Here are 3 more steps to follow in order to prepare you AngularJS code to Angular (+2).

## Use ng-change with ng-model

Angular (+2) data binding is by default one-way binding. In order to update a model with new changes, a handler must be defined as such:

```typescript


This requires you to implement a "resetPageToken()" function in the component's class.

With AngularJS, in order to track changes in ng-model while avoiding using the non-standard "scope", you would can do something similar - ng-change.

```typescript


This as well, requires you to implement a "resetPageToken()" function on the controller of this template. Following the first 5 steps, if you're using es2015 classes syntax for controllers - that will require less code to migrate when moving to Angular (+2).

## Use Services To Store any State and inject it to modules

This advice follows best practices as well as the recent trendy Flux design pattern. Any state and logics of the app, should reside to services. Usually, we would like to keep our code DRY and write logics once.

With Angular (+2), it is becoming popular to inject services to components. The key point is that these services should be singletons.

You should always follow the concept of injecting services to smart components - those that manage a certain section in the app, like the app itself:

```typescript


In this case, the services are injected inside the javascript definition of "my-app" class.

While, injecting data as a property to reusable components:

```typescript


In this case, "video" is a property of a class and injected via the html attribute "media".

## Use ng-forward for Angular (+2) syntax in AngularJS

<a href="https://github.com/ngUpgraders/ng-forward" target="_blank">ng-forward</a> is a project that aims to provide a tool for writing Angular (+2) syntax with AngularJS.3+ code base. This means that your code will use Es 2015, Angular (+2) Annotations, Decorators and practically almost all of Angular (+2) features. i.e, you can write this code and run it with AngularJS:

```typescript
import 'angular';
import { Component, Input, Output } from 'ng-forward';
import template from './youtube-media.tpl.html';

@Component({
	selector: 'youtube-media',
	template
})
export default class YoutubeMedia {
	@Input() media;
	@Output() play = new EventEmitter();
}
```

If you have the time of diving into <a href="https://angular.io/docs/ts/latest/index.html" target="_blank">Angular (+2) docs</a>, read articles and tutorials and want to try the syntax on your AngularJS code - ng-forward is an excellent choice.

Some of the benefits are code organization and easier migration to Angular (+2). You also get to play with the syntax and experience immediate results.

## Final Thoughts

With Angular (+2) already in beta version, I believe it's time to move on. I also believe in sticking into standards and best practices with it.

Using Ecmascript 2015 should become the first step with any javascript development today, and regardless of the framework you use for developing apps, eventually, writing with standards in mind will allow to experiment with frameworks more easily.

This means that while using Angular (+2) syntax, you should always remember that its syntax should wrap vanilla ecmascript code rather than tiding the code to the framework's features. You should be thinking how you can implement good and solid code architecture to a component or a service, and then allow to wrap it with any framework of choice. This is a challenging task, however it should benefit to the long term.