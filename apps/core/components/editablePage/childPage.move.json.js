var Q = require('q');
var mv = require('mv');
var repositoryManager = require("repository-manager");
moveChildPage = exports;

moveChildPage.handle = function(req, res, pathInfo, resource) {
	if (pathInfo.parameters.node_position == undefined)
	{
		res.writeHead(500, {"Content-Type": "text/plain; charset=utf-8"});
		res.write("The url-parameter 'node_position' is not set. This parameter defines the new position of the node.");
		res.end();
	}
	else if (pathInfo.parameters.name == undefined)
	{
		res.writeHead(500, {"Content-Type": "text/plain; charset=utf-8"});
		res.write("The url-parameter 'name' is not set. This parameter defines the name of the node which shall be moved.");
		res.end();
	}
	else if (pathInfo.parameters.destinationPath == undefined)
	{
		res.writeHead(500, {"Content-Type": "text/plain; charset=utf-8"});
		res.write("The url-parameter 'destinationPath' is not set. This parameter defines the name of the node which shall be reordered.");
		res.end();
	}
	else
	{
		mv('.' + resource.path + "/" + pathInfo.parameters.name, '.' + pathInfo.parameters.destinationPath + "/" + pathInfo.parameters.name, {mkdirp: true}, function(err) {
			if (err)
			{
				res.writeHead(500, {"Content-Type": "text/plain; charset=utf-8"});
				res.write("Error while moving page to new place: " + err.message);
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
				resource.saveProperties().then(Q(pathInfo)).then(repositoryManager.resolve).then(function(destinationPathResource) {
																									 var newPositionChildPage = parseInt(pathInfo.parameters.node_position);

																									 var destinationChildPages = destinationPathResource.properties.childPages || [];
																									 if (newPositionChildPage > destinationChildPages.length)
																									 {
																										 destinationChildPages.push(pathInfo.parameters.name);
																									 }
																									 else
																									 {
																										 destinationChildPages.splice(newPositionChildPage, 0, pathInfo.parameters.name);
																									 }
																									 destinationPathResource.properties.childPages = destinationChildPages;
																									 destinationPathResource.saveProperties();

																									 res.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});
																									 res.end();

																								 });
			}
		});
	}
}