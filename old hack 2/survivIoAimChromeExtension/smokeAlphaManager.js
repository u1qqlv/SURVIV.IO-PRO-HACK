window.smokeAlphaManager = function(game, smokeAlpha) {

	var binded = false;

	var bind = function(opt) {
		smokeAlpha.scope = opt.smokeAlpha;
		binded = true;
	}

	var unbind = function() {
		smokeAlpha.scope = 1;
		binded = false;
	}

	var isBinded = function() {
		return binded;
	}

	var setSmokeAlpha = function(alpha) {
		smokeAlpha.scope = alpha;
	}

	return {
		bind: bind,
		unbind: unbind,
		isBinded: isBinded,

		setSmokeAlpha: setSmokeAlpha
	}
}