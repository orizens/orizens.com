---
id: 1151
title: Lessons Learned from Creating A Typeahead With RxJs And Angular
date: 2017-01-01T14:29:36+00:00
author: Oren Farhi
templateKey: blog-post
layout: post
guid: http://orizens.com/wp/?p=1151
permalink: /blog/lessons-learned-from-creating-a-typeahead-with-rxjs-and-angular-2/
post_grid_post_settings:
  - 'a:10:{s:9:"post_skin";s:4:"flat";s:19:"custom_thumb_source";s:93:"./img/plugins/post-grid/assets/frontend/css/images/placeholder.png";s:17:"font_awesome_icon";s:0:"";s:23:"font_awesome_icon_color";s:7:"#737272";s:22:"font_awesome_icon_size";s:4:"50px";s:17:"custom_youtube_id";s:0:"";s:15:"custom_vimeo_id";s:0:"";s:21:"custom_dailymotion_id";s:0:"";s:14:"custom_mp3_url";s:0:"";s:20:"custom_soundcloud_id";s:0:"";}'
dsq_thread_id:
  - "5426540708"
dsq_needs_sync:
  - "1"
image: ../img/uploads/2017/01/type-rxjs.jpg
categories:
  - Angular
  - RxJS
tags:
  - angular2
  - architecture
  - rxjs
---

