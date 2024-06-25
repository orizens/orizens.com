---
id: 20201231
title: "React Hooks Retrospective: Event Driven Async Hooks"
pubDate: 2021-01-31T22:14:48.459Z
author: Oren Farhi
layout: '@/templates/BasePost.astro'
# permalink: /blog/react-hooks-retrospective-event-driven-async-hooks/
imgSrc: "/images/blog/2021-1/PXL_20201217_162640591.PORTRAIT.jpg"
imgAlt: "coffee cup"
tags:
  - react
  - hooks
  - clean-code
  - architecture
---

I have been [writing about React Hooks] and how I'm using it to encapsulate features and making it reusable in apps. In my opinion, [Reusing hooks] as self contained units is important as much as designing them.

The strategy of Clean Code plays an important role before and after approaching a solution. One should understand all React's built in hooks before using it for a solution. There are some concepts and constraints and the code should play the rules of that "Hooks Game". When played by the rules, the result can be satisfying.

I read the article ["The Catch with React Hook"] which explains well the constraints of hooks and async programming. However, in my opinion, the example that is presented in that article can be simplified with hooks while adopting a different approach and playing by the rules of hooks.

I thought it is a good idea to share my views with that chat example - as it's a very good feature for demonstrating clean code with hooks - separating concerns and designing with hooks in mind.

### Separating Concerns With Hooks

The article eventually presents a chat panel implemented as one long function with one **useEffect()** to address the challenges of async operations that happens when bootstrapping the chat component.

On the other hand, the **"Class"** based component attempts to present the same features with a different approach - one that allows you to see the flow of a synchronous execution.

Lets list out the features of that chat component:

1. **Chat Stream Connector** - connecting or closing sockets
2. **Chat Messages Provider** - fetching messages
3. **Scroll To Bottom** - in order to show the latest messages

If you've read previous articles I wrote about [clean code] and hooks - Or simply you've identified where i'm going from here - I will let the code speak for itself.

i'm going to transform the above list to hooks.

### Using Custom React Hooks For Better Maintainability

I always try to design code so it is almost read as a story - speaking out loud its intention without going into details.
**Javascript** includes events by nature, so, in a way, it's asynchronous by nature. I consider **useEffect()** to implement that concept - given an array of dependencies, once one of the dependencies has changed, we tell the hook to run the logics inside that hook no matter what.

I look at **useEffect()** as an integral part of the Event Driven Architecture that happens in a reactive application like a chat. We don't have to necessarily "await" for functions to complete, but rather, we can use the given features that will react to events that happen over time in our application.

A possible perspective of **useEffect()** can be the case where the the function inside that effect block should run and respond to changes in that dependency array. It's Reactivity - This is the Reaction to a change in state. so, **useEffect()** offers a way to tap into that lifecycle of "state changed" and act.

**TL;DR**, Hooks are event driven - here's my possible implementation of the ChatPanel with **Function component** and **Custom Hooks**:

```typescript
function ChatPanel() {
  const { data, connect, send } = useChatStreamConnector(url, roomId);
  const { messages, fetchNextMessages } = useChatMessagesProvider(socket, data);
  const listRef = useScrollPosition(roomId);

  return (
    <article>
      <div ref={listRef}>
        {messages.map(message => (
            <Message
              key={message.id}
              name={message.user.name}
              time={message.timeSent}
              thumbnail={message.user.thumbnail}
              contents={message.contents}
            />
        )}
      </div>
    </article>
  )
}
```

The goal in the design of the above code is to have separation of the various functional components of that **ChatPanel** and to make it clear of what makes that composition.

There are 3 hooks - each one implements a feature and abstracts away it's logic. All hooks in this case export an api that can be used with other hooks or any container that calls it.

Now, lets approach each hook and the challenge they approach, while taking into an account the problems the article mentioned. Some of the code is assume features are implemented in a certain way. For a community open source hooks, I usually use the excellent [Collection Of React Hooks by @nikgraf].

### Custom Hook - Connect to Chat Socket

The problem with the socket is - it is the first feature that needs to be initialized before we attempt to fetch messages.

According to the chat solution we need to implement, the chat component requires a socket to:

1. register the room id
2. send new data
3. closing connections
4. listen for new data

I'm specifically abstracting away the socket functionality and tie it into a chat/messages - as it can used for other purposes - however, my goal to let that hook do one thing and specialize in one feature only.

The **useChatStreamConnector()** hook simply creates a socket and expose a connect and send functions. I'm relying on a hook that would provide most of the socket functionality - connecting, reconnecting, closing a connection. On top of that, i'm adding some logics i need. A possible implementation to the above can result in:

```typescript
function useChatStreamConnector(url ,id) {
  const user = useUser();
  // the hook already provides socket.close()
  const socket = useSocket(url, id);
  const [data, setData] = useState();

  // register to 'message' event
  useEffect(() => {
    if (user && !socket?.connected) {
      socket.on('message', (event) => setData(event.data))
    }
  // when one of these is changing, i want to run that logic again
  }, [id, url, user, socket, setData])

  return { data, send: socket.send }
}
```

