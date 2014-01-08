var app = app || {};

(function($, ko) {
	var defaults = {
		codeSmall: 13,
		codeMedium: 21,
		codeLarge: 30,
		testSmall: 160,
		testMedium: 320,
		testLarge: 550,
		testDebounce: 500,
		cookieName: 'Default',
		cookieSaveTimeDays: 300
	};

	var ViewModel = function(config) {
		var self = this
			config = config || {};

		self.codeContent = ko.observable('');
		self.testsContent = ko.observable('');

		self.codeSize = ko.observable(defaults.codeSmall);

		self.showingStorage = ko.observable(false);

		self.newCookieName = ko.observable('');
		self.activeCookie = ko.observable();
		self.cookies = ko.observableArray();

		self.toggleStorage = function() { self.showingStorage(!self.showingStorage()); };

		self.setContentSmall = function() { self.codeSize(defaults.codeSmall); };
		self.setContentMedium = function() { self.codeSize(defaults.codeMedium); };
		self.setContentLarge = function() { self.codeSize(defaults.codeLarge); };

		var testFrameHeight = defaults.testSmall;
		var setTestFrameHeight = function(size) {
			testFrameHeight = size;
			$('iframe').height(size);
		};

		self.setResultsSmall = function() { setTestFrameHeight(defaults.testSmall); };
		self.setResultsMedium = function() { setTestFrameHeight(defaults.testMedium); };
		self.setResultsLarge = function() { setTestFrameHeight(defaults.testLarge) };

		self.setContent = function(code, tests) {
			self.codeContent(code);
			self.testsContent(tests);
		}		

		self.clearContent = function() {
			self.setContent('', "describe('', function() {\n\tit('', function() {\n\t\t\n\t});\n});");
		};

		self.loadExample = function() {
			self.setContent(config.codeExample, config.testsExample);
		};

		self.saveContentToCookie = function(cookieName) {
			cookieName = cookieName || self.activeCookie();
			//Ensure something gets written so we have a valid extraction

			var encodingMethod = 'encodeURIComponent';
			var cookie = { code: window[encodingMethod](self.codeContent() || ' '), tests: window[encodingMethod](self.testsContent() || ' ') };

			if (cookie.code.indexOf(';') !== -1 || cookie.tests.indexOf(';') !== -1) {
				debugger;
				console.log(cookie);
			}

			app.cookie.set(cookieName, cookie, defaults.cookieSaveTimeDays);
			app.cookie.set(app.activeCookieName, { name: cookieName }, defaults.cookieSaveTimeDays);
		};

		self.saveCookie = function() {
			if (self.newCookieName().length < 1)
				return;
			self.saveContentToCookie(self.newCookieName());
			self.cookies.push(self.newCookieName());
			self.activeCookie(self.newCookieName());
			self.newCookieName('');
		};

		self.deleteCookie = function() {
			app.cookie.remove(self.activeCookie());
			self.cookies.remove(self.activeCookie());

			//If that was the last cookie, make a new default one
			if (self.cookies().length === 0)
				self.cookies.push(defaults.cookieName);
			else
				self.activeCookie(self.cookies()[0]);
		};

		self.activeCookie.subscribe(function(newValue) {
			if (!newValue)
				return;
			var cookie = app.cookie.get(newValue);
			//Cookie exists, load it
			if (cookie){
				self.codeContent(unescape(cookie.code));
				self.testsContent(unescape(cookie.tests));
			//Cookie is new, save it
			} else {
				self.cookies.push(newValue);
				self.saveContentToCookie();
			}
		});

		var runTests = $.debounce(defaults.testDebounce, function() {
			var testFrame = $('<iframe id="testFrame" src="runner.html"></iframe>');
		
			//Reset the test frame, using the existing height
			$('#' + config.testHost).empty().append(testFrame);
			setTestFrameHeight(testFrameHeight);

			window.frames[0].__codeScript = self.codeContent();
			window.frames[0].__testScript = self.testsContent();

			self.saveContentToCookie();
		});

		self.codeContent.subscribe(runTests);
		self.testsContent.subscribe(runTests);

		//Init

		//load the cookieslist , ifnore the activeCookie
		self.cookies(app.cookie.list(app.activeCookieName));

		//load the active cookie, if present
		var activeCookie = app.cookie.get(app.activeCookieName);
		if (activeCookie)
			self.activeCookie(activeCookie.name);
		else {
			self.clearContent();
			self.activeCookie(defaults.cookieName); //Will cause a save to happen
		}
	};

	//Init Tab-Override
	$('textarea').tabOverride();

	//Pull the examples out of the HTML (they just look nicer there, I know it's odd)
	var examples = $('#examples').contents().filter(function() { return this.nodeType === 8; }),
        codeExample = examples.get(0).nodeValue.trim(),
        testExample = examples.get(1).nodeValue.trim();

	app.vm = new ViewModel({
		testHost: 'testHost',
		codeExample: codeExample,
		testsExample: testExample
	});

	ko.applyBindings(app.vm);

})(jQuery, ko);
