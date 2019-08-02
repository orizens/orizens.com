---
id: 883
title: 'Angular (2+): To Typescript or To ES5?'
date: 2015-12-25T12:12:18+00:00
author: Oren Farhi 
templateKey: blog-post
layout: post
guid: http://orizens.com/wp/?p=883
permalink: /topics/angular-2-to-typescript-or-to-es5/
dsq_thread_id:
  - "4432846493"
post_grid_post_settings:
  - 'a:10:{s:9:"post_skin";s:4:"flat";s:19:"custom_thumb_source";s:93:"./img/plugins/post-grid/assets/frontend/css/images/placeholder.png";s:17:"font_awesome_icon";s:0:"";s:23:"font_awesome_icon_color";s:7:"#737272";s:22:"font_awesome_icon_size";s:4:"50px";s:17:"custom_youtube_id";s:0:"";s:15:"custom_vimeo_id";s:0:"";s:21:"custom_dailymotion_id";s:0:"";s:14:"custom_mp3_url";s:0:"";s:20:"custom_soundcloud_id";s:0:"";}'
image: ../../img/uploads/2015/12/toTypeEs5.jpg
categories:
  - Angular
  - es2015
  - learning
  - thoughts
tags:
  - angular2
  - es2015
  - learning
  - thoughts
---
<p class="graf--p">
  …that is the question.
</p>

<p class="graf--p">
  Aside from <a href="http://orizens.com/wp/topics/5-steps-to-prepare-your-angular-1-code-to-angular-2/" target="_blank" rel="noopener">migrating AngularJS.x code</a> <a href="http://orizens.com/wp/topics/3-more-steps-to-prepare-your-angular-1-code-to-angular-2/" target="_blank" rel="noopener">to Angular (+2)</a> using few steps, i’ve been playing around with <a href="https://angular.io/docs/ts/latest/quickstart.html" target="_blank" rel="noopener">Angular (+2)</a> (alpha and beta releases) lately. At first, it seemed strange and totally different from version 1.x. <a href="http://angularjs.org" target="_blank" rel="noopener">Version 1.x of angular</a> is written in ES5, plain javascript, while version 2 is a new take with <a href="http://www.typescriptlang.org/" target="_blank" rel="noopener">Typescript</a> & ES 2015. In this post, i’de like to reflect my experience of writing with Angular (+2) with all of the language flavours — let it be ES5, ES2015 and Typescript.<!--more-->
</p>

<p class="graf--p">
  I like ES5. I’m not a fan of strong typing and not sure where it is actually fits in the spirit of javascript.
</p>

<p class="graf--p">
  I had to research and read lots of articles in order to understand what is going on in Angular (+2). I overviewed many code examples, I read some of the source code of Angular (+2).
</p>

<p class="graf--p">
  Finally, I forked <a href="https://github.com/johnpapa/angular2-go" target="_blank" rel="noopener">john's papa repo of angular2go</a> and started writing Angular (+2) code myself.
</p>

## Getting Started With ES2015 (es6) syntax {.graf--h3}

<p class="graf--p">
  First, I had to learn the new es2015 (es6) syntax.
</p>

<p class="graf--p">
  The main new features that you’ll see in Angular (+2) are:
</p>

### “import” {.graf--h4.graf--startsWithDoubleQuote}

<p class="graf--p">
  The “import” keyword is for requiring dependant modules (in commonjs or node.js’ “require” is used):
</p>

```typescript


<p class="graf--p">
  This is a welcomed feature with es2015, though it is not actually supported by browsers yet, so you’ll have to use 3rd party solutions such as browserify or webpack.
</p>

### “destructuring” {.graf--h4.graf--startsWithDoubleQuote}

<p class="graf--p">
  That comes along with the import example above. Among many other features, it means that I can define the name of the variable as well as the object that I want to import from whatever package i’m importing from. In general, I can extract properties (let it be objects, functions and primitive values) from a simple json object.
</p>

<p class="graf--p">
  I.e, in the above code, the “Component” is assigned (in this case) to a local variable “Component”, which I can use. You can see <a href="https://github.com/lukehoban/es6features#destructuring" target="_blank" rel="noopener">more examples this great resource</a>.
</p>

### “class” {.graf--h4.graf--startsWithDoubleQuote}

<p class="graf--p">
  One of the latest and most controversial keywords has been added to the ES 2015 spec. Essentially, its a syntactic sugar for defining a function with a prototype.
</p>

<p class="graf--p">
  I think that the most important outcome is that in the end, we’re creating objects, and the “class” is no exception from this. It’s just a function that after it has been invoked, it will return an object with properties that were defined — let it be a primitive property or either a function property.
</p>

<p class="graf--p">
  I.e, this “class”:
</p>

```typescript
class Track {
 constructor(track, title){
   this.track = track;
   this.title = title;
 }

