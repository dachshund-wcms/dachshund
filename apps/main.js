'use strict';

require('string-utils');
const config = require('config');
const http = require('http');
const RequestPathInfo = require('request-pathinfo');
const logger = require('dachshund-logger').getLogger(__filename);
const userSessionManager = require('user-session-manager');
const authenticationHandler = require(config.get('user.session.authenticationHandlerModule'));
const RepositorySession = require('repository-session');
const fileScriptHandler = require("file-script-handler");
const ResourceTypes = require('resource-types');
const nodeStatic = require('node-static');
const dispatcher = require('component-handler');
const i18n = require("i18n");
const appsInitializer = require('apps-initializer');

const fileNodeStatic = new nodeStatic.Server({cache: false});

i18n.configure(config.get("i18n"));

var server = http.createServer(function(req, res) {
	i18n.init(req, res);
	try
	{
		userSessionManager.lookupSession(req).then(function(userSession) {
			req.pathInfo = new RequestPathInfo(req);
			req.session = new RepositorySession(userSession);
			req.userSession = userSession;

			authenticationHandler.checkAndAuthenticateUser(req, res).then(function(proceedRequest) {

				if (proceedRequest == true)
				{
					req.session.resolve(req.pathInfo).then(function(resource) {

						req.attributes = {};

						if (resource.type == ResourceTypes.RESOURCE)
						{
							logger.debug(resource.path + " - dispatch request");

							dispatcher.dispatchRequest(req, res, req.pathInfo, resource);
						}
						else if (resource.type == ResourceTypes.FILE)
						{
							logger.debug(resource.path + " - serve static resource");

							if (resource.source != undefined)
							{
								var mimetype = mime.lookup(req.pathInfo.extension);
								fileNodeStatic.serveFile("." + resource.source, 200, {"content-type": mimetype}, req, res);
							}
							else
							{
								req.url = resource.path.replaceAll(" ", "%20");
								fileNodeStatic.serve(req, res);
							}
						}
						else if (fileScriptHandler.getScriptHandler(req.pathInfo) != null)
						{
							var scriptHandler = fileScriptHandler.getScriptHandler(req.pathInfo);
							scriptHandler.handle(req, res, req.pathInfo);
						}
						else
						{
							logger.warn("no resource found at: " + req.pathInfo.completePath);

							res.writeHead(404, {"Content-Type": "text/plain; charset=utf-8"});
							res.write("404 Resource Not Found\n");
							res.end();
						}
					}).fail(function(error){
						logger.error("Error while authenticating user ["+ error.toString() +"]");

						res.writeHead(401, {"Content-Type": "text/plain; charset=utf-8"});
						res.write("401 Unauthorized\n");
						res.end();
					});
				}
				else if (proceedRequest == false)
				{
					res.writeHead(401, {"Content-Type": "text/plain; charset=utf-8"});
					res.write("401 Unauthorized\n");
					res.end();
				}
			}).fail(function(error){
				logger.error("Error while authenticating user ["+ error.toString() +"]");

				res.writeHead(401, {"Content-Type": "text/plain; charset=utf-8"});
				res.write("401 Unauthorized\n");
				res.end();
			});
		});
	} catch (err)
	{
		res.writeHead(500, {"Content-Type": "text/plain; charset=utf-8"});
		res.write(JSON.stringify("Error while proccessing request >> " + err));
		res.end();
		logger.error("Error while proccessing request >> " + err);
	}
});

appsInitializer.init();

const dachshundWebServerPort = config.get("server.port");
server.listen(dachshundWebServerPort);
logger.info("Started Server on http://127.0.0.1:" + dachshundWebServerPort);