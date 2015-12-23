'use strict';

//This script is to set properties
const repositoryManager = require('repository-manager');
const fs = require('fs');
require('fs-utils');
const qs = require('querystring');
const path = require('path');
const resourceTypes = require('resource-types');
const logger = require('dachshund-logger').getLogger(__filename);


const properties = exports;

properties.handle = function(req, res, pathInfo, contentResource) {

	let body = '';
	req.on('data', function(data) {
		body = body + data;
	});
	req.on('end', function() {
		let postParameters = qs.parse(body);

		if (postParameters.childName == undefined)
		{
			res.writeHead(500, {"Content-Type": "text/plain; charset=utf-8"});
			res.write("The parameter 'childName' is not set. It defines the name of the new childnode");
			res.end();
		}
		else
		{
			let childResourcePath = contentResource.path + "/" + postParameters.childName;

			req.session.resolve(childResourcePath).then(function(childResource) {
				if (childResource.type == resourceTypes.NOT_FOUND)
				{
					res.writeHead(404, {"Content-Type": "text/plain; charset=utf-8"});
					res.write("The the childnode '" + postParameters.childName + "' does not exists at '" + contentResource.path + "'.");
					res.end();
				}
				else if (!childResource.isAuthorized("delete"))
				{
					res.writeHead(401, {"Content-Type": "text/plain; charset=utf-8"});
					res.write("Not allowed to delete childnode '" + postParameters.childName + "'.");
					res.end();
				}
				else
				{
					fs.removeRecursive("." + childResourcePath, function() {
						res.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});
						res.write(JSON.stringify({deletedChild: postParameters.childName}));
						res.end();
					});
				}
			}).fail(function(err) {
				logger.error("Error while deleting childnode '" + postParameters.childName + "' beacause of:" + err.toString());

				res.writeHead(500, {"Content-Type": "text/plain; charset=utf-8"});
				res.write("Error while deleting childnode '" + postParameters.childName + "'.");
				res.end();
			});
		}

	});
};
