---
id: 20260316
pubDate: 2026-03-16T10:00:00+00:00
title: "Code Review Is Broken in the Age of AI - Here's what can we do"
author: Oren Farhi
layout: '@/templates/BasePost.astro'
# permalink: /blog/code-review-is-broken-in-the-age-of-ai/
dsq_thread_id:
  - ""
imgSrc: /images/blog/2026/20260311.jpg
tags:
  - ai
  - architecture
  - tdd
  - bdd
  - testing
  - developer-productivity
  - spec-driven-development
  - code-review
---

# Code Review Is Broken in the Age of AI

## Why AI Development Works Better With Spec-Driven Engineering

I have been experimenting a lot recently with AI-assisted development.

At first it feels almost like cheating. You describe a feature and within seconds you get hundreds of lines of code.

After working like this for a while, one question keeps coming up:

**What exactly are we reviewing now?**

Most teams still follow the same workflow we used before AI.

1. Write code
2. Open a pull request
3. Review the code

That process worked when humans wrote every line.

It becomes harder to justify when AI starts generating large parts of the implementation.

---

## AI generates more code than we can review

Even a small prompt can produce:

- multiple files
- helper utilities
- configuration
- tests
- documentation

If you iterate a few times, the amount of generated code grows quickly.

At that point reviewing everything line by line becomes unrealistic.

The problem is not code review itself.

The problem is that **manual code review does not scale well when code generation becomes cheap.**

So the question shifts from:

“Who reviews the code?”

to

**“Where should review actually happen?”**

---

## The first code review happens before generation

Working with AI quickly teaches you one thing.

Context matters more than anything else.

Most teams now keep project-specific AI guidance files in the repository, things like:

- `claude.md`
- `copilot.md`
- `ai-guidelines.md`

These files describe how the project expects code to be written.

Typical things inside them include:

- architecture rules
- naming conventions
- preferred libraries
- testing expectations
- performance constraints

You can think of these files as **skills for the AI**.

Instead of fixing style or architectural problems during PR review, we define the rules up front so the generated code already follows them.

In practice, this becomes the **first layer of code review.**

---

## AI is good at implementation

Large language models are surprisingly capable when it comes to implementation details.

They are very good at:

- syntax
- common design patterns
- scaffolding
- boilerplate
- integrating libraries

What they are not responsible for is intent.

AI does not fully understand the real constraints of your product.

It does not know:

- which edge cases actually matter
- how the system should behave under load
- how users interact with the feature
- what trade-offs the team cares about

That part still belongs to engineers.

---

## This is why specs matter more than ever

When implementation becomes cheap, the most valuable artifact in the project is no longer the code.

It is the specification.

Before generating anything, it helps to define clearly:

- expected behavior
- inputs and outputs
- edge cases
- failure scenarios
- performance expectations

These definitions become the contract the implementation must satisfy.

Once the contract is clear, AI can generate code much more reliably.

---

## Tests become the real code review

In this workflow tests become far more important.

They are not just safety nets.

They become the **second layer of code review.**

Instead of reviewing syntax, we verify behavior.

Good test suites should cover things like:

Behavior tests that verify the expected results.

Edge case tests that validate boundary conditions.

Performance tests that detect inefficiencies.

Visual regression tests that catch UI changes such as layout shifts, color changes, or spacing issues.

These tests often catch problems that manual code review would never notice.

---

## What engineers should focus on now

AI does not remove engineers from the process.

But it definitely changes where the effort should go.

Less time writing code.

More time spent on:

- defining clear specifications
- identifying edge cases
- designing strong test coverage
- defining AI context and project conventions
- verifying system behavior

The hardest part of development is no longer typing code.

It is **being precise about what the system should do.**

---

## Final thoughts

AI can generate far more code than we can realistically review.

Trying to keep the exact same development workflow will eventually break.

A better approach is to focus on three layers:

1. AI context and skills (`claude.md`, `copilot.md`)
2. clear specifications
3. automated tests

Together they provide a much stronger safety net than manual PR reviews.

Code review does not disappear.

It simply moves to places where it scales better.
