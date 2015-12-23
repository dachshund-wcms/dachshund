about = exports;

about.handle = function(req, res, pathInfo, resource) {
	//Delete sensitive properties from a copy of the object
	var userSessionObject = JSON.parse(JSON.stringify(req.userSession));

	delete userSessionObject.user.properties.passwordHash;
	delete userSessionObject.user.auth;
	delete userSessionObject.user.resourceTypes;
	delete userSessionObject.user.type;
	delete userSessionObject.user._resourceFiles;
	delete userSessionObject.user._resourceChilds;

	res.writeHead(200, {"Content-Type": "application/json; charset=utf-8", "Cache-Control": "private, max-age=0"});
	res.write(JSON.stringify(userSessionObject));
	res.end();
};
