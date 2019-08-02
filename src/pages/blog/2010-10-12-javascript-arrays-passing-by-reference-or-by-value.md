---
id: 298
title: 'Javascript Arrays - passing by reference or by value?'
date: 2010-10-12T13:57:28+00:00
author: Oren Farhi 
templateKey: blog-post
layout: post
guid: http://orizens.com/wp/?p=298
permalink: /topics/javascript-arrays-passing-by-reference-or-by-value/
dsq_thread_id:
  - "751019241"
categories:
  - javascript
---
I stumbled across a great article about javascript arrays - [Mastering Javascript Arrays](http://www.hunlock.com/blogs/Mastering_Javascript_Arrays).

One fact that i didn't realize until reading this article is that if you pass an array to a function - it is passed by reference by default. Actually, any non primitive object is passed by reference.

<!--more-->


  
<!--RndAds-->

## Array By Reference

Basically it means that if you make any changes to the array inside the function, these changes are saved in the original array so you don't have to "return myArray" at the end of this function (or at any other return statement inside this function) - that's what's so great about javascript - being dynamic enough and consolidate various tricks from other low-level languages.

<pre class="brush:js">var a= [3, 'my new post', {345}]
function renderData(a)
{
a.push(4);
}
renderData(a);
alert(a);	// will output the new a - [3, 'my new post', {345}, 4]</pre>

<!--RndAds-->

At this point, I also realized the benefit of creating an array from a dom collection query - i.e. - document.getElementsByTagName(&#8216;div') - and as nicholas zakas pointed out in his <a title="javascript optimizations" href="http://jonraasch.com/blog/10-javascript-performance-boosting-tips-from-nicholas-zakas" target="_blank">javascript optimizations presentation</a> he gave at <a title="google tech talk javascript optimzations" href="http://www.youtube.com/watch?v=mHtdZgou0qU" target="_blank">google tech talk</a> youtube channel (bullet 8). I also noticed that jquery uses this concept to return a jquery object after querying the dom (and also with other operations). Jquery also has a utility "$.makeArray" to convert any object/array to a real array. One of the benefits of converting a dom collection to a regular array is boosting javascript performance when doing various operations on these elements.

## Array By Value

In contrary, array can also be passed by value - a copy of the array is passed- which means that changes that made to the passed array won't be saved in the original array. This can be done by using the native array method - "slice()" - as described in any <a title="javascript array reference" href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice" target="_blank">javascript language reference</a>. The &#8216;slice' method in this case will return a shallow copy of the array.

<pre class="brush:js">var a= [3, 'my new post', {345}]
function renderData(a)
{
a.push(4);
}
renderData(a.slice());
alert(a);	// will output the original a - [3, 'my new post', {345}]</pre>