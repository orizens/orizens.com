---
id: 20201016
title: "How To Not Have A Mess with React Hooks & Redux"
pubDate: 2020-01-17T03:58:39.857Z
author: Oren Farchi
layout: '@/templates/BasePost.astro'
# permalink: /blog/how-to-not-have-a-mess-with-react-hooks-and-redux/
# dsq_thread_id:
imgSrc: /images/blog/2020-01/IMG_20191229_111820.jpg
imgAlt: "red coffee"
tags:
  - react
  - hooks
  - redux
  - architecture
---

In a previous article, where I introduced [Custom Hooks As A Service (CHAAS)](/blog/react-hooks-and-components-custom-hooks-as-minions-at-your-service/), I promised about sharing a custom hook strategy i'm working with - one that's also good for integrating Redux and Hooks.

### Redux Or Hooks? Both!

Ever since hooks was released, there were few good articles explaining on how Hooks differ from Redux, how Hooks may replace Redux and how Hooks work with Redux.  
Finally, I have found Hooks to be a complementry feature for working with Redux - the latest version of redux added hooks for selecting slices from reducers (selectors), adding dispatch to a component and few others.

With **Custom Hooks**, we can make the store implementation agnostic, and expose a simple api for reading and update the state.

### Using React Redux Built In Hooks

Before React Redux added the hooks api, usually a component would have to be connected to Redux and "define" props and actions using the **connect()** along with its full setup.

In this code example, there's a Book container component that is connected to the **redux** store:

```typescript
import { connect } from 'react-redux'
import { setSelectedBook, addBooks } from '../store/books/books.actions'
import { selectBooksEntities } from '../store/books'

const Book = (props) => { /* some code */ }

const mapStateToProps = (state /*, ownProps*/) => {
  return {
    books: selectBooks(state);
  }
}

const mapDispatchToProps = { setSelectedBook, addBooks }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Book)
```

Here is the same code implemenetd With Redux hooks:

```typescript
import { useDispatch, useSelector } from "react-redux"
import { selectBooksEntities } from "../store/books"
import { setSelectedBook, addBooks } from "../store/books/books.actions"

const Book = props => {
  const dispatch = useDispatch()
  const { books } = useSelector(selectBooksEntities)

  const selectBook = useCallback(id => dispatch(setSelectedBook(id)), [
    dispatch,
  ])
  const _addBooks = useCallback(books => dispatch(addBooks(books)), [dispatch])

  return SomeJsx
}
```

The action creators - **setSelectedBook()**, **addBooks()** - are cached with the **useCallback()** hook so it wont be recreated again (optional) and for wrapping the calls to these functions with redux **dispatch**.
This is useful for several reasons:

1. if these functions are used more the once - we keep it DRY.
2. these functions may be passed as props to internal/nested components.

However, we can this code even pretier and more useful.

### Custom Hooks As Facades

When the application grows, there may be other components that might be using the same selectors/action creators. Since we do want our code to be DRY and maintainable for the long run, we can abstract away the redux boilercode with custom hooks.

This is the point where custom hooks really shine - it's based on other hooks - let it be other custom hooks or primitive hooks.

Here is the same code applied with a custom state/store hook:

```typescript
const Book = props => {
  const { books, addBooks, selectBook } = useBooksStore()
  return SomeJsx
}
```

This is beautiful - encapsulating the redux hooks inside a custom hook, the code has become much shorter, reusable and in my opinion - with more purpose in its design.
Now, the Book component is not constrained into a specific redux implmenetation, but rather just a facade with an api to the state and its mutate actions with a custom hook.

Now this facade is reusable and can be used in other components - if its implementation changes, we just need to make sure the exposed api remains the same.

We may want to replace **Redux** for this specific state with a **React.Context** (however, be aware of its implications) or rather communicate and retrieve the data directly from a remote cloud data base (i.e, firebase). With this strategy, it makes it easier to switch the implementation, and keeping the functionality and the exposed api still the same.

Here is the source code for the custom book hook:

```typescript
import { useDispatch, useSelector } from "react-redux"
import { useCallback } from "react"
import { setActiveBook } from "../store/books/books.actions"

import {
  addBooks,
  selectBooksEntities,
  selectBooksAsArray,
} from "../store/books"

export function useBooksStore() {
  const dispatch = useDispatch()
  const _books = useSelector(selectBooksEntities)
  const booksList = useSelector(selectBooksAsArray)

  const _addBooks = useCallback(newBooks => dispatch(addBooks(newBooks)), [
    dispatch,
  ])
  const setSelectedBook = useCallback(
    (id: string) => dispatch(setActiveBook(id)),
    [dispatch]
  )

  return {
    books: _books,
    booksList,
    addBooks: _addBooks,
    setSelectedBook,
  }
}
```

### Organizing Hooks

I like to keep my code neat and organized - so I keep moving it around until I feel it's in the right place. It may vary from one prject to another.

One way I like to organize App Level Redux Hooks is to keep it under a main **hooks/store** directory.

```
- app
  - components
  - containers
  - hooks
    - store
      |- use-books-store.ts
    - auth
    - firebase
```

There are few benefits from using this strategy:

1. It allows me to clearly see which hooks are available at a glance.
2. It abstracts away the implementation of these hooks' state by allowing to be any state management solution - redux, local storage, cloud etc..