 getLength(){
   return this.track.length;
  }
}
```

<p class="graf--p">
  If translated to plain ES5, it could be a function with a prototype:
</p>

```typescript
function Track (track, title) {
  this.track = track;
  this.title = title;
}
Track.prototype = {
  getLength: function () {
    return this.track.length
  }
}
```

<p class="graf--p">
  Since the final outcome is an object, The “Track” function can also be defined as a striped version with the <a href="https://carldanley.com/js-revealing-module-pattern/" target="_blank" rel="noopener">revealing module pattern</a>:
</p>

```typescript
function Track (track, title) {
 var api = {
   getLength: getLength
   title: title
 };
 
 return api;
 
 function getLength () {
   return track.length;
 }
}
```

## Understanding The Benefits Of Typescript In Angular2 {.graf--h3}

<p class="graf--p">
  The above ES5 code looks great and minimalistic to some. However, I think that the es2015 “class” does look great and minimalistic as well — it takes time to get used to (I admit…) but besides keeping it minimal, it also saved few key strokes and holds few gems with it.
</p>

<p class="graf--p">
  I.e, default values for function arguments can be defined in the function signature:
</p>

```typescript
class Track {
 constructor(track = {}, title = "no name yet..."){
   this.track = track;
   this.title = title;
 }
 
 getLength(){
   return this.track.length;
  }
}
var coolSong = new Track();
coolSong.track; // outputs empty {}
coolSong.title; // outputs "no name yet"
```

<p class="graf--p">
  This is an ES2015 feature.
</p>

<p class="graf--p">
  Apart from supplying better tooling for coding with javascript, Typescript assists in several more scenarios with Angular (+2).
</p>

### Injecting Services {.graf--h4}

<p class="graf--p">
  In angular2, there are several methods to inject a service to a class. The easiest for injecting a singleton service is:
</p>

```typescript
class MediaPlayer {
 
 // instructing angular2 to inject a singleton of PlaylistService
 constructor(public playlist: PlaylistService){
   // statements
 }
 
 getLength(){
   return this.track.length;
  }
}
```

<p class="graf--p">
  With this type annotation, you don’t have to instantiate the “playlist” service and you can be sure that the right object will be injected by the framework. This is what dependency injection is about with Angular (+2), and I suggest to read <a href="https://angular.io/docs/ts/latest/tutorial/toh-pt4.html" target="_blank" rel="noopener">more about it on angular website</a>.
</p>

### Private Injected Services {.graf--h4}

<p class="graf--p">
  With Angular 1.x, I usually tend to inject services and map its functions to a controller’s api scope. I.e (a simple code example):
</p>

```typescript
angular
 .module(‘media.search’)
 .controller(‘MediaSearchCtrl’, MediaSearchCtrl);

function MediaSearchCtrl(YoutubeSearch) {
 var vm = this;
 vm.title = ‘MediaSearchCtrl’;
 vm.search = search;

 function search (query) {
   YoutubeSearch.search(query).then((res) =&gt; {
     vm.items = res.items;
   })
 }
}
```

<p class="graf--p">
  The important fact to notice here is that this controller doesn’t expose the service “YoutubeSearch” to the view (scope or this), rather, it’s using it as a somewhat “private” variable through javascript closure feature.
</p>

<p class="graf--p">
  With Typescript, you can declare this service to be available in MediaPlayer “context” as a property, so it will be accessible to this controller via the “this” context. With this definition, It will be available to the view as well. It’s important to note that if we omit the “private” (or “public”) definition, the “playlist” argument is only available inside the constructor function. I.e:
</p>

```typescript
class MediaPlayer {
 
 // instructing angular2 to inject a singleton of PlaylistService
 constructor(private playlist: PlaylistService, cloudStorage: GoogleMusic){
   // accessible via the “this” context
   this.playlist.fetchMetadata();
   // accessible inside this function only
   this.cloudPlaylists = cloudStorage.getPlaylists();
 }

 getTotalTracksCount(){
   return this.playlist.length;
 }
}
```

### Final Thoughts {.graf--h4}

<p class="graf--p">
  Choosing Typescript as the language of choice means using Ecmascript 2015 as well. Hence, all of the goodness of Ecmascript 2015 is available.
</p>

<p class="graf--p">
  There are more benefits to using Typescript which I haven’t written about yet. Perhaps, some of them may be regarded as subjective preference — feature like Interfaces, <a href="https://github.com/lukehoban/es6features#classes" target="_blank" rel="noopener">Class Inheritance</a> (ES 2015) etc. I hope to investigate these more in the future and trying to understand good use cases for it, regardless of assisting the development environment (or Code Editor) to help with better tooling and coding support like code completion.
</p>

<p class="graf--p">
  It’s important to note that you don’t have to use Typescript or type annotation with Angular (+2), and you can stick to Ecmascript 2015 along with <a href="http://kangax.github.io/compat-table/es7/" target="_blank" rel="noopener">ES7 decorators</a> only. However, I like to promote the ease of language use, readability and creative solution that may result in writing less code however, more expressive.
</p>

<p class="graf--p">
  To summarise, I’m choosing to use Typescript wherever it may assist in writing less code while expressing more. I’ll probably tend to use the “good parts”.
</p>