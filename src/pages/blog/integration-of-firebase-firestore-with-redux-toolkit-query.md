---
id: 20230406
title: "Integration of Firebase Firestore with Redux Toolkit Query"
pubDate: 2023-04-06T15:56:38.693Z
author: Oren Farhi
layout: '@/templates/BasePost.astro'
# permalink: /blog/integration-of-firebase-firestore-with-redux-toolkit-query/
imgSrc: '/src/images/blog/2023-04-06/rainbow.jpg'
imgAlt: 'rainbow'
tags:
  - react
  - firebase
  - firestore
  - rtk
  - clean-code
---

## Integration of Firebase Firestore with Redux Toolkit Query

Integrating Firebase Firestore with [Redux Toolkit Query] is an efficient way to handle data management in modern web applications. Redux Toolkit Query is a library that helps to simplify the management of API data in a Redux store. Firebase Firestore, on the other hand, is a NoSQL document-oriented database that can store, retrieve and manage data. This technical article will explain how the above code integrates Firebase Firestore with Redux Toolkit Query to organize the code and the benefits of this approach.

## Benefits of Using Firebase Firestore with Redux Toolkit Query

Using Firebase Firestore with Redux Toolkit Query provides several benefits. Here are three of them:

### 1. Efficient Caching and Data Management
Firebase Firestore with Redux Toolkit Query makes caching and data management easier and more efficient. Redux Toolkit Query automatically caches data from API responses and removes stale data from the cache after a set period. This makes it easy to retrieve data from the cache when it is needed and reduces the number of API calls needed to retrieve data.

### 2. Improved Code Organization
Integrating Firebase Firestore with Redux Toolkit Query improves code organization. With Redux Toolkit Query, all the API-related logic is handled in a single file, making it easier to manage and maintain. This reduces the need to scatter API logic across multiple components and files, which can make the code harder to follow and debug.

### 3. Improved Scalability and Flexibility
Using Firebase Firestore with Redux Toolkit Query makes it easier to scale and add new features to an application. Redux Toolkit Query provides a consistent and easy-to-use API for working with data from different sources. This makes it easier to switch to a different database or API in the future if needed. Additionally, Firebase Firestore's scalability makes it easy to handle large amounts of data

## The users query api

```javascript
import { documentId, onSnapshot, query, where } from 'firebase/firestore';

import { CreateUserConfig, createUser, getUsersCollection } from '~/api';
import { IUserProfile } from '~/api/user.types';

import { readmApi } from '../query.api';

export const userApi = readmApi
  .enhanceEndpoints({
    addTagTypes: ['Users'],
  })
  .injectEndpoints({
    endpoints: builder => ({
      getUsers: builder.query<IUserProfile[], string[]>({
        providesTags: ['Users'],
        keepUnusedDataFor: 3600,
        async queryFn(userIds) {
          return { data: null };
        },
        async onCacheEntryAdded(
          userIds,
          { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
        ) {
          let unsubscribe;
          try {
            const ref =
              userIds.length > 0
                ? await query(
                    getUsersCollection(),
                    where(documentId(), 'in', userIds),
                  )
                : await query(getUsersCollection());
            unsubscribe = onSnapshot(ref, snapshot => {
              updateCachedData(draft => {
                return snapshot?.docs?.map(doc => doc.data()) as IUserProfile[];
              });
            });
          } catch (error) {
            console.log('error in users!', error);
            throw new Error('Something went wrong with users.');
          }
          await cacheEntryRemoved;
          unsubscribe && unsubscribe();
          return unsubscribe;
        },
      }),
      createStudent: builder.mutation<IUserProfile, CreateUserConfig>({
        async queryFn(arg) {
          const response = await createUser(arg);
          return { data: response.data };
        },
        // @ts-expect-error
        transformResponse(response: { data: IUserProfile }): IUserProfile {
          return response.data;
        },
      }),
    }),
  });

export const { useGetUsersQuery, useCreateStudentMutation } = userApi;

export const useGetUserProfile = (student: string) => {
  return useGetUsersQuery([student], {
    selectFromResult: result => {
      const user = result
        ? result?.data?.find(user => user.uid === student)
        : null;
      return { user };
    },
  });
};
```

