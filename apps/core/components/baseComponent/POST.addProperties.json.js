var qs = require('querystring');
var propertyTransformer = require('./utils/propertyTransformer.js');

properties = exports;

properties.handle = function(req, res, pathInfo, contentResource, component) {
	if (!contentResource.isAuthorized("modify"))
	{
		res.writeHead(401, {"Content-Type": "text/plain; charset=utf-8"});
		res.write("User is not authorized to add properties.");
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

			//Reload properties to avoid that properties which are 
			//temporary defined in the component 'prepare.js' are persisted
			contentResource.loadProperties();

			for (var parameterName in postParameters)
			{
				contentResource.properties[parameterName] = postParameters[parameterName];
			}

			propertyTransformer.transform(component.componentResource.path, contentResource.properties).finally(function(){
				contentResource.saveProperties(function() {
					res.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});
					res.write(JSON.stringify(contentResource.properties));
					res.end();
				});
			});
		});
	}

};
