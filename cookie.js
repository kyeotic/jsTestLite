var app = app || {};
app.activeCookieName = '__activeCookie';
app.cookie = (function(){
      var set = function (name, value, days) {
      	var expires;
        if (days) {
          var date = new Date();
          date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
          expires = "; expires=" + date.toGMTString();
        }
        else {
        	expires = "";
        }
        document.cookie = name + "=" + escape(JSON.stringify(value)) + expires + "; path=/";
      };

      var get = function (name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) == ' ') {
            c = c.substring(1, c.length);
          }
          if (c.indexOf(nameEQ) == 0) {
            return JSON.parse(unescape(c.substring(nameEQ.length, c.length)));
          }
        }
        return null;
      };

	var remove = function (name) {
		set(name, "", -1);
	};

	var list = function (exclude) {
		var result = [],
			cookies = document.cookie.split(';'),
		exclude = exclude || [];
		if (!(exclude instanceof Array))
			exclude = [exclude];
		for (var i = 0 ; i < cookies.length; i++) {
			var cookie = cookies[i].split('=')[0];
			if (exclude.indexOf(cookie) === -1)
				result.push(cookie);
			}						
		return result;
	};
      
	return {
		set: set,
		get: get,
		remove: remove,
		list: list
	};
})();
