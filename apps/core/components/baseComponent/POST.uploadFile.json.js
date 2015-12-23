require("string-utils");
var Q = require('q');
var formidable = require('formidable');
var logger = require('dachshund-logger').getLogger(__filename);
var uploadFilesHandler = require('./utils/uploadedFilesHandler.js');
var uploadFiles = exports;

uploadFiles.handle = function(req, res, pathInfo, contentResource) {
	if (!contentResource.isAuthorized("create"))
	{
		res.writeHead(401, {"Content-Type": "text/plain; charset=utf-8"});
		res.write("User is not authorized to upload files.");
		res.end();
	}
	else
	{
		var form = new formidable.IncomingForm();
		form.parse(req, function(err, fields, files) {
			if (err)
			{
				res.writeHead(500, {"Content-Type": "text/plain; charset=utf-8"});
				res.write("Error while uploading file:" + err.toString());
				res.end();
			}
			else
			{
				uploadFilesHandler.handle(form, pathInfo, contentResource, files).then(function() {
					contentResource.getFiles(true).then(function(fileList) {
						res.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});
						res.write(JSON.stringify(fileList));
						res.end();
					});
				}).fail(function(error) {
					logger.error(error.toString());

					res.writeHead(err.id || 500, {"Content-Type": "text/plain; charset=utf-8"});
					res.write("Error while uploading file: " + error.toString());
					res.end();
				});
			}
		});
	}
};
