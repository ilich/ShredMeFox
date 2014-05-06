var getShreddingAlgorithms = (function () {
	function QuickDelete(storageHandler, file, onsuccess) {
		// TODO
		
		onsuccess();
	}
	
	return function() {
		return {
			'Quick delete': QuickDelete
		};
	}
})();