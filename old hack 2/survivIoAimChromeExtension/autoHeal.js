window.autoHeal = function(game, variables) {

	var key = variables.key;
	var binded = false;
	var timer = null;

	var pressKey = function(key) {
		if(!game.scope.be.keys[key]) {
			setTimeout(function() {
				game.scope.be.keys[key] = true;
				setTimeout(function() {
					delete game.scope.be.keys[key]
				}, 90);
			}, 0);
		}
	}

	var isNoEnemy = function() {
		if(!game.scope.Pe.St[game.scope.ce]) return false;

		var selfTeamId = game.scope.Pe.St[game.scope.ce].teamId;
		var selfId = game.scope.ce;
		var playerIds = Object.keys(game.scope.Pe.St);

		for(var i = 0; i < playerIds.length; i++) {
			if( game.scope.st.idToObj[playerIds[i]] && 
				(!game.scope.st.idToObj[playerIds[i]].N.dead) && 
				(!game.scope.st.idToObj[playerIds[i]].N.downed) &&
				game.scope.Pe.St[playerIds[i]].teamId != selfTeamId) {
				
				return false;
			}
		}

		return true;
	}

	var isNoMotion = function() {
		if(	game.scope.be.keys[key.W] ||
			game.scope.be.keys[key.D] ||
			game.scope.be.keys[key.S] ||
			game.scope.be.keys[key.A]) {

			return false;
		}

		return true;
	}

	var heal = function() {
		if(isNoEnemy() && isNoMotion()) {
			if(game.scope.mt.U.health < 30) {
				if(game.scope.mt.U.inventory["healthkit"] > 0 ) {
					pressKey(key.Eight);
					return;
				}
			}

			if(game.scope.mt.U.health < 70 && game.scope.mt.U.boost < 40) {
				if(game.scope.mt.U.inventory["bandage"] > 0 ) {
					pressKey(key.Seven);
					return;
				}
			}

			if(game.scope.mt.U.boost < 50) {
				if(game.scope.mt.U.inventory["painkiller"] > 0 ) {
					pressKey(key.Zero);
					return;
				}
			}

			if(game.scope.mt.U.boost < 75) {
				if(game.scope.mt.U.inventory["soda"] > 0 ) {
					pressKey(key.Nine);
					return;
				}
			}
		}
	}

	var runHeal = function() {
		heal();
		timer = setTimeout(runHeal, 1000);
	}

	var stopHeal = function() {
		clearTimeout(timer);
		timer = null;
	}	

	var bind = function() {
		runHeal();
        binded = true;
	}

	var unbind = function() {
		stopHeal();
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
