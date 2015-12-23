var userManager = require('user-manager');
var sessionManager = require('user-session-manager');

var authenticate = exports;

authenticate.handle = function(req, res, pathInfo, resource) {
	var username = pathInfo.parameters.username;
	var password = pathInfo.parameters.password;
	var redirectTo = pathInfo.parameters.redirectTo;

	userManager.authenticate(username, password, function(user) {
		if (user == null)
		{
			res.writeHead(401);
			res.write("Username or password unknown.");
			res.end();
		}
		else
		{
			var session = sessionManager.createSession(req, res, user).then(function() {
				if (redirectTo != undefined)
				{
					res.writeHead(302, {'Location': redirectTo, "Cache-Control": "private, max-age=0"});
					res.end();
				}
				else
				{
					res.writeHead(200, {"Content-Type": "text/plain", "Cache-Control": "private, max-age=0"});
					res.write("User authenticated.");
					res.end();
				}
			});
		}


	});
}