Following recent articles on development of [Echoes Player](http://echoesplayer.com), my [open source media player](http://echoesplayer.com) built with Angular, I really wanted to implement a typeahead feature for this version. There are some great ng2-typeahead out-there (available in npm), however, I wanted to take this opportunity to built something from scratch - exploring deeper concepts in Angular. I learned quite a few from implementing a typeahead component and i'm sharing these in this article.

## Typeahead - Design

I had a clear vision of how the typeahead feature should work:

1. it should be used as an attribute to an input element
2. it should be rendered as a sibling to the input element
3. it should expose a selected result event
4. it should support keyboard navigation in suggestions list
5. it should support custom template for suggestions list
6. it should cancel suggestions when "Escape" key is pressed
7. it should cancel suggestions when clicking outside the suggestions container

I wrote on my experience with [RxJs and Angular (+2)](http://orizens.com/wp/blog/stepping-into-the-next-level-with-rxjs-in-angular-2/) before, and this article takes this approach further.

## Typeahead - Implementation

I decided to use the "@Component()" decorator, as it allows to have template - which I wanted to have for this implementation.

### 1. typeahead as an attribute

defining a component as an attribute is simple since the @Component's "selector" values are parsed as css selectors:

```typescript
@Component({
  selector: '[typeahead]',
  // OR restrict to an input element only
  selector: 'input[typeahead]'
})
```

### 2. typeahead suggestions as a sibling to the element

In order to achieve this, I had to define this component with the @Component() decorator. However, since this component is added to an input element, If I use regular template that will be rendered with Angular's engine, than it will be rendered inside the input element. This will show up in the devtools like this:

```typescript
<input typeahead>
   <typehead-template-contents>
</input>
```

I took a slightly different approach with this challenge. I remembered seeing few videos on youtube (Rob Warmwald) explaining about the strengths of the template engine within Angular and how it can be used to achieve complex ideas. At first, the template for the typeahead was quite simple. The template supports the following:

1. declare a name for the template
2. toggle the template contents with "ngIf" boolean statement
3. rendering a simple array of suggestions (referred as results)
4. marking the currently active result with an "active" css class
5. handle a click event for selecting a result

```typescript
@Component({
  selector: '[typeahead]',
  template: `
  <ng-template #suggestionsTplRef>
  <section class="list-group results" *ngIf="showSuggestions">
    <button type="button" class="list-group-item"
      *ngFor="let result of results; let i = index;"
      [class.active]="markIsActive(i, result)"
      (click)="handleSelectSuggestion(result)">
      <span><i class="las la-search"></i> {{ result }}</span>
    </button>
  </section>
  </ng-template>
  `
})
```

Lets define the class which handles this template.

### 3 - expose a selected event

In order to support the typeahead selected event, I defined an event of string with the @Output() decorator. The rest of the following properties, match the variables that are referenced from the template aside from subscriptions and activeResult.

"subscriptions" is an array of subscriptions which this component use to store rxjs subscriptions which should be disposed once this component is destroyed (we'll get to these later).

```typescript
export class TypeAheadComponent implements OnInit, OnDestroy {
  @Output() typeaheadSelected = new EventEmitter<string>();

  private showSuggestions: boolean = false;
  private results: string[];
  private suggestionIndex: number = 0;
  private subscriptions: Subscription[];
  private activeResult: string;

  @ViewChild('suggestionsTplRef') suggestionsTplRef;

```

The constructor injects these:

1. element - to listen for input events
2. viewContainer - in order to render the template as a sibling (bullet #2)
3. jsonp - start requests as a jsonp to google's search api
4. cdr - change detection reference to apply changes within this component and its siblings

```typescript
constructor(private element: ElementRef,
    private viewContainer: ViewContainerRef,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) { }
```

### Component Setup

First, this component sets up the proper subscriptions when it is ready in the ngOnInit lifecycle:

```typescript
ngOnInit() {
    this.subscriptions = [
      this.filterEnterEvent(),
      this.listenAndSuggest(),
      this.navigateWithArrows()
    ];
    this.renderTemplate();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions.length = 0;
  }

  renderTemplate() {
    this.viewContainer.createEmbeddedView(this.suggestionsTplRef);
    this.cdr.markForCheck();
  }
```

Before we dive into each function, I want to explain the "**renderTemplate()**" function.

With this function, i'm using the "viewContainer" in order to render the template as a sibling to the actual element. The "createEmbeddedView" function takes a template reference and inserts it, compiled with the data, into the last view position in the html container. The actual "viewContainer" is the element that wraps the input element (in this case). A second argument determines the index at which this template should be rendered.

### cdr - ChangeDetectorRef for change detection

The use of "cdr" turned out to be useful for detecting changes and telling angular to render this component again. Since i'm using a parent component (PlayerSearch Component) with a change detection strategy set to "OnPush" - using "**markForCheck()**" is a way of telling angular that there are changes within this component which are not originated from the "Input()"s, so it needs to re-render the component.

### 4 - Keyboard Support

lets go over the actual rxjs code which creates the typeahead behavior for this component.

In order to support selection of a result with the enter key, this code listens to keydown strokes on the input element, allows only Enter key to pass on to the stream and then invokes the "handleSelectSuggestion" which eventually - emits an event for the selected result.

```typescript
filterEnterEvent() {
    return Observable.fromEvent(this.element.nativeElement, 'keydown')
      .filter((e: KeyboardEvent) => e.keyCode === Key.Enter)
      .subscribe((event: Event) => {
        event.preventDefault();
        this.handleSelectSuggestion(this.activeResult);
      });
  }
```

The actual logics which makes a jsonp call to get the list of suggestions according to the value of the input, is implemented in the "**listenAndSuggest()**" function.

This time, the code listens to keyup strokes (since we do want to allow a character to apply into the input), filtering out any non characters keys with "**validateKeyCode()**". Here I set a debounce of 400ms as a reasonable time for not doing too many request in a given time. I use "**distinctUntilChanged()**" to filter the stream for the same value - which again prevents unnecessary requests. Then, the filter for an empty string becomes relevant before the code makes the actual request.

Now, i'm using "switchMap" since i'm expecting to pass a new observable which should be returned from the "**suggest(query)**" function.

The subscribe starts the execution of this stream, saves the results and sets the suggestions box to show the relevant view. Since this code is not connected to angular, I have to use the "**markForCheck()**" to instruct angular to re-render the component and its parent, regardless of the change detection strategy that is used. An **important** note in this context is that in order to achieve this chain of operations and decisions, **without** RxJs, I would have written a much more complex code, probably one that would not fit a single short function like this one.

```typescript
listenAndSuggest() {
    return Observable.fromEvent(this.element.nativeElement, 'keyup')
      .filter(this.validateKeyCode)
      .map((e: any) => e.target.value)
      .debounceTime(400)
      .concat()
      .distinctUntilChanged()
      .filter((query: string) => query.length > 0)
      .switchMap((query: string) => this.suggest(query))
      .subscribe((results: string[]) => {
        this.results = results;
        this.showSuggestions = true;
        this.cdr.markForCheck();
    });
  }
```

**NOTE**: Currently, this component is not reusable anywhere else, so I hardcoded the url and the params of the http.jsonp request to the "suggest()" function. However, if I had to make this component reusable, I would have have few ways to take out hard coded "suggest()" function:

1. Pass "suggest" as an @Input() which should get an observable.
2. Pass "url" and "searchParams" as @Inputs - this would restrict the typeahead component to jsonp requests only.

Achieving one of the two is pretty straight forward - you can take this a good exercise. Here is the **suggest** code extracted to a **"requestJsonp()"** method (taken from the latest [ngx-typeahead](https://github.com/orizens/ngx-typeahead/blob/master/src/modules/ngx-typeahead.component.ts#L281) npm package):

```typescript
) {
<span class="pl-k">    const</span> params <span class="pl-k">=</span> <span class="pl-smi">options</span>.<span class="pl-smi">params</span>.<span class="pl-c1">toString</span>();
    return this.http.jsonp(<span class="pl-pds">`</span>${<span class="pl-smi">url</span>}?${<span class="pl-smi">params</span>}<span class="pl-pds">`</span>, 'callback')
      .map(response => response[1])
      .map(results => results.map(result => result[0]));
  }
```

accessible navigation with arrows

To achieve this feature, the code listens to the &#8216;keydown' key strokes allowing only arrow keys to pass. The "subscribe" method starts the execution of this stream and applies logics for marking the relevant suggestion as active.

```typescript
navigateWithArrows() {
    return Observable.fromEvent(this.element.nativeElement, 'keydown')
      .filter((e: any) => e.keyCode === Key.ArrowDown || e.keyCode === Key.ArrowUp)
      .map((e: any) => e.keyCode)
      .subscribe((keyCode: number) => {
        let step = keyCode === Key.ArrowDown ? 1 : -1;
        const topLimit = 9;
        const bottomLimit = 0;
        this.suggestionIndex += step;
        if (this.suggestionIndex === topLimit + 1) {
          this.suggestionIndex = bottomLimit;
        }
        if (this.suggestionIndex === bottomLimit - 1) {
          this.suggestionIndex = topLimit;
        }
        this.showSuggestions = true;
        // this.renderTemplate();
        this.cdr.markForCheck();
      });
  }
```

### 5 - allow custom template for suggestion

To achieve this challenge, I had to use more angular template engine feature - which explains how some of the features of this engine work behind the scenes.

First, I added a new Input which gets a template reference:

````typescript


Then I added a template inside the button element to allow rendering this template ref when present. In order to render a template reference, the "**ngTemplateOutlet**" directive is used with the template tag. In order to add a context for the external template, so the result value can be referenced, Angular supplies the "**ngTemplateOutletContext**" directive. This directive should receive a literal object with the special "**$implicit**" property. This property is used as the contect for the contents of the ng-template tag (the one in this button) - then, the "result" and "index" variables can be used as expressions within the template that is passed through from outside.

```typescript
<button type="button" class="list-group-item"
      *ngFor="let result of results; let i = index;"
      [class.active]="markIsActive(i, result)"
      (click)="handleSelectSuggestion(result)">
      <span *ngIf="!typeaheadItemTpl"><i class="las la-search"></i> {{ result }}</span>
      <ng-template
        [ngTemplateOutlet]="typeaheadItemTpl"
        [ngTemplateOutletContext]="{ $implicit: {result: result, index: i} }"
      ></ng-template>
</button>
````

A good example for defining a template and passing it as a reference is described in this snippet:

```typescript
<ng-template #itemTpl let-result>
    <strong>custom result: {{ result.result }}</strong>
</ng-template>
```

### 6 - "@HostListener" cancel suggestions box with Escape key

For achieving this feature, I chose to use the "@HostListener()" decorator - a simple function for filtering the Escape key (not rxjs for this one, though this has changed in the latest [ngx-typeahead](https://github.com/orizens/ngx-typeahead/blob/master/src/modules/ngx-typeahead.component.ts#L148)). From this snippet we can learn that the event object can be passed as an argument to any function as well as other members or properties of this component's context (i.e, &#8216;results' can be sent as a second argument).

```typescript
@HostListener('keydown', ['$event'])
  handleEsc(event: KeyboardEvent) {
    if (event.keyCode === Key.Escape) {
      this.hideSuggestions();
      event.preventDefault();
    }
  }
```

### 7 - cancel suggestions when clicking outside

The suggestions box is similar to a dropdown. To allow this feature, I took the approach of having a transparent background - "**typeahead-backdrop**" div below the box, combined with a simple click event which will hide (cancel) the suggestions box - a reuse to this function. This is simply done with adding a div element to the template along with the relevant click event:

```typescript
@Component({
  selector: '[typeahead]',
  template: `
....
  <section class="list-group results" *ngIf="showSuggestions">
    <div class="typeahead-backdrop" (click)="hideSuggestions()"></div>
....
`,
  styles: [`
  .typeahead-backdrop {
    position: fixed;
    bottom: 0;
    top: 0;
    left: 0;
    right: 0;
  }
  `]
});
```

## All Lessons Learned From Typeahead Component

You can see the end result live on [Echoes Player App](http://echoesplayer.com) and in this screenshot:

<img class="alignnone wp-image-1156 size-large" src=".../../img/uploads/2017/01/Screen-Shot-2017-01-01-at-4.23.24-PM-1024x754.png" width="697" height="513" srcset=".../../img/uploads/2017/01/Screen-Shot-2017-01-01-at-4.23.24-PM-1024x754.png 1024w, .../../img/uploads/2017/01/Screen-Shot-2017-01-01-at-4.23.24-PM-300x221.png 300w, .../../img/uploads/2017/01/Screen-Shot-2017-01-01-at-4.23.24-PM-768x566.png 768w" sizes="(max-width: 697px) 100vw, 697px" />

To summarize the great benefits came out form this experience, we learned these:

1. use **changeDetectionRef** to force a re render inside an "OnPush" defined component
2. Angular's template engine can be reused to achieve greater power in creating complex components
   1. reuse templates with **ngTemplateOutlet **directive
   2. apply different context to template with **ngTemplateOutletContext** directive
3. **@HostListener()** can pass more arguments other than the event object
4. **RxJS** can reduce the amount of code dramatically and make it maintainable as well

There are few optimizations that I can make to this code and other ways to achieve it. However, this is a great way to experiment with other concepts, open your (or mine) mind and dig more into the source, understanding how it runs and how features might serve us in achieving various tasks and components features.

The full source code is available at Angular (ngx) Typeahead Component [github](https://github.com/orizens/echoes-ng2/blob/07c009b9784fd727042b880dffb99f293c4bf22f/src/app/youtube-videos/typeahead.directive.ts).

For more articles about Angular, please check out the [Angular Article Series Page](http://orizens.com/wp/angular-2-article-series/).

[Contact to get a special offer for Angular consulting](https://docs.google.com/forms/d/e/1FAIpQLSc341_p9YiUeMHipBMDujCv0bHJfQD1NKWFvoYkcJiFeMm4Ig/viewform)
