---
id: 1229
title: 'Guidelines For developing with Angular, ngrx/store, ngrx/effects & AOT'
date: 2017-03-19T13:57:23+00:00
author: Oren Farhi 
templateKey: blog-post
layout: post
guid: http://orizens.com/wp/?p=1229
permalink: /topics/guidelines-for-developing-with-angular-ngrxstore-ngrxeffects-aot/
post_grid_post_settings:
  - 'a:10:{s:9:"post_skin";s:4:"flat";s:19:"custom_thumb_source";s:93:"./img/plugins/post-grid/assets/frontend/css/images/placeholder.png";s:17:"font_awesome_icon";s:0:"";s:23:"font_awesome_icon_color";s:7:"#737272";s:22:"font_awesome_icon_size";s:4:"50px";s:17:"custom_youtube_id";s:0:"";s:15:"custom_vimeo_id";s:0:"";s:21:"custom_dailymotion_id";s:0:"";s:14:"custom_mp3_url";s:0:"";s:20:"custom_soundcloud_id";s:0:"";}'
dsq_thread_id:
  - "5645812559"
image: ../img/uploads/2017/03/ngrxaot.jpg
categories:
  - Angular
  - AOT
  - ngrx
  - ngrx-effects
tags:
  - angular2
  - aot
  - ngrx
