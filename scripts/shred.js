var getShreddingAlgorithms = (function () {
	function reportError(request, file) {
		request.onerror = function () {
			console.log(this);
			alert('Cannot remove ' + file + '.');
		};
	}
	
	var generators = {
		random: function() {
			var next = Math.floor(Math.random() * 256);
			return next;
		}
	};
	
	function createBuffer(size, generate) {
		var buffer = new ArrayBuffer(size);
		
		if (_.isFunction(generate)) {
			var view = new DataView(buffer);
			for (var i = 0; i < size; i++) {
				var next = generate();
				view.setUint8(i, next);
			}
		}
		
		return buffer;
	}
	
	function overwriteFile(parameters) {
		var parameters = $.extend({
			handler: null,
			file: null,
			contentType: null,
			onsuccess: null,
			passes: [],
			pass: 0
		}, parameters);
	
		if (!parameters.handler || 
			parameters.file == null ||
			parameters.passes.length === 0 ||
			!_.isFunction(parameters.onsuccess)) {
			return;
		}
		
		if (parameters.pass === parameters.passes.length) {
			// TODO
			onsuccess();
		}
		
		var request = parameters.handler.get(parameters.file);
		request.onsuccess = function () {
			var filesize = this.result.size,
				editRequest = parameters.handler.getEditable(parameters.file);
			
			editRequest.onsuccess = function() {
				console.log(this.result);
				var buffer = createBuffer(filesize, parameters.passes[parameters.pass]),
					blob = new Blob([buffer], { type: parameters.contentType }),
					writeRequest = parameters.handler.addNamed(blob, parameters.file);
				
				writeRequest.onsuccess = function () {
					parameters.pass++;
					overwriteFile(parameters);
				};
			
				reportError(writeRequest, parameters.file);
			};
			
			reportError(editRequest, parameters.file);
		};
		
		reportError(request, parameters.file);
	}
	
	function quickDelete(storageHandler, file, contentType, onsuccess) {
		//var passes = [null, generators.random];
		var passes = [null];
		overwriteFile({
			handler: storageHandler,
			file: file,
			contentType: contentType,
			onsuccess: onsuccess,
			passes: passes
		});
	}
	
	return function() {
		return {
			'Quick delete (2 passes)': quickDelete
		};
	}
})();