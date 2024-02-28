---
id: 20200628
title: "Show A PWA Update with Redux, React Hooks & Service Workers"
pubDate: 2020-06-28T15:48:30.402Z
author: Oren Farchi
layout: '@/templates/BasePost.astro'
# permalink: /blog/show-a-pwa-update-with-redux-react-hooks-and-service workers/
imgSrc: "/images/blog/2020-06-28/2020-06-28.jpg"
imgAlt: "lake"
tags:
  - react
  - hooks
  - redux
  - architecture
  - clean-code
---

## Show A PWA Update with Redux, React Hooks & Service Workers

In this article, i'm sharing the method to notify about an update for [ReadM] PWA. readm is using a service worker to add offline and cache support - so, when an update is available, it's important to notify the user and have the most up to date code.

[ReadM] is a free friendly reading web app that motivates kids to practice, learn, read and speak English using real time feedback and providing positive experience.

## Setting Up Offline in CRA

In the cra documentation, there's a very good explanation to [why you would consider adding offline support] to your app - there are important considerations to think about and these docs are doing it well.

One of the requirements for creating a PWA and support offline is to have a service worker that supports that.
CRA is already packed with a very good service worker abilities. In the main **index.js** there's already a very clear disclaimer and an optional opt-in code to allow offline worker.

It clearly indicate the following:

```typescript
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
```

The actual code of the service and what it does is available in **serviceWorker.js**.
To setup offline out of the box, the serviceWorker should simply call the register method:

```
serviceWorker.register();
```

## Behind The Scenes - "Crash Course" on Service Worker in CRA

The Service Worker is a separate asynchronous layer that lives in parallel to the app's DOM. In the code, it is declared and run by default after React initiates the app's main render.

In [ReadM], the main **index.tsx** includes a store provider that wraps the App in order to provide the redux store layer:

```typescript
ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
  document.querySelector("#root")
)

serviceWorker.register(config)
```

The **config** object that is passed to the register function, may include callbacks for interesting events that happen in the serviceWorker lifecycle. On of these events is the `onUpdate(registration)` event.

This function is called from within the service worker once the the service worker has already registered with the browser. Still, this is NOT an indication that something has changed.

the **registration** object is a [service worker registration] - an object that the service worker gets to activate and it allows to control several pages under the same domain and act as a sort of "event emitter" within the browser.

the code within **serviceWorker.js** listens to an **onStateChange** event and calls that **onUpdate()** callback.

## Dispatch an update to Redux Store

lets get to business: we're interested in the **onUpdate()** method. The code below is passed in the configuration to the Service Worker.

**registration.waiting** is a [service worker] that is returned from the registration object (a service worker on its own). Only if it exists, it will listen to any changes or updates in ReadM's code and upon that will simply dispatch an **updateRead()** action to Redux store.
the store object is available (as seen above) within the scope of **index.ts**.

```typescript
serviceWorker.register({
  onUppubDate:registration => {
    const waitingServiceWorker = registration.waiting

    if (waitingServiceWorker) {
      waitingServiceWorker.addEventListener("statechange", event => {
        if (event.target.state === "activated") {
          store.dispatch(updateReady())
        }
      })
    }
  },
})
```

In this case, I decided to take the simple route and signal an update with a boolean value.

Similarly, the **onSuccess()** callback is invoked once ReadM is registered for offline use. In this case, this information may be used to indicates the app is in offline mode.

```typescript
// Pseudo code
serviceWorker.register({
  onSuccess: registration => {
    console.log("registered app for offline use. details:", registration)
  },
})
```

## Separation of Concerns - Reacting with UI

Up until now we handled the technical layer for checking and verifying there's an update. Now it's time to UI into it.

In [ReadM] i took a simple approach - The **App** component is using [Redux selector hook] to get the value of **update** from the app's main reducer (I simplified the code for this example - i'm actually using a [store api hook]):

```typescript
const update = useSelector(selectUpdate)
```

Simply enough, the jsx includes a conditional rendering of a **Toast** component that notifies the user of an update and an action to take:

```typescript
{
  update && (
    <Toast
      text="Update is available. Please Close all tabs and reload."
      header="Update"
      actionLabel="Update"
      onAction={() => window.location.reload()}
    />
  )
}
```

![alt text][toastui]

## "Offline" Notes To Take

Before approaching this solution, it took some time to have a clear mind set of the problem - This is important for the App's overall architecture and for me as the maintainer.

I wanted to have a **clear separation of concerns** - the **logics** layer and the **UI** layer. I was able to achieve that by having a layer in between - in this case - Redux (it can be any other layer).

[ReadM] is free - please try it out.

[readm]: https://readm.app
[service worker]: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/waiting
[service worker registration]: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration
[why you would consider adding offline support]: https://create-react-app.dev/docs/making-a-progressive-web-app/#why-opt-in
[store api hook]: https://orizens.com/blog/how-to-not-have-a-mess-with-react-hooks-and-redux/
[redux selector hook]: https://react-redux.js.org/api/hooks#useselector
[toastui]: /images/blog/2020-06-28/toast.png "Toast for an app update."
