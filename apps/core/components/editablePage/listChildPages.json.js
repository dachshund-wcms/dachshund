var templateManager = require("template-manager");
childPages = exports;

var processChildPages = function(childPages, childResources, cb) {
	var processedChildPages = [];
	childPages.forEach(function(childPage, childPageNumber, childPages) {

		var resolvedChildComponentResource = null;
		for (childResourceIndex in childResources)
		{
			var childResource = childResources[childResourceIndex];
			if (childPage == childResource.name)
			{
				resolvedChildComponentResource = childResource;
				break;
			}
		}

		if (resolvedChildComponentResource != null && resolvedChildComponentResource.properties.componentPath != "SELF")
		{
			templateManager.getMatchingTemplates(resolvedChildComponentResource.path, function(availableChildTemplates) {
				var processedChildPage = {};
				processedChildPage.name = resolvedChildComponentResource.name;
				processedChildPage.componentPath = resolvedChildComponentResource.properties.componentPath;
				processedChildPage.path = resolvedChildComponentResource.path;
				processedChildPage.title = resolvedChildComponentResource.properties.title;
				processedChildPage.label = resolvedChildComponentResource.properties.label || resolvedChildComponentResource.properties.title;
				processedChildPage.description = resolvedChildComponentResource.properties.description;
				processedChildPage.hasChildPages = resolvedChildComponentResource.properties.childPages instanceof Array && resolvedChildComponentResource.properties.childPages.length > 0;
				processedChildPage.template = resolvedChildComponentResource.properties.template;
				processedChildPage.availableChildTemplates = availableChildTemplates;
				processedChildPages.push(processedChildPage);

				if (childPageNumber == (childPages.length - 1))
				{
					cb(processedChildPages);
				}
			});
		}
		else
		{
			if (childPageNumber == (childPages.length - 1))
			{
				cb(processedChildPages);
			}
		}
	});
}

var buildPageListFromChildResources = function(childResources) {
	var pages = [];
	for (childResourceIndex in childResources)
	{
		var childResource = childResources[childResourceIndex];
		if (childResource.properties.type == "page")
		{
			pages.push(childResource.name);
		}
	}
	return pages;
}

childPages.handle = function(req, res, pathInfo, resource) {
	resource.getChildResources(function(childResources) {
		if (resource.properties.childPages == undefined)
		{
			resource.properties.childPages = buildPageListFromChildResources(childResources);
		}
		processChildPages(resource.properties.childPages, childResources, function(childPageDetails) {
			resource.properties.childPageDetails = childPageDetails;

			res.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});
			res.write(JSON.stringify(resource.properties.childPageDetails))
			res.end();
		});
	});
}
