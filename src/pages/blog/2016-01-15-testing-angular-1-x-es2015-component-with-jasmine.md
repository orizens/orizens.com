---
id: 912
title: Testing Angular 1.x ES2015 Component with Jasmine
date: 2016-01-15T10:43:33+00:00
author: Oren Farhi 
templateKey: blog-post
layout: post
guid: http://orizens.com/wp/?p=912
permalink: /topics/testing-angular-1-x-es2015-component-with-jasmine/
dsq_thread_id:
  - "4493235687"
image: ../../img/uploads/2016/01/jstesting.jpg
categories:
  - AngularJS
  - browserify
  - es2015
  - javascript
  - testing
tags:
  - angular.js
  - browserify
  - es2015
  - tests
---
In the previous article, I wrote about how to <a href="http://orizens.com/wp/topics/setup-karma-for-testing-angular-1-x-components-with-es2015-browserify/" target="_blank">setup karma for testing AngularJS.x written with ES2015</a>. Since then, I stumbled upon few issues while trying to test an AngularJS.x component written in ES2015 according to the <a href="http://github.com/orizens/angular-es2015-styleguide" target="_blank">angular ES2015 style guide</a>. In this post, I'm sharing how to test AngularJS.x component written in ES2015.<!--more-->

## Karma Setup For Testing Angular 1.x ES2015

_tldr; the test code can be found <a href="https://github.com/orizens/echoes/blob/9e4cd2acfa5b389a9d9e193eab9221725376408a/src/components/youtube-videos/youtube-videos.component.spec.js" target="_blank">here</a>._

