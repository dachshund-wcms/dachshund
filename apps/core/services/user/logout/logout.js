var sessionManager = require('user-session-manager');

logout = exports;

logout.handle = function(req, res, pathInfo, resource) {
	sessionManager.deleteSession(req, res).then(function(anonymousSession) {
		var redirectTo = pathInfo.parameters.redirectTo;
		if (redirectTo != undefined)
		{
			res.writeHead(302, {'Location': redirectTo, "Cache-Control": "private, max-age=0"});
		}
		else if (req.userSession.isAnonymous)
		{
			res.writeHead(200, {"Content-Type": "text/plain", "Cache-Control": "private, max-age=0"});
			res.write("No session to destroy.");
		}
		else
		{
			res.writeHead(200, {"Content-Type": "text/plain", "Cache-Control": "private, max-age=0"});
			res.write("Session destroyed.");
		}

		req.userSession = anonymousSession;

		res.end();
	});
}
