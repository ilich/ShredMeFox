$(document).ready(function () {
	var Storage = getStorage();

	function initStorage(onloaded) {
		_.each(Storage.getDeviceStorages(), function (storage) {
			var	handler = navigator.getDeviceStorage(storage.storageId),
				request = handler.available();
			
			request.onsuccess = (function (s, h) {
				var tempStorage = s,
					tempHandler = h;
				
				return function () {
					var isAvailable = isAvailable = this.result === 'available';
					tempStorage.setDeviceHandler(tempHandler, isAvailable, onloaded);
				};
			})(storage, handler);
			
			request.onerror = (function (s, h) {
				var tempStorage = s,
					tempHandler = h;
				
				return function () {
					tempStorage.setDeviceHandler(tempHandler, false, onloaded);
				};
			})(storage, handler);
		});
	}
	
	function setupMainPage() {
		var hasPermissions = false;
		_.each(Storage.getDeviceStorages(), function (storage) {
			if (storage.isAvailable) {
				$(storage.elId).show();
				hasPermissions = true;
			}
		});
		
		if (hasPermissions) {
			$('#storage').show();
		} else {
			$('#file-system-error').show();
		}
	}
	
	function bindings() {
		
	}
	
	function navigation() {
		
	}
	
	function init() {
		navigation();
		bindings();
		initStorage(setupMainPage);
	};
	
	init();
});