var getStorage = (function () {
	function StorageInfo(allStorages, storageId, elId, uri, title) {
		this._allStorages = allStorages;
		this._storageId = storageId;
		this._isAvailable = false;
		this._handler = null;
		this._elId = elId;
		this._uri = uri;
		this._title = title;
	}
	
	Object.defineProperty(StorageInfo.prototype, 'storageId', {
		get: function () { return this._storageId; }
	});
	
	Object.defineProperty(StorageInfo.prototype, 'isAvailable', {
		get: function () { return this._isAvailable; }
	});
	
	Object.defineProperty(StorageInfo.prototype, 'handler', {
		get: function () { return this._handler; }
	});
	
	Object.defineProperty(StorageInfo.prototype, 'elId', {
		get: function () { return this._elId; }
	});
	
	Object.defineProperty(StorageInfo.prototype, 'uri', {
		get: function () { return this._uri; }
	});
	
	Object.defineProperty(StorageInfo.prototype, 'title', {
		get: function () { return this._title; }
	});
	
	StorageInfo.prototype.setDeviceHandler = function (handler, isAvailable, onloaded) {
		this._handler = handler;
		this._isAvailable = isAvailable;
		
		if (this._allStorages.isLoaded()) {
			onloaded();
		}
	};
	
	// Storage configuration
	
	return function() {
		var storages = {}
		
		storages.SDCard = new StorageInfo(storages, 'sdcard', '#sdcard-storage', '#sdcard', 'SD Card');
		storages.Pictures = new StorageInfo(storages, 'pictures', '#pictires-storage', '#pictures', 'My Pictures');
		storages.Music = new StorageInfo(storages, 'music', '#music-storage', '#music', 'My Music');
		storages.Videos = new StorageInfo(storages, 'videos', '#videos-storage', '#videos', 'My Videos');
			
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