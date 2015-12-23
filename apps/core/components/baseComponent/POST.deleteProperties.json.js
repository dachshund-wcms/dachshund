//This script is to delete properties

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
		var body = '';
		req.on('data', function(data) {
			body = body + data;
		});
		req.on('end', function() {

			var postParameters = qs.parse(body);

			for (attrname in postParameters)
			{
				delete contentResource.properties[attrname];
			}

			contentResource.saveProperties(function() {
				res.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});
				res.write(JSON.stringify(contentResource.properties));
				res.end();
			});
		});
	}
}