The code above demonstrates the integration of Firebase Firestore with Redux Toolkit Query. The `userApi` object is created using the `readmApi` object, which is enhanced with the `enhanceEndpoints` method that adds a tag type for Users. The `injectEndpoints` method adds two endpoints to the `userApi` object, `getUsers` and `createStudent`.

The `getUsers` endpoint is a query endpoint that returns an array of `IUserProfile` objects. It has three important properties, providesTags, `keepUnusedDataFor` and queryFn. The `providesTags` property is used to define the tag type that the query endpoint is associated with. The `keepUnusedDataFor` property is used to set the duration in seconds for which unused data is kept in the cache. The queryFn property is used to define the function that is executed when the query is made. In this case, the function returns null data, but it can be customized to retrieve data from the Firebase Firestore database.

The createStudent endpoint is a mutation endpoint that creates a new `IUserProfile` object. It has only one property, `queryFn`, which is used to define the function that is executed when the mutation is made. In this case, the function calls the createUser function from the ~/api module and returns the new user data.

The `useGetUsersQuery` and `useCreateStudentMutation` hooks are created using the userApi object. These hooks can be used in React components to retrieve and mutate data respectively.

The `useGetUserProfile` hook is a custom hook that uses the `useGetUsersQuery` hook to retrieve a single user profile. It takes a student argument, which is the uid of the user profile to retrieve. It uses the `selectFromResult` option to select and return the user profile with the specified uid from the data property of the result.

## Real-time Updates and Improved Scalability

The `getUsers` function in the query api is designed to listen to changes in the Cloud Firestore and update the relevant hook of the query accordingly. This functionality is made possible by the onSnapshot method that's used in the code.

When a user queries for a set of users, the `getUsers` function listens for changes to the documents in the Cloud Firestore that match the query. If a change is detected, the onSnapshot method fires, and the function retrieves the updated data from the snapshot.

Since the `getUsers` function is connected to the relevant endpoint in the Redux store, any changes to the data in the Cloud Firestore will automatically trigger a change to the component that's consuming the relevant hook of that query. This ensures that the component always has the most up-to-date data and can respond accordingly.

Using this approach provides several benefits. First, it ensures that the component always has the most up-to-date data, which is critical in real-time applications. Second, it eliminates the need for developers to write complex code to listen for changes in the Cloud Firestore manually. This can significantly reduce development time and improve code quality.

Finally, it allows for greater scalability since the onSnapshot method only retrieves changes to the data rather than the entire dataset. This can improve performance and reduce the load on the database, making it easier to scale the application as the user base grows.
## How is it used
The code in this article is based on [ReadM] - an innovative free game changing app for practicing English reading aloud while having fun and becoming fluent reader.

![alt text][classes]

This page is utilizing the query API to provide live updates of all the students in the class. The remarkable aspect of this implementation is its usefulness in the post-COVID era, where students can work and practice their reading remotely, while the teacher receives instant updates in real-time. The seamless integration of Firebase/Firestore and RTK Query is the key factor in achieving this functionality.

![alt text][student]

When accessing a student's profile, the page utilizes the useGetUserProfile hook to monitor any updates to the individual user's profile. Similar to the previous page, changes made to the student's profile will be instantly reflected here due to the integration of Firebase Firestore and Redux RTK Query.

[readm]: https://readm.app
[Redux Toolkit Query]: https://redux-toolkit.js.org/rtk-query/usage/queries
[classes]: /src/images/blog/2023-04-06/classes.png "classes page in readm practice reading aloud app"
[student]: /src/images/blog/2023-04-06/student.png "classes page in readm practice reading aloud app"