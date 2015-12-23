var qs = require('querystring');

properties = exports;

properties.handle = function(req, res, pathInfo, contentResource) {
	if (!contentResource.isAuthorized("modify"))
	{
		res.writeHead(401, {"Content-Type": "text/plain; charset=utf-8"});
		res.write("User is not authorized to modify properties.");
		res.end();
	}
	else
	{
		//Reload properties to avoid that properties which are
		//temporary defined in the component 'prepare.js' are persisted
		contentResource.loadProperties().then(contentResource.saveProperties.bind(contentResource)).then(function() {
																											 res.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});
																											 res.write(JSON.stringify(contentResource.properties));
																											 res.end();
																										 });
	}
};
