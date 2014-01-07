(function() {
	var defaults = {
		codeSmall: 13,
		codeMedium: 21,
		codeLarge: 30,
		testSmall: 160,
		testMedium: 320,
		testLarge: 550,
		testDebounce: 500
	};

	var setTextAreaRows = function(size) {
		$('textarea').attr('rows', size);
	};
	
	var testFrameHeight = defaults.codeSmall;
	var setTestFrameHeight = function(size) {
		testFrameHeight = size;
		$('iframe').height(size);
	};
	
	var testHost = $('#testHost');
	var rerunTests = function() {
		var testFrame = $('<iframe id="testFrame" src="runner.html"></iframe>');
		
		//Reset the test frame, using the existing height
		testHost.empty().append(testFrame);
		setTestFrameHeight(testFrameHeight);

		window.frames[0].__codeScript = $('#userCode').val();
		window.frames[0].__testScript = $('#userTests').val();
	};
	
	$('textarea').keyup($.debounce(defaults.testDebounce, rerunTests ));
	
	$('#codeSmall').click(function() { setTextAreaRows(defaults.codeSmall); });
	$('#codeMedium').click(function() { setTextAreaRows(defaults.codeMedium); });
	$('#codeLarge').click(function() { setTextAreaRows(defaults.codeLarge); });
	
	$('#testSmall').click(function() { setTestFrameHeight(defaults.testSmall); });
	$('#testMedium').click(function() { setTestFrameHeight(defaults.testMedium); });
	$('#testLarge').click(function() { setTestFrameHeight(defaults.testLarge); });
})();
