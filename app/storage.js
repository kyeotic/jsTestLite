var app = app || {};

app.storage = (function() {
	var storage = {
		
	}

	function supportsWebStorage() {
		try {
			return 'localStorage' in window && window['localStorage'] !== null;
		} catch (e) {
			return false;
		}
	}

	var useLocalStorage = supportsWebStorage();

	var cleanStorageKey = function(value) {
		return value !== 'undefined' ? value : undefined;
	};

	return {
		isLocalStorageSupported: supportsWebStorage,
		get: function(key) { return cleanStorageKey(localStorage[key]); },
		set: function(key, value) { return localStorage[key] = value; },
		remove: function(key) { return localStorage.removeItem(key); },
		setJSON: function(key, value) { return localStorage[key] = JSON.stringify(value); },
		getJSON: function(key) {
			var item = cleanStorageKey(localStorage[key]);
			return item ? JSON.parse(item) : null;
		},
		list: function(exclude) {
			var keys = [];
			exclude = exclude || [];

			if (exclude instanceof Array === false)
				exclude = [exclude];
			
			for(var i=0; i < localStorage.length; i++) {
				var item = cleanStorageKey(localStorage.key(i));
				if (item && exclude.indexOf(item) === -1 && item.length > 0)
					keys.push(item);
			}
			return keys;
		}
	}
})();