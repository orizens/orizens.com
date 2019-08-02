---
id: 727
title: 'Github Workflow & &#8220;Feature Toggles"'
date: 2014-10-15T06:28:44+00:00
author: Oren Farhi 
templateKey: blog-post
layout: post
guid: http://orizens.com/wp/?p=727
permalink: /topics/github-workflow-feature-toggles/
dsq_thread_id:
  - "3118310471"
image: ../../img/uploads/2014/10/git-workflow-edit-e1421241770538.jpg
categories:
  - AngularJS
  - git
  - learning
  - open source
  - thoughts
tags:
  - angular.js
  - git
  - github
  - vcs
---
I'm working with git & github as a vcs for the last 3 years. It's a great concept, and github has supplied great tools for development workflow and keeping the development process documented in a well user interface system.

Recently, I was introduced to the concept of &#8220;Feature Toggles" in software development.<!--more-->

* This is a guest post that was posted to <a title="Tikal's Blog" href="http://tikalk.com/node/12448" target="_blank">Tikal's professional blog</a>.

## Preface - What is &#8220;Feature Toggles"

The demand from the development team was to start supporting in &#8220;feature toggles" while developing, and push all code to the master branch - while having no separate branches - known as - feature branches. That, in order to support Continuous Integration, Automation Tests often and avoiding complicated merge.

As a background, &#8220;Feature Toggles" (or &#8220;feature bits") means, that each feature in the application is configurable and can be turned on or off in any time without causing errors on all development layers - let it be ui, server and data base. Practically during the development cycle of a feature, it is in an &#8220;off" mode, until all relevant layers are developed and are ready to introduce the feature. Meantime, all code relevant to this feature is pushed to the &#8220;master" branch, but not &#8220;active" in ui or server.
  
the pros for that are (as given):

  1. it promotes CI.
  2. allows testing earlier
  3. prevents complicated merge flow / conflicts
  4. business oriented - allows to toggle features based on user roles, permissions or customer regulations (that's a business perspective, though)

This is a good example of <a href="https://github.com/mjt01/angular-feature-flags" target="_blank">implementing &#8220;feature toggles" with angular</a>.

## Dilema with &#8220;Feature Toggles" Workflow

The idea of not using <a href="http://nvie.com/posts/a-successful-git-branching-model/" target="_blank">feature branches</a> and having only one branch to work on led me to confusion.
  
I wanted to find out if using &#8220;Feature Toggles" is a common practice nowadays and whether it contradicts with &#8220;feature branch":

  1. what happens with the history of a feature?
  2. how do I group several commits under a feature development cycle?
  3. what if I want to remove this feature from the code?

## Solution - Github Workflow

So - I was glad to find out that the concept of &#8220;Feature Toggles" doesn't contradicts with developing iwth feature branches.
  
On the contrary, the two concepts works well together, and even - should.

A reference to <a href="http://scottchacon.com/2011/08/31/github-flow.html" target="_blank">Scott Chacon blog post on github workflow</a> and an official <a href="https://guides.github.com/introduction/flow/index.html" target="_blank">github workflow</a> really shed some light on this dilema.

### The Strengths Of Github Workflow

I have found out few advantages of using the github workflow:

  1. promotes safer deployable master branch
  2. promoting code-reviews/testing etc before merging to master
  3. promotes CI
  4. visibility of work to the team
  5. you can use Hubot - also for FUN :), deploy process becomes easier for all

Having the above approach to go with &#8220;feature branch" led me to wonder what to do with branches that were merged to master.
  
Since the content and author of the code is preserved, it is safe and preffered to delete these branches (if there's no other use for them). And still, it is clear what are the active branches and who's working on them just by viewing teh branches.

Another approach combines some of the above:

  1. Work with a Branch model (feature/ hotfix/ bug/ chore/)
  2. CI works on all branches with Pull Requests
  3. Once code is in master you can use any type of feature flag you want. &#8220;rollout" can be used, which is a redis based feature rollout system.
  4. Any branch can be deployed to any environment and not just master, meaning you can deploy a specific feature branch for any amount of time you may want.

To conclude, having Scott's approach seems to win the case for my dilema - It is resonable, takes into an account team work, promotes discussion while saving a certain protocol, and eventually allows Continous Integration & Delivery.