$(document).on('pageinit', '#storage-selector-page', function () {
	var Storage = getStorage(),
		$folderName = $('#folder-name'),
		$files = $('#files');

	function initStorage(onloaded) {
		_.each(Storage.getDeviceStorages(), function (storage) {
			var	handler = navigator.getDeviceStorage(storage.storageId),
				request = handler.available();
			
			request.onsuccess = function () {
				var isAvailable = isAvailable = this.result === 'available';
				storage.setDeviceHandler(handler, isAvailable, onloaded);
			};
			
			request.onerror = function () {
				storage.setDeviceHandler(handler, false, onloaded);
			};
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
		$('#storage a').on('click', function (e) {
			e.preventDefault();
			
			var storage = $(this).attr('href');
			$(":mobile-pagecontainer").pagecontainer('change', '#storage-page', {storage: storage});
		});
	}
	
	function navigation() {
		$(document).on('pagebeforechange', function (e, data) {
			if (data.toPage[0].id != 'storage-page') {
				return;
			}
			
			setupStoragePage(data.options.storage);
		});
	}
	
	function setupStoragePage(storageUri) {
		var fileTemplate = '<li data-icon="delete"><a href="#{{NAME}}" class="file">{{NAME}}</a></li>',
			storage = Storage.findStorageByUri(storageUri);
			
		if (!storage) {
			alert('Cannot open ' + storageUri + '. Please check application permissions and install the latest version.');
			$(":mobile-pagecontainer").pagecontainer('change', '#storage-selector-page');
			return;
		}
		
		$folderName.text(storage.title);
		
		var request = storage.handler.enumerate();
		var listHtml = [];
		request.onsuccess = function () {
			if (this.result) {
				var html = fileTemplate.replace(/{{NAME}}/ig, this.result.name);
				listHtml.push(html);
				this.continue();
			} else {
				var strHtml = listHtml.join('');
				$files.html(strHtml).listview('refresh');
			}
		};
	}
	
	function init() {
		navigation();
		bindings();
		initStorage(setupMainPage);
	};
	
	init();
});