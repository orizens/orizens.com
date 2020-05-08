---
id: 750
title: First Steps In Setting Up Travis CI To Your Javascript Project
date: 2015-02-04T11:20:52+00:00
author: Oren Farhi
templateKey: blog-post
layout: post
guid: http://orizens.com/wp/?p=750
permalink: /blog/first-steps-in-setting-up-travis-ci-to-your-javascript-project/
dsq_thread_id:
  - "3484339018"
image: ../img/uploads/2015/02/travis-e1423042196923.jpg
categories:
  - AngularJS
  - CI
  - git
  - gulp.js
  - javascript
  - learning
  - open source
  - travis
tags:
  - ci
  - howto
  - javascript
  - learning
  - nodejs
  - open source
  - travis
---

I've been developing my projects with <a title="Decluttering your Gruntfile.js (organizing grunt)" href="http://orizens.com/wp/blog/decluttering-your-gruntfile-js/" target="_blank">build processes</a> for quite some time now. At some point I added unit tests and end to end to my javascript project. In this post i'd like to share some simple steps I did in order to add Continuous Integration to my <a title="Echoes Player" href="http://github.com/orizens/echoes" target="_blank">open source project</a>, <a href="http://echotu.be" target="_blank">Echoes Player</a>, using <a title="Travis CI in the cloud" href="http://travis-ci.org" target="_blank">Travis</a>.<!--more-->

From the docs of Travis: "Travis CI is a hosted continuous integration service. It is integrated with GitHub and offers first class support" - For many programming languages.

With Travis, you actually get a machine on the cloud (Ubuntu) that you can use it to run tests for your Github projects on each push as well as pull request.

I recently added unit tests to the new version of Echoes, and I was missing that Travis link in my <a title="Github Workflow & “Feature Toggles”" href="http://orizens.com/wp/blog/github-workflow-feature-toggles/" target="_blank">development workflow</a>. There are many good reasons to use CI, amongst - getting a free cloud virtual machine for running tests and deploying. For a long time i wanted to integrate Travis to my open source projects - and in this post i describe how i started with one of my <a href="https://github.com/orizens" target="_blank">open source projects</a> - Echoes Player..

<img class="alignleft  wp-image-751" src=".../../img/uploads/2015/02/Screen-Shot-2015-02-04-at-10.04.29-AM-1024x332.png" alt="Screen Shot 2015-02-04 at 10.04.29 AM" width="737" height="239" srcset=".../../img/uploads/2015/02/Screen-Shot-2015-02-04-at-10.04.29-AM-1024x332.png 1024w, .../../img/uploads/2015/02/Screen-Shot-2015-02-04-at-10.04.29-AM-300x97.png 300w, .../../img/uploads/2015/02/Screen-Shot-2015-02-04-at-10.04.29-AM-700x227.png 700w" sizes="(max-width: 737px) 100vw, 737px" />

## How to setup Travis for your Github Project

Travis works well (and only) with github - and the steps for adding it are quite easy.

### Preparation - travis.yaml file

First, you need to setup few configurations in your github project.

Travis uses a ".travis.yaml" configuration file to tell Travis what kind of environment the tests run (nodejs).

```typescript
language: node_js
node_js:
  - "0.10"
branches:
  only:
    - angular
before_script:
  - npm install -g bower
  - npm install -g gulp
  - npm install phantomjs
  - npm install -g karma
  - bower install
  - gulp build
  - gulp style
```

Aside from being self explanatory, at this point i wanted Travis to run tests on the angular branch only - so i easily marked that with the "**branches**" section.

Also, since the unit tests require some npm modules to be installed on the environment it will run, I indicated the actual npm modules installation commands that will run before Travis runs the test in the "**before_script**" section. Those will run prior to the "**npm install**" that Travis will run in order to install additional npm modules that are configured in the project's "**package.json**" file.

I like the yaml addition, because aside from Travis using it to understand the requirements to run the tests, It is also serves as a requirements documentation for my project - in case someone wants to fork and run the tests on a different machine.

Additional <a title="Travis Docs" href="http://docs.travis-ci.com/user/build-configuration/" target="_blank">yaml build configurations</a> are available on travis's docs.

### Preparation - package.json file

For historical reasons, the yaml file needs to be present in all the **active** branches. So, since some of the branches in Echoes project are completly different in code base, I just did a cleanup of old inactive branches and adde d the yaml file to the <a href="https://github.com/orizens/echoes/branches" target="_blank">active branches</a>.

