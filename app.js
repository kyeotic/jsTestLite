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

	//Init Tab-Override
	$('textarea').tabOverride();

	var setTextAreaRows = function(size) {
		$('textarea').attr('rows', size);
	};
	
	var testFrameHeight = defaults.testSmall;
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

	$('#codeExample').click(function() {
	    var examples = $('#examples').contents().filter(function() { return this.nodeType === 8; }),
	        codeExample = examples.get(0).nodeValue.trim(),
	        testExample = examples.get(1).nodeValue.trim();
	    $('#userCode').val(codeExample);
	    $('#userTests').val(testExample);
	    rerunTests();
	});

	$('#codeClear').click(function() { $('textarea').val(''); });
})();
