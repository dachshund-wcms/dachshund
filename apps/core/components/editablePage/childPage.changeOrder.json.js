changeChildPageOrder = exports;

changeChildPageOrder.handle = function(req, res, pathInfo, resource) {
	if (pathInfo.parameters.node_position == undefined)
	{
		res.writeHead(500, {"Content-Type": "text/plain; charset=utf-8"});
		res.write("The url-parameter 'node_position' is not set. This parameter defines the new position of the node.");
		res.end();
	}
	else if (pathInfo.parameters.name == undefined)
	{
		res.writeHead(500, {"Content-Type": "text/plain; charset=utf-8"});
		res.write("The url-parameter 'name' is not set. This parameter defines the name of the node which shall be reordered.");
		res.end();
	}
	else
	{
		var newPositionChildPage = parseInt(pathInfo.parameters.node_position);
		var childPages = resource.properties.childPages || [];
		var currentPositionChildpagePosition = childPages.indexOf(pathInfo.parameters.name);
		if (currentPositionChildpagePosition > -1)
		{
			childPages.splice(currentPositionChildpagePosition, 1);
		}
		if (newPositionChildPage > childPages.length)
		{
			childPages.push(pathInfo.parameters.name);
		}
		else
		{
			childPages.splice(newPositionChildPage, 0, pathInfo.parameters.name);
		}
		resource.properties.childPages = childPages;
		resource.saveProperties(function() {
			res.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});
			res.end();
		});
	}
}
