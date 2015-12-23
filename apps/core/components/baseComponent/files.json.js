//This script is to read all resources

resources = exports;

resources.handle = function(req, res, pathInfo, resource) {
	var includeHiddenResources = pathInfo.parameters.includeHiddenResources == "true";
	resource.getFiles(includeHiddenResources).then(function(fileList) {
		res.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});
		res.write(JSON.stringify(fileList));
		res.end();
	});
};
