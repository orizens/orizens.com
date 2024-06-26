---
id: 20210703
title: "How To Improve Your Developer Experience (DX) With React, Hooks And Redux-Toolkit (rtk)"
pubDate: 2021-07-03T22:14:48.459Z
author: Oren Farhi
layout: '@/templates/BasePost.astro'
# permalink: /blog/how-to-improve-your-developer-experience-(dx)-with-react-hooks-and-redux-toolkit-rtk/
imgSrc: '/images/blog/2021-7/PXL_20210702_194653498.PORTRAIT.jpg'
imgAlt: 'choco balls'
tags:
  - react
  - hooks
  - redux-toolkit
  - clean-code
  - architecture
---

In few of my [previous articles on React Hooks] I mention how I'm using hooks to encapsulate features and making it reusable in apps. I consider state to be an important feature in app - and that's why I prefer to have some kind of a central state management that the client code can speak with as one source of truth.

Nowadays, Redux is still **my** preferred solution for front end central state management. Some of its benefits I appreciate include:

1. Well designed implementation
2. Maturity
3. Integrated Devtools
4. Community
5. Extendability

With Extendability, a while back, the team introduced **Redux-Toolkit** - taking redux usage to a higher level and making it simpler and developer friendly - or what i like to call - a great Developer Experience in the same way as User Experience (where the user is the developer).

## Redux Toolkit Simplicity

RTK features lots of benefits as compared to raw redux usage while suggesting beautiful abstractions to interact with a redux-store. All of that while supporting Typescript.

For me, the integrated **createEntityAdapter** for managing a collection of items and the way to use async actions with **createAsyncThunk** - improves the development experience and makes it more manageable and maintainable with time.

## Reducer Structure

In development, i'm usually using a standard "feature" structure to define a reducer and its sub-parts inside a directory. i.e, in my free app [ReadM], here's an example of the books reducer:

```
- books
    - hooks
      useBooks.ts
      useBooksActions.ts
    books.reducer.ts
    books.selectors.ts
    books.effects.ts
    books.types.ts
    index.ts
```

The **books** reducer is a self contained unit of state management (a module) that is responsible for managing a collection of books. Each book includes a metadata that is constantly updated according to the user actions (user reading progress and score).

To interact with it, I'm simply using hooks - that's the only to access data and access any actions that may update the data within the store.

A book screen is composed of few components: graphics, sentences, pagination and much more. All the state and actions that can be performed on that state (and on others) are **available through hooks**.

### The Reason for exposing state and actions with hooks

Hooks make it easy for me as a developer, using it anywhere I want - let it be a presentational component or a container component. The problem of "prop-drilling" is solved well with redux and redux-toolkit while making sure performance is high. That also promotes a cleaner approach for coding - known as [clean code].

Lets visualize how that works. The hierarchy of a components in that book screen may have more than 3 levels of nesting for components:

```
Book Screen ->
  TopBar ->
    UserMenu
    Score
    Title
  Paginator
  PageGraphic->
    Graphic
    GraphicProgress
  RangeSlider
  Paragraph->
    Speaker
    SpeechTester
    TesterResult
```

One may argue the design of these components could be done differently, however each component includes its own complexity and internal logics.
Some components nested way down the tree, require access to actions from the reducer - that's because i'm following the rule of using hooks only to access the store's actions/state.

i.e, `SpeechTester` component may need to update the store with a successful reading session. instead of creating a prop of `onSuccess()` and drilling it down all the way from `Book`, I can use the `useBookActions()->completeParagraph()` to simply access the relevant action which would be handled by the **books** module.

In the above case, some actions are async since the app is using firebase to read/save data - however - for the component that's triggering the action it's as simple as invoking an action. any re-renders cycles are happening in an atomic level thanks for the nature of Redux-Toolkit (considering the update is precise).

Using that approach in few apps for more than a year, has proved to boost my developer experience as well as contributing to a more robust encapsulated modules that can be reused and refactored easily at any time.

All of the sudden, updating features and moving abilities between screens becomes easier, faster and well tested.

## Strategies For Working With Redux-Toolkit

Overtime, I settled with a certain strategy for working with redux, redux-toolkit and using the power of React's hooks in order to expose a well defined typed api for interacting with the state layer in an app.

I'm intentionally separating the state and the actions.

1. I'm following the separation of concerns rule - each hook should deal with one purpose only
2. Performance reasons - when a state is updated - I don't want the "actions" hook to trigger a re-render if its not needed.

The first hook I usually create is a hook that expose state - `useBooksState()`. I incrementally expose state that is consumed by the `view` layer of the app - any components that require it.

```typescript
import { useMemo } from "react"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { bindActionCreators } from "redux"
import * as effects from "../books.effects"
import { slice } from "../books.reducer"
import * as selectors from "../books.selectors"

export function useBooksState() {
  const state = {
    booksEntities: useSelector(selectors.selectBooksEntities, shallowEqual),
    booksArray: useSelector(selectors.selectBooksArray, shallowEqual),
    total: useSelector(selectors.selectTotalBooks),
    selectedBookId: useSelector(selectors.selectSelectedBooks),
  }

  return state
}
```

The second hook is an actions hook that expose an api for mutating the state - either synchronously or asynchronously:

