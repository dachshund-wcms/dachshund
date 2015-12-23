var templateManager = require("template-manager");
var availableTemplates = exports;

availableTemplates.handle = function(req, res, pathInfo, resource) {
	templateManager.getMatchingTemplates(resource.path, function(availableTemplates) {
		res.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});
		res.write(JSON.stringify(availableTemplates));
		res.end();
	});
}