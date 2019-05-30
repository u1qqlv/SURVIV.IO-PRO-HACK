window.init = function(game, exports, interactionEmitter, emitActionCb, smokeAlpha, modules, options, extensionId) {
	if(!exports) {
		console.log("Error: Exports not defined, return.");
		return;
	}

	function storeOptions(extensionId, optionsObj) {
		chrome.runtime.sendMessage(extensionId, JSON.stringify(optionsObj));
		console.log("Storing options...");
	}

	function getNewOptionsInstance() {
		return {
			particlesTransparency: 0.5,
			ceilingTransparency: 0.5,
			bigMapTransparency: 0.9,
			fragGernadeSize: 0.31,
			fragGernadeColor: 16711680,
			smokeGernadeAlpha: 0.1,
			defaultFragGernadeEnabled: false,
			autoAimEnabled: true,
			autoLootEnabled: true,
			autoHealEnabled: true,
			autoOpeningDoorsEnabled: true,
			gernadeTimerEnabled: true,
			laserPointerEnabled: true,
			zoomRadiusManagerEnabled: true,
			targetEnemyNicknameVisibility: true,
			forwardFiringCoeff: 1
		}
	}

	if(!options) {
		options = getNewOptionsInstance();
		storeOptions(extensionId, options);
	}

	smokeAlpha.scope = options.smokeGernadeAlpha;
	emitActionCb.scope = function(){};

	var defsParticles = exports['ceee80d9'].exports.Defs;
	var bullets = exports['989ad62a'].exports.bullets;
	var player = exports['989ad62a'].exports.player;
	var items = exports['989ad62a'].exports.items;
	var bagSizes = exports['989ad62a'].exports.bagSizes;
	var scopeZoomRadius = exports['989ad62a'].exports.scopeZoomRadius;

	var playerBarn = exports['a508b62a'].exports.Ce;
	var lootBarn = exports['a48f3bb2'].exports.Ve;
	var bulletBarn = exports['c73dee75'].exports.Ie;
	var inputHandler = exports['4b8d140f'].exports.oe;

	var key = exports['4b8d140f'].exports.Key;

	var particlesTransparencyCb = null;
	var ceilingTransparencyCb = null;
	var bigMapTransparencyCb = null;
	var gernadePropertiesCb = null;
	var defaultGernadePropertiesCb = null;
	var forwardFiringCoeffCb = null;

	// Default gernade properties
	var defaultFragGernadeTint = null;
	var defaultFragGernadeScale = null;

	if(	!!defsParticles &&
		!!items &&
		!!bullets &&
		!!bagSizes &&
		!!playerBarn &&
		!!lootBarn &&
		!!scopeZoomRadius &&
		!!inputHandler) {

		var defaultInputHandlerFreeFunction = function() {};
		var inputHandlerFreeContext = {};

		defaultInputHandlerFreeFunction = inputHandler.prototype.o;
		inputHandler.prototype.o = function() {
			disableCheat();
			inputHandlerFreeContext = this;
			defaultInputHandlerFreeFunction.call(inputHandlerFreeContext);			
		}

		// Gernade size and color
		defaultFragGernadeTint = items.frag.worldImg.tint;
		defaultFragGernadeScale	= items.frag.worldImg.scale;

		items.frag.worldImg.tint = options.fragGernadeColor;
		items.frag.worldImg.scale = options.fragGernadeSize;

		// Ceiling alpha
		Object.keys(defsParticles).forEach(function(key) {
			if(defsParticles[key].ceiling) {
				defsParticles[key].ceiling.imgs.forEach(function(item) {
					item.alpha = options.ceilingTransparency;
				});
			}
		});

		defsParticles["bush_03"].img.alpha = options.particlesTransparency;
		defsParticles["bush_02"].img.alpha = options.particlesTransparency;
		defsParticles["bush_01"].img.alpha = options.particlesTransparency;

		defsParticles["tree_01"].img.alpha = options.particlesTransparency;
		
		defsParticles["table_02"].img.alpha = options.particlesTransparency;
		defsParticles["table_01"].img.alpha = options.particlesTransparency;

		particlesTransparencyCb = function(alpha) {
			// Particle alpha
			options.particlesTransparency = alpha;

			defsParticles["bush_01"].img.alpha = alpha;
			defsParticles["bush_02"].img.alpha = alpha;
			defsParticles["bush_03"].img.alpha = alpha;

			defsParticles["tree_01"].img.alpha = alpha;
			
			defsParticles["table_01"].img.alpha = alpha;
			defsParticles["table_02"].img.alpha = alpha;
		}

		ceilingTransparencyCb = function(alpha) {
			// Ceiling alpha
			options.ceilingTransparency = alpha;

			Object.keys(defsParticles).forEach(function(key) {
				if(defsParticles[key].ceiling) {
					defsParticles[key].ceiling.imgs.forEach(function(item) {
						item.alpha = alpha;
					});
				}
			});
		}

		bigMapTransparencyCb = function(alpha) {
			options.bigMapTransparency = alpha;
			bigMapManager.setBigMapTransparency(alpha);
		}

		gernadePropertiesCb = function(size, color) {
			options.fragGernadeSize = size;
			options.fragGernadeColor = color;

			items.frag.worldImg.tint = color;
			items.frag.worldImg.scale = size;
		}

		smokeGernadePropertiesCb = function(alpha) {
			options.smokeGernadeAlpha = parseFloat(alpha);
			smokeAlphaManager.setSmokeAlpha(options.smokeGernadeAlpha);
		}

		defaultGernadePropertiesCb = function() {
			options.fragGernadeSize = defaultFragGernadeScale;
			options.fragGernadeColor = defaultFragGernadeTint;

			items.frag.worldImg.scale = defaultFragGernadeScale;
			items.frag.worldImg.tint = defaultFragGernadeTint;

			return {
				defaultFragGernadeScale: defaultFragGernadeScale,
				defaultFragGernadeTint: defaultFragGernadeTint
			}
		}

		forwardFiringCoeffCb = function(coeff) {
			options.forwardFiringCoeff = parseFloat(coeff);
			autoAim.setForwardFiringCoeff(options.forwardFiringCoeff);
		}
	} else {
		console.log("Error: Variable not defined");
	}

	storeOptionsCb = function() {
		storeOptions(extensionId, options);
	}

	// setInterval(function(){if(game.scope && game.scope.st){
	// 	console.log(game.scope);console.log(exports);
	// }}, 2000);

	var bindAutoAim = function() {
		autoAim.bind({
			targetEnemyNicknameVisibility: options.targetEnemyNicknameVisibility,
			forwardFiringCoeff: options.forwardFiringCoeff
		});
	}

	var unbindAutoAim = function() {
		autoAim.unbind();
	}

	var autoAimEnableCb = function() {
		if(autoAim.isBinded() && options.autoAimEnabled) {
			unbindAutoAim();
			options.autoAimEnabled = false;
		} else if(!autoAim.isBinded() && !options.autoAimEnabled) {
			bindAutoAim();
			options.autoAimEnabled = true;
		}
	}

	var autoAimTargetEnemyVisibilityCb = function() {
		options.targetEnemyNicknameVisibility = !options.targetEnemyNicknameVisibility;
		if(autoAim.isBinded() && options.autoAimEnabled) {
			unbindAutoAim();
			bindAutoAim();
		}
	}

	var autoLootEnableCb = function() {
		if(autoLoot.isBinded() && options.autoLootEnabled) {
			autoLoot.unbind();
			options.autoLootEnabled = false;
		} else if(!autoLoot.isBinded() && !options.autoLootEnabled) {
			autoLoot.bind();
			options.autoLootEnabled = true;
		}
	}

	var autoHealEnableCb = function() {
		if(autoHeal.isBinded() && options.autoHealEnabled) {
			autoHeal.unbind();
			options.autoHealEnabled = false;
		} else if(!autoHeal.isBinded() && !options.autoHealEnabled) {
			autoHeal.bind();
			options.autoHealEnabled = true;
		}
	}

	var autoOpeningDoorsEnableCb = function() {
		if(autoOpeningDoors.isBinded() && options.autoOpeningDoorsEnabled) {
			autoOpeningDoors.unbind();
			options.autoOpeningDoorsEnabled = false;
		} else if(!autoOpeningDoors.isBinded() && !options.autoOpeningDoorsEnabled) {
			autoOpeningDoors.bind();
			options.autoOpeningDoorsEnabled = true;
		}
	}

	var gernadeTimerEnableCb = function() {
		if(gernadeTimer.isBinded() && options.gernadeTimerEnabled) {
			gernadeTimer.unbind();
			options.gernadeTimerEnabled = false;
		} else if(!gernadeTimer.isBinded() && !options.gernadeTimerEnabled) {
			gernadeTimer.bind();
			options.gernadeTimerEnabled = true;
		}
	}

	var laserPointerEnableCb = function() {
		if(laserPointer.isBinded() && options.laserPointerEnabled) {
			laserPointer.unbind();
			options.laserPointerEnabled = false;
		} else if(!laserPointer.isBinded() && !options.laserPointerEnabled) {
			laserPointer.bind();
			options.laserPointerEnabled = true;
		}
	}

	var zoomRadiusManagerEnableCb = function() {
		if(zoomRadiusManager.isBinded() && options.zoomRadiusManagerEnabled) {
			zoomRadiusManager.unbind();
			options.zoomRadiusManagerEnabled = false;
		} else if(!zoomRadiusManager.isBinded() && !options.zoomRadiusManagerEnabled) {
			zoomRadiusManager.bind();
			options.zoomRadiusManagerEnabled = true;
		}
	}

	var autoAim = modules.autoAim(game, {
		bullets: bullets, 
		items: items, 
		playerBarn: playerBarn
	});

	var autoLoot = modules.autoLoot(game, {
		lootBarn: lootBarn,
		bagSizes: bagSizes
	});

	var autoHeal = modules.autoHeal(game, {
		key: key
	});

	var autoOpeningDoors = modules.autoOpeningDoors(game, emitActionCb, interactionEmitter);

	var bigMapManager = modules.bigMapManager(game);

	var gernadeTimer = modules.gernadeTimer(game);

	var laserPointer = modules.laserPointer(game, {
		bullets: bullets, 
		items: items
	});

	var zoomRadiusManager = modules.zoomRadiusManager(game, {
		scopeZoomRadius: scopeZoomRadius
	});

	var smokeAlphaManager = modules.smokeAlphaManager(game, smokeAlpha);

	var menu = modules.menu(options, {
		particlesTransparencyCb: particlesTransparencyCb,
		ceilingTransparencyCb: ceilingTransparencyCb,
		bigMapTransparencyCb: bigMapTransparencyCb,

		gernadePropertiesCb: gernadePropertiesCb,
		defaultGernadePropertiesCb: defaultGernadePropertiesCb,
		smokeGernadePropertiesCb: smokeGernadePropertiesCb,

		autoAimEnableCb: autoAimEnableCb,
		autoAimTargetEnemyVisibilityCb: autoAimTargetEnemyVisibilityCb,
		forwardFiringCoeffCb: forwardFiringCoeffCb,
		autoHealEnableCb: autoHealEnableCb,
		autoLootEnableCb: autoLootEnableCb,
		autoOpeningDoorsEnableCb: autoOpeningDoorsEnableCb,
		laserPointerEnableCb: laserPointerEnableCb,
		zoomRadiusManagerEnableCb: zoomRadiusManagerEnableCb,
		gernadeTimerEnableCb: gernadeTimerEnableCb,

		storeOptionsCb: storeOptionsCb
	});

	var lShiftKeyListener = {
		keydown: function(event) {
			if(event.which == 16) {
				if(autoAim.isBinded()) {
					unbindAutoAim();
				}
				if(autoLoot.isBinded()) {
					autoLoot.unbind();
				}
				if(autoHeal.isBinded()) {
					autoHeal.unbind();
				}
			}
		},
		keyup: function(event) {
			if(event.which == 16) {
				if(options.autoAimEnabled && !autoAim.isBinded()) {
					bindAutoAim();
				}
				if(options.autoLootEnabled && !autoLoot.isBinded()) {
					autoLoot.bind({
						targetEnemyNicknameVisibility: options.targetEnemyNicknameVisibility
					});
				}
				if(options.autoHealEnabled && !autoHeal.isBinded()) {
					autoHeal.bind();
				}
			}
		}
	}

	var addLShiftKeyListener = function() {
		window.addEventListener("keydown", lShiftKeyListener.keydown);
		window.addEventListener("keyup", lShiftKeyListener.keyup);
	}

	var removeLShiftKeyListener = function() {
		window.removeEventListener("keydown", lShiftKeyListener.keydown);
		window.removeEventListener("keyup", lShiftKeyListener.keyup);
	}

	var bindCheatListeners = function() {
		addLShiftKeyListener();

		if(options.autoAimEnabled && !autoAim.isBinded()) {
			bindAutoAim();
		}

		if(options.autoLootEnabled && !autoLoot.isBinded()) {
			autoLoot.bind();
		}

		if(options.autoHealEnabled && !autoHeal.isBinded()) {
			autoHeal.bind();
		}

		if(options.autoOpeningDoorsEnabled && !autoOpeningDoors.isBinded()) {
			autoOpeningDoors.bind();
		}

		if(!bigMapManager.isBinded()) {
			bigMapManager.bind({
				bigMapTransparency: options.bigMapTransparency
			});
		}

		if(options.gernadeTimerEnabled && !gernadeTimer.isBinded()) {
			gernadeTimer.bind();
		}

		if(options.laserPointerEnabled && !laserPointer.isBinded()) {
			laserPointer.bind();
		}

		if(options.zoomRadiusManagerEnabled && !zoomRadiusManager.isBinded()) {
			zoomRadiusManager.bind();
		}

		if(!smokeAlphaManager.isBinded()) {
			smokeAlphaManager.bind({
				smokeAlpha: options.smokeGernadeAlpha
			});
		}

		if(!menu.isBinded()) {
			menu.bind();
		}
	}

	var unbindCheatListeners = function() {
		removeLShiftKeyListener();

		if(menu.isBinded()) {
			menu.unbind();
		}
		
		if(autoAim.isBinded()) {
			unbindAutoAim();
		}

		if(autoLoot.isBinded()) {
			autoLoot.unbind();
		}

		if(autoHeal.isBinded()) {
			autoHeal.unbind();
		}

		if(autoOpeningDoors.isBinded()) {
			autoOpeningDoors.unbind();
		}

		if(bigMapManager.isBinded()) {
			bigMapManager.unbind();
		}

		if(gernadeTimer.isBinded()) {
			gernadeTimer.unbind();
		}

		if(laserPointer.isBinded()) {
			laserPointer.unbind();
		}

		if(zoomRadiusManager.isBinded()) {
			zoomRadiusManager.unbind();
		}

		if(smokeAlphaManager.isBinded()) {
			smokeAlphaManager.unbind();
		}
	}

	var gameOver = function() {
		if(game.scope) return !!game.scope.gameOver;
		return true;
	}

	var cheatEnabled = false;
	function enableCheat() {
		if(game.scope && !gameOver() && !cheatEnabled) {			
			bindCheatListeners();
			cheatEnabled = true;
		}
	}
  
	function disableCheat() {
		if(cheatEnabled) {
			unbindCheatListeners();
			cheatEnabled = false;
		}
	}

	var zKeyListener = {
		keyup: function(event) {
			if(event.which == 90) {
				if(!gameOver()) {
					if(cheatEnabled) {
						disableCheat();
					} else {
						enableCheat();
					}
				}
			}
		}
	}

	var addZKeyListener = function() {
		window.addEventListener("keyup", zKeyListener.keyup);
	}

	var removeZKeyListener = function() {
		window.removeEventListener("keyup", zKeyListener.keyup);
	}

	removeZKeyListener();
	addZKeyListener();
}
