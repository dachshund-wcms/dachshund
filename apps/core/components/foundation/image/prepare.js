var Q = require('q');
var md = require('node-markdown').Markdown;
var imageUtils = require('image-utils');
var stringUtils = require('string-utils');

var prepare = exports;

prepare.handle = function(req, res, pathInfo, resource, component) {
	var deferred = Q.defer();

	resource.getFiles(function(files) {
		if (files.length > 0)
		{
			var filepath = files[0];
			if (resource.properties.size == "min" && !stringUtils.isEmpty(resource.properties.width) && !stringUtils.isEmpty(resource.properties.height))
			{
				filepath = imageUtils.resizeImageMin(filepath, resource.properties.width, resource.properties.height);
			}
			if (resource.properties.size == "max" && !stringUtils.isEmpty(resource.properties.width) && !stringUtils.isEmpty(resource.properties.height))
			{
				filepath = imageUtils.resizeImageMax(filepath, resource.properties.width, resource.properties.height);
			}
			resource.properties.imagepath = filepath;
			deferred.resolve();
		}
		else
		{
			deferred.resolve();
		}
	});

	return deferred.promise;
};