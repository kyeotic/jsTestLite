var app = app || {};

(function($) {
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

	//Init Tab-Override
	$('textarea').tabOverride();

	var resetFields = function() {
		$('#userCode').val('');
		$('#userTests').val("describe('', function() {\n\tit('', function() {\n\t\t\n\t});\n});");
	};

	/* 
		Setup Field Size and Size Control
		======================================================
	*/

	var setTextAreaRows = function(size) {
		$('textarea').attr('rows', size);
	};
	
	var testFrameHeight = defaults.testSmall;
	var setTestFrameHeight = function(size) {
		testFrameHeight = size;
		$('iframe').height(size);
	};

	$('#codeSmall').click(function() { setTextAreaRows(defaults.codeSmall); });
	$('#codeMedium').click(function() { setTextAreaRows(defaults.codeMedium); });
	$('#codeLarge').click(function() { setTextAreaRows(defaults.codeLarge); });
	
	$('#testSmall').click(function() { setTestFrameHeight(defaults.testSmall); });
	$('#testMedium').click(function() { setTestFrameHeight(defaults.testMedium); });
	$('#testLarge').click(function() { setTestFrameHeight(defaults.testLarge); });
	
	/*
		Setup Example Button
		======================================================
	*/
	$('#codeExample').click(function() {
	    var examples = $('#examples').contents().filter(function() { return this.nodeType === 8; }),
	        codeExample = examples.get(0).nodeValue.trim(),
	        testExample = examples.get(1).nodeValue.trim();
	    $('#userCode').val(codeExample);
	    $('#userTests').val(testExample);
	    rerunTests();
	});

	/*
		Setup Cookie Manager
		======================================================
	*/

	//Create save and load functions
	var saveContentToCookie = function() {
		//Ensure something gets written so we have a valid extraction
		app.cookie.set(activeCookie, { code: $('#userCode').val() || ' ', tests: $('#userTests').val() || ' ' }, 1000);
		app.cookie.set(app.activeCookieName, { name: activeCookie }, 1000);
	};
	var loadContentFromCookie = function() {
		var cookie = app.cookie.get(activeCookie);
		$('#userCode').val(cookie.code);
		$('#userTests').val(cookie.tests);
	};

	//Bind the toggle button
	$('#toggleCookies').click(function() { $('#cookieContainer').slideToggle(); } );

	//Retrieve the cookie list, and selected cookie
	var cookieList = app.cookie.list(app.activeCookieName),
		activeCookie = app.cookie.get(app.activeCookieName);

	if (activeCookie)
		activeCookie = activeCookie.name;

	//Select the first cookie if none is selected
	if (!activeCookie && cookieList.length > 0) {
		activeCookie = cookieList[0];
	}

	//Load the cookie if present
	if (activeCookie) {
		loadContentFromCookie();
	//Otherwise, make a default cookie
	} else {
		$('#cookieContainer').hide();
		activeCookie = defaults.cookieName;
		cookieList.push(activeCookie);
		resetFields();
	}

	//Populate the dropdown
	if (cookieList.length > 0) {
		$.each(cookieList, function (i, item) {
		    $('#cookieList').append($('<option>', { value: item, text : item }));
		});
	}

	//Save should set the active cookie, save the content, add a dropdown option, and select it
	$('#cookieSave').click(function() {
		if ($('#cookieList').find('[value=' + this.value + ']').length > 0) {
			alert("A cookie by this name already exists");
			return;
		}
		activeCookie = this.value;
		saveContentToCookie();

		$('#cookieList').append($('<option>', { value: cookieName, text : cookieName }));
		$('#.cookieList').val(activeCookie);
	});

	//Delete should remove the current cookie, remove the dropdown option, and clear the fields
	$('#cookieDelete').click(function() {
		app.cookie.remove(activeCookie);
		$('#cookieList').find('[value=' + activeCookie + ']').remove();
		resetFields();
	});	

	//Change should load the selected cookie
	$('#cookieList').change(function() {
		var cookieName = this.value;
		if (activeCookie === cookieName)
			return;
		activeCookie = cookieName;
		loadContentFromCookie();
	});


	/*
		Setup Test Runner
		======================================================
	*/

	var testHost = $('#testHost');
	var rerunTests = function() {
		var testFrame = $('<iframe id="testFrame" src="runner.html"></iframe>');
		
		//Reset the test frame, using the existing height
		testHost.empty().append(testFrame);
		setTestFrameHeight(testFrameHeight);

		window.frames[0].__codeScript = $('#userCode').val();
		window.frames[0].__testScript = $('#userTests').val();

		saveContentToCookie();
	};

	$('textarea').keyup($.debounce(defaults.testDebounce, rerunTests ));

	/*
		Setup Reset Button
		======================================================
	*/
	
	
	
	$('#codeClear').click(function() { resetFields(); rerunTests(); });
	
})(jQuery);
