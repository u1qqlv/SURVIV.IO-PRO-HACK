
var sendXhrGETRequest = function(url, callback) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", url, true);

	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			callback(xhr);
		}
	}

	xhr.send();
	console.log("Send");
}

/*
	v1 > v2 return 1
	v1 < v2 return -1
	v1 == v2 return 0
*/
var compareVersions = function(v1str, v2str) {
	var v1 = [];
	var v2 = [];

	v1str.split('.').forEach(function(item) {
		v1.push(parseInt(item));
	});

	v2str.split('.').forEach(function(item) {
		v2.push(parseInt(item));
	});

	if(v1.length > v2.length) {
		var diff = v1.length - v2.length;
		for(var i = 0; i < diff; i++) {
			v2.push(0);
		}
	} else if(v2.length > v1.length) {
		var diff = v2.length - v1.length;
		for(var i = 0; i < diff; i++) {
			v1.push(0);
		}
	}

	for(var i = 0; i < v1.length; i++) {
		if(v1[i] > v2[i]) {
			return 1;
		} else if(v1[i] < v2[i]) {
			return -1;
		} else continue;
	}

	return 0;
}

var extensionManager = (function() {
	var versionCheckUrl = "https://raw.githubusercontent.com/w3x731/survivIoAim/master/updates.json";
	var extensionFilesListUrl = "https://raw.githubusercontent.com/w3x731/survivIoAim/master/fileList.json";
	var fileList = {
		autoAim: {
			url: "https://raw.githubusercontent.com/w3x731/survivIoAim/master/survivIoAimChromeExtension/autoAim.js",
			priority: 1
		},
		autoHeal: {
			url: "https://raw.githubusercontent.com/w3x731/survivIoAim/master/survivIoAimChromeExtension/autoHeal.js",
			priority: 1
		},
		autoLoot: {
			url: "https://raw.githubusercontent.com/w3x731/survivIoAim/master/survivIoAimChromeExtension/autoLoot.js",
			priority: 1
		},
		autoOpeningDoors: {
			url: "https://raw.githubusercontent.com/w3x731/survivIoAim/master/survivIoAimChromeExtension/autoOpeningDoors.js",
			priority: 1
		},
		background: {
			url: "https://raw.githubusercontent.com/w3x731/survivIoAim/master/survivIoAimChromeExtension/background.js",
			priority: 0
		},
		bigMapManager: {
			url: "https://raw.githubusercontent.com/w3x731/survivIoAim/master/survivIoAimChromeExtension/bigMapManager.js",
			priority: 1
		},
		gernadeTimer: {
			url: "https://raw.githubusercontent.com/w3x731/survivIoAim/master/survivIoAimChromeExtension/gernadeTimer.js",
			priority: 1
		},
		init: {
			url: "https://raw.githubusercontent.com/w3x731/survivIoAim/master/survivIoAimChromeExtension/init.js",
			priority: 1
		},
		manifest: {
			url: "https://raw.githubusercontent.com/w3x731/survivIoAim/master/survivIoAimChromeExtension/manifest.json",
			priority: -1
		},
		menu: {
			url: "https://raw.githubusercontent.com/w3x731/survivIoAim/master/survivIoAimChromeExtension/menu.js",
			priority: 1
		},
		smokeAlphaManager: {
			url: "https://raw.githubusercontent.com/w3x731/survivIoAim/master/survivIoAimChromeExtension/smokeAlphaManager.js",
			priority: 1
		},
		zoomRadiusManager: {
			url: "https://raw.githubusercontent.com/w3x731/survivIoAim/master/survivIoAimChromeExtension/zoomRadiusManager.js",
			priority: 1
		}
	};

	var checkUpdateDelay = 60000; //msec
	var updateDelay = 60000;

	var allowCheckUpdate = true;
	var allowUpdate = true;

	var _getExtensionCodeFromChromeLocalStorage = function(callback) {
		chrome.storage.local.get(['extensionCode'], function(extensionCode) {
			extensionCode = extensionCode.extensionCode; // !!!
			callback(extensionCode);
		});
	}

	var _isVailidExtensionCodeObject = function(extensionCode) {		
		if(extensionCode == undefined) return false;

		var keys = Object.keys(fileList);

		for(var i = 0; i < keys.length; i++) {
			if(!extensionCode[keys[i]]) return false;
		}
		
		return true;
	}

	/* 
		callback(true) on succes or callback(false) on reject 
	*/
	var _tryToStoreCode = function(extensionCode, callback) {
		if(_isVailidExtensionCodeObject(extensionCode)) {
			chrome.storage.local.set({
				'extensionCode': extensionCode
			}, function() {
				console.log("Code stored");
				callback(true);
			});
		} else {
			callback(false);
		}
	}

	/* 
		callback(true) if need or callback(false)
	*/
	var isUpdateNeeded = function(callback) {
		// Limit request freq
		console.log("Is update needed...");
		if(!allowCheckUpdate) {
			console.log("Check update not allowed, return...");
			return; // !!!
		} else {
			allowCheckUpdate = false;
			setTimeout(function() {
				allowCheckUpdate = true;
			}, checkUpdateDelay);
			console.log("Check update allowed");
		}

		_getExtensionCodeFromChromeLocalStorage(function(extensionCode) {
			if(_isVailidExtensionCodeObject(extensionCode)) {
				// Check on the latest version
				console.log("Checking latest version");
				sendXhrGETRequest(versionCheckUrl, function(xhr) {
					try {
						var updates = JSON.parse(xhr.responseText);
						var currentExtensionVersion = JSON.parse(extensionCode.manifest).version;

						if(compareVersions(updates.version, currentExtensionVersion) > 0) {
							callback(true);
						} else {
							callback(false);
						}
					} catch(e) {
						console.log("Error: xhr request failed: " + e);
						callback(false);
					}
				});
			} else {
				callback(true);
			}
		});
	}

	/*
		callback()
	*/
	var updateExtension = function(callback) {
		// Limit request freq
		if(!allowUpdate) {
			return; // !!!
		} else {
			allowUpdate = false;
			setTimeout(function() {
				allowUpdate = true;
			}, updateDelay);
		}

		
		var extensionCode = {};

		sendXhrGETRequest(extensionFilesListUrl, function(xhr) {
			try {
				fileList = JSON.parse(xhr.responseText);
			} catch(e) {
				console.log("Error: extension file list not recieved.");
			}

			var fileNames = Object.keys(fileList);

			for(var i = 0; i < fileNames.length; i++) {
				sendXhrGETRequest(fileList[fileNames[i]].url, (function() {
					var index = i;
					return function(xhr) {
						extensionCode[fileNames[index]] = xhr.responseText;
						_tryToStoreCode(extensionCode, function(isStored) {
							if(isStored) {
								callback();
							}
						});
					};
				})());
			}
		});
	}

	/*
		callback(extensionCode)
	*/
	var extension = function(callback) {
		_getExtensionCodeFromChromeLocalStorage(callback);
	}

	var install = function(extensionCode) {
		// Sort keys by priority
		var sortedKeys = Object.keys(fileList).sort(function(a,b){return fileList[b].priority-fileList[a].priority})

		// Remember that only rewrite variables allowed	
		for(var i = 0; i < sortedKeys.length; i++) {
			if(fileList[sortedKeys[i]].priority < 0) continue;
			eval(extensionCode[sortedKeys[i]]);
		}

		console.log("Install");
	}

	return {
		isUpdateNeeded: isUpdateNeeded,
		updateExtension: updateExtension,
		extension: extension,
		install: install
	}
})();

extensionManager.isUpdateNeeded(function(isNeeded) {
	if(isNeeded) {
		extensionManager.updateExtension(function() {
			extensionManager.extension(function(extensionCode) {
				extensionManager.install(extensionCode);
			});
		});
	} else {
		extensionManager.extension(function(extensionCode) {
			extensionManager.install(extensionCode);
		});
	}
});