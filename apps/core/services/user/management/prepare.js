var userManager = require("user-manager");

var prepare = exports;

prepare.handle = function(req, res, pathInfo, resource) {
	resource.properties.userlist = userManager.getUserlist();
}