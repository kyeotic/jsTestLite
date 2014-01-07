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
		var code = __codeScript,
		  codeScript = document.createElement('script'),
		  tests = __testScript,
		  testsScript = document.createElement('script');

		codeScript.type = 'text/javascript';
		codeScript.text = code;
		document.body.appendChild(codeScript);
		
		testsScript.type = 'text/javascript';
		testsScript.text = tests;
		document.body.appendChild(testsScript);

		execJasmine();
	};
})();