Apart from setting up karma as I mentioned in the previous article, I found that it is necessary to define the relevant transforms that the browserify task is using (and rather not &#8220;plugins" as i've written before) in karma's configuration.

Since I'm using several transforms, in particularly - the &#8220;stringify" transform to load html files as strings, the karma configuration file now includes:

```typescript
{
//... other configurations
    preprocessors: {
        '../tests/mocks/**/*mock.json': ['json_fixtures'],
        '**/*spec.js': ['browserify']
    },
    browserify: {
      debug: true,
      transform: [ 'babelify', 'stringify' ]
    },
    babelPreprocessor: {
      options: {
        presets: ['es2015'],
        sourceMap: 'inline'
      }
    }
}
```

## Writing Tests For Angular 1.x Controller written in ES2015

As mentioned above, the component i'm testing is written in <a href="http://orizens.com/wp/topics/5-steps-to-prepare-your-angular-1-code-to-angular-2/" target="_blank">ES2015 as part of a preparation to Angular (+2)</a>. We're going to explore a test case for the YoutubeVideos Component of the <a href="http://echotu.be" target="_blank">Echoes Player</a> <a href="http://github.com/orizens/echoes" target="_blank">Open Source App</a> that I developed, recently converting the code to use ES2015. The controller is defined as part of the component's properties:

```typescript
import template from './youtube-videos.tpl.html';

// Usage:
//  &lt;youtube-videos&gt;&lt;/youtube-videos&gt;
export let YoutubeVideosComponent = {
	template,
	selector: 'youtubeVideos',
	controllerAs: 'youtubeVideos',
	scope: {},
	bindToController: true,
	// replace: true,
	restrict: 'E',
	controller: class YoutubeVideosCtrl {
		/* @ngInject */
		constructor (YoutubePlayerSettings, YoutubeSearch, YoutubeVideoInfo, PlaylistEditorSettings) {
			Object.assign(this, { YoutubePlayerSettings, YoutubeVideoInfo, PlaylistEditorSettings });

			this.queueVideo = YoutubePlayerSettings.queueVideo;
			this.getFeedType = YoutubeSearch.getFeedType;
			this.videos = YoutubeSearch.items;
			this.searchMore = YoutubeSearch.searchMore;

			YoutubeSearch.resetPageToken();
			if (!this.videos.length) {
				YoutubeSearch.search();
			}
		}

		playVideo (video) {
			this.YoutubePlayerSettings.queueVideo(video);
			this.YoutubePlayerSettings.playVideoId(video);
		}

		playPlaylist (playlist) {
			return this.YoutubeVideoInfo.getPlaylist(playlist.id).then(this.YoutubePlayerSettings.playPlaylist);
		}

		addVideo (video) {
			this.PlaylistEditorSettings.add(video);
			this.PlaylistEditorSettings.show();
		}
	}
};

```

The **YoutubeVideos** component is a **smart component**, responsible for displaying a &#8220;wall" of media cards, originated in a youtube search api request.

First, to allow ES2015 new variables declarations, I need to define <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode" target="_blank">&#8216;use strict'</a>. Afterwards, the code imports the relevant component and starts a describe block where I define variables that will be used during the tests:

```typescript
'use strict';
import { YoutubeVideosComponent } from './youtube-videos.component';

describe('Youtube Videos', () =&gt; {
	let scope, YoutubeSearch, ctrl, YoutubePlayerSettings, controller;
	let YoutubeVideoInfo = {};
	let mockVideoItem = {};
	let mockPlaylistItem = {};
```

Next, inside the &#8220;**describe**" block, comes two definitions of &#8220;**beforeEach**" blocks. The first, defines a mocked module for testing the &#8220;**youtube-videos**" module.

The 2nd, is a setup that will run for **every** test (&#8220;it()") inside this describe block. Since it's a smart component, it uses core services of the app that are injected to the controller of the component. These should be mocked since we really don't want to invoke these services and, i.e,  calling youtube api for every test.

For mocking the services, I'm using jasmine's **<a href="http://jasmine.github.io/2.3/introduction.html#section-Spies:_<code>createSpy</code>" target="_blank">&#8220;createSpyObj"</a>**, which create a mocked object with the set of &#8220;methods" that is passed in the 2nd argument as an array. These methods are defined as trackable functions which I can test and &#8220;spy" later.

After setting up the spies for the injected services, I'm creating a new instance of the component's controller. The **actual function** is passed as an argument - that is part of the api of <a href="https://docs.angularjs.org/api/ngMock/service/$controller" target="_blank">&#8220;$controller"</a> mock service, as well as the mocked services are passed for this controller.

During the actual test, the **&#8220;constructor"** function of &#8220;**YoutubeVideosCtrl**" is injected with the spies that are passed rather than the real services.

```typescript
beforeEach(angular.mock.module('youtube-videos'));

	beforeEach(inject(($injector, $controller, $q) =&gt; {
		controller = $controller;
		YoutubeSearch = jasmine.createSpyObj('YoutubeSearch', [
			'search', 'resetPageToken', 'getFeedType', 'searchMore'
		]);
		YoutubePlayerSettings = jasmine.createSpyObj('YoutubePlayerSettings',
			['playVideoId', 'queueVideo', 'playPlaylist']);
		// spies
		YoutubeSearch.items = [];
		YoutubeVideoInfo.getPlaylist = () =&gt; {};
		spyOn(YoutubeVideoInfo, 'getPlaylist').and.callFake( () =&gt; {
			let defer = $q.defer();
			defer.resolve();
			return defer.promise;
		});
		scope = $injector.get('$rootScope').$new();
		ctrl = controller(YoutubeVideosComponent.controller, {
			$scope: scope,
			YoutubeSearch: YoutubeSearch,
			YoutubePlayerSettings: YoutubePlayerSettings,
			YoutubeVideoInfo: YoutubeVideoInfo
		});
		scope.$digest();
		mockVideoItem = window.mocks['video.item.mock'];
		mockPlaylistItem = window.mocks['youtube.videos.mock'];
	}));
```

That's the code needed for the &#8220;**beforeEach**" phase. Now, we can start writing the actual tests for the controller.

Notice how I refer to a &#8220;**search**" function that i'm expecting to exist on the YoutubeSearch **spy**. As part of this component behaviour, I expect the &#8220;search" method to be invoked only once if there are no items (videos) for the component to render.

```typescript
it('search youtube once when it loads if there are no items to render', () =&gt; {
	expect(YoutubeSearch.search).toHaveBeenCalled();
	expect(YoutubeSearch.search.calls.count()).toBe(1);
});
```

In order to test the opposite case, I took a different approach.

I copied an array of video items to &#8220;**YoutubeSearch.items"** property to mock a populated property, after a &#8220;**search**" response. Then, I create again a new instance of the YoutubeVideos controller, expecting the **&#8220;YoutubeSearch.search"** function not to be called. Eventually, the count of calls for the &#8220;**search**" function should be still 1.

```typescript
it('should not search when it loads if there are items to render', () =&gt; {
	angular.copy(mockPlaylistItem.items, YoutubeSearch.items);
	controller(YoutubeVideosComponent.controller, {
		$scope: scope,
		YoutubeSearch: YoutubeSearch,
		YoutubePlayerSettings: YoutubePlayerSettings,
		YoutubeVideoInfo: YoutubeVideoInfo
	});
	expect(YoutubeSearch.search.calls.count()).toBe(1);
});
```

For testing methods directly on the controller's instance, I can refer to the &#8220;**ctrl**" variable which hold a reference to it.

In the 2nd test described below, I'm testing the &#8220;**playPlaylist**" method which supposed to invoke a promise based service. The &#8220;**getPlaylist**" method has been mocked in the &#8220;beforeEach" block, and suppose to return a mocked promise. That, in order to test that the &#8220;**YoutubePlayerSettings**" is expected to be called once as a reaction to a resolved promise.

In order to &#8220;invoke" the promise chain, we need to instruct angular to **digest** the changes, an only then, we can expect to write assertions.

```typescript
it('should queue and play video', () =&gt; {
	ctrl.playVideo(mockVideoItem);
	expect(YoutubePlayerSettings.queueVideo).toHaveBeenCalled();
	expect(YoutubePlayerSettings.playVideoId).toHaveBeenCalled();
});

it('should play a playlist and queue the videos', () =&gt; {
	ctrl.playPlaylist(mockPlaylistItem);
	scope.$digest();
	expect(YoutubePlayerSettings.playPlaylist.calls.count()).toBe(1);
});
```

## Final Thoughts

Currently, tests run on Chrome and PhantomJs2 <del>these tests run on Chrome only - and not on PhantomJS2 as I wanted</del>. The final code in one piece can be found <a href="https://github.com/orizens/echoes/blob/9e4cd2acfa5b389a9d9e193eab9221725376408a/src/components/youtube-videos/youtube-videos.component.spec.js" target="_blank">here</a>.

As i've written before, I think testing is important. Using ES2015 to to test ES2015 code is essential, as well as promoting modularity and more concise code. Still, there are more fields to cover in this world of testing and I can't wait to explore all.

&nbsp;