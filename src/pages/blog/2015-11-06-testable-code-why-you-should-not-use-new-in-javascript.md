---
id: 822
title: 'Testable Code: Why You Should Not Use &#8220;new" In Javascript'
date: 2015-11-06T14:40:44+00:00
author: Oren Farhi 
templateKey: blog-post
layout: post
guid: http://orizens.com/wp/?p=822
permalink: /topics/testable-code-why-you-should-not-use-new-in-javascript/
dsq_thread_id:
  - "4295255301"
image: ../../img/uploads/2015/11/injection.jpg
categories:
  - AngularJS
  - architecture
  - backbone
  - Dependancy Injection
  - es2015
  - functional code
  - javascript
tags:
  - angular.js
  - architecture
  - functional
  - javascript
  - patterns
---
Since I started writing tests for my javascript projects, I feel it is much more robust and uncovers problems both in design and implementation in the right time. In this post, i'de like to share a use case i discovered few days ago, one which demonstrates why the &#8220;new" keyword shouldn't be used when creating objects and how dependency injection assists in this matter - that, in order to write testable and robust code.

<!--more-->

## The Problem of &#8220;new" in javascript

My [open source project](http://github.com/orizens/echoes), <a href="http://echotu.be" target="_blank">Echoes Player</a>, is built of several modules. The current version uses angular as the framework for the app (last version was based on <a href="http://backbonejs.org" target="_blank">Backbone.js</a>). One of the main modules is the youtube-player module. It has several purposes:

  1. playing a single video or a playlist
  2. exposing the controls for youtube player (amongst, resizing the player)
  3. loading and instantiating the youtube object by using <a href="https://developers.google.com/youtube/iframe_api_reference?hl=en" target="_blank">Youtube Player Iframe API</a>

The actual UI player is located in the bottom left corner:

<img class="alignleft size-large wp-image-824" src=".../../img/uploads/2015/11/Screen-Shot-2015-11-06-at-4.37.11-PM-1024x545.png" alt="Screen Shot 2015-11-06 at 4.37.11 PM" width="1024" height="545" srcset=".../../img/uploads/2015/11/Screen-Shot-2015-11-06-at-4.37.11-PM-1024x545.png 1024w, .../../img/uploads/2015/11/Screen-Shot-2015-11-06-at-4.37.11-PM-300x160.png 300w, .../../img/uploads/2015/11/Screen-Shot-2015-11-06-at-4.37.11-PM-657x350.png 657w, .../../img/uploads/2015/11/Screen-Shot-2015-11-06-at-4.37.11-PM.png 1416w" sizes="(max-width: 1024px) 100vw, 1024px" />

There are few steps in order to use the <a href="https://developers.google.com/youtube/iframe_api_reference?hl=en" target="_blank">youtube player iframe api</a>:

  1. embedding the script of the player.
  2. listen to the api ready event
  3. creating a new youtube player object with the &#8220;**YT**" global object

My first implementation was quite naive at the time. I created a directive that served at the placeholder for the youtube iframe. This directive was responsible for listening to the api ready event, and then create the new youtube player object. So, the code was something like this:

<pre class="lang:js decode:true">function youtubePlayer ($rootScope, $window) {
    var directive = {
        link: link,
        controller: controller,
        controllerAs: 'vm',
        restrict: 'A',
        // replace: true,
        scope: {
        	videoId: '=',
        	height: '=',
        	width: '=',
            index: '=',
            seek: '=',
            autoNext: '@',
            onVideoStart: '&'
        }
    };
    var player;

    return directive;

    /* @ngInject */
	function controller ($scope, $attrs, youtubePlayerApi, YoutubePlayerSettings) {
        
        // ..some ode before

        function createPlayer () {
            // var playerVars = angular.copy(scope.playerVars);
            // playerVars.start = playerVars.start || scope.urlStartTime;
            player = new YT.Player($attrs.id, {
                height: $scope.height,
                width: $scope.width,
                videoId: $scope.videoId,
                // playerVars: playerVars,
                events: {
                    onReady: onPlayerReady,
                    onStateChange: onPlayerStateChange
                }
            });
            YoutubePlayerSettings.setYTPlayer(player);
            player.id = $attrs.id;
            return player;
        }
        //... more code
    }
}</pre>

There are 4 problems here:

  1. the directive's controller is creating the new youtube player object (use of logic) - this should be handled in a service
  2. the new youtube player object is saved **outside** of the controller's function
  3. The new youtube player object is saved in the **YoutubePlayerSettings** service - That's hard to test
  4. This code is not testable

## Refactoring The Code To Testable Code

To solve some of the problems, I refactored the code.

I moved the &#8220;**createPlayer**" function to **YoutubePlayerSettings** - This helped me in reducing the code logic that was in the controller.

However, I was still using the &#8220;new YT.player" constructor, and as soon as i ran the tests for the **YoutubePlayerSettings** service, I realised that I have no control over this &#8220;foreign" object (YT). There's no need to create a new youtube player object in tests - that should and could be mocked easily (i'm using **<a href="http://jasmine.github.io/2.3/introduction.html" target="_blank">jasmine</a>** for tests).

So, I took the bdd approach. In order to create a mocked youtube player, one which I can inject and test with it, I created a new factory object - **YoutubePlayerCreator** - which abstracts the **YT.player** constructor object and exposes a clear defined API for creating a new youtube player object::

<pre class="lang:default decode:true ">angular
    .module('youtube.player')
    .factory('YoutubePlayerCreator', YoutubePlayerCreator);

/* @ngInject */
function YoutubePlayerCreator() {
    var service = {
        createPlayer: createPlayer
    };
    return service;

    ////////////////

    function createPlayer (elementId, height, width, videoId, callback) {
        return new YT.Player(elementId, {
            height: height,
            width: width,
            videoId: videoId,
            // playerVars: playerVars,
            events: {
                onReady: angular.noop,
                onStateChange: callback
            }
        });
    }
}</pre>

Afterwards, I injected this factory to the **YoutubePlayerSettings** service, and I use it in order to create a new object:

<pre class="lang:default decode:true">angular
    .module('youtube.player')
    .factory('YoutubePlayerSettings', YoutubePlayerSettings);

/* @ngInject */
function YoutubePlayerSettings(localStorageService, YoutubePlayerCreator) {

    // more code....
    
    function createPlayer (elementId, height, width, videoId, callback) {
        // I'm using a factory to create a new player object
        ytplayer = YoutubePlayerCreator.createPlayer(elementId, height, width, videoId, onPlayerStateChange);
        return ytplayer;

        function onPlayerStateChange (event) {
            var state = event.data;
            
            // play the next song if its not the end of the playlist
            // should add a "repeat" feature
            if (angular.isDefined(autoNext) && state === YT.PlayerState.ENDED) {
                service.playNextTrack({ stopOnLast: true });
            }

            if (state === YT.PlayerState.PAUSED) {
                service.playerState = YT.PlayerState.PAUSED;
            }
            if (state === YT.PlayerState.PLAYING) {
                service.playerState = YT.PlayerState.PLAYING;
            }
            callback(state);
        }
    }
// more code....
}</pre>

The tests that follow along with this approach, allow to inject a mocked **YoutubePlayerCreator** factory, mock its functions and assert any issue that jasmine (in my current setup) allows to assert and track as well.

So, this is where **Dependancy Injection** manifests at is best (and not just in angular). Now, I can mock the case of creating a youtube player as if i actually injected the real script. Notice how I mock the various functions with **jasmine.createSpyObj**:

<pre class="lang:js mark:15,26 decode:true">describe('Youtube Player Module', function() {
	var YoutubePlayerSettings, YoutubeSearch, YoutubePlayerCreator;
	var videosResponseMock = {};

	beforeEach(function(){
		module('youtube.player');
		inject(function (localStorageService) {
			spyOn(localStorageService, 'get').and.returnValue([]);
		});
		inject(function($controller, $injector){
			var ytPlayerSpy = jasmine.createSpyObj('ytPlayerSpy', ['loadVideoById', 'playVideo', 'pauseVideo']);
			YoutubePlayerSettings = $injector.get('YoutubePlayerSettings');
			YoutubePlayerCreator = $injector.get('YoutubePlayerCreator');

			spyOn(YoutubePlayerCreator, 'createPlayer').and.returnValue(ytPlayerSpy);
			videosResponseMock = window.mocks['youtube.videos.mock'];
		});
	});

	describe('Youtube Player Settings Service', function() {

		// some other tests before..
		
		it('should update the nowPlaying object when playing a video', function() {
			var video = videosResponseMock.items[3];
			YoutubePlayerSettings.createPlayer(); // returns the ytPlayerSpy
			YoutubePlayerSettings.playVideo(video);
			expect(YoutubePlayerSettings.nowPlaying.mediaId).toBe(video.id);
		});
	});
});</pre>

## Summary

To summarise this adventure, this is a single case among many, where you should use a factory to create new objects rather than just creating new objects with the &#8220;new" keyword. Being true to the nature of writing tests for each scenario in the code, should result in creating factory objects. Perhaps there are some cases where you can still use the &#8220;**new**" keyword, i.e,  internal framework level or rather an environment where you can &#8220;**import**" objects and mock them easily.

I can't think of a thumb rule, however I can point to concentrate in writing the story of the objects in the specs (using **bdd** approach along writing the code). Remember, you're always testing the outcome - if not in code, then manually - and in this case - think again, make that **extra mile** to write a test. I'm positive this extra **mile** will save you 100 miles ahead.