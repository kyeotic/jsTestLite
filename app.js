(function() {
  var testHost = $('#testHost');
    
  var rerunTests = function() {
  
    var testFrame = $('<iframe id="testFrame" src="runner.html"></iframe>');
    
    //Reset the test frame
    testHost.empty().append(testFrame);
    
    var code = $('#userTests').val(),
      tests = $('#userTests').val(),;

    var frame = window.frames[0];
    
	frame.__codeScript = code;
	frame.__testScript = tests;
  };
  
  $('textarea').keyup(function() {
    rerunTests();
  });
})();
