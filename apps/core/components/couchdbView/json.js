const stringUtils = require('string-utils');
const Q = require('q');

resources = exports;
const multipleParametersRegex = /(["'][^"']+["'],?)*/;

var isMultipleKeySearch = function(keyParameter) {
	return stringUtils.isNotEmpty(keyParameter) && !keyParameter.startsWith("[") && !keyParameter.endsWith("]") && multipleParametersRegex.test(keyParameter);
};

var combineViewResults = function(viewResults) {
	var resultElements = {};
	viewResults.forEach(function(viewResult){
		viewResult.rows.forEach(function(row){
			resultElements[row.id] = row;
		});
	});

	var combinedResult = {
		total_rows: 0,
		rows: []
	};
	for(resultElementKey in resultElements)
	{
		var resultElement = resultElements[resultElementKey];
		combinedResult.rows.push(resultElement);
	}
	combinedResult.total_rows = combinedResult.rows.length;

	return combinedResult;
};

resources.handle = function(req, res, pathInfo, resource) {

	if (stringUtils.isEmpty(pathInfo.selector))
	{
		res.writeHead(500, {"Content-Type": "text/plain; charset=utf-8"});
		res.write("The selector which defines the name of the view. Is not specified within the request.\n");
		res.write("http://dachshund-name/path/to/my/couchdbDatabase/_design/designDoc.vieName.json");
		res.end();
	}
	else
	{
		var viewName = pathInfo.selector;
		if (pathInfo.parameters.group == undefined)
		{
			pathInfo.parameters.group = true;
		}
		if (isMultipleKeySearch(pathInfo.parameters.key))
		{
			var keys = pathInfo.parameters.key.split(",");
			var viewRequestPromises = [];

			keys.forEach(function(key){
				pathInfo.parameters.key = key;
				viewRequestPromises.push(resource._resolver.getView(resource.path, viewName, pathInfo.parameters));
			});

			Q.all(viewRequestPromises).done(function(viewResults) {
				res.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});
				res.write(JSON.stringify(combineViewResults(viewResults)));
				res.end();
			});

		}
		else
		{
			resource._resolver.getView(resource.path, viewName, pathInfo.parameters).then(function(viewResult) {
				res.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});
				res.write(JSON.stringify(viewResult));
				res.end();
			}).fail(function(err) {
				res.writeHead(500, {"Content-Type": "text/plain; charset=utf-8"});
				res.write("Error while requesting view: " + err.toString());
				res.end();
			});

		}
	}

};
