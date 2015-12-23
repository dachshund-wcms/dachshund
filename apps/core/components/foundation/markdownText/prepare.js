var md = require("node-markdown").Markdown;

prepare = exports;

prepare.handle = function(req, res, pathInfo, resource, component) {
	if (resource.properties.markdownText != undefined)
	{
		resource.properties.htmlContent = md(resource.properties.markdownText);
	}
}