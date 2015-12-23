var Q = require('q');
var repositoryIndex = require('repository-index');

exports.handle = function(req, res, pathInfo, resource) {
	var deferred = Q.defer();
	repositoryIndex.addToIndex(resource).then(deferred.resolve).fail(deferred.reject);
	return deferred.promise;
};