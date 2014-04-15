var app = app || {};
app.activeTestKey = '__activeTest';
app.aceThemeKey = 'aceTheme';
app.codeSizeKey = 'codeSize';
app.keyExcludes = [app.activeTestKey, app.aceThemeKey, app.codeSizeKey, app.codeSizeKey];

(function($, ko) {
	var defaults = {
		codeSmall: 'small',
		codeMedium: 'medium',
		codeLarge: 'large',
		testSmall: 160,
		testMedium: 320,
		testLarge: 550,
		testDebounce: 500,
		testName: 'Default',
		aceTheme: 'chrome'
	};

	var ViewModel = function(config) {
		var self = this
			config = config || {};

		self.testFrame;

		self.codeContent = ko.observable('');
		self.testsContent = ko.observable('');

		self.codeSize = ko.observable(defaults.codeSmall);
		self.aceTheme = ko.observable(defaults.aceTheme);
		self.aceThemes = ko.observableArray(app.aceThemes);

		self.showingStorage = ko.observable(app.storage.isLocalStorageSupported);

		self.newTestName = ko.observable('');
		self.activeTest = ko.observable();
		self.savedTests = ko.observableArray();

		var setSize = function(size) {
			self.codeSize(size);
			ko.aceEditors.resizeAll();
			app.storage.set(app.codeSizeKey, size);
		}

		self.setContentSmall = function() { setSize(defaults.codeSmall); };
		self.setContentMedium = function() { setSize(defaults.codeMedium); };
		self.setContentLarge = function() { setSize(defaults.codeLarge); };

		var testFrameHeight = defaults.testSmall;
		var setTestFrameHeight = function(size) {
			testFrameHeight = size;
			self.$testFrame.height(size);
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
			self.$testFrame = $('<iframe id="testFrame" src="app/runner.html"></iframe>');
			self.testFrame = self.$testFrame[0];
		
			//Reset the test frame, using the existing height
			$('#' + config.testHost).empty().append(self.$testFrame);
			setTestFrameHeight(testFrameHeight);

			self.testFrame.contentWindow.__codeScript = self.codeContent();
			self.testFrame.contentWindow.__testScript = self.testsContent();

			self.saveContentToStorage();
		});

		self.codeContent.subscribe(runTests);
		self.testsContent.subscribe(runTests);

		//Init
		if (app.storage.isLocalStorageSupported) {
			//load the savedTestslist , ifnore the activeTest
			self.savedTests(app.storage.list(app.keyExcludes));

			//load the active test, if present
			var activeTest = app.storage.get(app.activeTestKey);
			if (activeTest)
				self.activeTest(activeTest);
			else {
				self.clearContent();
				self.activeTest(defaults.testName); //Will cause a save to happen
			}

			var aceTheme = app.storage.get(app.aceThemeKey);
			if (aceTheme)
				self.aceTheme(aceTheme);

			//Save any changes
			self.aceTheme.subscribe(function (newValue) { app.storage.set(app.aceThemeKey, newValue); });

			var codeSize = app.storage.get(app.codeSizeKey);
			if (codeSize)
				setSize(codeSize);
		}

		var aceReload = function() {
			//window.location.reload(false);
		};
		self.aceTheme.subscribe(function() { aceReload(); });
	};

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
