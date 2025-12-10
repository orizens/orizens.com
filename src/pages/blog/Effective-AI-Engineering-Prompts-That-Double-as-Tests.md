---

title: "Effective AI Engineering: Prompts That Double as Tests"
pubDate: 2025-12-09T18:00:00.000Z
author: Oren Farhi
layout: '@/templates/BasePost.astro'
imgSrc: "/images/blog/2025/aitdd.jpg"
imgAlt: "AI-driven development concept"
tags:

* ai
* tdd
* bdd
* architecture
* clean-code
* productivity

---

## Effective AI Engineering: Prompts That Double as Tests

It took me a while to realize this, but if you’re working with an AI coding assistant today - Cursor, Copilot, Claude, Codeium, whatever - you’re basically doing **Test-Driven Development**.

Yes, really.

When you think about it, the moment you start describing what you want the AI to build - the behavior, the constraints, the flows, the edge cases - you’re already writing **specs**. And if those specs are clear enough, the AI can turn them into code, and even into tests.
Call it *ai-Driven Development* (**aiDD**). Or *vibe coding*. But the pattern is the same:
**The better the spec you write, the better the code you get.**

## AI Assistant Coding Isn’t a Replacement - It’s Another Tool

There’s a trend I’ve been seeing: people assuming AI replaces engineering.
It doesn’t.

AI-assistant coding is simply another tool in the development toolbox - a powerful one, yes, but still just a tool. It doesn’t replace engineering judgment, Architecture 101 thinking, or experience. You still need to understand the domain, design the components, define the boundaries, and give the assistant clear direction.

If you give vague instructions, you’ll get vague code.
If you give structure and intent, the AI delivers something consistent and maintainable.

Think of it as pair-programming with someone extremely fast, but who takes everything you say **literally**.

## Architecture Is Still on Us

(“Skynet” is not doing system design... yet)

Even with today’s AI speed, you still carry the responsibility to design a clean architecture. You define the interfaces, responsibilities, boundaries, workflows, testing strategy - all before asking the AI to generate code.

Could AI do all that one day? Maybe.
Will it design a distributed system for you tomorrow morning? Probably not.
So until Skynet shows up, the ownership is ours.

## A Great Era for Writing Code - and Tests

One of the most underrated uses of AI coding tools is **test generation**.

You can describe a feature once, ask the AI to generate tests, refactor them, and extend them. It’s suddenly natural to think in “specs first,” which pushes us toward TDD, even if we didn’t intend to.

Here are some **realistic examples of prompts** using ReadM as the concept:

```text
Prompt 1:
"Generate a React component for ReadM that displays a student's reading progress, including a progress bar, current book, and daily reading goal. Include unit tests to verify correct progress calculation."

Prompt 2:
"Write a function in TypeScript for ReadM that takes a text passage and returns a reading difficulty score. Then, generate Jest tests covering edge cases like empty strings, very long passages, and non-English characters."

Prompt 3:
"Refactor the ReadM login page to support both email/password and SSO login flows. Produce Cypress end-to-end tests that cover all flows, including error handling when credentials are invalid."

Prompt 4:
"Design a ReadM feature that recommends personalized reading exercises based on previous mistakes. Write AI-generated test cases that ensure recommendations adapt correctly as the student improves."
```

This is why I think aiDD is a good thing:

* It forces clarity
* It encourages structured thinking
* It makes test writing trivial
* It raises the quality bar almost automatically

Playwright even released **Test Agents**, allowing the AI to explore your app and propose testing strategies on its own:
[https://playwright.dev/docs/test-agents](https://playwright.dev/docs/test-agents)
This is a glimpse of what the future of testing looks like - the test runner itself learning how to test your system.

## The Big Point: AI Doesn’t Remove Responsibility

It *shifts* it

AI assistants generate code **blazingly fast**. Faster than any of us can type.

But that speed doesn’t remove responsibility - it amplifies it.
We still must ensure the generated code is:

* **Functional**
* **Correct**
* **Well-tested**
* **Aligned with real requirements**
* **Integrated cleanly into the architecture**

Using AI in coding today is a gift. It frees us from boilerplate and lets us focus on the things that actually make us better engineers:

* Understanding the problem deeply
* Designing the architecture deliberately
* Thinking through flows and edge cases
* Writing a proper spec
* And finally - running tests that validate everything

AI accelerates engineering, but it does not replace engineering.

## Final Thoughts

If you’re using AI to write code, you’re already closer to TDD than ever before.
You write the spec, the AI writes the implementation, and the tests follow naturally.

This era doesn’t diminish engineering - it elevates it.

We’re not just coding faster.
We’re **thinking** more.
And that’s what makes us better.

Welcome to aiDD.
