---
id: 20200539
title: "How To Let Your React Code Speak For Itself"
pubDate: 2020-05-30T15:48:30.402Z
author: Oren Farhi
layout: '@/templates/BasePost.astro'
# permalink: /blog/how-to-let-your-react-code-speak-for-itself/
imgSrc: "/images/blog/2020-05/2020-05-30.jpg"
imgAlt: "red flower"
tags:
  - react
  - hooks
  - architecture
  - clean-code
---

## How To Let Your React Code Speak For Itself

It has become extremely easy to manage state in React Functional components with Hooks. I've previously written of using [Custom Hooks as a service] and using [functional programming inside custom hooks]. In this article i'm sharing a fairly simple refactor I made, one that led to a cleaner, reusable and more minimal implementation.

this article was [translated to Chinese] ([@infoQ China])

## Code Abstraction

I believe code should be self explanatory and easy to move around and be reused. Sometimes it's easier to start with a naive approach of using the basics and once you see a recurring pattern - to abstract that away.

I think code abstraction clarifies a lot when applied correctly. Too much abstraction may lead to the opposite effect - hard to realize implementation - or what I like to call: **"Bad Poetry"**.

I have created the **Speaker()** component for [ReadM] - the free friendly reading web app that motivates kids to practice, learn, read and speak English using real time feedback and providing positive experience (the Speaker component is highlighted with the sentence "Nick went for a ride on his bike").

![alt text][readm app]

This component is responsible for displaying a text and while allowing interactivity by saying a sentence or a specific word. As far as it goes for user experience, I decided to add **word highlighting** while it is spoken (much like karaoke).

![alt text][readm word highlighting]

## The React Speaker Component Layout

The **Speaker()** component expects to receive few props in order to allow the above interactivity.

### Speaker's Component Definition

Here's A quick summary of all props:

- **text** - a sentence (or a word) the speaker displays and "says"
- **onSpeakComplete** - a callback the speaker calls once speak is complete
- **disable** - disables the functionality for clicking a word to hear it
- **verified** - an array of words in **text** that have been read successfully during current session of spoken text
- **highlight** - an array of boolean values for words from **text** that have been read successfully previously
- **speed** - a number that indicates the speed of saying a sentence

```typescript
function Speaker({
  text,
  onSpeakComplete,
  disable,
  verified = [],
  highlight = [],
  speed,
}: SpeakerProps) {
  // code
}
```

![alt text][paragraph in react devtools]

### Speaker Behavior & Functionality

