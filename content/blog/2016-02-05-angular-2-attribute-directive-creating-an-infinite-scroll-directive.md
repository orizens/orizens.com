---
id: 939
title: 'Angular (2+): Attribute @Directive() & Creating An Infinite Scroll Directive'
date: 2016-02-05T10:25:01+00:00
author: Oren Farhi 
templateKey: blog-post
layout: post
guid: http://orizens.com/wp/?p=939
permalink: /blog/angular-2-attribute-directive-creating-an-infinite-scroll-directive/
dsq_thread_id:
  - "4553592304"
image: ../img/uploads/2016/02/scroll.jpg
categories:
  - Angular
  - es2015
  - javascript
  - typescript
tags:
  - angular2
  - es2015
  - typescript
---
In the recent article, I used the <a href="http://orizens.com/wp/blog/from-angular-1-x-ng-repeat-to-angular-2-ngfor-with-component/" target="_blank">new "<strong>ng-repeat</strong>" in Angular (+2), "<strong>NgFor</strong>"</a>, and created component that consumes other custom component. In this article, I continue to show further development for <a href="http://github.com/orizens/echoes-ng2" target="_blank">Echoes Player</a> with Angular (+2), this time - making it more dynamic by adding infinite scroll directive as what is known in angular2 as an attribute directive.<!--more-->

## Angular 1.x Infinite Scroll

In the current production of <a href="http://echotu.be" target="_blank">Echoes Player</a>, in order to add more videos to the result while scrolling, I used "<a href="https://sroze.github.io/ngInfiniteScroll/" target="_blank">ng-infinite-scroll</a>". It has a nice minimal directive api for triggering an infinite scroll - and the usage for Echoes Player is quite simple:

```typescript
<div class="view-content youtube-results youtube-videos" 
	infinite-scroll="youtubeVideos.searchMore()" 
	infinite-scroll-distance="2"
	>
....
</div>
```

There are more attributes as an api for this directive, however, in this case - I didn't use it.

As of this time of writing this post, I didn't found any Angular (+2) infinite scroll directive / component, so, I figured it is a great opportunity to migrate "**ng-infinite-scroll**" directive from AngularJS.x to Angular (+2) while learning how to create one.

Please note that the source code for this AngularJS.x infinite scroll directive is written with "**coffeescript**". However, the production ready code is compiled eventually to ES5.

## Migration Process to Angular (+2) Infinite Scroll

After converting the source code back to javascript (using <a href="http://js2.coffee/" target="_blank">http://js2.coffee/</a>), I started isolating the code to understand what it does and being able to migrate it to ES2015 class.

Most of the important logics is written as an AngularJS.x controller. I figured this code should be an ES2015 class. Actually, I wanted the migrate the logics of this controller to an ES2015, So it will be agnostic to any framework/library, being able to use it anywhere - the same principal applied to ponyfoo's dragula and his other awesome components.

But first, I had to understand Angular (+2) directive concepts.

## Angular (+2) Directive In a Nutshell

In Angular (+2), aside from components, there are still directives. There are built-in directive to the framework, such as: NgFor, NgIf, NgModel, NgClass and there's an api for creating custom directives.

Essentially, a directive is something like a component.

There are 3 kinds of directives:

  1. A Component - using **@Component()**
  2. A Structural Directive - using **@Directive()** - usually changes the DOM of an element - **NgIf**
  3. An Attribute Directive - using **@Directive()** - doesn't change the DOM, but adding behaviour

Infinite Scroll fits well to an <a href="https://angular.io/docs/ts/latest/guide/attribute-directives.html" target="_blank">Attribute Directive (More on that on the official documentation)</a> - It adds a scroll event (behaviour) to an element and acts upon it.

Lets create the Angular (+2) wrapping code for this directive.

First, lets import the relevant dependencies:

```typescript
import { Directive, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { Scroller } from './scroller';
```

The logics and migrated code of AngularJS.x is imported from the "scroller.ts" class file.

We're going to use some of angular's 2 core objects to define the relevant properties.

### Directive Definition

To declare an attribute as a directive, similar to Component, we use the "**<a href="https://angular.io/docs/ts/latest/api/core/Directive-decorator.html" target="_blank">@Directive()</a>**" decorator, while specifying an attribute class selector (css selector):

```typescript
@Directive({
  selector: '[infinite-scroll]'
})
```

### Directive Bindings & Events

Next, we'll define the class which will used as a controller for this directive, an input data that we'll expect to get from the element and an event that this directive will expose.

```typescript
export class InfiniteScroll {
  @Input() set infiniteScrollDistance(distance: Number) {
    this._distance = distance;
  }

  @Output() scroll = new EventEmitter();

//...
}
```

The "**infiniteScrollDistance**" property is expected to be set from outside the directive, as an attribute api. The same goes for the "**scroll**" event, which will trigger a function that is bind from outside. This means, that we'll use this directive like so:

```typescript
<div class="search-results"
    infinite-scroll
    [infiniteScrollDistance]="2"
    (scroll)="onScroll()">
</div>
```

Notice how each attribute in the above "**div**" element is matching a different declaration in this directive code.

### Referencing Directive's Element in Angular (+2)

With AngularJS.x, the DI system allowed us to require "$element" and expect to get a reference to the directive's DOM element:

```typescript
controller: function ($element) {
	$element.on('scroll', onScroll);
}
```

With Angular (+2), we use the "**ElementRef**" type definition. Also with the use of Typescript, we'll attach its property reference to "**this**" directive context:

```typescript
constructor(private element: ElementRef) {
   // now, we can reference to: this.element
}
```

### Hook the Scroll Event with ngOnInit to Directive's Element

Now, we'll us Angular (+2) hook - "<a href="https://angular.io/docs/ts/latest/api/core/OnInit-interface.html" target="_blank">ngOnInit</a>" - which will run when the directive is ready and will instantiate a new scroller, only once. Notice that I bind "this" context to the onScroll function reference to keep the context of this directive when the scroll event will trigger the event emitter's property, scroll:

```typescript
ngOnInit() {
    this.scroller = new Scroller(window, setInterval, this.element, this.onScroll.bind(this), this._distance, {});
  }

  private scroller: Scroller;

  private _distance: Number;

  onScroll() {
    this.scroll.next({});
  }
```

### Migration of Scroller Logic

The "scroller.ts" is an <a href="https://github.com/orizens/angular2-infinite-scroll/blob/master/src/scroller.ts" target="_blank">ES2015 class (full source code)</a>. Much of this code has been copied from the source implementation of "ng-infinite-scroll" of AngularJS.x and has been adapted to follow ES2015 syntax and relevant updates to the code as much as possible.

## Final Thoughts

Still, the infinite-scroll directive is not complete and there are more features to port from the original AngularJS.x version. There are also some points in the code where it is points to Angular (+2) specific "**this.$elementRef.nativeElement**" in order to get the actual DOM element.

Echoes Player implementation with <a href="https://github.com/orizens/echoes-ng2" target="_blank">ng2 is open source</a>. You can also fork <a href="https://github.com/orizens/echoes/tree/es2015" target="_blank">Echoes ES2015 with AngularJS.x version</a> and follow the complete <a href="https://github.com/orizens/echoes/issues/84" target="_blank">conversion from ES5 to ES2015</a> of this project.

The Goal of <a href="http://github.com/orizens/echoes-ng2" target="_blank">echoes-ng2</a> is migrating the whole application code to use angular2 various features.