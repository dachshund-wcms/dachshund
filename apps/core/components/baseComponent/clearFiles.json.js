//This script is to remove all resources
var Q = require('q');
require('q-utils');
resources = exports;

resources.handle = function(req, res, pathInfo, resource) {

	if (!resource.isAuthorized("delete"))
	{
		res.writeHead(401, {"Content-Type": "text/plain; charset=utf-8"});
		res.write("User is not authorized to delete here files and resources.");
		res.end();
	}
	else
	{
		var includeHiddenFiles = pathInfo.parameters.includeHiddenFiles == "true";
		var resultObject = {
			numberOfDeletedFiles: 0,
			deletedFiles: []
		};

		resource.getFiles(includeHiddenFiles).then(function(filenames) {

			return Q.sequenceArray(filenames, function(filename) {
				var deleteFilePromise = resource.deleteFile(filename);
				resultObject.deletedFiles.push(filename);
				resultObject.numberOfDeletedFiles++;
				return deleteFilePromise;
			});

		}).then(function() {
			res.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});
			res.write(JSON.stringify(resultObject));
			res.end();
		}).fail(function(err) {
			res.writeHead(500, {"Content-Type": "text/plain; charset=utf-8"});
			res.write("Error while deleting files from resource [" + resource.path + "]:" + JSON.stringify(err));
			res.end();
		});
	}
};
