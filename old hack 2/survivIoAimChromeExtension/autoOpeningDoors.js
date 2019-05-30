window.autoOpeningDoors = function(game, emitActionCb, interactionEmitter) {

	var binded = false;

	var pressF = function() {
		if(!game.scope.be.keys["70"]) {
			setTimeout(function() {
				game.scope.be.keys["70"] = true;
				setTimeout(function() {
					delete game.scope.be.keys["70"]
				}, 50);
			}, 50);
		}
	};

	var interactionTypes = {
		Obstacle: 2,
		Loot: 3
	};

	var bind = function() {
		emitActionCb.scope = function() {
			if(interactionEmitter.scope) {
				switch(interactionEmitter.scope.__type) {
					case interactionTypes.Obstacle:
						if( interactionEmitter.scope.hasOwnProperty('door') &&
							!interactionEmitter.scope.door.open) {
							pressF();
						}
					break;
				}
			}
		};
		binded = true;
	};

	var unbind = function() {
		emitActionCb.scope = function() {};
		binded = false;
	};

	var isBinded = function() {
		return binded;
	}

	return {
		bind: bind,
		unbind: unbind,
		isBinded: isBinded
	}
}