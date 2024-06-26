---
id: 20200419
title: "How To Functional Programming With Custom React Hooks"
pubDate: 2020-04-19T23:32:38.000Z
author: Oren Farhi
layout: '@/templates/BasePost.astro'
# permalink: /blog/how-to-functional-programming-with-custom-react-hooks/
imgSrc: "/images/blog/2020-04/IMG_20200406_143035.jpg"
imgAlt: "white tree"
tags:
  - react
  - hooks
  - architecture
  - functional
---

In this article, I decided to go the technical route and sharing my experience with writing a custom hook and integrating some functional programming strategy. The article walks through a custom hook - **useRecorder()**.

this article was [translated to Chinese] ([@infoQ China])

### "useRecorder()" Specifications

I have created **useRecorder()** for [ReadM] - a free friendly reading web app that motivates kids to practice, learn, read and speak English using real time feedback and providing positive experience.

![alt text][readm app]
This hook's purpose is to provide a recorder's functionality:

- it should record an audio
- it should allow to replay.
- it should provide explicit controls to start and stop recording
- it should persist while the application is active (and flush when refreshing/closing)
- it should provide full access to the audio and the player

### Usage

I designed the **useRecorder()** hook to be used with the paragraph component - this component is composed of 3 components - A Speaker, A Speech Tester and A Recorder Button.
The Recorder button is actually a simple rounded button which appears once the user has said the sentence and the feedback has been given. Only then, the user may click the recorder button to listen to the last attempt.

The description above is implemented in this code snippet (I removed some the actual code to make it shorter for this article):

```typescript
export function Paragraph({ text, ...props }: ParagraphProps) {
  // some code was stripped
  const { start, stop, player } = useRecorder()

  const handleEndResult = () => {
    stop()
  }

  const handleStart = result => {
    start()
  }

  return (
    <section>
      <Speaker
        text={text}
        disable={isReading}
        verified={speechResult}
        highlight={verified}
        speed={speed}
      />
      <SpeechTester onStart={handleStart} onResult={handleEndResult} />
      <ButtonIcon
        icon="play-circle"
        title="Listen to your voice"
        onClick={playRecording}
      />
    </section>
  )
}
```

[ReadM] recorder is shown to the right of the first sentence **"the power of your subconscious mind"** as a black oval with a white "play" icon.

![alt text][readm recorder]

### Reusable React Custom Hook: Implementation

For The **useRecorder()** actual audio recording feature, i've found a nice package that abstracts and simplifies the recording: [mic-recorder-to-mp3].

Thanks to using this module, the hook's code is quite short. However, it simplifies the building blocks it is made of.

I created **two** separate states that holds the audio and the player.

```typescript
const [audio, setAudio] = useState<File>()
const [player, setPlayer] = useState<HTMLAudioElement>()
```

In order to cache the recorder for each instance, i'm using a ref:

```typescript
const recorderInstance = useRef<MicRecorder>(() => undefined)
```

The **start()** function updates the recorderInstance with a new recording instance. This instance is a function that is used to **stop()** the recording.
I decided to use th strategy of **useEffect()** and **Observables** the use the return value of a constructor as a **destroy/cancel** functionality (notice that i'm checking whether recording is supported - i'll refer to that later in this article):

```typescript
const start = () => {
  if (supportsRecordingWithSpeech) recorderInstance.current = record()
}
```

The **record()** function is a functional composition of three functions - which is introduced in the section.

Next, the async **stop()** function returns a reference to a blob audio file and a instance of the audio player that can be used to play the audio at any given time. These are, respectively, saved within the state introduced a the beginning of this hook.

```typescript
const stop = async () => {
  if (supportsRecordingWithSpeech) {
    const { file, audioPlayer } = await recorderInstance.current()
    setAudio(file)
    setPlayer(audioPlayer)
  }
}
```

A word about recording speech: to this date, recording speech is not available in android via Web API. I'm using the navigator's userAgent object to determine whether this code runs in a mobile or android platform. In order to make this hook error free, both **start()** and **stop()** performs a check before running.

```typescript
// NOTE: in Android there's an issue with recording while starting speech recognizing
const supportsRecordingWithSpeech =
  navigator.userAgent.match(/(mobile)|(android)/im) === null

export function useRecorder() {
  const [audio, setAudio] = useState<File>()
  const [player, setPlayer] = useState<HTMLAudioElement>()
  const recorderInstance = useRef<MicRecorder>(() => undefined)

  const start = () => {
    if (supportsRecordingWithSpeech) recorderInstance.current = record()
  }

  const stop = async () => {
    if (supportsRecordingWithSpeech) {
      const { file, audioPlayer } = await recorderInstance.current()
      setAudio(file)
      setPlayer(audioPlayer)
    }
  }

  return {
    start,
    stop,
    audio,
    player,
  }
}
```

### Functional Javascript: Creating a Recorder

