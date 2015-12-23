prepare = exports;

prepare.handle = function(req, res, pathInfo, resource, component) {
	req.attributes.editMode = !req.userSession.isAnonymous && pathInfo.cookies.get("EDITMODE") == "on";
}