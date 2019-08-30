---
id: 1295
title: 'Upgrading to Angular 5: Using HttpClient, JSONP with parameters'
date: 2017-12-27T12:30:41+00:00
author: Oren Farhi 
templateKey: blog-post
layout: post
guid: http://orizens.com/wp/?p=1295
permalink: /topics/upgrading-to-angular-5-using-httpclient-jsonp-with-parameters/
post_grid_post_settings:
  - 'a:10:{s:9:"post_skin";s:4:"flat";s:19:"custom_thumb_source";s:93:"./img/plugins/post-grid/assets/frontend/css/images/placeholder.png";s:17:"font_awesome_icon";s:0:"";s:23:"font_awesome_icon_color";s:7:"#737272";s:22:"font_awesome_icon_size";s:4:"50px";s:17:"custom_youtube_id";s:0:"";s:15:"custom_vimeo_id";s:0:"";s:21:"custom_dailymotion_id";s:0:"";s:14:"custom_mp3_url";s:0:"";s:20:"custom_soundcloud_id";s:0:"";}'
dsq_thread_id:
  - "6375090931"
image: ../img/uploads/2017/12/typeahead.jpg
categories:
  - Angular
tags:
  - angular2
---
[Angular](https://blog.angular.io/version-5-0-0-of-angular-now-available-37e414935ced) released **version 5** - deprecating the old http module "**@angular/http**" with the replacement of "**@angular/common/http**". Along with the http module, the jsonp module was also deprecated in favor of a better replacement which is included with the new HttpClient. The usage of jsonp is a little bit different with this version. My open source project, [ngx-typeahead](https://www.npmjs.com/package/ngx-typeahead) - is an auto suggest directive for Angular-  allowing to query a remote source either with jsonp or http (and with version 0.1.0 - static list as well). In this article, i'm sharing the steps I took for upgrading the package to use HttpClient and performing a jsonp request with parameters.<!--more-->

## Step 1: Updating The Module Imports

First, lets import the relevant modules. Within src/modules/ngx-typeahead.module.ts, I replaced the code so it will import the new modules. Similar to before, there are 2 modules for using http and jsonp:

```typescript
// Before: with Angular 4
import { HttpModule, JsonpModule } from '@angular/http';
...
@NgModule({
  imports: [CommonModule, HttpModule, JsonpModule],
})

// After: with Angular 5
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
...
@NgModule({
  imports: [CommonModule, HttpClientModule, HttpClientJsonpModule],
})

```

I also update the src/modules/ngx-typeahead.component.ts to import HttpClient only. Notice that the alternatives to "RequestOptionsArgs" and "URLSearchParams" have been updated too and are used inside a utility function (respectively, "HttpParams" and "HttpParamsOptions":

```typescript
// Before: with Angular 4
import {
  RequestOptionsArgs,
  Response,
  Jsonp,
  URLSearchParams,
  Http
} from '@angular/http';

// After: with Angular 5
import { HttpClient } from '@angular/common/http';

```

## Step 2: Updating The Http Service Injection

In contrary to the previous version, with Angular 5, "jsonp" is used as a method of the http service. All I had to do is change the injection of the http service to use "HttpClient" as well as remove the "Jsonp" injection:

```typescript
// Before: with Angular 4
constructor(
      private element: ElementRef,
      private viewContainer: ViewContainerRef,
      private jsonp: Jsonp,
      private http: Http,
      private cdr: ChangeDetectorRef
    ) { }

// After: with Angular 5
constructor(
    private element: ElementRef,
    private viewContainer: ViewContainerRef,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) { }
```

## Step 3: Updating the Jsonp call with parameters

In the old version, i used the jsonp service and had to create an options object which includes the parameters to attach for the request. Eventually, I passed 2 arguments to the jsonp method that was used ("get" by default):

```typescript


With the new HttpClient it's a little bit different. "jsonp" is a method that performs the jsonp request. It takes the first argument as the url and the callback string name as the second argument.

```typescript


### Where jsonp request's parameters should be placed with Angular 5?

I had a small challenge with this one: the params in this case should be concatenated as string parameters to the url argument. Since i'm using the new "HttpParams" to construct a params object, I can use the "toString()" to get all parameters as url search parameters and add it to the url:

```typescript
requestJsonp(url, options, callback = 'callback') {
    // options.params is an HttpParams object
    const params = options.params.toString();
    return this.http.jsonp(`${url}?${params}`, callback)
      .map((response: Response) => response[1])
      .map((results: any[]) => results.map((result: string) => result[0]));
  }
```

You can see and experiment with ngx-typeahead in this [plunkr demo](http://plnkr.co/edit/gV6kMSRlogjBKnh3JHU3?p=preview) and in production on my open source alternative player to YouTube: [Echoes Player](http://echoesplayer.com)

[<img class="alignnone wp-image-1299" src=".../../img/uploads/2017/12/Screen-Shot-2017-12-27-at-12.23.12-PM.png" alt="" width="408" height="339" srcset=".../../img/uploads/2017/12/Screen-Shot-2017-12-27-at-12.23.12-PM.png 964w, .../../img/uploads/2017/12/Screen-Shot-2017-12-27-at-12.23.12-PM-300x250.png 300w, .../../img/uploads/2017/12/Screen-Shot-2017-12-27-at-12.23.12-PM-768x639.png 768w" sizes="(max-width: 408px) 100vw, 408px" />](http://echoesplayer.com)