With [ReadM] development, I went deeper into experimenting with functional programming in javascript.

Since [ReadM] already utilizes [Redux], to compose the **record()** function, I imported **compose()** from redux:

```typescript
import { compose } from "redux"
```

The **compose()** function takes any number of arguments. These arguments must be functions. **compose()** invokes these functions sequentially starting with the **last** argument (a **pipe** is doing the same, but starting with the first argument).

The result of each function is passed on to the next function. It's up to the function's end goal to decide what the return value would be - that to allow some kind of **"chainability"** so it can be used with a **compose()** sequence.

With **record()**, **setupMic()** runs first an then one by one are invoked while receiving the return value of the latter.

```typescript
const record = compose(
  attachStopRecording,
  startRecording,
  setupMic
)
```

**setupMic()** creates a new instance of a recorder and returns it:

```typescript
function setupMic() {
  return new MicRecorder({
    bitRate: 128,
  })
}
```

Next, **startRecording(recorder)** is invoked with the recorder instance as an argument. It returns the recorder as well. Although this this function just invokes **start()**, in a broader context, it allow to perform any other logics related to starting the audio or perhaps some other operations:

```typescript
function startRecording(recorder: MicRecorder) {
  recorder.start()
  return recorder
}
```

Finally, **attachStopRecording(recorder)** is invoked with the same recorder instance as an argument. This function return a new function - a **stop()** functionality for the recorder which returns both the file (blob buffer) and an audio player instance with this file loaded.

Putting it altogether:

```typescript
function setupMic() {
  return new MicRecorder({
    bitRate: 128,
  })
}

function startRecording(recorder: MicRecorder) {
  recorder.start()
  return recorder
}

function attachStopRecording(recorder: MicRecorder) {
  return () =>
    recorder
      .stop()
      .getMp3()
      .then(([buffer, blob]) => {
        const file = new File(buffer, "reading.mp3", {
          type: blob.type,
          lastModified: Date.now(),
        })

        const audioPlayer = new Audio(URL.createObjectURL(file))
        return { file, audioPlayer }
      })
      .catch(e => {
        console.error(`Something went wrong with the recording ${e}`)
      })
}

const record = compose(
  attachStopRecording,
  startRecording,
  setupMic
)
```

If you prefer **arrow functions**, the same code would become:

```typescript
const setupMic = () => new MicRecorder({ bitRate: 128 })

const startRecording = (recorder: MicRecorder) => recorder.start() && recorder

const attachStopRecording = (recorder: MicRecorder) => () =>
  recorder
    .stop()
    .getMp3()
    .then(([buffer, blob]) => {
      const file = new File(buffer, "reading.mp3", {
        type: blob.type,
        lastModified: Date.now(),
      })
      const audioPlayer = new Audio(URL.createObjectURL(file))
      return { file, audioPlayer }
    })
    .catch(e => {
      console.error(`Something went wrong with the recording ${e}`)
    })

const record = compose(
  attachStopRecording,
  startRecording,
  setupMic
)
```

### The Benefits of Functional Programming

During development, I was asking - what benefits does it get me?

For starters, I started composing and creating functionality by plugging few functions together, making sure they are linked in some way that keeps the "chain" going. These functions are **reusable** for other purposes - other operations or functionality that I may use in other situations.

**Testing** becomes much more modular, precise and isolated to self operable units. The responsibility for each unit becomes much smaller, dedicated to a simple task.

Overall, I like the final outcome. The code is small, simple and easy to maintain. Coming back to this code few months after I wrote, I can read and understand it quite fast.

### Making It Better

I always keep on eye on how to improve existing code.
There are optional configurations that can be added to the hook's function signature, ie: resulted file name, recording bit-rate, different file type, init with an existing file blob.

We can go further to be more reactive with the implementation, and have the **start()** and **stop()** functions run as effects (with **useEffect()**) with creating a single **"activate()"** function that will trigger both operations.

Please check out our game changing app [ReadM] - the reading app builds confidence in reading and speaking English (more languages are in progress) with real time feedback.

Full Source Code is available at [use-recorder source code at github].
Also, I created a small and simple [recorder demo] app.

Expect more useful articles sharing code from the [ReadM] development experience.

[readm]: https://readm.netlify.app
[@infoq china]: https://www.infoq.cn
[translated to chinese]: https://www.infoq.cn/article/4PGR9BeBKGIKyElkNiLN
[mic-recorder-to-mp3]: https://www.npmjs.com/package/mic-recorder-to-mp3
[redux]: https://redux.js.org/
[use-recorder source code at github]: https://github.com/orizens/use-recorder.git
[an npm package]: https://www.npmjs.com/package/use-recorder
[recorder demo]: https://p1wmc.csb.app/
[readm app]: /images/blog/2020-04/readm.png "ReadM App"
[readm recorder]: /images/blog/2020-04/readm-recorder.png "ReadM usage of recorder"
