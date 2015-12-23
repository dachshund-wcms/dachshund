'use strict';

const userManager = require("user-manager");
const logger = require('dachshund-logger').getLogger(__filename);
const USER_HOME_PATH = "/home/users";

const authenticate = exports;

let sendResponse = function(res, message) {
	res.writeHead(200, {"Content-Type": "text/plain; charset=utf-8"});
	res.write(message);
	res.end();
};

authenticate.handle = function(req, res, pathInfo, resource) {
	req.session.resolve(USER_HOME_PATH).function(function(usersHome) {
		if (req.userSession.isAnonymous)
		{
			res.writeHead(401, {"Content-Type": "text/plain; charset=utf-8"});
			res.write("You have to authenticate before you can create an user.");
			res.end();
		}
		else if (usersHome.type = resourceResolver.resourceTypes.RESOURCE && !usersHome.isAuthorized("create"))
		{
			res.writeHead(401, {"Content-Type": "text/plain; charset=utf-8"});
			res.write("You're not authorized to create an user.");
			res.end();
		}
		else if (pathInfo.parameters.username == undefined || pathInfo.parameters.password == undefined)
		{
			res.writeHead(500, {"Content-Type": "text/plain; charset=utf-8"});
			res.write("The parameters 'username' or 'password' is not set within the request.");
			res.end();
		}
		else
		{
			userManager.load(pathInfo.parameters.username, function(userResource) {
				if (userResource == null)
				{
					userManager.createUser(pathInfo.parameters.username, pathInfo.parameters.password).then(function(userResource) {
						if (pathInfo.parameters.name != undefined)
						{
							userResource.properties.name = pathInfo.parameters.name;
							userResource.saveProperties(function() {
								sendResponse(res, "User created");
							});
						}
						else
						{
							sendResponse(res, "User created");
						}
					});
				}
				else
				{
					userManager.changePassword(pathInfo.parameters.username, pathInfo.parameters.password, function() {
						if (pathInfo.parameters.name != undefined)
						{
							userResource.properties.name = pathInfo.parameters.name;
							userResource.saveProperties(function() {
								sendResponse(res, "User modified");
							});
						}
						else
						{
							sendResponse(res, "User modified");
						}
					});
				}
			});
		}
	}).fail(function(err){
		logger.error("Error while resolving user home '"+ USER_HOME_PATH +"' because of: " + err.toString());

		res.writeHead(500, {"Content-Type": "text/plain; charset=utf-8"});
		res.write("Error while creating user.");
		res.end();
	});
};