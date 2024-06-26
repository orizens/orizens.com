---
id: 20220810
title: "Reducing React Dev Server to 213ms - From Create React App To Vite Migration"
author: Oren Farhi
pubDate: 2022-08-10T15:56:38.693Z
layout: '@/templates/BasePost.astro'
# permalink: /blog/reducing-react-dev-server-to-213ms-from-create-react-app-to-vite-migration/
imgSrc: '/images/blog/20220810/turtle.jpg'
imgAlt: 'turtle'
tags:
  - react
  - performance
  - devtools
  - clean-code
---

Developer experience is important. Having a fast and reliable development and build solution is important, as much the code that is written and how it performs. Recently, I saw a significant slow-down in a react app that its development and build system was based on the latest CRA package (create react app / react-script).
I was able to improve the developer experience in both development and build for production from few seconds to a mere **213ms** from **3277ms** (dev server) - That's an improvement of **95%** in server up time (!). In this article I share the steps I did for migrating **CRA** to use [Vite] while highlighting the benefits.

With Vite (After):
![alt text][dev server]

With CRA (Before):
![alt text][dev server before]

### Why Vite.js?

The JS ecosystem is a wild ride - every once in a while there is a new library / package / some other solution that comes with a promise to improve developer life in the js client, server and even both. The last JS evolution that popularized SSR and SSG introduced Next.js, Remix, fresh and more as a full stack javascript framework for web applications and static websites. However, not everyone is joining that ride - I assume some don't get the full benefits while others might be stuck in a complex migration and some don't even need the server side benefits - in which case these are client side apps (CSA). 

In my case, I was looking for a CRA alternative that would not require me introducing a js server and any significant opinionated architecture and code change. I was interested in migrating to Next.js or Remix.
However, I dismissed both because it required me to make a rather huge change to my application while also requiring a somewhat steep learning curve that I could not afford due to time constraints.

### Issues with CRA

CRA has become for my projects very sluggish and had few issues. For starters, first dev server start took around 45 seconds (while other cold start took around 8-9 seconds).

I had to migrate storybook v6.5 to use Vite.js builder - since it didn't work with the latest CRA v5 because it's based on webpack version 5. Due to that, the build process for storybook failed, because webpack still exist in the system (at the time of writing this article it is [still an issue]).

The hot module reload / refresh was also problematic and not satisfying - with few changes the entire app was reloaded, and sometimes I had to manually reload.

Lastly, maintenance and new version release went silent for quite some time now.

## Migrating to Vite.js

Version 3 was just published, and I wanted to give it a try after reading and seeing some examples that were looking quite pleasing. Having the ability to easily configure or have a **"zero configuration"** appealed to me.

My CRA app was using React 18, Typescript, Chakra-UI and some SVG files.

Vite configuration lives in a `vite.config.ts` file at the root of the project (I chose to go with the Typescript version, although js also works).

### Base configuration for compiling react, typescript and svg

To support all the above and match the build of CRA, this configuration worked:

these npm packages are required:

```shell
npm i vite vite-plugin-svgr vite-tsconfig-paths @vitejs/plugin-react
```

```typescript
import { defineConfig } from 'vite'
import svgrPlugin from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'
import react from '@vitejs/plugin-react'

import path from 'path';

export default defineConfig({
  server: {
    port: 3210,
  },
  build: {
    outDir: 'build',
  },
  plugins: [
    react(),
    tsconfigPaths(),
    svgrPlugin({
      svgrOptions: {
        icon: true,
        // ...svgr options (https://react-svgr.com/docs/options/)
      },
    }),
  ],
})
```

I believe the code is pretty much self-explanatory. One of the most dominant components is the **plugins** entry - which allow composing pluggable features to vite's build system. 

Some of these plugin functions usually gets a configuration object as a parameter, which lets you further customize what and how a plugin should do with the compiled code.

To complement typings and following some documentation on Vite, `tsconfig.ts` was updated with these:

```json
{
  "target": "ESNext",
  "esModuleInterop": false,
  "jsx": "react-jsx",
  "types": [
    "vite/client", 
    "vite-plugin-svgr/client", 
  ],
  "paths": {
    "~/*": ["./*"]
  }
}
```

on top of this basic configuration, I added the following plugins to support more features:

```shell
npm i @vitejs/plugin-basic-ssl vite-plugin-mkcert vite-plugin-pwa
// adding workbox to support pwa features
npm i workbox-core workbox-precaching workbox-routing workbox-window
```

