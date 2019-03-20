---
id: 298
title: 'Javascript Arrays &#8211; passing by reference or by value?'
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
I stumbled across a great article about javascript arrays &#8211; [Mastering Javascript Arrays](http://www.hunlock.com/blogs/Mastering_Javascript_Arrays).

One fact that i didn&#8217;t realize until reading this article is that if you pass an array to a function &#8211; it is passed by reference by default. Actually, any non primitive object is passed by reference.

<!--more-->


  
<!--RndAds-->

## Array By Reference

Basically it means that if you make any changes to the array inside the function, these changes are saved in the original array so you don&#8217;t have to &#8220;return myArray&#8221; at the end of this function (or at any other return statement inside this function) &#8211; that&#8217;s what&#8217;s so great about javascript &#8211; being dynamic enough and consolidate various tricks from other low-level languages.

<pre class="brush:js">var a= [3, 'my new post', {345}]
function renderData(a)
{
a.push(4);
}
renderData(a);
alert(a);	// will output the new a - [3, 'my new post', {345}, 4]</pre>

<!--RndAds-->

At this point, I also realized the benefit of creating an array from a dom collection query &#8211; i.e. &#8211; document.getElementsByTagName(&#8216;div&#8217;) &#8211; and as nicholas zakas pointed out in his <a title="javascript optimizations" href="http://jonraasch.com/blog/10-javascript-performance-boosting-tips-from-nicholas-zakas" target="_blank">javascript optimizations presentation</a> he gave at <a title="google tech talk javascript optimzations" href="http://www.youtube.com/watch?v=mHtdZgou0qU" target="_blank">google tech talk</a> youtube channel (bullet 8). I also noticed that jquery uses this concept to return a jquery object after querying the dom (and also with other operations). Jquery also has a utility &#8220;$.makeArray&#8221; to convert any object/array to a real array. One of the benefits of converting a dom collection to a regular array is boosting javascript performance when doing various operations on these elements.

## Array By Value

In contrary, array can also be passed by value &#8211; a copy of the array is passed- which means that changes that made to the passed array won&#8217;t be saved in the original array. This can be done by using the native array method &#8211; &#8220;slice()&#8221; &#8211; as described in any <a title="javascript array reference" href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice" target="_blank">javascript language reference</a>. The &#8216;slice&#8217; method in this case will return a shallow copy of the array.

<pre class="brush:js">var a= [3, 'my new post', {345}]
function renderData(a)
{
a.push(4);
}
renderData(a.slice());
alert(a);	// will output the original a - [3, 'my new post', {345}]</pre>