Since my project is based on javascript and the tests run on the nodejs platform, it already has a package.json file.

Travis uses the convention of "**npm test**" to run the tests. I configured this command within the "scripts" property to actually run "**gulp test**" (configured in <a href="https://github.com/orizens/echoes/blob/angular/gulp/test.js" target="_blank">test.js</a>)**.**

Up until using Travis, the tests were configured to run with karma runner, and never end (so i can develop with tdd in practice). In karma runner, the flag for this is "singleRun" set to false. In Travis, the tests need to run once. Travis expose an environmental variable in nodejs process. So, in order to adjust to it, I simple read the TRAVIS variable and set the "singleRun" to true when running in TRAVIS.

```typescript
var gulp = require("gulp")
var karma = require("karma").server
var isTravis = process.env.TRAVIS || false
var pathToKarmaConf = __dirname.replace("/gulp", "")

module.exports = gulp.task("test", function(done) {
  console.log("isTravis", isTravis)
  karma.start(
    {
      configFile: pathToKarmaConf + "/karma.conf.js",
      singleRun: isTravis,
    },
    done
  )
})
```

The result of Travis running the build is output to travis dashboard (the same output that the terminal output when running the tests in mac's terminal):

[

<img class="  wp-image-755 aligncenter" src=".../../img/uploads/2015/02/Screen-Shot-2015-02-04-at-11.33.00-AM-1024x693.png" alt="Screen Shot 2015-02-04 at 11.33.00 AM" width="660" height="447" srcset=".../../img/uploads/2015/02/Screen-Shot-2015-02-04-at-11.33.00-AM-1024x693.png 1024w, .../../img/uploads/2015/02/Screen-Shot-2015-02-04-at-11.33.00-AM-300x203.png 300w, .../../img/uploads/2015/02/Screen-Shot-2015-02-04-at-11.33.00-AM-517x350.png 517w" sizes="(max-width: 660px) 100vw, 660px" />](.../../img/uploads/2015/02/Screen-Shot-2015-02-04-at-11.33.00-AM.png)

## Connect Travis To Your Github Project

After you prepared your github project with the yaml file, these are the steps you need to do in order to connect the project to Travis.

### Step 1 - Register To Travis

You need to have a github account - sign in with your account to Travis.

### Step 2 - Activate Access To Repositories

Once you're signed in, in the Profile page, under Repositories tab, you can turn on /grant (currently there are switches) access to Travis for your repositories that you want Travis to watch and run builds.

### Step 3 - Initiate The First Build

Once Travis has access to the github account and project, it adds a github web hook - that's how Travis watch the project for any new commits or pull requests - and knows by default to run the builds.

### Final Fun Step

After the tests run, you can add a build status image to your repository. Travis offers few presets you can copy & paste in order to use the build status badge anywhere. I took the markdown snippet and added it <a href="https://github.com/orizens/echoes/blob/angular/README.md" target="_blank">Echoes readme.md</a>.

<img class="  wp-image-753 aligncenter" src=".../../img/uploads/2015/02/Screen-Shot-2015-02-04-at-11.10.15-AM-1024x594.png" alt="Screen Shot 2015-02-04 at 11.10.15 AM" width="571" height="331" srcset=".../../img/uploads/2015/02/Screen-Shot-2015-02-04-at-11.10.15-AM-1024x594.png 1024w, .../../img/uploads/2015/02/Screen-Shot-2015-02-04-at-11.10.15-AM-300x174.png 300w, .../../img/uploads/2015/02/Screen-Shot-2015-02-04-at-11.10.15-AM-603x350.png 603w, .../../img/uploads/2015/02/Screen-Shot-2015-02-04-at-11.10.15-AM.png 1310w" sizes="(max-width: 571px) 100vw, 571px" />

## Summary

Adding Travis to Echoes was both fun and interesting. Aside from running tests locally when i'm developing, I can rest assure that there's another assistance from Travis - and if there are pull requests for Echoes - Travis will run the tests for me and notify (via email) and something went wrong.

Adding to my development workflow Cloud Continuous Integration with Travis feels like another great addition to both the health of the project and the development & deployment cycle.

There are additional actions that can be configured using Travis - like deployment - so i'm looking forward to explore it and possibly write a review.