Next (the function's body), the state for highlighting a spoken word is defined along with a function handler to set this word. Note this section - this is what this article is going to enhance and hopefully clarifies in a much better way.

```typescript
const [highlightSpoken, setHighlightSpoken] = useState<{
  word: string
  index: number
}>()

const handleOnSpeak = useCallback(() => {
  speak({
    phrase: text,
    speed,
    onEndCallback: () => {
      onSpeakComplete && onSpeakComplete(text)
      setHighlightSpoken(null)
    },
    onSpeaking: setHighlightSpoken,
    sanitize: false,
  })
}, [text, onSpeakComplete, setHighlightSpoken, speed])

const handleOnSelectWord = (phrase: string) => {
  speak({ phrase, speed, onEndCallback: noop })
}
```

### Speaker's Display: The Render

This code now derives values from the props to prepare display properties that are passed into the presentation components within the return render value.

```typescript
const words = verified.length ? verified : createVerifiedWords(text, highlight)
const rtlStyle = resolveLanguage(text).style
const justify = rtlStyle.length ? "end" : "between"
```

The returned render value is:

```typescript
function Speaker(props) {
  // all the above code commented
  return (
    <Column md="row" alignItems="center" justify={justify} className="speaker">
      <Row
        wrap={true}
        className={`speaker-phrase bg-transparent m-0 ${rtlStyle}`}
      >
        {words.map((result, index) => (
          <WordResult
            key={`${text}-${index}`}
            result={result}
            disable={disable}
            highlight={highlightSpoken && highlightSpoken.index === index}
            onSelectWord={handleOnSelectWord}
          />
        ))}
      </Row>
      <ButtonIcon
        data-testid="speaker"
        icon="volume-up"
        type="light"
        size="4"
        styles="mx-md-2"
        disabled={disable}
        onClick={handleOnSpeak}
      />
    </Column>
  )
}
```

## ConsolipubDate:Rethinking With Custom Hook - useSpeaker()

Although this component is not that big, it can be organized better and can be cleaner.

The Speaker's Behavior & Functionality code section can be reused and consolidated into its own self operable unit. Notice how the **"speak()"** function is used twice in 2 different contexts - There might be a potential to DRY it out and rethink how to approach it.

We can create a new reusable Hook - **useSpeaker()**. All we need from this hook is to receive the currently spoken word (a state) and the **speak()** functionality.

Only then, we can abstract away the entire behavior code and use this handy little snippet in the Speaker's code:

```typescript
const { spokenWord, say } = useSpeaker({
  text,
  speed,
  onEnd: onSpeakComplete,
})
```

The **useSpeaker()** includes the code that was extracted from the **Speaker** component.

```typescript
import React from 'react';
import { speak } from '../utils/speaker.util';

type TextWord = {
  word: string;
  index: number;
};
export default function useSpeaker({ text, speed, onEnd }) {
  const [spokenWord, setSpokenWord] = React.useState<TextWord>();

  const say = React.useCallback(() => {
    speak({
      phrase: text,
      speed,
      onEndCallback: () => {
        onEnd && onEnd(text);
        setSpokenWord(null);
      },
      onSpeaking: setSpokenWord
      sanitize: false,
    });
  }, [text, speed, onEnd]);
  return { spokenWord, say };
}

```

Now, there were two **"speak()"** function calls. The new **useSpeaker()** hook can now be reused internally inside the **WordResult** component.

All we need to change in WordResult is - instead of passing a function handler for **onSelectWord()**, the **speed** property will be passed. Using speed, result (an object that includes the "word"), the same functionality of **useSpeaker** is reused inside WordResult.

```typescript
{
  words.map((result, index) => (
    <WordResult
      key={`${text}-${index}`}
      result={result}
      disable={disable}
      highlight={spokenWord && spokenWord.index === index}
      speed={speed}
    />
  ))
}
```

![alt text][wordresult in react devtools]

With the above custom hook - **useSpeaker()** - the code refactor have trimmed down **20** lines of code to a reusable **5** lines of code. On top of that, the code now has much more semantical meaning with a very precise and clear goal.

## How Code Speaks

Besides from tailoring technical "speaking" to the code, the **useSpeaker()** code refactor reflects its meaning - by just coming up with the correct terms, the code may speak in one's mind.

I believe it's important to keep iterating on good functional code not too long after it's written. While reading the code and trying to make sense of it, questions may pop up:

- why this code is here?
- what does it do?
- where is it used?
- what is it trying to accomplish?

To these questions, I usually add questions with goals that may lead to better results:

- what code can be taken out?
- can this code be consolidated into a short function name?
- what parts of the code are tightly coupled so those can be grouped together into a "black-box"?
- how can I make the code tell a story as in poetry/book/plain-english?
- can I make the code speak for itself?

Please check out my real-time reading feedback app [ReadM] - a Free PWA reading app that builds confidence in reading and speaking English (more languages are in progress) with real time feedback using speech recognition.

Expect more useful articles sharing code from the [ReadM] development experience.

[readm]: https://readm.app
[custom hooks as a service]: https://orizens.com/blog/react-hooks-and-components-custom-hooks-as-minions-at-your-service/
[functional programming inside custom hooks]: https://orizens.com/blog/how-to-functional-programming-with-custom-react-hooks/
[readm app]: /images/blog/2020-05/speaker.png "ReadM App - The Speaker Component Is Highlighted"
[wordresult in react devtools]: /images/blog/2020-05//WordResult.png "Word Result in React DevTools"
[paragraph in react devtools]: /images/blog/2020-05//paragraph-in-devtools.png "Paragraph in React DevTools"
[readm word highlighting]: /images/blog/2020-05//word-highlighting.gif "ReadM Word Highlighting"
[@infoq china]: https://www.infoq.cn/article/ZmcUNS7ezTwKjL0wUCLI
