//This component is to redirect to another page

const assert = require('assert');
const stringUtils = require('string-utils');

redirect = exports;

redirect.handle = function(req, res, pathInfo, resource) {
	assert(stringUtils.isNotEmpty(resource.properties.redirectTo), `The property [redirectTo] is not set or empty within resource [${resource.path}]`);

	res.writeHead(302, {'Location': resource.properties.redirectTo});
	res.end();
};
