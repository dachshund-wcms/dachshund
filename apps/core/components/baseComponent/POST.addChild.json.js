//This script is to set properties
var formidable = require('formidable');
var qs = require('querystring');
var repositoryManager = require('repository-manager');
var config = require('config');
var logger = require('dachshund-logger').getLogger(__filename);
var uploadFilesHandler = require('./utils/uploadedFilesHandler.js');
var propertyTransformer = require('./utils/propertyTransformer.js');
var Q = require('q');

properties = exports;

properties.handle = function(req, res, pathInfo, contentResource) {

	if (!contentResource.isAuthorized("create"))
	{
		res.writeHead(401, {"Content-Type": "text/plain; charset=utf-8"});
		res.write("User is not authorized to add childs.");
		res.end();
	}
	else
	{
		var form = new formidable.IncomingForm();
		form.encoding = 'utf-8';
		form.parse(req, function(err, fields, files) {
			if (err)
			{
				res.writeHead(500, {"Content-Type": "text/plain; charset=utf-8"});
				res.write("Error while uploading file:" + err);
				res.end();
			}
			else
			{
				repositoryManager.createResource(contentResource.path, fields.childName).then(function(childResource) {
					return req.session.resolve(childResource.path);
				}).then(function(childResource) {
					var deferred = Q.defer();

					delete fields["childName"];
					for(var fieldName in fields)
					{
						childResource.properties[fieldName] = fields[fieldName];
					}

					propertyTransformer.transform(fields.componentPath, childResource.properties).finally(function(){
						childResource.saveProperties().then(deferred.resolve).fail(deferred.reject);
					});

					return deferred.promise;
				}).then(function(childResource) {
					var deferred = Q.defer();
					uploadFilesHandler.handle(form, pathInfo, childResource, files).then(function(){
						deferred.resolve(childResource);
					}).fail(deferred.reject);
					return deferred.promise;
				}).then(function(childResource) {
					var resultObject = {
						properties: childResource.properties,
						name: childResource.name,
						path: childResource.path,
						depth: childResource.depth
					};

					res.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});
					res.write(JSON.stringify(resultObject));
					res.end();
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
