$(document).ready(function () {
	var runningApp = {};
	(function (app) {
		var Storage = getStorage();
	
		function initStorage(onloaded) {
			var storages =_.filter(Storage, function (storage) {
				return !_.isFunction(storage);
			});
			
			_.each(storages, function (storage) {
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
		
		function bindings() {
			
			// TODO
		}
		
		function navigation() {
			// TODO
			var r = Storage.Pictures.handler.enumerate();
			
			r.onsuccess = function () {
				if (this.result) {
					console.log(this.result);
					this.continue();
				}
			}
			
			r.onerror = function () {
				console.log(this.error);
			}
		}
		
		app.init = function () {
			initStorage(navigation);
		};
		
		app.init();
	})(runningApp);
});