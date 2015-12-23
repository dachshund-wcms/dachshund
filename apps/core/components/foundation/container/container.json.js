container = exports;


container.handle = function(req, res, pathInfo, resource) {
	res.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});
	res.write(JSON.stringify(resource.properties.extendedComponents))
	res.end();
}
