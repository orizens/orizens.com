---
id: 436
title: 'Sublime Text &#8220;Modific&#8221; Plugin &#8211; Changes since last commit'
date: 2012-06-29T08:34:09+00:00
author: Oren Farhi 
templateKey: blog-post
layout: post
guid: http://orizens.com/wp/?p=436
permalink: /topics/sublime-text-modific-plugin-changes-since-last-commit/
shareaholic_disable_share_buttons:
  - "0"
shareaholic_disable_open_graph_tags:
  - "0"
dsq_thread_id:
  - "750801269"
image: ../../img/uploads/2012/06/camera_Stop_Hassel.jpg
categories:
  - javascript
  - tools
tags:
  - free
  - javascript
  - tools
---
<a title="My Favorite Text Editor for Web Development" href="http://www.sublimetext.com/" target="_blank">Sublime Text</a> is my <a title="Javascript IDE’s? yes!" href="http://orizens.com/wp/topics/javascript-ides-yes/" target="_blank">favorite text editor for any web development &#8211; javascript, css & html</a>. It&#8217;s fast, has a very minimalist and slick user interface and amazingly and easily can be customized with plugins.
  
One of the features that I like most in an editor is the ability to see visually code that has been changed since the last commit. Some editors has that feature built in if the VCS allows such a feature (github, mercurial, subversion etc).
  
Sublime Text doesn&#8217;t. But, since it can be customized easily with python and a dedicated plugin API, among the many plugins available, i&#8217;m using one which is integrated nicely into the editor.
  
<!--more-->

## The &#8220;Modific&#8221; Plugin

So, github&#8217;s user <a title="Modific Plugin" href="https://github.com/gornostal/" target="_blank">gornostal</a> has created this amazing <a title="Modific for Sublime Text" href="https://github.com/gornostal/Modific#readme" target="_blank">Modific</a> plugin for sublime text.
  
Currently, This plugin works directly with these version control systems: <a title="Github" href="https://github.com/" target="_blank">github</a>, <a title="Mercurial" href="http://mercurial.selenic.com/" target="_blank">mercurial</a> and <a title="Subversion" href="http://subversion.tigris.org/" target="_blank">subversion</a>.

## The Benefits of using Modific

Lets cut to the chase &#8211; what are you getting from using Modific?

### Highlights changes inside sublime

It highlights changes in your code since the last commit with little green/yellow/pinkish dots right next to the row number (dots can be customized to other indicators). Meaning &#8211; your code must be in one of those repositories for the plugin to work correctly.
  
<a href=".../../img/uploads/2012/06/changes.png" rel="lightbox"><img title="changes" src=".../../img/uploads/2012/06/changes-300x265.png" alt="" width="300" height="265" /></a>

### Shows the Diff&#8217;s of the code

With the magic shortcut of &#8220;ctrl + alt + D&#8221;, a new tab will be opened in sublime, with a full detailed log of the current differences &#8211; added, changed or deleted &#8211; highlighted as well in this files with corresponding color.
  
<a href=".../../img/uploads/2012/06/diff.png" rel="lightbox"><img title="Modific &quot;Diff&quot; screenshot" src=".../../img/uploads/2012/06/diff-300x200.png" alt="" width="300" height="200" /></a>

### Preview Changes In Console

Again, with a magic shortcut of &#8220;ctrl + alt + C&#8221;, a sublime console will opened at the bottom, displaying the last committed code in your repository respectively to the current selected row.
  
<a href=".../../img/uploads/2012/06/preview.png" rel="lightbox"><img class="alignnone size-medium wp-image-445" title="preview" src=".../../img/uploads/2012/06/preview-300x161.png" alt="" width="300" height="161" srcset=".../../img/uploads/2012/06/preview-300x161.png 300w, .../../img/uploads/2012/06/preview.png 884w" sizes="(max-width: 300px) 100vw, 300px" /></a>

## Summary

<a title="Modific Plugin for Sublime Text Editor" href="https://github.com/gornostal/Modific#readme" target="_blank">&#8220;Modific&#8221;</a> is a great tool for tracking down changes in the current file you&#8217;re working on, or as an overall tracker for changes made in you project since last commit. Installation and usage instructions are provided within <a href="https://github.com/gornostal/Modific#readme" target="_blank">the github&#8217;s project page.</a>