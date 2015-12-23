'use strict';

const Q = require('q');
const prepare = exports;
const repositoryManager = require("repository-manager");
const logger = require('dachshund-logger').getLogger(__filename);

let processComponents = function(components, childResources, callback) {
	let processedComponents = [];
	components.forEach(function(component, componentIndex, components) {
		let resolvedChildResource = null;
		for (let childResourceIndex in childResources)
		{
			let childResource = childResources[childResourceIndex];
			if (component == childResource.name)
			{
				resolvedChildResource = childResource;
				break;
			}
		}

		if (resolvedChildResource != null && resolvedChildResource.properties.componentPath != "SELF")
		{
			repositoryManager.resolve(resolvedChildResource.properties.componentPath).then(function(componentResource) {

				let processedComponent = {};
				processedComponent.name = resolvedChildResource.name;
				processedComponent.componentPath = resolvedChildResource.properties.componentPath;
				processedComponent.path = resolvedChildResource.path;
				processedComponent.title = componentResource.properties.title;
				processedComponent.description = componentResource.properties.description;
				processedComponents.push(processedComponent);

				if (componentIndex == components.length - 1)
				{
					callback(processedComponents);
				}
			}).fail(function(err){
				logger.error("Error while resolving '"+ resolvedChildResource.properties.componentPath +"' beacause of: " + err.message);

				if (componentIndex == components.length - 1)
				{
					callback(processedComponents);
				}
			});
		}
		else
		{
			if (componentIndex == components.length - 1)
			{
				callback(processedComponents);
			}
		}
	});

	if (components.length == 0)
	{
		callback(processedComponents);
	}
};

let buildComponentListFromChildResources = function(childResources) {
	let components = [];
	childResources.forEach(function(childResource, childResourceIndex, childResources) {
		components.push(childResource.name);
	});
	return components;
};

prepare.handle = function(req, res, pathInfo, resource, component, callback) {
	let deferred = Q.defer();

	resource.getChildResources(function(childResources) {
		if (resource.properties.components == undefined)
		{
			resource.properties.components = buildComponentListFromChildResources(childResources);
		}
		resource.properties.requestIsForInnerContent = req.pathInfo.selector != null && req.pathInfo.selector.startsWith("innerContent");
		processComponents(resource.properties.components, childResources, function(processedComponents) {
			resource.properties.extendedComponents = processedComponents;
			deferred.resolve();
		});
	});

	return deferred.promise;
};