```typescript
export default defineConfig({
plugins: [
    enableSsl && basicSsl(),
    mkcert(),
    // ...
    // ... plugins from above
    // ...
    VitePWA({
      manifest, // imported from ./manifest.json
      includeAssets: ['favicon.ico', 'robots.txt', 'images/*.png'],
      devOptions: {
        enabled: false,
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html}', '**/*.{svg,png,jpg,gif}'],
        maximumFileSizeToCacheInBytes: 3000000,
      },
    }),
  ],
})
```
My [readm] app is a pwa app, which at this point, installs a cached version to speed up loading time on the next time a user opens the app. The app is also installable as a desktop app in any platform, desktop and mobile. 

There's more into PWA configuration - i.e. showing an update is available - for that I had to use a dedicated solution, which is out of the scope of this article. I followed examples from the excellent [VitePWA] documentation and examples. I add `"vite-plugin-pwa/client"` to the `tsconfig/types` section.

PWA apps require ssl connection and so - `basicSsl()` and `mkcert()` simply setup a local https server with a locally signed certificate - This step requried few steps when I was using CRA.

### Updating index.html and environment variables

The main entry point to the app, `index.html`, has to be in the root. I removed any `%PUBLIC_URL%` instances as these were not needed. Vite requires a plugin in order to embed environment variables values from `.env` - I chose to remove those completely from the index and embed the codes statically (Google Analytics). 

Few image references in the html were updated with a full path starting from the root, i.e `src/assets/images/readm.png`. 

Vite requires indicating the starting file for the app with a simple script tag before the closing body tag:

```typescript
  <script type="module" src="/src/index.tsx"></script>
```

As for environment variables that are defined in `.env`, I had to replace  any `REACT_APP_` with `VITE_`. To use these variables across the app, you would use it like that:

```typescript
import.meta.env.VITE_THE_VARIABLE
```

`src/react-app-env.d.ts` has been renamed `src/env.d.ts`

### configure test with vitest

create-react-app was using `jest` and `react-testing-library`. With Vite, I had to install the `vitest` plugin and add its configuration to `vite.config.ts`. To run test with a virtual dom, I had to install 2 additional packages as well:

```shell
npm i vitest c8 jsdom
```

```typescript
// added this typing reference
/// <reference types="vitest" />

export default defineConfig({
  test: {
    include: ['src/**/__tests__/*'],
    globals: true,
    environment: 'jsdom',
    setupFiles: 'src/setupTests.ts',
    clearMocks: true,
    coverage: {
    	enabled: true,
    	'100': true,
    	reporter: ['text', 'lcov'],
    	reportsDirectory: 'coverage/jest'
    }
  },
  // ... rest of the config
}
```

The difference in `vitest` vs `jest` was replacing stub functions:

```typescript
// BEFORE
const speak = jest.fn()

// AFTER
import { vi } from 'vitest'
const speak = vi.fn()
```

### Updating package.json scripts

Finally, to make it all work, we have to update the scripts that are building the production app and starting the server.

This is easily done with:

```json
{
  "start": "vite",
  "build": "vite build",
  "test": "vitest",
  "test:ci": "vitest run"
}
```

With everything in place, I removed `react-scripts` as well.

## Conclusion

moving from CRA to Vite improved my developer experience by far. As the screenshot in this beginning of the article shows, the dev server is up in **~213ms** (the first run takes 1-2 seconds) compared to CRA - which took around **3277ms** or more (first run adds 4-5 seconds) - that's a reduction of around 95% in for the dev server startup.

The additional benefit in the developer experience is the hot module reload during development - changes are injected live into the working server - updating specific files for the update and reloading the entire app. That's a huge improvement from the previous cra development.

The build process has also been improved - around 10 seconds with a live indicator and hints on how to improve it. In CRA that same build took around 40 seconds with no live indicator.

Feels like [readm] is now steroids - I recommend anyone who's still using create-react-app to make this effort and consider migrating to [Vite].

The Article is based on [ReadM] - a free app for practicing English reading fast while having fun.

[still an issue]: https://github.com/storybookjs/builder-vite/issues/463#event-7089130387
[readm]: https://readm.app
[dev server]: /images/blog/20220810/dev-server.png "fast dev server"
[dev server before]: /images/blog/20220810/react-scripts-server.png "react-scripts server"
[VitePWA]: https://vite-plugin-pwa.netlify.app/
[Vite]: https://vitejs.dev/

