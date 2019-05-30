window.gernadeTimer = function(game) {

	var binded = false;

	var timerHidden = true;
	var duration = 4.2;  // sec
	var period = 0.1; // sec
	var dead = true;

	var updateTimerState = function() {
		if(	game.scope.mt.curWeapIdx === 3 &&
			game.scope.mt.weapType === "frag" &&
			!dead) {

			setTimeout(updateTimerState, period);	
		} else {
			freeTimer();
		}
	}

	var initTimer = function() {
		game.scope.Ke.a(function onElapsed() {
			freeTimer();
		}, duration, "Grenade", true);
		dead = false;

		updateTimerState();
	}

	var freeTimer = function() {
		game.scope.Ke.o(true);
		dead = true;
	}

	var mouseListener = {
		mousedown: function(event) {
			if(	game.scope.mt.curWeapIdx === 3 &&
				game.scope.mt.weapType === "frag" &&
				dead &&
				event.button === 0) {

				initTimer();
			}
		},
		mouseup: function(event) {
			if(	event.button === 0 &&
				!dead) {

				freeTimer();
			}	
		}
	}

	var addMouseListener = function() {
		window.addEventListener("mousedown", mouseListener.mousedown);
		window.addEventListener("mouseup", mouseListener.mouseup);
	}

	var removeMouseListener = function() {
		window.removeEventListener("mousedown", mouseListener.mousedown);
		window.addEventListener("mouseup", mouseListener.mouseup);
	}

	var bind = function(opt) {
		addMouseListener();
		binded = true;
	}

	var unbind = function() {
		removeMouseListener();
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
