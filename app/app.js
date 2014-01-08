var app = app || {};
app.activeTestKey = '__activeTest';

(function($, ko) {
	var defaults = {
		codeSmall: 13,
		codeMedium: 21,
		codeLarge: 30,
		testSmall: 160,
		testMedium: 320,
		testLarge: 550,
		testDebounce: 500,
		testName: 'Default'
	};

	var ViewModel = function(config) {
		var self = this
			config = config || {};

		self.codeContent = ko.observable('');
		self.testsContent = ko.observable('');

		self.codeSize = ko.observable(defaults.codeSmall);

		self.showingStorage = ko.observable(app.storage.isLocalStorageSupported);

		self.newTestName = ko.observable('');
		self.activeTest = ko.observable();
		self.savedTests = ko.observableArray();

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

		self.saveContentToStorage = function(testName) {
			testName = testName || self.activeTest();
			//Ensure something gets written so we have a valid extraction
			var test = { code: self.codeContent() || ' ', tests: self.testsContent() || ' ' };

			app.storage.setJSON(testName, test);
			app.storage.set(app.activeTestKey, testName);
		};

		self.saveNewTest = function() {
			if (self.newTestName().length < 1)
				return;
			self.saveContentToStorage(self.newTestName());
			self.savedTests.push(self.newTestName());
			self.activeTest(self.newTestName());
			self.newTestName('');
		};

		self.deleteTest = function() {
			app.storage.remove(self.activeTest());
			self.savedTests.remove(self.activeTest());

			//If that was the last test, make a new default one
			if (self.savedTests().length === 0)
				self.savedTests.push(defaults.testName);
			else
				self.activeTest(self.savedTests()[0]);
		};

		self.activeTest.subscribe(function(newValue) {
			if (!newValue)
				return;
			var test = app.storage.getJSON(newValue);
			//test exists, load it
			if (test){
				self.codeContent(test.code);
				self.testsContent(test.tests);
			//test is new, save it
			} else {
				self.savedTests.push(newValue);
				self.saveContentToStorage();
			}
		});

		var runTests = $.debounce(defaults.testDebounce, function() {
			var testFrame = $('<iframe id="testFrame" src="app/runner.html"></iframe>');
		
			//Reset the test frame, using the existing height
			$('#' + config.testHost).empty().append(testFrame);
			setTestFrameHeight(testFrameHeight);

			window.frames[0].__codeScript = self.codeContent();
			window.frames[0].__testScript = self.testsContent();

			self.saveContentToStorage();
		});

		self.codeContent.subscribe(runTests);
		self.testsContent.subscribe(runTests);

		//Init

		//load the savedTestslist , ifnore the activeTest
		self.savedTests(app.storage.list(app.activeTestKey));

		//load the active test, if present
		var activeTest = app.storage.get(app.activeTestKey);
		if (activeTest)
			self.activeTest(activeTest);
		else {
			self.clearContent();
			self.activeTest(defaults.testName); //Will cause a save to happen
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
