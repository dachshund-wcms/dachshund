var templateManager = require("template-manager");
var aboutPage = exports;

aboutPage.handle = function(req, res, pathInfo, resource) {
	templateManager.getMatchingTemplates(resource.path, function(availableChildTemplates) {
		var aboutPage = {};
		aboutPage.name = resource.name;
		aboutPage.componentPath = resource.properties.componentPath;
		aboutPage.path = resource.path;
		aboutPage.title = resource.properties.title;
		aboutPage.label = resource.properties.label || resource.properties.title;
		aboutPage.description = resource.properties.description;
		aboutPage.hasChildPages = resource.properties.childPages instanceof Array && resource.properties.childPages.length > 0;
		aboutPage.childPages = resource.properties.childPages || [];
		aboutPage.template = resource.properties.template;
		aboutPage.availableChildTemplates = availableChildTemplates;


		res.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});
		res.write(JSON.stringify(aboutPage));
		res.end();
	});
};