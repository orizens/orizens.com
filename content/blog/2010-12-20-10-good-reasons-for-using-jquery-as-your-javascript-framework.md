---
id: 326
title: 10 good reasons for using jquery as your javascript framework
date: 2010-12-20T08:09:10+00:00
author: Oren Farhi 
templateKey: blog-post
layout: post
guid: http://orizens.com/wp/?p=326
permalink: /blog/10-good-reasons-for-using-jquery-as-your-javascript-framework/
dsq_thread_id:
  - "757204000"
categories:
  - javascript
  - jquery
tags:
  - javascript
  - jquery
---
I'm a jquery lover - I admit. ever since I started using this excellent framework - I got hooked.

Since I'm consider myself a core javascript developer, I tend to test and research before I choose to use others work. Well - Jquery has passed the test!

Nowadays, when developing in javascript, a developer has to be able to code for all browsers at least (in my opinion and as a proof of concept from our reality). It's one of the most common requirements a javascript project must take into an account when developing any project. The <a title="browsers market share" href="http://www.w3schools.com/browsers/browsers_stats.asp" target="_blank">browsers market</a> is changing and people are getting to know few browsers and tend to prefer one over the other.

There are many good reasons for why using <a title="Jquery javascript framework" href="http://www.jquery.com" target="_blank">jquery</a> as your javascript framework. After working for quite some time with jquery in big and small projects, these are my top reasons:

## <!--more-->10 Good Reasons for using Jquery as your Javascript framework





  1. Easy to use
  
    if you have a hidden element (of any kind - li, div, td, etc) - in order to show it, it's "display" property has to set the its proper "block" state. Each element has its own native "block" state. Jquery does that simply with the show() method:
  
    **$(&#8216;div').show()**.
  
    So - if it's a "td" element, in modern browsers (such as firefox, chrome, webkit etc..) this method will set its display property to "table-cell".
  2. Performance
  
    Jquery uses a <a title="javascript document fragment" href="http://ejohn.org/blog/dom-documentfragments/" target="_blank">document fragment</a> for some inner dom processing - which results in faster dom manipulations such as: appending html content, removing elements etc.
  3. CSS (xpath) selector syntax to retrieve elements
  
    one of the most common actions in jquery is to get a set of elements (or one element) and perform one or more actions on it. Jquery uses the sizzle engine to retrieve dom elements. Sizzle uses the convenient simple css syntax to describe the elements it will try to retrieve.
  
    i.e., if i want to retrieve all elements with class "my-class", which has a div ancestor: **$(&#8216;div .my-class')**.
  4. Easy Ajax
  
    Jquery has implemented a very convenient and easy cross-browser ajax. Handling callbacks, passing values as json or other data format is straight forward. Moreover, there are simplified versions of the **$.****ajax()** method for just **$.****get()** for loading a url, **$.****getJSON()** for loading json data and **$.****post()** method for posting data to the  server (using POST method).
  5. Plugin System
  
    One is able to extend jquery by plugins. Jquery plugins are usually additional javascript code which is overloaded to the Jquery object, allowing to achieve components, effects and easy tasks like **$(element).grid()**, **$(element).treeview()**, **$(element).editable()** etc. the Jquery website hosts thousands of useful plugins for free use, all categorized by its relevance - you don't need to reinvent the wheel - some of it is already there (if not all) and you can use it, extend it and learn from it.
  6. Worldwide community support
  
    Jquery is being used by many (millions&#8230;). Microsoft officially <a title="Microsoft support jquery library" href="http://www.microsoft.com/web/library/details.aspx?id=microsoft-adopts-open-source-jQuery-JavaScript-library" target="_blank">supports</a> this library integrating tools in its developer web tools, the web is full with tutorials, mentors and help using jquery for any project or use.
  7. Excellent Event Management System
  8. jquery has a very convenient event management. you can bind events easily and you get an event object (again, cross-browser) with useful properties. One addition that I like is the ability to have a namespace for any event, i.e.:
  
     **$(&#8216;#myId').bind(&#8216;click.anyObject')**.
  
    Now, when myId is clicked, it will trigger a click with the additional property of "anyObject" as a namespace. In fact, you can use this namspace again for more objects.
  9. Getting form element values
  
    Again. the elegant way of getting values from any form element is simply as: **$(&#8216;#someFormElement').val()**.
  
    However, you can also use the form function $(&#8216;myForm').serialize() to retrieve a query string which includes the form elements with their values ready to be sent with an ajax call.
 10. Get the source dom element
  
    Sometimes, you'll want to use the source dom element resulted in your jquery object,so you can finally revert back and get the reference source dom object easily with: **$(&#8216;.myClass').get(5);** (where you can use any index to get any object in the jquery result set).

These are some of my 10 good reasons for using jquery. I'm sure there are a lot of other good reasons for using jquery in your projects. It's fast, it's dynamic, it's open source, it's cross-browser and it's beautiful and elegant. I'm sure once you start developing with it, you'll feel very comfortable and you'll get the feeling of where it can assist you and save time while writing elegant code.