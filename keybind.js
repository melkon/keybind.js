var Keybind = function() {
	var obj = {};

	var specials = {
		'Ctrl': 49,
		'Alt': 50
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
			
			if(chrs.length === 1) {
				cpyShortcuts[chrs] = callback;
			} else {
				combi = chrs.join('-');

				if(undefined === cpyShortcuts[combi]) 
					cpyShortcuts[combi] = {};

				cpyShortcuts = cpyShortcuts[combi];
			}
		}
	};

	obj.clear = function() {
		shortcuts = {};
	};

	obj.show = function() {
		console.log(shortcuts);
	};

	obj.showDown = function() {
		console.log(downs);
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

	obj.eval = function() {
		var shortcut;
		var combi;

		newDowns = true;
		console.log(downs);

		for(var i in downs) {
			combi = (downs[i].length === 1) ? downs[i] : downs[i].join('-');

			if(undefined === shortcut) 
				shortcut = shortcuts;

			switch(typeof(shortcut[combi])) {
				case 'object': shortcut = shortcut[combi]; break;
				case 'function': shortcut[combi](); 
				case 'undefined': downs = []; return; break;
			}
		}
	};

	obj.onKeydown = function(event) { 
		var add = (false === event.shiftKey) ? 32 : 0;

		obj.addDown(event.keyCode + add); 
	};

	obj.onKeyup   = function(event) { console.log(event.keyCode); obj.eval(); };
	
	return obj;
}();
