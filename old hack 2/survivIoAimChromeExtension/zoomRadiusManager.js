window.zoomRadiusManager = function(game, variables) {

	var scopeZoomRadius = variables.scopeZoomRadius;
	var defaultZoomRadius = Object.assign({}, scopeZoomRadius);

	var binded = false;

	if(!!!scopeZoomRadius) {
		console.log("Cannot init zoom radius manager");
		return;
	}

	var setZoomRadius = function(radius) {
		if(scopeZoomRadius) {
			scopeZoomRadius["1xscope"] = radius;
			scopeZoomRadius["2xscope"] = radius;
			scopeZoomRadius["4xscope"] = radius;
			scopeZoomRadius["8xscope"] = radius;
			scopeZoomRadius["15xscope"] = radius;
		} else {
			console.log("Scope zoom and radius not patched");
		}
	};

	var resetZoomRadius = function() {
		if(scopeZoomRadius) {
			scopeZoomRadius["1xscope"] = defaultZoomRadius["1xscope"];
			scopeZoomRadius["2xscope"] = defaultZoomRadius["2xscope"];
			scopeZoomRadius["4xscope"] = defaultZoomRadius["4xscope"];
			scopeZoomRadius["8xscope"] = defaultZoomRadius["8xscope"];
			scopeZoomRadius["15xscope"] = defaultZoomRadius["15xscope"];
		} else {
			console.log("Scope zoom and radius not patched");
		}
	}

	var zoomRadius = 68;

	var defaultBOnMouseWheel = function(e) {};

	var mouseListener = {
		wheel: function(e) {
			if(e.shiftKey) {
				var delta = e.deltaY || e.detail || e.wheelDelta;
				zoomRadius += Math.sign(delta) * 10;
				if(zoomRadius < 10) zoomRadius = 10;
				if(zoomRadius > 1000) zoomRadius = 1000;
				setZoomRadius(zoomRadius)
			} else {
				defaultBOnMouseWheel(e);
			}
		}
	}

	var addMouseListener = function(e) {
		window.addEventListener('wheel', mouseListener.wheel);
	}

	var removeMouseListener = function(e) {
		window.removeEventListener('wheel', mouseListener.wheel);
	}

	var bind = function() {
		defaultBOnMouseWheel = game.scope.be.bOnMouseWheel;
		window.removeEventListener('wheel', game.scope.be.bOnMouseWheel);

		removeMouseListener();
		addMouseListener();

		setZoomRadius(zoomRadius);
		binded = true;
	}

	var unbind = function() {
		removeMouseListener();

		window.removeEventListener('wheel', defaultBOnMouseWheel);
		window.addEventListener('wheel', defaultBOnMouseWheel);

		resetZoomRadius();
		binded = false;
	}

	var isBinded = function() {
		return binded;
	}

	return {
		bind: bind,
		unbind: unbind,
		isBinded: isBinded
	}
}