---
title: "Why I choose Astro for web app development in 2024"
pubDate: 2024-02-15T21:16:45.670Z
author: Oren Farhi
layout: '@/templates/BasePost.astro'
# permalink: /blog/show-a-pwa-update-with-redux-react-hooks-and-service workers/
imgSrc: "/images/blog/2024/choose-astro.jpg"
imgAlt: "space"
tags:
  - astro
  - react
  - architecture
  - clean-code
---
Recently, I've seen websites and apps developed with astro. The previous version of my website was developed with gatsby - I was looking into migrating that to one of the newest trends to make my life easy and interesting. I was looking for a static site generator that has React & Typescript in mind. Amongst other alternatives, I finally choose Astro, and I can't say how happy i am to chose this route as it appears to be the most appropriate framework for either static or dynamic site/app, while letting you chose any of the ui frameworks or even better - mix them.

Astro is the missing link between easy web app development, static site development and no-locked in vendors - the islands architecture.

## The Most Transparent Significant Advantages

I want to shed some light on what made me feel at home with astro. It's important to note i started with one of the free starters and taking off from there.

### Simple HTML is a Component (JSX / web component)
The Astro framework introduce the `.astro` fiel extension as a component. Create a new file, write some html into it - and there you have it - a full custom html component ready to be used anywhere.
```astro
<!-- Link.astro -->
<a href="/">This is my homepage</a>
```

And then, simply import that anywhere - in any `jsx` or `astro` file:

```astro
---
import Link from '.@/components/Link.astro';
---
  <div>
    <Link />
  </div>
```

I see that as an advantage because it's that simple - no need for writing a function, import `React` - less cluter. It's important to mention that when you want that `<Link />` to have custom properties or React's `children` prop - you would use that definition on top of the html:

```astro
---
// Link.astro
const { props } = Astro;
---

<a class='underline hover:bg-primaryAlpha' target='_blank' {...props}>
  <slot></slot>
</a>
```

With that in place, you can use it like that:

```astro
---
import Link from '.@/components/link.astro';
---
  <div>
    <Link href="/contact">Contact Me</Link>
  </div>
);
```

This leads me to the next aparent advantage - it looks like react.

### React and JSX
the starter repo i started with included react as a plugin. However, if you're familiar with vite, you'll notice it's just a plugin that is just attached to the `astro.config.ts` which is quite similar with any `vite.config.ts`.

With that in place, writing react `.tsx` files is possible just like that.

### Routing By Directory And Files
Astro include routing right out of the box by using the convention of the `/pages` directory. Any `.astro` files under that directory becomes a route. If it's a directory, you can simply use `index.astro`. 

There are more options to support dyanmic routes - i.e, if you have a `/blog/an-id-of-a-post`, you would use `/blog/[id].astro` as a file to handle all the dynamic posts that should be there. Other file extensions that are supported as handlers to this route startegy are: `.md`, `.mdx`, `.html` and `.js/.ts` (is used as endpoints).

### Run Javascript When and Where It's needed
By default, Astro renders static pages. Although it supports `SSR`, and server api routes, Astro includes special directives (html attributes) that instructs various loading and activation. In order to run client side javascript in the browser, one would use the `client:only` directive:

```astro
---
import Link from '@/compoennts/Link.astro';
---
<Link client:only>any js runs inside the component in the browser</Link>
```

This makes sure that any js code that is included inside `Link.astro` runs in the browser - that includes any event handlers and practically anything that is written with `Javascript/Typescript`.

## What's next?
That's not all - Astro includes a fantastic [documentation] with lots of examples, recipes, and guides on how to to do almost anything you can imagine. 
For a long time, I've been wanting to have some static pages on our reading practice app - [ReadM].

[readm]: https://readm.app
[documentation]: https://docs.astro.build/en/getting-started/
