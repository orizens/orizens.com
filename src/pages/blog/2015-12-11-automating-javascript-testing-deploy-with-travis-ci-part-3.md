---
id: 865
title: 'Automating Javascript Testing, Deploy with npm & Travis CI to Github (part 3)'
date: 2015-12-11T15:07:42+00:00
author: Oren Farhi 
templateKey: blog-post
layout: post
guid: http://orizens.com/wp/?p=865
permalink: /topics/automating-javascript-testing-deploy-with-travis-ci-part-3/
dsq_thread_id:
  - "4395222818"
image: ../../img/uploads/2015/12/travisdeploy.jpg
categories:
  - AngularJS
  - CI
  - git
  - javascript
  - nodejs
  - testing
  - travis
tags:
  - angular.js
  - architecture
  - ci
  - github
  - javascript
  - travis
---
Not long ago, I wrote about <a href="http://orizens.com/wp/topics/first-steps-in-setting-up-travis-ci-to-your-javascript-project/" target="_blank">my experience</a> and <a href="http://orizens.com/wp/topics/my-setup-for-testing-js-with-jasmine-karma-phantomjs-angularjs/" target="_blank">setup of Travis CI</a> for running javascript testing (on an angular based web application) on my <a href="http://github.com/orizens/echoes" target="_blank">open source project</a>, <a href="http://echotu.be" target="_blank">Echoes Player</a>. On last week, I completed my setup with an auto deployment - in which I share the solution that worked for me.<!--more-->

## Initial Setup

<a href="http://echotu.be" target="_blank">Echoes Player</a> is a pure web ui application for playing and managing media from youtube. The backend for this app is <a href="https://developers.google.com/youtube/v3/docs/" target="_blank">youtube's data api</a>. The current version of Echoes is wrapped with <a href="http://angularjs.org" target="_blank">angularjs</a>.

It is developed with bdd in mind, using <a href="http://jasmine.github.io/2.3/introduction.html" target="_blank">jasmine.js</a> as a testing framework in order to write tests, spy on functions and setup expectations.

To run the tests, I use <a href="http://karma-runner.github.io/" target="_blank">karma test runner</a> - which orchestrates the environment setup to run the tests.

When the project is developed or run in Travis, I use <a href="http://phantomjs.org/" target="_blank">Phantomjs</a> as the javascript engine to run the tests on. Karma also <a href="http://karma-runner.github.io/0.13/config/preprocessors.html" target="_blank">preprocesses</a> some source files in order to compile code from es2015 to es5, convert templates to compiled templates (optimisation for angular) and more.

## CI with Travis

Up until a week ago, I used Travis as a second protection for running javascript unit tests. <a href="http://travis-ci.org" target="_blank">Travis</a> is a cloud service for continuos integration and deploy. Those javascript unit tests ran on each commit and pull request that was pushed to echoes repository. In Travis I also successfully integrated <a href="http://browserstack.com/" target="_blank">browserstack</a>, in order to run e2e tests of the new repository version on a selected remote group of browsers.

With this setup, whenever there were errors in tests or in build, I was informed by email to the right spot. It is very powerful workflow.

## Release with npm

Echoes Player is deployed to github pages (remember - it's a ui based app), so, all I had to do is push a new version of bundled code to <a href="https://github.com/orizens/echoes/tree/gh-pages" target="_blank">gh-pages branch</a> of my repository.

The preparation for release involves several steps to take before pushing to github the new code. For that, I'm using <a href="https://docs.npmjs.com/misc/scripts" target="_blank">npm's scripts feature</a> - I defined a custom script - "release" - script that will run the required operations before i can commit to github.

```typescript
"scripts": {
    "test": "gulp test && protractor ./gulp/config/protractor.conf.bs.js",
    "release": "gulp dist:prepare && gulp build && gulp style && gulp assets && gulp dist && gulp dist:rev"
  },
```

## Automating Deployment to Github with Travis

The new addition to echoes ci scripts added automatic deployment to github after a successful unit tests session. Adding this step was a bit of challenge, after reading a <a href="https://gist.github.com/domenic/ec8b0fc8ab45f39403dd" target="_blank">few</a> <a href="http://benlimmer.com/2013/12/26/automatically-publish-javadoc-to-gh-pages-with-travis-ci/" target="_blank">articles</a> things still didn't work as expected. Only after experimenting with my own configuration and understanding, I finally completed the ci flow to be complete with Travis.

I took the approach of pushing a new version of code to gh-pages while not keeping the history. This approach simply worked after many other tries.

## The steps for adding Auto Deployment in Travis

First, create a new <a href="https://github.com/settings/tokens" target="_blank">github token for travis</a> and <a href="https://docs.travis-ci.com/user/encryption-keys/" target="_blank">generate an encrypted travis key</a> (there's also an <a href="https://www.npmjs.com/package/travis-encrypt" target="_blank">npm package</a> for generating Travis tokens with **node**).

Then, I added the secured key to the yml file - Usually, the token generation process will **prompt** to add the new key to your project's yml file.

finally, add this **after_success** step:

```typescript
after_success:
- git config --global user.email "mu-user-name@for-github.com"
- git config --global user.name "travis-ci"
- npm run release
- cd dist
- git init
- git add .
- git commit -m "deployed new version from travis"
- git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" master:gh-pages > /dev/null 2>&1
```

few notes on the **after_success** flow:

**First**, I setup my username email of github in travis virtual machine.

**Second**, I'm using "**npm run release**" script that I defined. Eventually, this script created a "dist" directory, which includes a bundled minified version of the app (ready to deploy).

**Finally**, the process shifts to the dist directory, creates a new git repository, add & commit the files to the local repository and with the new secured github token, push this directory contents to echoes repository (and also overrides the history for this branch).

#### A Note about not keeping the history:

I tried several commands for checking out the actual gh-pages of echoes in order to keep the history, but have come to a dead end each time. I do see a reason to keep history of production version with some strategy (release tags, commit messaged or other) so I'm still investigating this.

## Final Notes

Adding that **after_success** step to the ci workflow has pushes echoes project to a full e2e ci & cd workflow using cloud services only (github, travis and browserstack). Now, I can be sure that a production version has been deployed automatically any time after whole of the tests passed.

Zen.