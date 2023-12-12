---
id: 20191005
title: "React Hooks and Components: Custom Hooks as Minions At Your Service"
pubDate: 2019-10-05T14:50:00+00:00
author: Oren Farhi
layout: '@/templates/BasePost.astro'
# permalink: /blog/react-hooks-and-components-custom-hooks-as-minions-at-your-service/
imgSrc: "/src/images/blog/2019-10/IMG_20190921_125514.jpg"
imgAlt: "fantasy chair"
tags:
  - react
  - hooks
  - architecture
---

I was hoping to write yet another article about react hooks - but I felt like waiting for the right time to do it. I wanted this article to be useful and reusable for others. Like many others, I have been trying to wrap my head with the idea of hooks and come up with creative way to make it work for me, instead of me working on it.

Hooks are very simple - that's a good thing. I like simplicity and minimalism - especially when it comes to coding. Mainly aim at state management for components, react hooks can be creatively used to build up a beautifully reusable functional features - and it's just like reading poetry or listening to a really good piece of an well composed emotional music.

I feel like, once you get to **feel** and **know** the building blocks of React Hooks, you can make the code you write much cleaner, organized and **DRY**.
In this article I'm sharing my own experience and interpretation to how I perceive react hooks and how I use this feature in code.

### Custom Hooks As A Service (Minions)

Simply put: with the main purpose of state management, hooks can be used to expose services of the app. This leads to reuse and DRY code.

The basic `useState()` hook usually works well for "simple" state management - that can be an object, array, string, boolean etc.
The state can be manually set upon request.

I see **custom hooks** simply as **Minions** (minions as those little yellow henchman - as in "Despicable Me" or "The Minions"). They are servants of the master - the application. They can be similar with a small difference, or rather, quite different with unique abilities (Playing Guitar like Eddie Van Halen 😃).

Often, for every application there's a service layer - a directory that includes various services that may connect to an api for fetching, updating and deleting data from remote/cloud services. These services might be using 3rd party api, http request call, websockets or others (i.e, firebase, axious, web sockets).

Imagine a **Cloud Storage** App (i.e, google drive, dropbox). It allows the user to view all files, upload, delete, create groups and much much more.

Take the **CloudApi** - a service that provides CRUD abilities for files. This is one way to consume and use this service:

```jsx
import { CloudApi } from "../api/cloud-api"

function FilesViewer() {
  // some code here...
  const [files, setFiles] = useState([])
  const [file, setFile] = useState(null)
  const [metaData, setMetaData] = useState(null)
  const handleFilesResponse = response => setFiles(response.items)
  CloudApi.fetch(handleFilesResponse)
  const handleSelectedFile = file => setFile(file)
  const handleFileMetaDataResponse = data => setMetaData(data)
  return (
    <section>
      <button onClick={CloudApi.refresh}>Refresh</button>
      <button onClick={CloudApi.add}>+ Add</button>
      {/* some code omitted */}
      <section className="file-preview">preview file contents</section>
      <section className="file-metadata">shows selected file's meta data</section>
      {files.map(file => <File onDelete={CloudApi.delete} />)
    </section>
  )
}
```

This code works, but I feel like it can improved in its readability. Having 3 `useState()` in this case, may serve 3 different presentations that can be extracted into their own components.

There are times where some of the code that is presented in the **FilesViewer** component may be required in other components as well - i.e TrashViewer or TagsViewer.

In the example above the usage of **CloudApi** is eventually, tied to a state that's presented in the presentation layer (JSX/HTML).

Although this code used hooks, instead of repeating this code and in order to make it DRY, we can use a custom hook.

```jsx
import { useCloudApi } from "../hooks/use-cloud-api"

function FilesViewer() {
  // some code here...
  const { files, add, remove, fetch, sync } = useCloudApi("files")
  const { preview, setId } = useCloudApi("file")

  fetch()

  return (
    <section>
      <button onClick={fetch}>Refresh</button>
      <button onClick={add}>+ Add New</button>
      <button onClick={sync}>Sync</button>
      <section className="file-preview">
        preview file contents {preview}
      </section>
      {/* some code omitted */}
      {files.map(file => (
        <File onDelete={remove} />
      ))}
    </section>
  )
}
```

Still, the initial code can be further improved.
There are quite a few html sections (original code omitted for this article) that can be isolated, and then converted to a fully functional standalone units with the help of hooks.
We can create a "Minion" that will help us in fetching the files and rendering it.
We can create a "Minion" that will help us to preview a file's content.
We can create a "Minion" that will help us to show a file's metadata.

### Composable Hooks

The headline for this section is quite pretentious - it's really about creating self operable units that can be plugged and play very easily - creating a beautiful symphony from brilliant composition.

Restructuring the code like that allow us to craft a very neat, organized and functional reusable components while keeping this services layer organized in its directory.

```jsx
function FilesViewer() {
  // some code here...
  return (
    <section>
      <FilePreviewer id={selected} />
      <FileMetadata id={selected} />
      {/* buttons are may be part of <Files /> */}
      <Files />
      <FilesUploader />
    </section>
  )
}
```

Each component in this code includes a cloud hook and its logics inside - It's beautifully organized, minimal and self operable. These components are reusable in other views as well - some require the **id** of a file while the **Files** is simply a presentation layer of the cloud hook that fetch files and may allow to perform CRUD operations.

```jsx
function FilePreviewer({ id }) {
  const { file } = useCloudApi(`file/${id}`)
  return <section>{/* some jsx presenting the file */}</section>
}
```

### Reusable Hooks as Components

The main concept that I want to share is - instead of importing hooks across the application code, try to think beyond that - and understand how the state of these hooks is supposed to be used in the app. Usually, this state will be presented in the screen.

I think that in some cases, using a hook in one reusable component may be enough and promotes an elegant way to expose services while using the power of hooks - render the state when it changes.

I think that this strategy promotes the code to be organized and composed like so:

```
Component1 => hook1, hook2
Component2 => hook2, hookA
Component3 => hookB, Hook4
Component4 => hook1, Component1, Component2,
```

That's composition.
Even though **hook1** is used by **Component1**, its abilities (sync data, deleting data etc..) may still be reused in a Component4, and yet, it's using the same hook to perhaps expose a new functionality in the UI that's not exposed in **Component1**. This make some of the hooks reusable through components.

I hope the contents of this article helps other engineers or developers rethink when composing code, when designing custom hooks and when consuming hooks.
I'm looking for strategies to eliminate code, make it reusable, reduce "noise", make it understandable and make the code as minimal as possible.

In the next article I'm planning on sharing a new custom hook strategy (lets call it a "Minion") I came up with, while trying to integrate **Redux** and **Hooks**.
