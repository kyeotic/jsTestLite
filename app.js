(function() {
  var testHost = $('#testHost');
    
  var rerunTests = function() {
  
    var testFrame = $('<iframe id="testFrame" src="runner.html"></iframe>');
    
    //Reset the test frame
    testHost.empty().append(testFrame);
    
    var testFrameDoc = testFrame.contents()[0],
      testFrameBody = testFrame.contents().find('body')[0];
    
    var code = $('#userTests').val(),
      codeScript = testFrameDoc.createElement('script'),
      tests = $('#userTests').val(),
      testsScript = testFrameDoc.createElement('script');

    var frame = window.frames[0];

    frame.window.eval(code);
    frame.window.eval(codetestsScript);
    frame.window.eval(codeScript);
    
    /*
    codeScript.type = 'text/javascript';
    codeScript.text = code;
    testFrameBody.appendChild(codeScript);
    
    codeScript.type = 'text/javascript';
    codeScript.text = code;
    testFrameBody.appendChild(testsScript);
    */

    var runnerScript = testFrameDoc.createElement('script');
    runnerScript.type = 'text/javascript';
    runnerScript.src = 'runner.js';
    testFrameBody.appendChild(runnerScript);
  };
  
  $('textarea').keyup(function() {
    rerunTests();
  });
})();
