var fs = require("fs")
var deletChildPage = exports;

deleteFolderRecursive = function(path) {
	var files = [];
	if (fs.existsSync(path))
	{
		files = fs.readdirSync(path);
		files.forEach(function(file, index) {
			var curPath = path + "/" + file;
			if (fs.lstatSync(curPath).isDirectory())
			{ // recurse
				deleteFolderRecursive(curPath);
			}
			else
			{ // delete file
				fs.unlinkSync(curPath);
			}
		});
		fs.rmdirSync(path);
	}
};

deletChildPage.handle = function(req, res, pathInfo, resource) {
	if (pathInfo.parameters.name == undefined)
	{
		res.writeHead(500, {"Content-Type": "text/plain; charset=utf-8"});
		res.write("The url-parameter 'name' is not set. This parameter defines the name of the node which shall be deleted.");
		res.end();
	}
	else
	{
		var childPages = resource.properties.childPages;
		var currentPositionChildpagePosition = childPages.indexOf(pathInfo.parameters.name);
		if (currentPositionChildpagePosition > -1)
		{
			childPages.splice(currentPositionChildpagePosition, 1);
		}
		resource.properties.childPages = childPages;
		resource.saveProperties(function() {
			deleteFolderRecursive("." + resource.path + "/" + pathInfo.parameters.name)

			res.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});
			res.end();
		});
	}

}