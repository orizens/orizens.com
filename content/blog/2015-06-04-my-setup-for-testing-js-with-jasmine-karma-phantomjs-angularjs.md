---
id: 775
title: 'My Setup For Testing JS With Jasmine, Karma & Phantomjs And BrowserStack (angularjs)'
date: 2015-06-04T14:26:03+00:00
author: Oren Farhi 
templateKey: blog-post
layout: post
guid: http://orizens.com/wp/?p=775
permalink: /topics/my-setup-for-testing-js-with-jasmine-karma-phantomjs-angularjs/
dsq_thread_id:
  - "3820798109"
image: ../img/uploads/2015/06/testing.jpg
categories:
  - AngularJS
  - CI
  - gulp.js
  - testing
  - travis
tags:
  - ci
  - gulpjs
  - javascript
  - travis
---
When I start a new project with angular.js today, I like to have my usual setup of running unit tests. This setup allows me to easily write testing, write the code, running the tests and making sure the process automates what's needs to be done when any of the code or environment change. In this post i'm sharing the setup that I use for unit tests with angular.js app - as well as the mind behind it.<!--more-->

## Tools For Testing

Usually, I use these 3 main tools which combine the environment & testing tools.

### 1. Testing Framework - Jasmine.js

I started using [jasmine.js](http://jasmine.github.io) back in version 1, when I developed a backbone plugin for storage - [Backbone.Safe](https://github.com/orizens/Backbone.Safe). I actually developed the tests after writing the code. The main reason for doing that were few bugs that were discovered and issued in github. Only then, I realised that writing once a test can be a time saver for me and a more robust and sealed plugin for the community - resulting in a [suite of several tests](http://orizens.github.io/Backbone.Safe/test/).

These are tests for a player in Echoes Player app:

```typescript
describe('Youtube Player Settings Service', function() {
		it('queue videos to its playlist', function() {
			YoutubePlayerSettings.queueVideo(videosResponseMock.items[1]);
			expect(YoutubePlayerSettings.nowPlaylist.length).toBe(1);
		});

		it('should reset the seek to zero when a new video is played', function() {
			YoutubePlayerSettings.playVideoId(videosResponseMock.items[5]);
			expect(YoutubePlayerSettings.getSeek()).toBe(0);
		});

		it('should update the nowPlaying object when playing a video', function() {
			var video = videosResponseMock.items[3];
			YoutubePlayerSettings.playVideoId(video);
			expect(YoutubePlayerSettings.nowPlaying.mediaId).toBe(video.id);
		});

		it('should mark the next video when play next track', function() {
			YoutubePlayerSettings.playVideoId(videosResponseMock.items[1]);
			YoutubePlayerSettings.queueVideo(videosResponseMock.items[2]);
			YoutubePlayerSettings.playNextTrack();
			expect(YoutubePlayerSettings.nowPlaying.mediaId).toBe(videosResponseMock.items[2].id);
		});
})
```

&nbsp;

Getting into Jasmine.js was (and still is) quite easy. I like the one page documentation with examples which also runs the example code using jasmine at the end of the page. I learned a lot about unit testing and jasmine, from writing and defining tests for this plugin.

### 2. Tests Runner - Karma

I ran Backbone.Safe tests inside the browser, using jasmine's html page example. It included all the necessary javascript files, nice css styling and jasmine core itself.

However, with each change, I had to go back to the browser, refresh the page and wait for it to render. this is exhausting.

Then, I heard about [karma](http://karma-runner.github.io). karma automate few steps in this process:

  1. re-run the tests when the app's code has changed
  2. re-run the tests when the test's code has changed
  3. running the tests on several browsers - Chrome, Firefox, IE and headless browsers - like Phantom.js
  4. loading any testing framework of a choice (i can easily pick another testing framework other than jasmine)
  5. allowing to pre-process files before running the tests - i.e. precompiling html templates, pre-process js files (if you write in a compile-to js lib like es6, coffeescript etc&#8230;), load and process json files, output results in various display methods etc.
  6. easily config all of the above in one karma.conf.js file.
  7. running these in terminal

When I started converting my [open source project](http://github.com/orizens/echoes), [Echoes Player](http://echotu.be), to angular.js, I also integrated a cloud [CI service - Travis](http://travis-ci.org/orizens/echoes) (on which i [mentioned before](http://orizens.com/wp/topics/first-steps-in-setting-up-travis-ci-to-your-javascript-project/)) - for running tests after each commit.

#### Karma Plugins

Karma is an amazing tool. I allows external plugins to process files before running tests. Since Echoes Player relies on youtube data api, I've found it comfortable to have samples of json responses right inside the repository (in a "mocks" directory"). Apart from it being comfortable to work with it, keeping as files is also useful for using it in tests.

For loading json files and use it as fixtures, i found the "[karma-json-fixtures-preprocessor](https://www.npmjs.com/package/karma-json-fixtures-preprocessor)" plugin great for this usecase. Whenever I need to mock a response in my tests, I just refer to the global variable **"window.mocks[&#8216;name.of.file.without.ext.json']"** to get the json i need. This is the configuration:

```typescript
module.exports = function(config) {
	var client_dir = '';

	config.set({
		...
		files: [
			// loading all json files
			'../tests/mocks/**/*mock.json'
	    ],
	    ...
        preprocessors: {
	        // configure to preprocess json files
	        '../tests/mocks/**/*mock.json': ['json_fixtures']
	        
	    },
	    ...
	    jsonFixturesPreprocessor: {
	      // strip this from the file path \ fixture name
	      stripPrefix: '.+mocks/',
	      // strip this to the file path \ fixture name
	      // prependPrefix: 'mock/',
	      // change the global fixtures variable name
	      variableName: 'mocks'
	    },
	    plugins : [
	        // load the plugin
	        'karma-json-fixtures-preprocessor'
	    ]
	    
  });
};
```

I also use a plugin for loading html templates and some plugins to output the tests results to the console in a nice way.

### 3. Tests Environment - Browser or Headless Browser - Phantom.js

During development, I use the terminal for running tests (as well as for git & npm operations). In order to run the tests right in the terminal and mock the app to run in Chrome's V8 / Webkit (actually only webkit), I chose to use [Phantom.js](http://phantomjs.org).

Phantom.js is a headless webkit based browser. It can run javascript, css and html files just like Chrome or any other browser - however it does that in a background process, without displaying the actual html/css like in visual browser.

However, since Phantom.js is configured to run by karma, any other browser (with a proper launcher plugin) can be easily configured to run the tests. In fact, you can even run several browsers at once using the "**browsers**" property in the karma.config.js file.

Sometimes, for debug purposes, I configure karma to run the tests in a Chrome window. To toggle the browser option on/off easily, I just configured 2 scripts in the package.json file:

  1. **"npm test"** runs the tests in the terminal.
  2. **"npm run testd"** runs the tests in a Chrome window where I can debug the tests code.

I also defined several other commands in "scripts" object such as: "**e2e**" testing and "**release**" operations. It is very convenience to use with Travis (full [package.json for Echoes](https://github.com/orizens/echoes/blob/master/package.json)):

```typescript
{
"scripts": {
    "pioneer": "node_modules/pioneer/bin/pioneer",
    "e2e": "protractor protractor.conf.js",
    "e2ed": "protractor debug protractor.conf.js",
    "test": "gulp test && gulp test:e2e",
    "testd": "DEBUG=true gulp test",
    "start": "gulp serve",
    "release": "gulp dist && gulp dist:rev && git checkout -f gh-pages && gulp copy:dist",
    "build": "gulp build && gulp style"
  }
}
```

And finally, this is the output in [Travis](https://travis-ci.org/orizens/echoes/builds/65395561):

[<img class="alignleft size-large wp-image-787" src=".../../img/uploads/2015/06/Screen-Shot-2015-06-04-at-5.38.32-PM-1024x640.png" alt="Screen Shot 2015-06-04 at 5.38.32 PM" width="1024" height="640" srcset=".../../img/uploads/2015/06/Screen-Shot-2015-06-04-at-5.38.32-PM-1024x640.png 1024w, .../../img/uploads/2015/06/Screen-Shot-2015-06-04-at-5.38.32-PM-300x188.png 300w, .../../img/uploads/2015/06/Screen-Shot-2015-06-04-at-5.38.32-PM-560x350.png 560w" sizes="(max-width: 1024px) 100vw, 1024px" />](.../../img/uploads/2015/06/Screen-Shot-2015-06-04-at-5.38.32-PM.png)

#### Testing in other Browsers with BrowserStack

I recently experimented with [browserstack](https://www.browserstack.com) - a cloud based service for testing various platforms and browsers.

Currently, the configuration I put together in Travis, is able to run end to end tests with [protractor](http://angular.github.io/protractor/) on the actual domain of Echoes (<http://echotu.be>). That is done after each commit or pull request in github.

So Eventualy, after each commit or pull request, Travis runs the unit tests with jasmine first, and afterwards connects to Browserstack, and runs the protractor based end to end specs on 2 platforms (Mac OS and Windows) for Chrome Browser.

However, i'm looking into the option of running a local server in Travis and connect it to Browserstack, so the tests run on the actual changed code - before the code has been uploaded to production (which is the gh-pages branch that github hosts as a simple web server).

Currently, Phantom.js for Mac is in version 1.9.8, which is based on the webkit browser with limited support in the full spectrum of ES5 (i.e, **"Function.prototype.bind"** isn't supported). As a consequence, I also want to run the unit tests on Chrome browser rather than phantom - however, as [explained in Travis documentation for GUI testing](http://docs.travis-ci.com/user/gui-and-headless-browsers/#Using-xvfb-to-Run-Tests-That-Require-GUI-(e.g.-a-Web-browser)), this option might be available in Travis with the right settings.

Currently, these are the tests that are running as end to end tests by protractor:

```typescript
describe('Echotu.be Search', function() {
  it('should search and display results', function() {
    browser.get('http://echotu.be');
    // browser.debugger();
    element(by.model('vm.params.q')).sendKeys('ambient music');
    var searchResults = element.all(by.repeater('video in videos'));
    expect(searchResults.count()).toEqual(50);
  });

  it("should search and display playlists when 'playlists' is selected", function() {
  	var playlistFeed = element(by.id('feed-filter')).element(by.repeater('feed in vm.data.items').row(1));
  	playlistFeed.click();
  	// browser.pause();
  	var searchResults = element.all(by.repeater('video in vm.videos'));
    expect(searchResults.count()).toEqual(50);
  });

  it('should display 100 results after 1 infinite scroll', function() {
    	var lastSearchResult = browser.findElement(by.repeater('video in vm.videos').row(49));
    	var scrollIntoView = function () {
    	  arguments[0].scrollIntoView();
    	};
    	browser.executeScript(scrollIntoView, lastSearchResult).then(function () {
        var searchResults = element.all(by.repeater('video in vm.videos'));
        browser.sleep(3000).then(function () {
          expect(searchResults.count()).toEqual(100);
        })
      });
});
```

## Binding It All Together

To connect these tools togther - jasmine.js, karma and phantom.js (or other browser), I used the **karma.conf.js** which defines each tool in the relevant configuration place:

```typescript
var isDebug = process.env.DEBUG || false;
var browsers = [isDebug ? 'Chrome' : 'PhantomJS'];

module.exports = function(config) {
	var client_dir = '';

	config.set({
		basePath: './src',
		browsers: <strong>browsers</strong>,
		frameworks: ['<strong>jasmine</strong>'],
		files: [
			'../.tmp/vendors.js',
			'../bower_components/angular-mocks/angular-mocks.js',
			
			'app/**/*.html',
			// 'common/**/*.html',
			'../.tmp/bundle.js',
			'../.tmp/templates.mdl.js',
			'app/**/*spec.js',
			'../tests/mocks/**/*mock.json'
			// 'common/**/*spec.js'
			// fixtures
		      // {pattern: 'app/**/*.mock.json', watched: true, served: true, included: false}
	    ],
	    autoWatch: true,
	    singleRun: true,
        preprocessors: {
	        'app/**/*.html': ['ng-html2js'],
	        '../tests/mocks/**/*mock.json': ['json_fixtures']
	        // 'app/bundle.js': ['coverage']
	        // 'common/**/*.html': ['ng-html2js']
	    },
	    ngHtml2JsPreprocessor: {
	        moduleName: 'htmlTemplates'
	    },
	    jsonFixturesPreprocessor: {
	      // strip this from the file path \ fixture name
	      stripPrefix: '.+mocks/',
	      // strip this to the file path \ fixture name
	      // prependPrefix: 'mock/',
	      // change the global fixtures variable name
	      variableName: 'mocks'
	    },
	    plugins : [
	        'karma-phantomjs-launcher',
	        'karma-chrome-launcher',
	        'karma-jasmine',
	        'karma-ng-html2js-preprocessor',
	        'karma-mocha-reporter',
	        '<strong>karma-json-fixtures-preprocessor</strong>'
	    ],
	    reporters: [
	    	'mocha'
	    ]
  });
};
```

## Final Notes

With this setup above, my development workflow is ready to write tests immediatly and code the app. All the configuration is setup for local development as well as for using CI service. I truly believe that writing tests is a process that should go hand in hand with a good design thinking - which eventually followed by few iterations of defining a feature in the best way.

I'm certain that it leads to a robust code development, better coding - and even better - less actual coding in some cases.