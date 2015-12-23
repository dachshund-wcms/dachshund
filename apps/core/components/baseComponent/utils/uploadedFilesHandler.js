var Q = require('q');
var mime = require('mime');
var fs = require('fs');
var uploadedFilesHandler = exports;

uploadedFilesHandler.handle = function(form, pathInfo, contentResource, files) {
	var deferred = Q.defer();

	var filename = pathInfo.parameters.filename;
	var filenameIsPredefined = pathInfo.parameters.filename != undefined;
	var fileNameHasExtension = filenameIsPredefined && pathInfo.parameters.filename.contains(".");
	var uploadedFiles = getUploadedFiles(files);

	//Reset already fetched file list
	contentResource._resourceFiles = null;

	if (uploadedFiles.length == 0)
	{
		deferred.resolve(uploadedFiles.length);
	}
	else if (uploadedFiles.length == 1)
	{
		var file = uploadedFiles[0];

		if (filenameIsPredefined && !fileNameHasExtension)
		{
			filename += "." + mime.extension(file.type);
		}
		else if (!filenameIsPredefined)
		{
			filename = file.name
		}

		moveFile(file.path, contentResource, filename).then(function() {
			deferred.resolve(uploadedFiles.length);
		}).fail(deferred.reject);
	}
	else
	{
		var movedFiles = [];
		uploadedFiles.forEach(function(file, fileNumber) {

			var newFilenameCounted = file.name;

			if (filenameIsPredefined && !fileNameHasExtension)
			{
				newFilenameCounted = filename + "-" + fileNumber + "." + mime.extension(file.type);
			}
			else if (filenameIsPredefined)
			{
				newFilenameCounted = filename.lastSubstringBefore(".") + "-" + fileNumber + "." + filename.lastSubstringAfter(".");
			}

			movedFiles.push(moveFile(file.path, contentResource, newFilenameCounted));
		});

		Q.all(movedFiles).then(function() {
			deferred.resolve(uploadedFiles.length);
		}).fail(deferred.reject);
	}

	return deferred.promise;
};

var getUploadedFiles = function(files) {
	var fileArray = [];
	if(files instanceof Object && Object.keys(files).length > 0)
	{
		for (var file in files)
		{
			fileArray.push(files[file]);
		}
	}
	return fileArray;
};

var moveFile = function(sourcePath, resource, fileName) {
	var deferred = Q.defer();

	var sourceFile = fs.createReadStream(sourcePath);
	resource.addFile(sourceFile, fileName).then(deferred.resolve).fail(deferred.reject);

	return deferred.promise;
};