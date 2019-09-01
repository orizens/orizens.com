---
id: 373
title: Javascript IDE’s? yes!
date: 2011-10-27T11:55:30+00:00
author: Oren Farhi 
templateKey: blog-post
layout: post
guid: http://orizens.com/wp/?p=373
permalink: /blog/javascript-ides-yes/
shareaholic_disable_share_buttons:
  - "0"
shareaholic_disable_open_graph_tags:
  - "0"
categories:
  - ide
  - javascript
  - notepad++
---
Lately, I am surprised of how javascript is perceived with people who are not so familiar with the new era of javascript.
  
Javascript has stepped up in its significance as a development language quite high in the last 3-4 years and it still does.
  
With javascript becoming so popular for developing almost any field: server side, database, client, mobile devices, cable boxes, games (and I can continue wit this list - but i won’t), the need for a proper IDE arises.
  
<!--more-->


  
<!--RndAds-->

<h2 dir="ltr">
  What is a proper IDE?
</h2>

First, let us take a look at wikipedia’s definition for an [IDE](http://en.wikipedia.org/wiki/Integrated_development_environment):
  
“An integrated development environment (IDE) (also known as integrated design environment, integrated debugging environment or interactive development environment) is a [software application](http://en.wikipedia.org/wiki/Software_application) that provides comprehensive facilities to [computer programmers](http://en.wikipedia.org/wiki/Computer_programmer) for [software development](http://en.wikipedia.org/wiki/Software_development)”.
  
By definition, an IDE consists of:

  1. source code editor
  2. compiler/interpreter
  3. build automation tools
  4. a debugger

<h2 dir="ltr">
  So - What these have to do with javascript?
</h2>

<h3 dir="ltr">
  Source Code Editor
</h3>

There many source code editors which include support for javascript. Again, by definition, a source code editor have features designed to simply and ease the development process: color syntax, auto-complete, object/class browser, code templates, code refactoring and much much more.
  
All of the above exist for javascript as well.

<h3 dir="ltr">
  Compiler/Interpreter
</h3>

Until the rise of popular compilers for javascript such as CoffeeScript, the compiler javascript developers worked with was actually a JIT compiler-  “just in time” compiler - or to put in simple words - the browser.
  
The browser compiles and interpret javascript code to machine code, which is usually formalize in what the end user sees as UI interactions (off course, there are also unseen operations that may run in the background).

<h3 dir="ltr">
  Build Automation Tools
</h3>

To put in simple words, build automation tools are macros which make repetitive tasks a breeze. Such tasks may include packaging, running tests, deployments, creating documentations etc.
  
Nowadays, there are tools for packaging javascript code - compressing, obfuscating, combining files by dependencies and more. There are also tools for generating documentations and running some tests on the code.

<h3 dir="ltr">
  Debugger
</h3>

Again, the debugger feature goes to the browser - which is the most common method for debugging javascript - and practically, the most convenient.
  
Javascript debuggers such as Chrome Developer Tools and Firebug offer: breakpoints and conditional breakpoints, watch expressions, logging requests and responses, live editing and more. There are several IDE’s which offer built in debuggers as well.
  
<!--RndAds-->


  
So, to summarize the above, IDE is a set of tools designed for developing. A javacript IDE may be an integration of a browser and a code editor. I want to present some of IDE’s available for javascript developement.

<h2 dir="ltr">
  A List of Javascript IDE’s
</h2>

<h3 dir="ltr">
  <a href="http://www.jetbrains.com/webstorm/">Jetbrains WebStorm</a> (commercial)
</h3>

<div>
  <img id="internal-source-marker_0.6913349931128323" src="https://lh5.googleusercontent.com/7jyUA3ZzEst0ssmVGnPyidsPIJrMlUUqPWL6E5R_i0jLfRKx6aAcXtqIAhkIEbGmeG8E0FGP1Mr2zFmzucJdfVMvT641Oel7E7FSX0jEcXKZ54gVIN0" alt="" width="316px;" height="237px;" />
</div>

Webstorm is a cross platform IDE designed for web development with Javascript, HTML5, CSS, SQL and more.
  
It offers IntelliSense code completion, object-class browser, refactoring tools, code navigation in a click, various js frameworks support, code analysis, FTP tools, Version Control integration (VCS)

<h3 dir="ltr">
  <a href="http://www.aptana.com/">Aptana</a> (free)
</h3>

<div>
  <img id="internal-source-marker_0.6913349931128323" src="https://lh3.googleusercontent.com/_jXqj3bYysjL3d42Fpw3SmfxnJQqPg38KCisGgnvPDPSSyU2LCe3Rz9G6jOQ4jfQ_-NGtgK3WBqL1l7rrSFZ9byCOiF4sBdk3P8bV-220APpBmQxekk" alt="" width="313px;" height="192px;" />
</div>

Aptana (currently studio 3) is a cross platform IDE supporting Javascript, HTML5, CSS, PHP, Python, Ruby and more. It is also available as an Eclipse plugin.
  
It supports code assisting, deployment tools, integrated debugger, plugins for extending the IDE capabilities and IDE customizations.

<h3 dir="ltr">
  <a href="http://netbeans.org/">Netbeans</a> (free)
</h3>

<div>
  <img id="internal-source-marker_0.6913349931128323" src="https://lh6.googleusercontent.com/xu2lTmcXYrNb5bp-bc4_ryGiGlsaybAqHQ8KRk7Rc4vwEvBu9Uy8TQ8grDPsVPSYIqndVYkAy2uUrz3d4XivLlK3oHG50atLNCowUf5eaGAxfgqE-UE" alt="" width="328px;" height="227px;" />
</div>

Netbeans is a cross platform IDE. Beyond being a JAVA IDE (as well as php), It also supports working with Javascript, html and css.
  
For Javascript, it supports IntelliSense code completion, object-class browser, refactoring tools, code navigation, js frameworks support, live code analysis, FTP tools, Version Control Integration, a debugger, project organizer, plugins and an IDE customization.

<h3 dir="ltr">
  User Defined
</h3>

<div>
  <img id="internal-source-marker_0.6913349931128323" src="https://lh4.googleusercontent.com/C99U7TH0fDLGv5U0IsxV-hGhsWn4NtIyMcTqBf8btn8kz7MqAIcJcjkMRYeo4j4cqxjebTDrCM_oWYwwA_v3GOlc1mU59Ut1yXeoS3eK1a207oO54_o" alt="" width="322px;" height="255px;" />
</div>

There are many more fine code editors for javascript. As I stated above, I see a Javascript IDE as a hybrid of browser and a source code editor (if looking at web ui development).
  
Currently, my editor of choice is notepad++.
  
it offers code completion for more than 30 languages, color syntax, object class browser (a plugin), FTP, file system integration, command line integration, command line scripts integration (i.e., I integrated a script for integration with TFS version control, plugins, low CPU consuming and world wide community support.There is also a movement towards online “cloud” based code editors, amongst - [Cloud9](http://c9.io/) and [akshell](http://www.akshell.com/).

<h3 dir="ltr">
  <a href="http://www.sublimetext.com/">Sublime Text</a> (commercial/free)
</h3>

[<img class="alignnone size-medium wp-image-398" title="sublime-text2" src=".../../img/uploads/2011/10/sublime-text2-300x187.png" alt="" width="300" height="187" srcset=".../../img/uploads/2011/10/sublime-text2-300x187.png 300w, .../../img/uploads/2011/10/sublime-text2-1024x641.png 1024w, .../../img/uploads/2011/10/sublime-text2.png 1446w" sizes="(max-width: 300px) 100vw, 300px" />](.../../img/uploads/2011/10/sublime-text2.png)
  
<!--RndAds-->


  
[edit 16/04/2012] Currently, I use Sublime Text (2) as my code editor. It has a very so many goodies:

  1. slick cool interface, theme support, file tabs as in Google Chrome
  2. many languages support
  3. community plugins with a plugins manager, which some of themBuilt in function lister (Ctrl + R)
  4. great jshint plugin (node based)
  5. intelli sense for js and more
  6. multi clipboard manager
  7. JavaDoc style Documentation generation tool
  8. Zen coding plugin (awesome!)
  9. Built in JS formatter
 10. build system
 11. navigate to: files in project, methods/functions in files
 12. split view with support to more than one instance
 13. snippets (dynamic code templates – ones where you can define various hot spots to walk through with TAB) and macros
 14. very keyboard oriented
 15. great ux – feels fast (only 25 MB for 2 instances !)
 16. a very good font rendering engine
 17. zooming in/out
 18. saving folders as project, ftp plugin.
 19. It is a free trial and after 30 days – you can still use it – however, it has a nag screen which prompts you that “you have to buy a license in order to use it”.

There are plenty other good IDE’s / editors which didn’t fit in to this post such as - Eclipse, Spekt, Komodo and more. If you feel you’re working with a good editor - let us know in the comments.