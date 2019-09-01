---
id: 20190830
title: "From Wordrpess to React, Gatsby And Netlify - Now In Orizens.com"
date: 2019-08-30T04:09:35+00:00
author: Oren Farhi
templateKey: blog-post
layout: post
permalink: /blog/react-gatsby-and-netlify-now-in-orizens/
dsq_thread_id:
  - "20190830"
image: ../img/uploads/netlify-deployed.png
categories:
  - React
  - Gatsby
  - Netlify
tags:
  - react
  - gatsby
  - netlify
---

That's it! Today I switched from my wordpress based website to the JAM stack: React, Gatsby and Netlify. I've been planning this migration for months - and i'm quite happy with the both the journy i had and the final outcome. Also, today is my oldest son 10th birthday - and i promised him that as a gesture for his birthday - i'll upload my new website and so I did.

This article is not about Angular, NgRx - this is actually an intro to a series of articles i'm planning to publish on my journey of migrating my wordpress based website to the new react-gatsby netlify stack.

A year ago, I rememebr reading how static websites have become popular, and how using cloud services and automatic deployment makes the process of publishing a new post that easy. Since then, I was facinated about the idea and started to check out recommendations for new solutions and stacks.

I first read about Hugo and Wordpress - but after reading an intro article - i decided to drop the idea. After a while, I read about creating static websites with our favorite front end frameworks - Angular & React.

Gatsby caught my attention as the "goto" solution - as I was reading articles that combined netlify as both a deployment solution and a free SSL certificate for custom domains - since then, I added an item to my todo list - "migrating from wordpress to gatsby".

My hosting cycle is renewing each year in November - so, although it's about two months away from now, and since I made my boy a promise to release this new website on his 10th birhtday, I commited to the plan, and released Orizens.com **Version Guy10** (named after my son, Guy). Guy - this is for you - 🥳🎉 Happy Birthday 😊⚽!

### Lessons Learned

I learned a lot from migrating to [gatsby](https://www.gatsbyjs.org) and using react as well.

- I rediscovered the component architecture in front end
- I made a full CI & CD in seconds with [netlify](http://netlify.com)
- I decided to experiment with a [Bulma new css framework v0.7](https://bulma.io)
- I learned some graphql

Soon, the develpoment of my new website was available offline, fast, easy to update and deploy. Whenever I had to make a change and update, i did that instantly.

However, there were some caveates as well - like with anything you start out from scratch and have to read lot, trial and discover. Setting up the new dev environment, setting up a contact form, adding new pages, learning the new graphql and the entire gastby eco system, restoring the features i had in my wordpress blog (like using disqus and code highligh) - that's a lot - but possible. I decided to take it step by step and make the effort to release an initial thourough version that I can improve easily after.

In the next articles there are going to be more code and architecture examples explaining the process i had and some decisions i took while developing the new website.

This article will probably be updated with some new links and information.

Stay tuned for more.
