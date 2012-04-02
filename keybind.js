var Keybind = function() {
	var obj = {};

	var specials = {
		'CTRL': 49,
		'ALT': 50,
		'SPC': 64
	};

	var shortcuts = {};
	var downs     = [];
	var newDowns  = true;
	
	var getASCII = function(key) {
		if(undefined !== specials[key])
			return specials[key];

		return key.charCodeAt(0);
	};

	obj.add = function(shortcut, callback) {
		if(undefined === shortcut) throw 'no shortcut given';
		if(undefined === callback) throw 'no callback given';
		if('function' !== typeof(callback)) throw 'no callable callback given';

		shortcut = shortcut.split(' ');

		var combi, chrs;
		var cpyShortcuts = shortcuts;

		for(var i in shortcut) {
			combi = shortcut[i].split('-');
			chrs  = [];

			for(var j in combi) chrs.push(getASCII(combi[j]));

			chrs = chrs.join('-');

			if(i == shortcut.length - 1) {
				cpyShortcuts[chrs] = callback;
			} else {
				if(undefined === cpyShortcuts[chrs]) 
					cpyShortcuts[chrs] = {};

				cpyShortcuts = cpyShortcuts[chrs];
			}
		}
	};

	obj.addDown = function(keycode) {
		if(newDowns) {
			downs.push([]);
			newDowns = false;
		}

		var combi = downs.pop();

		/* already pressed? */
		for(var i in combi) if(keycode === combi[i]) return;

		combi.push(keycode);
		downs.push(combi);

	};

	obj.isShortcut = function() {
		var intro = downs.shift().join('-');
		var is    = false;

		if(undefined !== shortcuts[intro])
			is = true;

		downs.unshift(intro.split('-'));

		return is;
	};

	obj.eval = function() {
		var shortcut;
		var combi;

		newDowns = true;

		for(var i in downs) {
			combi = (downs[i].length === 1) ? downs[i] : downs[i].join('-');

			if(undefined === shortcut) 
				shortcut = shortcuts;

			switch(typeof(shortcut[combi])) {
			case 'object': shortcut = shortcut[combi]; break;
			case 'function': shortcut[combi](); 

			case 'undefined': downs = []; break;
			}
		}

	};

	obj.onKeydown = function(event) { 
		var add = (false === event.shiftKey) ? 32 : 0;

		obj.addDown(event.keyCode + add); 

		if(obj.isShortcut()) {
			event.stopPropagation();
			event.preventDefault();
		}
	};

	obj.onKeyup = function(event) { obj.eval(); };
	
	return obj;
}();