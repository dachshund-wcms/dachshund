//This script is to delete a resource within the node 

var deleteFile = exports;
deleteFile.handle = function(req, res, pathInfo, resource) {

	const filename = pathInfo.parameters.name || pathInfo.parameters.filename;
	if (filename == undefined)
	{
		res.writeHead(500, {"Content-Type": "text/plain; charset=utf-8"});
		res.write("The url-parameter [name] is not set. This parameter defines the filename within the selected resource.");
		res.end();
	}
	else if (!resource.isAuthorized("delete"))
	{
		res.writeHead(401, {"Content-Type": "text/plain; charset=utf-8"});
		res.write("User is not authorized to delete here files and resources.");
		res.end();
	}
	else
	{
		resource.fileExists(filename).then(function() {
			return resource.deleteFile(filename);
		}).then(function() {
			return resource.getFiles(true);
		}).then(function(fileList){
			res.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});
			res.write(JSON.stringify(fileList));
			res.end();
		}).fail(function() {
			res.writeHead(500, {"Content-Type": "text/plain; charset=utf-8"});
			res.write("The resource [" + filename + "] does not exists within [" + resource.path + "]");
			res.end();
		});
	}
};
