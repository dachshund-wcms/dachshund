//This script is to set properties
var propertyTransformer = require('./utils/propertyTransformer.js');
var qs = require('querystring');
var formidable = require('formidable');
var uploadFilesHandler = require('./utils/uploadedFilesHandler.js');
const Q = require('q');

properties = exports;

var isJsonObject = function(postParameter) {
	postParameter = postParameter.fulltrim();

	var isJsonObject = false;

	isJsonObject |= postParameter.startsWith("{") && postParameter.endsWith("}");
	isJsonObject |= postParameter.startsWith("[") && postParameter.endsWith("]");

	return isJsonObject;
};

var deleteAllFilesHandler = function(contentResource, resetFilesFlag) {
	var deferred = Q.defer();

	if (resetFilesFlag == "true")
	{
		var includingHiddenFiles = true;
		contentResource.deleteAllFiles(includingHiddenFiles).then(function(){
			deferred.resolve(contentResource);
		}).fail(deferred.reject);
	}
	else
	{
		deferred.resolve(contentResource);
	}

	return deferred.promise;
};

properties.handle = function(req, res, pathInfo, contentResource, component) {

	if (!contentResource.isAuthorized("modify"))
	{
		res.writeHead(401, {"Content-Type": "text/plain; charset=utf-8"});
		res.write("User is not authorized to modify properties.");
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
				//Load the properties and reset changes which were made within a prepare script
				contentResource.loadProperties();


				for (var fieldIndex in fields)
				{
					var fieldValue = fields[fieldIndex];
					if (isJsonObject(fieldValue))
					{
						fieldValue = JSON.parse(fieldValue);
					}
					contentResource.properties[fieldIndex] = fieldValue;
				}

				propertyTransformer.transform(component.componentResource.path, contentResource.properties).then(function(){
					return contentResource.saveProperties();
				}).then(function(){
				    return deleteAllFilesHandler(contentResource, pathInfo.parameters["resetFiles"]);
				}).then(function(){
					return uploadFilesHandler.handle(form, pathInfo, contentResource, files);
				}).then(function(){
					res.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});
					res.write(JSON.stringify(contentResource.properties));
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
