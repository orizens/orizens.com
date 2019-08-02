---
id: 631
title: How To Use Git in Bitbucket and get Free Private Repositories
date: 2013-11-10T12:27:17+00:00
author: Oren Farhi 
templateKey: blog-post
layout: post
guid: http://orizens.com/wp/?p=631
permalink: /topics/how-to-use-git-in-bitbucket-and-get-free-private-repositories/
dsq_thread_id:
  - "1953172481"
image: ../../img/uploads/2013/11/camera_Sophia_Metal_Hassel.jpg
categories:
  - bitbucket
  - git
tags:
  - bitbucket
  - git
  - vcs
---
I mostly use git & github for my projects. Git is very useful, easy to learn and handle. Github is great for cloud repositories, has very clean and useful user interface while adding useful features like: wiki, team collaboration, issues system, cloude ide to edit files and more.
  
Private repositories in Github aren't free. However, there's a way to enjoy git with having free private repositories using bitbucket - setup is quite easy.<!--more-->

## What is BitBucket

Bitbucket is a cloud hosting for repositories (same concept as Github). It can host Mercurial and Git respositories. Like Git, it also has useful features such as: wiki, issues system, team collaboration (free version is up to 5 users), cloud ide editor for files and almost same features as in Github. With a free, unpaid account, you can create unlimited private repositories.
  
<!--RndAds-->

## Step 1 - Create A Private Repository in Bitbucket

Creating a repository is quite easy.
  
After login to bitbucket, there's a "create" button on the top.
  
The screen will show a form for creating a new repository. There are 2 important fields to notice:

  1. Make sure the "Access Level" field with the checkbox of "This is a private repository" is checked.
  2. Make sure the "Respository type" is selected with the option of "Git"

[<img class="aligncenter size-full wp-image-632" alt="new-repo" src=".../../img/uploads/2013/11/new-repo.png" width="635" height="644" srcset=".../../img/uploads/2013/11/new-repo.png 635w, .../../img/uploads/2013/11/new-repo-295x300.png 295w" sizes="(max-width: 635px) 100vw, 635px" />](.../../img/uploads/2013/11/new-repo.png)

Upon successful creation, you'll be taken to the newely created repository page.
  
On the right, you'll find the link to this repository (you'll need that later to add it to git).
  
<img class="aligncenter size-full wp-image-633" alt="repo-link" src=".../../img/uploads/2013/11/repo-link.png" width="461" height="542" srcset=".../../img/uploads/2013/11/repo-link.png 461w, .../../img/uploads/2013/11/repo-link-255x300.png 255w" sizes="(max-width: 461px) 100vw, 461px" />

## Step 2 - Setup bitbucket to your git with "git remote"

If you ever worked with git and github, pushing new commits to github was done using something like:

```typescript


<!--RndAds-->


  
This means that git will push the current local commited branch (in this case - "master")
  
Amongst its many features, Git can have several destinations to which a code can be pushed.
  
It is called "git remote" - a remote repository to which a code can be pushed.
  
To setup such a remote we need to open the command line/terminal within the folder of the git we want to setup, and use:

```typescript


I.e, here we setup a git remote with the nickname of "orizens" to a certain bitbucket url:

```typescript


That's it!

## Step 3 - Push Git to Bitbucket

Now, in order to push the master branch to the newely defined remote repository "orizens", we'll simply use:

```typescript


You can do the same for "fetch" operation.
  
<!--RndAds-->


  
A remote repository in git can be renamed, removed and <a href="http://git-scm.com/book/ch2-5.html" target="_blank">more</a>.
  
I.e, in order to see the remotes attached to a certain repository, you can use:

```typescript


The "-v" switch is optional, and will also print to the console/terminal the url of each remote.