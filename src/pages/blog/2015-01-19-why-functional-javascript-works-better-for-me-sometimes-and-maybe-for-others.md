---
id: 742
title: Why Functional Javascript Works Better For Me ( sometimes, and maybe for others)
date: 2015-01-19T16:03:58+00:00
author: Oren Farhi 
templateKey: blog-post
layout: post
guid: http://orizens.com/wp/?p=742
permalink: /topics/why-functional-javascript-works-better-for-me-sometimes-and-maybe-for-others/
dsq_thread_id:
  - "3435382802"
image: ../../img/uploads/2015/01/functional.jpg
categories:
  - javascript
  - learning
  - thoughts
tags:
  - code
  - functional
  - javascript
---
I've been writing javascript code since 2006.

Right from the very first lines of code in javascript, I felt that the simplicity of javascript was exactly what i was looking for in a language.

In this post, i'm sharing my thoughts on why i think javascript was and still is awesome and how functional javascript sometimes works better for me.

<!--more-->

Coming with knowledge of strong typing languages (actionscript 3.0) and from weak typing languages (php), javascript had the feeling of being in the middle.

The syntax is readable, simple, familiar (as in actionscript), however - the need to be strict about every declaration didn't exist - THAT's the point.

Being a dynamic language with which, one can do everything on the fly - made it to be the favourite tool for web apps and a rising force for ligth rich internet applications (remember <a title="RIA - rich internet application" href="https://en.wikipedia.org/wiki/Rich_Internet_application" target="_blank">RIA</a>?).

After discovering how prototype works in javascript (it's a function&#8230;) - I really getting used to this idea minimalism - using &#8220;function" - you can define a reusable class, singleton, method and quite everything else that is needed.

So, with jquery around, teaching everyone the concept of &#8220;chaining" functions - without knowing, myself and probably everyone that used jquery, was actually writing <a title="functional programming" href="https://en.wikipedia.org/wiki/Functional_programming" target="_blank">functional javascript code</a>.

Another common use case of functional programming in javascript is <a title="Function Closure" href="https://bonsaiden.github.io/JavaScript-Garden/#function.closures" target="_blank">closure</a>: in some of the examples of closures, there is a function that returns a function (again, minimalism at its best, imho):

```typescript
function guitarBuilder (spec) {
	return function (options) {
		return spec + options;
	}
}

var lesPaul = guitarBuilder(spec);
var lesPaulDetails = lesPaul({ color: 'green' });
```

Douglas Crockford explained quite well how <a href="https://www.youtube.com/watch?v=bo36MrBfTk4#t=975" target="_blank">javascript with ES6 is becoming a truly functional language</a>.

With latest rise of javascript, I see functional programming becoming a part of todays development  - perhaps, along side with oop. Here are few of my own reasons for adopting some of the functional programming style to my development in javascript:

### Zen of Syntax - no weird syntax

In javascript, there's really no need to introduce the unusual syntax of loops, such as:

```typescript
for (var i = Things.length - 1; i &gt;= 0; i--) {
  // some statements

};
while (statment) do {
  // some statements
}
```

There's a function for every loop you'll ever need, starting with: forEach, map, etc.

I started adopting Douglas' approach for iterating json objects using:

```typescript
Object.keys(someJson).forEach(function(item){
  // some statements
});
```

### Readable and Declarative

Javascript can be written as a story, if one might want to:

```typescript
musicTracks
  .map(addThumbs)
  .map(addToPlaylist)
  .forEach(createPlaylistTrack)
```

### Safer Context

The following (famous problem) code will assign the same value of &#8220;i" to every function:

```typescript
for (var i = 0; i &lt; tracks.length; i++) {
	tracks[i].onPlay = function () {
		return i;
	}
};
```

That's because the &#8220;for" loop run all assignments of the &#8220;onPlay" function in the same execution context. To solve that, prior to modern es5/6 solutions, you could use private context for each (using a closure):

```typescript
for (var i = 0; i &lt; tracks.length; i++) {
	tracks[i].onPlay = function (index) {
		return function() {
			return index
		};
	}(i)
};
```

With functional javascript, you would use a simple &#8220;forEach":

```typescript
tracks.forEach(function(track, index){
	track.onPlay = function() {
		return index;
	}
});
```

### Documented by Nature

This pro perhaps should go with the &#8220;readable and declarative" title, however, I think it should deserve a title of its own - since sometimes, writing functions and naming them appropriately (name is why a function exists), saved those lines of comments:

```typescript
function fillArrayWithNumbersBy(size) {
    var ar = [size];
    ar.forEach(addIndex);
    return ar;
    function addIndex(el, i, arr){
        var prevVal = el;
        if (i === el) { return; }
        arr[i] = i;
        addIndex(prevVal, i + 1, arr);
        return arr;
    }
}
var hoursArray = fillArrayWithNumbersBy(24);
// checking the expected results, 
// if not, the messages will be output to the console
console.assert(hoursArray.length === 24, "length is not correct");
console.assert(hoursArray[23] === 23, "the 23 cell is not right");
```

## Conclusion

To conclude, I feel like functional programming and its implementation with javascript, has its positive impact for a solid readable and secured code maintenance. I'm aware that for some, functional programming might not feel the same nor better, however, I sure hope you'll be able to see that we're using it and it may make sense in some cases.

&nbsp;

###