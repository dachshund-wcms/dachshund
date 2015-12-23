//This script is to read all resources

const childs = exports;

childs.handle = function(req, res, pathInfo, resource) {
	resource.getChilds().then(function(sortedChilds) {
		sortedChilds = sortedChilds.sort();
		res.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});
		res.write(JSON.stringify(sortedChilds));
		res.end();
	});
};
