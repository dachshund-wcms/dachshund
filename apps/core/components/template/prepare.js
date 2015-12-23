var Q = require('q');
var prepare = exports;

prepare.handle = function(req, res, pathInfo, resource, component) {
	var deferred = Q.defer();

	resource.properties.contentPath = resource.path + "/content";

	resource.getFiles(function(fileList) {
		fileList.forEach(function(file) {
			if (file.startsWith("thumb"))
			{
				resource.properties.thumb = resource.path + "/" + file;
			}
		});
		deferred.resolve();
	});

	return deferred.promise;
};