var Q = require('q');
var repositoryIndexCouchdb = require('repository-index-couchdb');
require('string-utils');

var indexDocuments = function(req, res, resource, documentId) {
	var deferred = Q.defer();

	repositoryIndexCouchdb.checkDatabaseStatus(resource, 20, documentId).then(function(documentsIndexed) {

		if (req.closed == true || documentsIndexed.length <= 1)
		{
			res.end();
			deferred.resolve();
		}
		else if (documentsIndexed.length > 1)
		{
			documentsIndexed.forEach(function(document){
				res.write(document);
				res.write("[");
				res.write((++res.numberOfCheckedDocuments).toString());
				res.write("]\n");
			});
			var lastDocumentId = documentsIndexed[documentsIndexed.length - 1].lastSubstringAfter("/");
			return indexDocuments(req, res, resource, lastDocumentId);
		}

	}).fail(deferred.reject);

	return deferred.promise;
};

exports.handle = function(req, res, pathInfo, resource) {
	res.writeHead(200, {"Content-Type": "text/plain; charset=utf-8"});

	res.numberOfCheckedDocuments = 0;

	req.on("close", function() {
		req.closed = true;
	});

	return indexDocuments(req, res, resource);
};