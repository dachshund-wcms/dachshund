'use strict';

require('string-utils');
const config = require('config');
const http = require('http');
const RequestPathInfo = require('request-pathinfo');
const logger = require('dachshund-logger').getLogger(__filename);
const userSessionManager = require('user-session-manager');
const authenticationHandler = require(config.get('user.session.authenticationHandlerModule'));
const RepositorySession = require('repository-session');
const fileScriptHandler = require('file-script-handler');
const ResourceTypes = require('resource-types');
const nodeStatic = require('node-static');
const dispatcher = require('component-handler');
const i18n = require('i18n');
const appsInitializer = require('apps-initializer');
const socketIoManaer = require('socket-io-manager');

process.on('uncaughtException', err => {
	logger.error('Unhandled exception during runtime', err);
});

process.on('unhandledRejection', reason => {
	logger.error('Unhandled Rejection.', reason);
});

const fileNodeStatic = new nodeStatic.Server({cache: false});

i18n.configure(config.get('i18n'));

const server = http.createServer(async function(req, res) {
	i18n.init(req, res);
	try
	{
		let userSession = await userSessionManager.lookupSession(req);
		req.pathInfo = new RequestPathInfo(req);
		req.session = new RepositorySession(userSession);
		req.userSession = userSession;

		try
		{
			// Throws an exception in case the user is not authenticated to proceed
			await authenticationHandler.checkAndAuthenticateUser(req, res);

			let resource = await req.session.resolve(req.pathInfo);

			req.attributes = {};

			if (resource.type === ResourceTypes.RESOURCE)
			{
				logger.debug(`${resource.path} - dispatch request`);

				dispatcher.dispatchRequest(req, res, req.pathInfo, resource);
			}
			else if (resource.type === ResourceTypes.FILE)
			{
				logger.debug(`${resource.path} - serve static resource`);

				if (resource.source !== undefined)
				{
					let mimetype = mime.lookup(req.pathInfo.extension);
					fileNodeStatic.serveFile("." + resource.source, 200, {'content-type': mimetype}, req, res);
				}
				else
				{
					req.url = resource.path.replaceAll(' ', '%20');
					fileNodeStatic.serve(req, res);
				}
			}
			else if (fileScriptHandler.getScriptHandler(req.pathInfo) !== null)
			{
				let scriptHandler = fileScriptHandler.getScriptHandler(req.pathInfo);
				scriptHandler.handle(req, res, req.pathInfo);
			}
			else
			{
				logger.warn(`no resource found at: ${req.pathInfo.completePath}`);

				res.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8'});
				res.write('404 Resource Not Found\n');
				res.end();
			}
		}
		catch (err)
		{
			logger.error('Error while authenticating user.', err);

			res.writeHead(401, {'Content-Type': 'text/plain; charset=utf-8'});
			res.write('401 Unauthorized\n');
			res.end();
		}
	}
	catch (err)
	{
		logger.error('Error while processing request', err);

		res.writeHead(500, {'Content-Type': 'text/plain; charset=utf-8'});
		res.write(JSON.stringify('Error while processing request >> ' + err));
		res.end();
	}
});


socketIoManaer.init(server);
appsInitializer.init().catch(err => {
	logger.error('Error while initializing all applications listed in /apps', err);
});

const dachshundWebServerPort = config.get('server.port');
const dachshundWebServerInterface = config.get('server.interface');
server.listen(dachshundWebServerPort, dachshundWebServerInterface);
logger.info(`Started Server on http://${dachshundWebServerInterface}:${dachshundWebServerPort}`);