---
id: 20261127
pubDate: 2026-11-27T10:00:00+00:00
title: "Claude did it all - expect for the parts it coudn't"
author: Oren Farhi
layout: '@/templates/BasePost.astro'
# permalink: /blog/code-review-is-broken-in-the-age-of-ai/
dsq_thread_id:
  - ""
imgSrc: /images/blog/2026/20261127.jpg
tags:
  - ai
  - architecture
  - bdd
  - testing
  - spec-driven-development
  - code-review
  - claude
  - mobile-development
---

# The Result

Two days after I started, I had a working kosher-symbol scanner on my phone. Ten days in, it was on Google Play.

Claude wrote most of the code. This post is about the part it couldn't do.

The app is Kashrut Check. Point your phone at the kosher symbol on a package and it tells you which agency certifies it and whether it's on the recommended list. Offline, no account, photos stay on the phone.

## The Journey
I didn't start with code. I had Claude interview me for a spec first. Match on the device or in the cloud? Keep scan history? Hebrew from day one? I had written answers before the first commit, which went in the same day.

Matching runs on image embeddings. A small TFLite model turns the photo into a vector, and the app compares it with the vectors of 223 known symbols. If the top match is clearly ahead of the runner-up, you get an answer. If it's close, you see the app's best guess and a retake button. Putting the model behind one interface early paid off when I swapped MobileNet for a fine-tuned DINOv2-small without touching a screen.

Then I tested it on real packages. That's where the real work was.

Symbols printed in color, white on blue or pink, didn't match our dark-on-white references. Reducing each crop to its own ink-vs-background axis (PCA) before the model sees it took recall on a synthetic recolor test from 88.8% to 94.5%.

Tiny or tilted symbols got a crop tool and rotation matching.

When the app doesn't know a symbol, you can now show it which one it is, and your phone remembers. No retraining. It just adds your photo's embedding to a local list.

Every model improvement used to mean a store release. Now the app checks for model updates itself, and the last two model versions reached users without app review.

Android builds kept running out of memory on EAS until I cut the CPU architectures and serialized Gradle.

The App Store got its own Claude Code agent. It runs the checks, builds with EAS, fills in App Store Connect in the browser, and stops for me before it submits anything or gets near my Apple credentials.

So what do I think about building with AI?

It's fast, and it will give you a confident answer that's wrong. Early on it handed me a CLI command that doesn't exist. My repo's agent file opens with "Expo has changed - do not trust your training data" for good reason. Every accuracy number my scripts printed was synthetic, and the model only got better from real photos of real products. And the decisions that mattered most weren't technical: privacy, what "recommended" means, and making it clear this is a helper, not a halachic ruling. Those were mine.

Claude is the best engineering tool I've used. I still needed to understand React Native and embeddings, and I still had to catch it when it was wrong.

That's how my team and I work with clients now. Want something built this way, or your team working like this? https://orizens.com

The app: https://kashrutcheck.netlify.app
