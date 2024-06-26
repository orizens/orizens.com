---
id: 20201230
title: "React - Making Component & Hooks With Clean Code Approach"
pubDate: 2020-12-31T00:13:48.715Z
author: Oren Farhi
layout: '@/templates/BasePost.astro'
# permalink: /blog/react-making-component-and-hooks-with-clean-code-approach/
imgSrc: "/images/blog/2020-12/PXL_20201223_194527123.PORTRAIT.jpg"
tags:
  - react
  - hooks
  - clean-code
---

Since React introduced hooks in its api, it has become a lot easier to encapsulate features and making it reusable. i've written before about the [reusing hooks], [organizing redux with hooks] and [much more hooks related articles].

I consider Clean Code as a philosophy that is developed over time. I believe that every developer wants to maintain code that is readable and easy to reason about. Sometimes, it's easy to add more code and features and by that, compromise the maintainability of the code.

I think that Clean Code requires more than a few iterations. With each iteration, new ideas may come up on how to approach and design the code.

### Separating Concerns

Consider this scenario for a React Component: it's easy to add few state hooks, some effects, function declarations that might use some of the hooks. This might end up as a big code before even getting into the component's jsx

In the example below, **Paragraph** is a sentence component in [ReadM] - a free friendly reading web app that motivates kids to practice, learn, read and speak English using real time feedback and providing positive experience.

![alt text][paragraph]

**Paragraph** internal state includes few helpers: speech result, state of active reading (speech api is in progress) and few more. It includes two effect hooks that handles an audio player get/set operations.

Some code within this example is a demo and the real implementation has been stripped for this article.

```typescript
function Paragraph({ text }) {
  const [speechResult, setSpeechResult] = useState([])
  const [isReading, setIsReading] = useState(false)
  const [userResult, setUserResult] = useState("")
  const [audioPlayer, setAudioPlayer] = useState()
  const { start, stop, player } = useRecorder()

  const handleEndResult = () => someCodeExecutedHere()
  const handleSuccess = () => someCodeExecutedHere()
  const handleFail = () => someCodeExecutedHere()

  const playRecording = () => someCode()
  const handleProgress = () => someCode()
  const handleStart = () => someCode()

  useEffect(() => {
    // setting current audio player from cache
  }, [])

  useEffect(() => {
    // adding new audio player to cache
  }, [])

  // includes 30-35 lines
  return (
    <>
      <Speaker {...usingSomeConstFromScope} />
      <SpeechTester {...usingSomeConstFromScope} />
      <Recording {...usingSomeConstFromScope} />
      <TesterResult {...usingSomeConstFromScope} />
    </>
  )
}
```

Although some of the variables are named decently, there's a lot that's going on within this component. This code can be further improved and encapsulated into its own hook. It would be a great deal to reduce the noise of the logics.

Lets dive into how to do that.

### Taking the MVC & MVVM approach

Few years ago, when js frameworks started to rise, the terms **MVC** & **MVVM** have become quite popular amongst the js community.

We can learn a lesson from these terms and use the guiding approach to clean up the code for this component. To make it analogous, we can think of MVC or MVVM in a React Component as:

1. M - Model - state
2. V - View - the jsx
3. C / VM - Controller / ViewModel - the logics and effects

we'll focus on the C/VM. Eventually ,the View is using few functions and only **some** of the state that is declared in this component.

Some of the code is related to the audio player - which is playing or recording audio.
Some of the code is related to the reading process - reading progress, speech result etc.

Now we can separate concerns and design a hook that would expose only api that is used by the view.

```typescript
function Paragraph({ text }) {
  const {
    speechResult,
    isReading,
    userResult,
    completeSuccessfulReading,
    endFailedReading,
    saveProgress,
    startReading,
  } = useReader(text)
  const { start, stop, playRecording } = useAudioPlayer(isReading)

  const handleSuccess = (result) => {
    stop()
    completeSuccessfulReading(result)
  }
  const handleFail = (result) => {
    stop()
    endFailedReading(result)
  }
  const handleStart = (result) => {
    saveProgress(result)
    start()
  }

  return <demo-jsx />
}
```

Notice how the component is now cleaner - the new **useReader** and **useAudioPlayer** hooks expose only the necessary actions and state that is used by the hook. All the scattered logics that was there before is now encapsulated inside this hook.
There are few more benefits:

1. reusing these hooks on other components.
2. testing becomes easier
3. internal implementations can be updated (turned off or adding features) without changing this api.
4. There's a chance some of the logics in one of these hooks might be reusable in other scenarios
5. it's simpler to understand where functions and states are coming from - some of the mess is gone now

I like taking the code I write to a high level of simplicity - aiming at almost [Pseudo code]. From my experience, it makes the code more maintainable, readable, easier to understand its purpose, reusable and FUN to read.

For me, it makes to have some kind of separation mentioned above - as approaching this code after few weeks or months still makes sense and becomes a no-brainer.

Please check out my app [ReadM] - a reading app that builds confidence in reading and speaking English (more languages are in progress) with real time feedback using speech recognition.

[readm]: https://readm.app
[organizing redux with hooks]: https://orizens.com/blog/how-to-not-have-a-mess-with-react-hooks-and-redux/
[reusing hooks]: https://orizens.com/blog/react-hooks-and-components-custom-hooks-as-minions-at-your-service/
[much more hooks related articles]: https://orizens.com/tags/hooks
[pseudo code]: https://en.wikipedia.org/wiki/Pseudocode
[paragraph]: /images/blog/2020-12/paragraph.png "Paragraph component"