```typescript
import { useMemo } from "react"
import { useDispatch } from "react-redux"
import { bindActionCreators } from "redux"
import * as effects from "../books.effects"
import { slice } from "../books.reducer"

// books.effects.ts - may include: selectBook, updateBook, completeBook
export function useBooksActions() {
  const dispatch = useDispatch()
  return useMemo(
    () => bindActionCreators({ ...slice.actions, ...effects }, dispatch),
    [dispatch]
  )
}
```

The `slice.actions` are actions that are defined as functions on the reducer (see createSlice for more). For convenience and [reuse], this hooks wraps these actions and the `effects` (which are async actions defined with createAsyncThunk) with redux dispatch, which makes it ready to be used as a simple function that operated directly on the reducer.

The actual usage comes from the `books.effects` and `books.selectors` where i'm using these useful time savers:

- **createEntityAdapter()**
- **createAsyncThunk()**
- **createSelector()**

## Redux Toolkit As A Time Saver

I want to focus on these functions that are available from redux-toolkit - as using the above mentioned tools gives some structure and boundaries to the game of state management with redux.

The `createEntityAdapter` factory function is a feature "import" from the excellent `ngrx` - Angular's first reactive state management. I've written few articles about it - and the same concepts and benefits can be easily adopted and used with redux-toolkit.

The `createEntityAdapter` creates a useful (es6) Map like object with an api for managing a list of entities. Adding new items becomes quite easy:

```typescript
function addBook(state: IBookStore, action: PayloadAction<IBook>) {
  adapter.upsertOne(state, action.payload)
}
```

The above function simply add a new book to the list. If the book already exists, it is updated automatically - that's the purpose of `upsertOne`.
There are many other useful methods that makes the job of updating the state (redux) easier - which I encourage to explore in the redux-toolkit documentation.

The `createAsyncThunk` factory function wraps an async function which should eventually, dispatch an event to the store. One of the most useful features of this function is its "automatic" async state once can consume.

Usually, the reducer slice would register to async thunks and update the state according to the async state:

```typescript
// part of the reducer
const reducer = {
  extraReducers: builder => {
    builder
      .addCase(addBook.fulfilled, addBook)
      .addCase(addBook.pending, handleAddBookPending)
      .addCase(addBook.rejected, handleAddBookRejected)
      .addCase(runRiver.pending, resetRunStatus)
  },
}
// now the addBook updates the loading state as well
function addBook(state: IBookStore, action: PayloadAction<IBook>) {
  state.loading = true
  adapter.upsertOne(state, action.payload)
}
```

Aside from that, the wrapper function of `createAsyncThunk` allows us to access the current store's state - which becomes useful if we need to process or get some data form the store, during the async operation.

The `createSelector` function is actually a re-export that comes from `reselect` - which allows us to memoize function calls. This function memoize (cache) the result.

Given the state or the property `selectedBookId` have changed, the function is invoked again, and thus, creates a new cache.

```typescript
export const selectSelectedBook = createSelector(
  selectBooksState,
  books => books.selectedBookId
)
```

## Where Redux, Hooks and Redux-toolkit really shines

Up until now, the previous paragraphs focused on the **State** layer of the application. As I mentioned before, the custom hooks of each store in that state layer are the way to interact with the state from wherever we need within the app - components.

The code below is an illustration of the books screen on [ReadM]. Notice how the `useBooksState` is used in both components. Using that strategy, simplifies the implementation and the mental model of accessing data or updating it - leading to a more granular defined components that focus on a certain aspect of the state.

```typescript
function BooksShelf() {
  const { books } = useBooksState()

  return (
    <section>
      {books.map(id => (
        <Book id={id} />
      ))}
    </section>
  )
}

function Book({ id }) {
  const { getBookById } = useBooksState()
  const { updateBook, completeBook } = useBooksActions()

  return (
    <article>
      <BookContents onComplete={completeBook} />
      <Button variant="primary" onClick={updateBook}>
        Listen Now
      </Button>
    </article>
  )
}
```

On the longrun, this strategy allows the code to be more flexible to changes and less prawn to errors when the time comes to move things around, redesign or adding new features to the UI. Even when moving the **BookContents** component to a different view reusing it in a new view, results simply in dropping that code and initialize it with an ID.

Being able to read the code and simply see the composition, promotes the simplicity we can have when planning the application's architecture right. I mentioned before that hooks are building blocks and have proven to be efficient in my development experience. Composing a component with hooks makes the perfect recipe for keeping the code DRY and promoting code [reuse].

Moreover, the "native" integration of redux-toolkit with **React's DevTools** and **Redux Devtools**, makes it an all in one great solution for global state management with the powers to inspect the state at any time and see the log of events that affected the state.

## Discussion

I like to discuss design patterns, code conventions and solutions. If you like this article - please share it with others. If you think there are other ways or feel something is not clear - please let me know and I will address it in a followup article or a through comments.

Thanks for reading.

[reuse]: https://orizens.com/blog/react-hooks-and-components-custom-hooks-as-minions-at-your-service/
[previous articles on react hooks]: https://orizens.com/tags/hooks
[clean code]: https://orizens.com/tags/clean-code
[readm]: https://readm.netlify.app
