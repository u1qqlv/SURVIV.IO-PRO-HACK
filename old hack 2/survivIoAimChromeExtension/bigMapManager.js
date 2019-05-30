window.bigMapManager = function(game) {

	var binded = false;

	var options = {
		bigMapTransparency: 0.9
	}

	var qKeyListener = {
		keyup: function(event) {
			if(event.which == 81) {
				game.scope.Ye.displayMapLarge(game.scope.Ye.bigmapDisplayed);
				game.scope.Ye.container.alpha = options.bigMapTransparency;
			}
		}
	}

	var addQKeyListener = function() {
		window.addEventListener("keyup", qKeyListener.keyup);
	}

	var removeQKeyListener = function() {
		window.removeEventListener("keyup", qKeyListener.keyup);
	}

	var bind = function(opt) {
		options.bigMapTransparency = opt.bigMapTransparency;

		removeQKeyListener();
		addQKeyListener();

		binded = true;
	}

	var unbind = function() {
		removeQKeyListener();

		binded = false;
	}

	var isBinded = function() {
		return binded;
	}

	var setBigMapTransparency = function(alpha) {
		options.bigMapTransparency = alpha;
	}

	return {
		bind: bind,
		unbind: unbind,
		isBinded: isBinded,

		setBigMapTransparency: setBigMapTransparency
	}
}