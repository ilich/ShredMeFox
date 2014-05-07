var getStorage = (function () {
	function StorageInfo(allStorages, parameters) {
		this._parameters = $.extend({
			isAvailable: false, 
			handler: null
		}, parameters);
		
		this._allStorages = allStorages;
	}
	
	Object.defineProperty(StorageInfo.prototype, 'storageId', {
		get: function () { return this._parameters.storageId; }
	});
	
	Object.defineProperty(StorageInfo.prototype, 'isAvailable', {
		get: function () { return this._parameters.isAvailable; }
	});
	
	Object.defineProperty(StorageInfo.prototype, 'handler', {
		get: function () { return this._parameters.handler; }
	});
	
	Object.defineProperty(StorageInfo.prototype, 'elId', {
		get: function () { return this._parameters.elId; }
	});
	
	Object.defineProperty(StorageInfo.prototype, 'uri', {
		get: function () { return this._parameters.uri; }
	});
	
	Object.defineProperty(StorageInfo.prototype, 'title', {
		get: function () { return this._parameters.title; }
	});
	
	Object.defineProperty(StorageInfo.prototype, 'contentType', {
		get: function () { return this._parameters.contentType; }
	});
	
	StorageInfo.prototype.setDeviceHandler = function (handler, isAvailable, onloaded) {
		this._parameters.handler = handler;
		this._parameters.isAvailable = isAvailable;
		
		if (this._allStorages.isLoaded()) {
			onloaded();
		}
	};
	
	// Storage configuration
	
	return function() {
		var storages = {}
		
		storages.SDCard = new StorageInfo(storages, {
			storageId: 'sdcard', 
			elId: '#sdcard-storage', 
			uri: '#sdcard', 
			title: 'SD Card',
			contentType: 'application/octet-stream'
		});
		
		storages.Pictures = new StorageInfo(storages, {
			storageId: 'pictures', 
			elId: '#pictires-storage', 
			uri: '#pictures', 
			title: 'My Pictures',
			contentType: 'image/jpeg'
		});
		
		storages.Music = new StorageInfo(storages, {
			storageId: 'music', 
			elId: '#music-storage', 
			uri: '#music', 
			title: 'My Music',
			contentType: 'audio/mpeg'
		});
		
		storages.Videos = new StorageInfo(storages, {
			storageId: 'videos', 
			elId: '#videos-storage', 
			uri: '#videos', 
			title: 'My Videos',
			contentType: 'video/mpeg'
		});
			
		storages.isLoaded = function () {
				return this.SDCard.handler !== null &&
						this.Pictures.handler !== null &&
						this.Music.handler !== null &&
						this.Videos.handler !== null;
			};
			
		storages.getDeviceStorages = function () {
			var deviceStorages = _.filter(this, function (storage) {
				return !_.isFunction(storage);
			});
			
			return deviceStorages;
		};
		
		storages.findStorageByUri = function (uri) {
			var storage = _.find(this, function (storage) {
				return !_.isFunction(storage) && storage.uri === uri;
			});
			
			return storage;
		};
		
		return storages;
	}
})();