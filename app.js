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
		cookieName: 'Default'
	};

	var ViewModel = function(config) {
		var self = this
			config = config || {};

		self.codeContent = ko.observable('');
		self.testsContent = ko.observable('');

		self.codeSize = ko.observable(defaults.codeSmall);

		self.showingStorage = ko.observable(false);

		self.newCookieName = ko.observable('');
		self.activeCookie = ko.observable(defaults.cookieName);
		self.cookies = ko.observableArray();

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
			self.runTests();
		};

		self.saveContentToCookie = function() {
			//Ensure something gets written so we have a valid extraction
			app.cookie.set(self.activeCookie(), { code: self.codeContent() || ' ', tests: self.testsContent() || ' ' }, 1000);
			app.cookie.set(app.activeCookieName, { name: self.activeCookie() }, 1000);
		};

		self.saveCookie = function() {
			self.cookies.push(self.newCookieName());
			self.activeCookie(self.newCookieName());
			self.newCookieName('');
		};

		self.loadContentFromCookie = function() {
			var cookie = app.cookie.get(self.activeCookie());
			self.codeContent(cookie.code);
			self.testsContent(cookie.tests);
		};

		self.deleteCookie = function() {
			app.cookie.remove(self.activeCookie());
			self.cookies.remove(self.activeCookie());

			//If that was the last cookie, make a new default one
			if (self.cookies().length === 0)
				self.cookies.push(defaults.cookieName);
		};

		self.activeCookie.subscribe(function(newValue) {
			self.loadContentFromCookie();
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

		//Start It up
		self.init = function() {
			//Init Tab-Override
			$('textarea').tabOverride();

			//load the cookieslist , ifnore the activeCookie
			self.cookies(app.cookie.list(app.activeCookieName));

			//load the active cookie, if present
			var activeCookie = activeCookie = app.cookie.get(app.activeCookieName);
			if (activeCookie)
				self.activeCookie(activeCookie);
			else
				self.clearContent();

			runTests();
		};
	};

	var examples = $('#examples').contents().filter(function() { return this.nodeType === 8; }),
        codeExample = examples.get(0).nodeValue.trim(),
        testExample = examples.get(1).nodeValue.trim();

	var vm = new ViewModel({
		testHost: 'testHost',
		codeExample: codeExample,
		testsExample: testExample
	});

	ko.applyBindings(vm);
	vm.init();

})(jQuery, ko);
