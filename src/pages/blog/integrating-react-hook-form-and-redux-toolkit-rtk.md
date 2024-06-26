---
id: 20211013
title: "Integrating React Hook Form & Redux-Toolkit (rtk)"
pubDate: 2021-10-13T17:49:04.757Z
author: Oren Farhi
layout: '@/templates/BasePost.astro'
# permalink: /blog/integrating-react-hook-form-and-redux-toolkit-rtk/
imgSrc: '/images/blog/2021-10/PXL_20211010_201650887_2.jpg'
imgAlt: 'tree lights'
tags:
  - react
  - hooks
  - react-hook-form
  - redux-toolkit
  - clean-code
---

When i'm coding forms with react, I prefer using [react-hook-form]. I find it simple but yet powerful enough. In of the projects I was working on, the initial form's data is pulled from a redux store. The requirement for this project is to push the form's input back to the store - that means, submitting the form results in updating the store.

Some of the data in the store is not reflected in the form, but rather is updated directly with the reducer's action functions. In addition to that, data in the store may be updated from other sources that are not part of the form.

That means the form's values need to be updated with the latest data from the store, so updates on the data source should go both ways:

1. from store to form
2. from form to store

If not done right, these updates may go into an infinite loop which would crush the browser. I have come up with a strategy to make sure this would not happen.

## The App with Redux Toolkit and useForm

[ReadM] includes a book editor and front page editor sections which allow an Editor to create books. This section is implemented with `useForm` and [Redux Toolkit].

**Book Editor**

![alt text][book editor]

**Front Page Editor**

![alt text][front page editor]

Next, we're going to create our own custom hook which will use `useForm` and is responsible for updating the store or the form when either is changing - **without** going into infinite loop.

## Custom Form Hook

I want this custom form hook to be responsible for any data updates going both ways, and that's why i prefer to compose the logics inside this custom hook. I wrote before on [improving your developer experience] custom [hooks].

This hook creates an instance of `useForm` and invokes 2 additional hooks which are responsible for updating the store and the form when the data changes in one of them. These hooks are actually standalone hooks and require a the `useForm` api to perform the update.

```typescript
export function useBookForm(book: IBook) {
  const bookActions = useBookActions(book.id)
  const useFormApi = useForm<IBook>({
    defaultValues: book
  })
  const { handleSubmit } = useFormApi

  /* Data source updaters */
  // update the FORM => WHY? change comes from "book" prop
  useFormUpdater(book, useFormApi.setValue)
  // update the STORE => WHY? change comes from the "form"
  useBookUpdater(useFormApi, bookActions.updateBook)

  const onSubmitHandler = useCallback(
    () => handleSubmit(bookActions.updateBook),
    [handleSubmit, bookActions.updateBook]
  )

  return {
    onSubmitHandler,
    useFormApi
  }
}
```

## Update Form When The Data source in Redux Store has Changed

The `useFormUpdater` hook is using the excellent `useDeepCompareEffect` hook which performs a deep equality comparison of the next and previous book object (a complex json object).

When change is detected, the `useForm.setValue()` is used to update the form. according to the [use form docs], `setValue` is more performant then `reset()` by avoiding "unnecessary re-rerenders". The `shouldDirty` property is set to `false` because in this case, I don't want the field to be set as if the change was coming from the form.

```typescript
import { useDeepCompareEffect } from "react-use"

const useFormUpdater = (book: IBook, setValueToKey) => {
  useDeepCompareEffect(() => {
    const setValueToKey = ([key, value]: [string, any]) => {
      setValue(key, value, { shouldDirty: false })
    }
    Object.entries(book).forEach(setValueToKey)
  }, [book, setValue])
}
```

## Update Redux When The Form has Changed

Next, this custom hook is responsible for watching the form's changes and updating redux. A naive approach would just invoke the redux action update function with the entire form's data - this would be prawn to that infinite re-rendering cycle I mentioned at the beginning of this article.

The **solution** for that is to update the store with the **changes only**. That means creating a book object with the properties that have changed.

This hook is using the `useDeepCompareEffect` to compare the entire book's form changes. However, in this case, i'm creating the set of changes by filtering the fields that have changed with the `useFormApi.formState.dirtyFields`. This is a key/value object (name of field, boolean value for "changed" status) that includes the fields that have changed only.

```typescript
const useBookUpdater = (useFormApi, onChange) => {
  const bookChanges: Partial<IBook> = useFormApi.watch()
  const dirtyFields = useFormApi.formState.dirtyFields
  useDeepCompareEffect(() => {
    if (!isRecordEmpty(bookChanges)) {
      const book = createBookFromDirtyFields(dirtyFields, bookChanges)
      onChange(book)
    }
  }, [bookChanges])
}
```

And that's what it takes to add [redux toolkit] as a caching layer for [react-hook-form].

## Usage of the custom Form hook in React

The usage of the custom `useBookForm` hook is simple and follows the `useForm` api. Since it simply expose the entire form's api, we can use any of the exported functions of `useForm` and don't have to worry about updating the store for each field.

```typescript
import { InputField, Sentences } from "@readm/components"

export function Editor({ book }) {
  const { onSubmitHandler, useFormApi } = useBookForm(book)

  return (
    <form onSubmit={onSubmitHandler}>
      <InputField control={useFormApi.control} name="title" />
      <Sentences api={useFormApi} name="sentences" />
    </form>
  )
}
```

This is just a way to achieve that and a solution I have came up with to solve that form hook and redux integration challenge.

Thanks for reading.

[hooks]: https://orizens.com/tags/hooks
[clean code]: https://orizens.com/tags/clean-code
[readm]: https://readm.netlify.app
[improving your developer experience]: https://orizens.com/blog/how-to-improve-your-developer-experience-(dx)-with-react-hooks-and-redux-toolkit-rtk/
[react-hook-form]: https://react-hook-form.com/
[book editor]: /images/blog/2021-10/readm-book-editor.png "readm book editor"
[front page editor]: /images/blog/2021-10/readm-front-page-editor.png "readm page editor"
[redux toolkit]: https://redux-toolkit.js.org/