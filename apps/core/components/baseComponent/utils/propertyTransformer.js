"use strict";

const stringUtils = require('string-utils');
const repositoryManager = require('repository-manager');
const propertyTransformer = exports;
const logger = require('dachshund-logger').getLogger(__filename);
const resourcePropertyTransformerName = "propertyTransformer.js";
const Q = require('q');

propertyTransformer.transform = function(componentPath, properties) {
	var deferred = Q.defer();

	if(stringUtils.isEmpty(componentPath))
	{
		deferred.reject(new Error("Parameter [componentPath] is not set or empty"));
	}
	else
	{
		repositoryManager.resolve(componentPath).then(function(resource) {
			return resource.loadScript(resourcePropertyTransformerName);
		}).then(function(propertyTransformerFromResource) {
			var deferred = Q.defer();

			if (propertyTransformerFromResource.transform instanceof Function)
			{
				Q(propertyTransformerFromResource.transform(properties)).then(deferred.resolve).fail(deferred.reject);
			}
			else
			{
				var message = "The resource [" + componentPath + "] has a script [" + resourcePropertyTransformerName + "] which has no [transform] method.";
				logger.warn(message);
				deferred.reject(new Error(message));
			}

			return deferred.promise;
		}).then(deferred.resolve).fail(deferred.reject);
	}

	return deferred.promise;
};