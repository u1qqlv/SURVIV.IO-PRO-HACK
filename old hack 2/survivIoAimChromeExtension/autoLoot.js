window.autoLoot = function(game, variables) {

	var lootBarn = variables.lootBarn;
	var bagSizes = variables.bagSizes;
	var binded = false;

	if(!!!lootBarn || !!!bagSizes) {
		console.log("Cannot init autoloot");
		return;
	}

	/*
		var bagSizes = {
			"9mm": [120, 240, 330, 420],
			"762mm": [90, 180, 240, 300],
			"556mm": [90, 180, 240, 300],
			"12gauge": [15, 30, 60, 90],
			"50AE": [49, 98, 147, 196],
			"308sub": [10, 20, 30, 40],
			flare: [2, 4, 6, 8],
			frag: [3, 6, 9, 12],
			smoke: [3, 6, 9, 12],
			bandage: [5, 10, 15, 30],
			healthkit: [1, 2, 3, 4],
			soda: [2, 5, 10, 15],
			painkiller: [1, 2, 3, 4],
		}
	*/

	var pressF = function() {
		if(!game.scope.be.keys["70"]) {
			setTimeout(function() {
				game.scope.be.keys["70"] = true;
				setTimeout(function() {
					delete game.scope.be.keys["70"]
				}, 90);
			}, 0);
		}
	}

	var pickupLoot = function() {
		if(game.scope.Ue.vt() && game.scope.Ue.vt().active) {
			if(	/mm/.test(game.scope.Ue.vt().name) ||
				/12gauge/.test(game.scope.Ue.vt().name) ||
				/50AE/.test(game.scope.Ue.vt().name) ||
				/308sub/.test(game.scope.Ue.vt().name) ||
				"flare" === game.scope.Ue.vt().name ||
				/bandage/.test(game.scope.Ue.vt().name) ||
				/soda/.test(game.scope.Ue.vt().name) ||
				/painkiller/.test(game.scope.Ue.vt().name) ||
				/smoke/.test(game.scope.Ue.vt().name) ||
				/frag/.test(game.scope.Ue.vt().name) ||
				/healthkit/.test(game.scope.Ue.vt().name)) {

				var ownBagIndex = !!game.scope.mt.N.backpack ? parseInt(game.scope.mt.N.backpack.slice(-2), 10) : 0;
				var bagSize = bagSizes[game.scope.Ue.vt().name][ownBagIndex];

				if(game.scope.mt.U.inventory[game.scope.Ue.vt().name] !== bagSize) {
					pressF();
				}
				return;
			}

			if(/scope/.test(game.scope.Ue.vt().name)) {
				var scopeLevel = parseInt(game.scope.Ue.vt().name.slice(0, -6), 10);
				if(!game.scope.mt.U.inventory[game.scope.Ue.vt().name]) {
					pressF();
				}
				return;
			};

			/*
				helmet01
				chest01
				backpack01
			*/
			if(	/helmet/.test(game.scope.Ue.vt().name) ||
				/chest/.test(game.scope.Ue.vt().name) ||
				/backpack/.test(game.scope.Ue.vt().name)) {

				var lootname = game.scope.Ue.vt().name.slice(0, -2);
				var lootLevel = parseInt(game.scope.Ue.vt().name.slice(-2), 10);

				if(!game.scope.mt.N[lootname]) {
					pressF();
					return;
				};

				var ownLootLevel = parseInt(game.scope.mt.N[lootname].slice(-2), 10);
				if( ownLootLevel < lootLevel) {
					pressF();
				}
				return;
			};

			/*
				Guns and skins
			*/
			if(game.scope.mt.U.weapons[0].name == "" ||
			   game.scope.mt.U.weapons[1].name == "") {
				pressF();
				return;
			}
		}
	}

	var defaultLootBarnUpdateFunction = function(e, t, a) {};
	var lootBarnUpdateContext = {};

	var bind = function() {
		defaultLootBarnUpdateFunction = lootBarn.prototype.l;
		lootBarn.prototype.l = function(e, t, a) {
			lootBarnUpdateContext = this;
			defaultLootBarnUpdateFunction.call(lootBarnUpdateContext, e, t, a);

			pickupLoot();
		}
		binded = true;
	}

	var unbind = function() {
		lootBarn.prototype.l = defaultLootBarnUpdateFunction;
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