### Custom Hook - Chat Message Provider

Fetching messages happens in 2 cases:

1. when the component has been rendered (did mount)
2. when a room has changed

According to the article, the fetch messages is not related to the socket, however if it was, I would have exposed a "fetch" method from the **useChatStreamConnector**.

The problem for this async action is that there's have to be a room to fetch the messages from. A possible implementation would be:

```typescript
function useChatMessagesProvider(socket, data) {
  const { value, toggle } = useToggle();
  const [messages, setMessages] = useState([]);

  // this hook runs when data is available from the socket
  useEffect(() => {
    if (data) {
      setMessages(data);
    }
  }, [data, setMessages])

  // when roomId or socket change, i want to fetch messages
  useEffect(() => {
    // the function can run without that "async" since we're using
    // a boolean guard
    async function fetchMessages() {
      toggle();
      // this would happen only when fetch is not in progress
      if (!value && roomId && socket?.connected) {
        // assume i'm using my own fetch that takes care of parsing the response
        const response = await fetch(`/rooms/${roomId}/messages`)
        setMessages(response);
        toggle();
      }
    }
    fetchMessages();
  }, [roomId, socket, setMessages])

  return { messages }
}
```

### Custom Hook - Scroll To Bottom

The feature of scrolling to bottom can be considered as an asynchronous if it needs to occur whenever a room is changed.

In order to "await" for this, a possible implementation can be:

```typescript
function useScrollPosition(prop) {
  const listRef = useRef<HTMLElement | any>()

  useEffect(() => {
    if (prop && listRef.current) {
      listRef.current.scroll(0, listRef.current.scrollHeight)
    }
  }, [prop])

  return listRef
}
```

The beauty of the above is that we're listening to a state change rather than actually "awaiting" for an operation to be completed. The difference is, this code is true for every situation where the "prop" is changing. Again - it's async by default.

It doesn't matter how the "prop" is updated - either async or async - once it has changed - it runs.

In the spirit of composition, "reusability" and DRY, we can create a component that includes this hook, making it reusable for other cases as well:

```typescript
function ScrollToBottom({ children, dependencies }) {
  const listRef = useScrollPosition(dependencies);

  return (
    <div ref={listRef}>
      {children}
    </div>
  )
}

// that makes the main component even smaller
function ChatPanel({ roomId }) {
  const { data, connect, send } = useChatStreamConnector(url, roomId);
  const { messages, fetchNextMessages } = useChatMessagesProvider(socket, data);

  return (
    <article>
      <ScrollToBottom dependencies={[roomId]}>
        {messages.map(message => (
            <Message
              key={message.id}
              name={message.user.name}
              time={message.timeSent}
              thumbnail={message.user.thumbnail}
              contents={message.contents}
            />
        )}
      </ScrollToBottom>
    </article>
  )
}
```

### React Hooks are Event Driven

I think that React Hooks is a feature that complements the idea of a **reactive application** in a **reactive programming** world. I like it how hooks simplifies the connection of View and Model, or **composing** several logics for the outcome of a desired result.

Simply put, react hooks trigger a rerender (useState) **or** recomputation (useEffect). React Hooks execution is based on events.

I think that the most important abstraction hooks solved is the Event Driven nature of the platform it runs on - the **Event Driven** expectation of how things happen.

As mentioned before, when knowing the rules really good, you can start playing and find out what works out better for the code you're designing.

Separating logical blocks of code to components or hooks - leads to a more elastic implementations. Using hooks is more about reusing features that were already well thought of - usually - without any Views in mind. After all, hooks solves the problem of reusing mostly logics instead of the popular render-props approach that were used before them.

A **paradigm shift** has/had to take place with hooks. I don't think Class components solves a problem better than Function components. These are 2 ways to solve a problem - I agree that it's confusing - but eventually - there's no right/wrong way to solve that problem. However, I do want to point out at always thinking about the concepts of Clean Code and Software Architecture Concepts: KISS (Keep it simple), DRY code and allow reusability.

I find it very pleasing to see a code like the proposed **ChatPanel** function component I shared above - being able to read the code and understand how it is composed promotes to the expressiveness one can have with hooks. I see a composition of several features that can be used to compose other awesome components. Using hooks as building blocks has proven to be efficient in my experience.

["the catch with react hook"]: https://stevenkitterman.com/posts/the-catch-with-react-hooks/
[collection of react hooks by @nikgraf]: https://nikgraf.github.io/react-hooks/
[reusing hooks]: https://orizens.com/blog/react-hooks-and-components-custom-hooks-as-minions-at-your-service/
[writing about react hooks]: https://orizens.com/tags/hooks
[clean code]: https://orizens.com/tags/clean-code
