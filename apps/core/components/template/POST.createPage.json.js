'use strict';

const repositoryManager = require('repository-manager');
const resourceTypes = require('resource-types');
const qs = require('querystring');
const ncp = require('ncp').ncp;
const XRegExp = require('xregexp').XRegExp;
const logger = require('dachshund-logger').getLogger(__filename);

const regexEverythingExceptingLettersAndNumbers = XRegExp('[^-\\p{L}1-9]', 'g');

const createPage = exports;

let isJsonObject = function(postParameter) {
	postParameter = postParameter.fulltrim();

	let isJsonObject = false;

	isJsonObject |= postParameter.startsWith("{") && postParameter.endsWith("}");
	isJsonObject |= postParameter.startsWith("[") && postParameter.endsWith("]");

	return isJsonObject;
};

let resourceNameFromTitle = function(title) {
	title = title.toLowerCase();

	//Replace most special characters by with hyphen
	title = title.replace(/[~&\/\\#:;*+\., ]/g, "-");

	//Remove all characters which are not in the alphabet or a hyphen
	title = XRegExp.replace(title, regexEverythingExceptingLettersAndNumbers, '');

	//Remove multiple hyphens and set only one hyphen
	title = title.replace(/-+/g, "-");

	//Remove hyphen at the beginning an at the end
	title = title.replace(/^-|-$/g, "")

	return title;
};

let lookupUnusedResourceName = function(baseResource, newPageResourceName) {
	if (baseResource.properties.childPages == undefined)
	{
		return newPageResourceName;
	}

	let resultNewPageResourceName = newPageResourceName;
	let newPageNumberCounter = 1;
	let collisionFound = false;
	while (!collisionFound)
	{
		for (let childPageIndex in baseResource.properties.childPages)
		{
			let childPage = baseResource.properties.childPages[childPageIndex];
			if (childPage == resultNewPageResourceName)
			{
				collisionFound = true;
				break;
			}
		}

		if (collisionFound)
		{
			resultNewPageResourceName = newPageResourceName + "-" + newPageNumberCounter;
			newPageNumberCounter++;
			collisionFound = false;
		}
		else
		{
			break;
		}
	}

	return resultNewPageResourceName;
};

let createNewPage = function(req, res, pathInfo, templateResource, postParameters) {
	let basePath = postParameters.basePath;
	delete postParameters["postParameters"];
	repositoryManager.resolve(basePath).then(function(baseResource) {
		if (baseResource.type == resourceTypes.NOT_FOUND)
		{
			res.writeHead(500, {"Content-Type": "text/plain; charset=utf-8"});
			res.write("The give base path '" + basePath + "' is not a resource.");
			res.end();
		}
		else
		{
			let newPageResourceName = resourceNameFromTitle(postParameters.title);
			newPageResourceName = lookupUnusedResourceName(baseResource, newPageResourceName);
			let newPageResourcePath = basePath + "/" + newPageResourceName;

			repositoryManager.createResource(newPageResourcePath, function(newPageResource) {
				ncp("." + templateResource.path + "/content", "." + newPageResource.path, function(err) {
					if (err)
					{
						res.writeHead(500, {"Content-Type": "text/plain; charset=utf-8"});
						res.write("Error while copying the template towards the destination.");
						res.end();

					}
					else
					{
						newPageResource.loadProperties();
						for (let postParameterIndex in postParameters)
						{
							let postParameter = postParameters[postParameterIndex];
							if (isJsonObject(postParameter))
							{
								postParameter = JSON.parse(postParameter);
							}
							newPageResource.properties[postParameterIndex] = postParameter;
						}
						newPageResource.properties.template = templateResource.path;
						newPageResource.saveProperties(function() {
							let childPages = [];
							if (baseResource.properties.childPages != undefined)
							{
								childPages = baseResource.properties.childPages;
							}
							childPages.push(newPageResourceName);
							baseResource.properties.childPages = childPages;
							baseResource.saveProperties();

							res.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});
							res.write(JSON.stringify({"newPageName": newPageResourceName, "newPagePath": newPageResourcePath}));
							res.end();
						});
					}
				});
			});
		}
	}).fail(function(err){
		logger.error("Error while resolving resource '"+ basePath +"' beacause of: " + err.toString());

		res.writeHead(500, {"Content-Type": "application/json; charset=utf-8"});
		res.write("Error while creating page.");
		res.end();
	});
};

createPage.handle = function(req, res, pathInfo, templateResource) {
	let body = '';
	req.on('data', function(data) {
		body = body + data;
	});
	req.on('end', function() {

		let postParameters = qs.parse(body);

		if (postParameters.basePath == undefined)
		{
			res.writeHead(500, {"Content-Type": "text/plain; charset=utf-8"});
			res.write("The post parameter 'basePath' isn't defined.");
			res.end();
		}
		else
		{
			createNewPage(req, res, pathInfo, templateResource, postParameters);
		}
	});
};