---
With [angular-cli tool](https://github.com/angular/angular-cli) entering RC-1, I decided to start migrating my [open source project](http://github.com/orizens/echoes-ng2) "[Echoes Player](http://github.orizens.io/echoes-ng2)" from [angular class boilerplate](https://github.com/AngularClass/angular2-webpack-starter/). Some of the code in "Echoes Player" wasn't AOT compatible. As a result, compilation logged errors to the console. In this post I'm sharing guidelines for making your [ngrx](http://github.com/ngrx) related code compatible with AOT.

<!--more-->

## Why I'm Using Angular-cli

The AngularClass boilerplate is a great all in one source for starting a project with Angular. It includes many features and abilities that makes development with Typescript and Angular very comfortable and easy to use.

**Angular-cli** is a command line tool for starting a new Angular app - its creates a new local repository while providing an interface for adding components, directives, services and all other Angular entities through command line commands. Instead of cloning a repository from github, the cli tool provides a one liner method for starting a project.

With this tool growing popularity, I decided to experiment with it and understand how to work with it, so I can better understand how teams may benefit form using it as the tool of choice for starting and maintaining an Angular project.

## AOT Refresher

**AOT** stands for **A**head **O**f **T**ime compilation. The AOT compiler, creates a statically ready code to run in the browser. This means that when the application runs in the browser, the compilation phase is not needed. In contrary, compiling without AOT is JIT - Just In Time - where code is compiled at runtime, within the browser.

There are few benefits for compiling with AOT:

  1. Less code in the final production bundles
  2. Faster rendering - as the code is ready to use
  3. template's errors are catch in compile time
  4. better security - html injection is prevented since templates are compiled to code.

### Compiling With AOT

Compiling with AOT is triggered via a terminal/cmd command. The "**@angular/compiler-cli**" and the "**@angular/platform-server**" packages are required. Since i'm using the "angular-cli" tool in my project, these are already included.

To compile, this command should run in the terminal:

```typescript


To compile for production and get the benefits of minifying and others, you should run:

```typescript


Please note that the flag "-prod" includes compiles with AOT (thanks for [the update](https://github.com/angular/angular-cli/blob/master/CHANGELOG.md#breaking-changes-3) [@shiny](https://disqus.com/by/disqus_cCRtlEGXCj/))

Now, lets overview the **guidelines** that we should follow when working with **ngrx/store** and **ngrx/effects**, which will allow AOT compilation to compile without any errors.

## AOT Guidelines With ngrx

In "Echoes Player", I chose to sync the store's state to the localstorage. In order to achieve that, I installed? the "ngrx-store-localstorage" npm package, which exports the "**localStorageSync()**" function. This function is supposed to be used as a middleware reducer which saves the current store's state to the localstorage with any dispatched action.

In order to combine reducers, the "**compose**()" function from the "@ngrx/core/compose" should be used along with the "**combineReducers**" from "@ngrx/store". In the end, the compose return value should be stored in a variable:

```typescript
const reducers = {
  player,
  nowPlaylist,
  user,
  search,
  appLayout,
};
const appReducer = compose(localStorageSync(Object.keys(reducers), true), combineReducers)(reducers);
```

### Guideline #1: Using "compose" in ngrx/store

Normally, the "**appReducer**" which holds a reference the new composed reducer, should be used as the argument for "StoreModule.provideStore(productionReducer)" to bootstrap the store. However, that approach is not compatible with **AOT**. In order to use "**compose**" in a way that is compatible with AOT, the "appReducer" is required to be wrapped with a function which will be sent as an argument to the "**provideStore**()". This is required for the AOT compiler to statically analyze the code and compile and produce the AOT ready code.

```typescript
const actions = []; // array of app's action classes
const reducers = {
  player,
  nowPlaylist,
  user,
  search,
  appLayout,
};
const appReducer = compose(localStorageSync(Object.keys(reducers), true), combineReducers)(reducers);
// This is required for AOT
export function reducer(state: any, action: any) {
  return appReducer(state, action);
}
@NgModule({
  imports: [
    StoreModule.provideStore(reducer)
  ],
  declarations: [],
  exports: [],
  providers: [ ...actions ]
})
```

### Guideline #2: Using Function declarations for Reducers

Reducers are meant to be pure functions. In previous versions of blog posts and other sources, reducer functions were demonstrated as anonymous function assignments to variables, sometimes using function arrows as well:

```typescript


As a rule of thumb for AOT in general (and not just for ngrx), exported arrow functions cannot be used. The AOT compatible way for defining reducer functions is with an **exported named function** declaration.

```typescript


### Guideline #3: AOT compatible ngrx/effects

I wrote about [using ngrx/effects](http://orizens.com/wp/topics/angular-2-ngrxstore-ngrxeffects-intro-to-functional-approach-for-a-chain-of-actions/) as a [layer for async logics](http://orizens.com/wp/topics/angular-2-from-services-to-reactive-effects-with-ngrxeffects/) and more complex logic. Adding an Effect class to Angular is run separately for each effect using "**EffectsModule.run()**" which creates a provider for each effect . Since in "Echoes Player" there are few effects classes, I chose to use a dynamic creation using a simple functional "map":

```typescript
@NgModule({
  imports: [
    CoreStoreModule,
    effects.map(effect => EffectsModule.run(effect))
  ]
})
export class CoreModule {}
```

Since both arrow functions and dynamic creation within a decorator are not compatible with AOT, I found (with the help of the community in the github repo of effects) that currently the solution is to run each effect separately while creating an array of effect providers, then, spread this array to the "imports" array:

```typescript
const AppEffectModules = [
  EffectsModule.run(AppEffects[0]),
  EffectsModule.run(AppEffects[1]),
  EffectsModule.run(AppEffects[2]),
  EffectsModule.run(AppEffects[3])
];
@NgModule({
  imports: [
    CoreStoreModule,
    ...AppEffectModules
  ]
})
export class CoreModule {}
```

## Summary

I has a very positive experience from the migration process of moving to angular-cli. This turned out to be an opportunity to learn new skills:

  1. Rethinking and restructuring the application's directories
  2. Learning  how to work with angular-cli features
  3. Learning [several techniques from the community](https://github.com/angular/angular-cli/tree/master/docs/documentation/stories) on migrating to angular-cli
  4. Using the build in scss compilation
  5. Diving into [AOT principles](https://angular.io/docs/ts/latest/cookbook/aot-compiler.html)

As of the time of writing this post, I haven't switched to using angular-cli completely yet. I have some thoughts in mind for finding a simpler way of moving between repositories/tools.

You can [view the history of commits](https://github.com/orizens/echoes-ng2/commits/ng-cli) of the migration process to angular-cli.

If you're looking for **Angular Consulting** / **Front End Consulting**, please consider to approach via the promotion packages below (no strings attached):

<div class="row orizens-consulting-packages">
  <div class="col-md-4">
    <a href="https://goo.gl/RJgihR" target="_blank"><img class="alignnone size-medium consulting-package" src=".../../img/uploads/2017/12/orizens.com-banners-premium-angular-consutling.png" alt="angular consulting development" /></a>
  </div>
  
  <div class="col-md-4">
    <a href="https://goo.gl/7zg4y9" target="_blank"><img class="alignnone size-medium consulting-package" src=".../../img/uploads/2017/12/orizens.com-banners-reinvented-code-with-ng-ngrx.png" alt="angular ngrx consulting" /></a>
  </div>
  
  <div class="col-md-4">
    <a href="https://goo.gl/6iAYIi" target="_blank"><img class="alignnone size-medium consulting-package" src=".../../img/uploads/2017/12/orizens.com-reactive-ngrx.png" alt="reactive programming angular ngrx cosulting packages" /></a>
  </div>
</div>