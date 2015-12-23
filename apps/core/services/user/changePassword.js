var userManager = require("../../userManager.js");

authenticate = exports;

authenticate.handle = function(req, res, pathInfo, resource) {
	if (req.userSession.isAnonymous)
	{
		res.writeHead(401, {"Content-Type": "text/plain; charset=utf-8"});
		res.write("You have to authenticate before you can change the password.");
		res.end();
	}
	else if (pathInfo.parameters.password == undefined || pathInfo.parameters.passwordRepeat == undefined)
	{
		res.writeHead(500, {"Content-Type": "text/plain; charset=utf-8"});
		res.write("The parameters 'password' or 'passwordRepeat' is not set within the request.");
		res.end();
	}
	else if (pathInfo.parameters.password != pathInfo.parameters.passwordRepeat)
	{
		res.writeHead(500, {"Content-Type": "text/plain; charset=utf-8"});
		res.write("The both passwords are not equal");
		res.end();
	}
	else if (pathInfo.parameters.password.length < 8)
	{
		res.writeHead(500, {"Content-Type": "text/plain; charset=utf-8"});
		res.write("The password is to short as it has less than eight characters");
		res.end();
	}
	else
	{
		userManager.changePassword(req.userSession.user.name, pathInfo.parameters.password, function() {
			res.writeHead(200, {"Content-Type": "text/plain; charset=utf-8"});
			res.write("Password changed");
			res.end();
		});
	}
}