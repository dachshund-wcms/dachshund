//This component is to redirect to another page

redirect = exports;

redirect.handle = function(req, res, pathInfo, resource) {

	res.writeHead(302, {'Location': resource.properties.redirectTo});
	res.end();

}
