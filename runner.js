(function() {
	var jasmineEnv = jasmine.getEnv();
	jasmineEnv.updateInterval = 250;

	var htmlReporter = new jasmine.HtmlReporter();
	jasmineEnv.addReporter(htmlReporter);

	jasmineEnv.specFilter = function(spec) {
		return htmlReporter.specFilter(spec);
	};

	function execJasmine() {
		jasmineEnv.execute();
	};

	window.onload = function() {
		debugger;

		var code = window.__codeScript,
		  codeScript = document.createElement('script'),
		  tests = window.__testScript,
		  testsScript = document.createElement('script');

		codeScript.type = 'text/javascript';
		codeScript.text = code;
		testFrameBody.appendChild(codeScript);
		
		codeScript.type = 'text/javascript';
		codeScript.text = code;
		testFrameBody.appendChild(testsScript);

		execJasmine();
	};
})();
