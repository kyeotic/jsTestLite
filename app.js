(function() {
  
  
  var setTextAreaRows = function(size) {
  	$('textarea').attr('rows', size);
  };
  
  var testFrameHeight = 160;
  var setTestFrameHeight = function(size) {
  	testFrameHeight = size;
  	$('iframe').height(size);
  };
  
  var testHost = $('#testHost');
  var rerunTests = function() {
    var testFrame = $('<iframe id="testFrame" src="runner.html"></iframe>');
    
    //Reset the test frame
    testHost.empty().append(testFrame);
    setTestFrameHeight(testFrameHeight);
    
    var code = $('#userTests').val(),
      tests = $('#userTests').val();

    var frame = window.frames[0];
    
	frame.__codeScript = code;
	frame.__testScript = tests;
  };
  
  $('textarea').keyup(function() { rerunTests(); });
  
  
  
	$('#codeSmall').click(function() { setTextAreaRows(13); });
	$('#codeMedium').click(function() { setTextAreaRows(21); });
	$('#codeLarge').click(function() { setTextAreaRows(30); });
	
	$('#testSmall').click(function() { setTestFrameHeight(160); });
	$('#testMedium').click(function() { setTestFrameHeight(320); });
	$('#testLarge').click(function() { setTestFrameHeight(550); });
})();
