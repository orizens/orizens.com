---
id: 693
title: 'Fuseday Experiments - working with Google Web Starter Kit & React.js'
date: 2014-07-03T07:42:28+00:00
author: Oren Farhi 
templateKey: blog-post
layout: post
guid: http://orizens.com/wp/?p=693
permalink: /blog/fuseday-experiments-working-with-google-web-starter-kit-and-reactjs/
dsq_thread_id:
  - "2814089399"
image: ../img/uploads/2014/07/IMG_20140702_125555.jpg
categories:
  - css
  - google
  - gulp.js
tags:
  - css
  - front end framework
  - goolge
  - gulpjs
  - web framework
---
At <a href="http://tikalk.com" target="_blank">Tikal</a>, we are conducting 2 times a year something called "Fuseday" - a day where we choose some technologies to experiment with while building a small application. In this post, i'de like to share my group's focus on Google's Web Starter Kit - it's pros and cons.
  
<!--more-->

## The Application

The app we were supposed to develop supposed to get a stream of tweets from an api call, and present them in a nice UI in the browser.

We had to integrate some graphs and charts as well as an interactive UI to play with the data.

My team managed to fulfill some of the requirements during this day.

## The Chosen Technologies

On the client side, we chose to experiment with new or trending libraries/frameworks. We chose the following:

  1. React.js - as a growing trend for performance in rendering web pages in the client - we feel that we had to test the workflow with React.js.
  2. Gulp.js - Gulp is trending to replace grunt.js as a node.js based task runner / automation tool.
  3. d3 - mvd3 - we feel that d3 is high in trends - so in order to take the high level of d3, we chose mvd3 as a subset of d3 in order to create pie and line charts.
  4. Google Web Starter Kit - with v2 released just 6 days ago, while in beta, we decided it can be quite refreshing to step out of the bootstrap world and experiment with a new set of css front end framework.

## Google Web Starter Kit

After briefly reading the introduction page, I downloaded the zip file - which contained the following:

  1. 2 html templates for starting a project
  2. A ready to use gulpfile with configuration for running builds, server task and more
  3. a style guide directory - which includes a demonstration of the various ui elements included in this kit
  4. sass source files - for tweaking the settings of the ui elements in order to create a different "skin"

as a foot note - after reading carefully the documentation of this kit, I discovered that you can clone the repo of this kit and follow a more organized procedure in order to get started.

### 

### Style Guide

This directory includes an index.html file which outlines the various features this kit offers.

There are many examples of what can be used form this kit:

  * Typography
  * Buttons
  * Lists
  * Links
  * Icons
  * Breadcrumbs
  * Table
  * Grid
  * Colors
  * Highlights
  * Editorial header
  * Article section
  * Guides section
  * Page header
  * Quote
  * Featured icons
  * Featured spotlight
  * Featured list
  * Featured block
  * Article navigation

The css classes definitions follows the nice BEM concept - while keeping the semantics of the classes easy to follow and grasp (in this short day). Overall, Google's Kit is minimal, both in style and in features - however, I can see how it can be nicely integrated with web components to create more UI element and complete reusable modules. It's built in media queries for various devices view ports and it's built in navigation and sidebar menu are awesome.

## React.js

Starting to code with react.js was a challenge. I did find the tutorial on their website quite easy easy to follow. Still, the syntax feels a little bit awkward, but the overall concept may free your mind and lead you to think - component style.

I do see the benefit gained from using react in large scale app like facebook, however - one has to design his component slowly as well as understand and getting to know react.js deeper. The data binding feature (let it be "state" - future binding - or "props") works as expected.

I was missing the good old html templating integration in react. Also, the use of almost html syntax inside javascript did led to confusion when you need to add attributes - and you need to start thinking again in js terms. i.e, if you need to add the attribute of a class to an "html" template in a react component, you would have to address it as "className" (as in pure javascript).

## Gulp.js

Although gulp.js was intended to be investigated, we didn't quite reach it too much. We used it mostly for local server solution rather than its build task - which was broken (on Mac). Overall, it's "watch" task and live reload worked as expected and with any code change, the browser refreshed automatically.

You can find the <a href="https://github.com/orizens/fuse-jun14-loitfos-client" target="_blank">sources and code for the POC at github</a>.