var Q = require('q');
var templateManager = require('template-manager');
prepare = exports;

prepare.handle = function(req, res, pathInfo, resource, component) {
	var deferred = Q.defer();

	templateManager.getMatchingTemplates(resource.path, function(availableTemplates) {
		resource.properties.availableTemplates = availableTemplates;
		deferred.resolve();
	});

	return deferred.promise;
}