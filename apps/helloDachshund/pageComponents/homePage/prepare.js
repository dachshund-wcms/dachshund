'use strict';

const Q = require('q');
const prepare = exports;

prepare.handle = function(req, res, pathInfo, resource, component) {
    const deferred = Q.defer();

	resolveHomepage(resource).then(function(){
		return resolveSubHeadings(req.session, resource);
	}).then(deferred.resolve).fail(deferred.reject);

	//deferred.reject(new Error("foo"));

    return deferred.promise;
};

const resolveSubHeadings = function(session, resource) {
	const deferred = Q.defer();

	const subHeadingsPath = resource.path + "/.content/subHeadings";

	session.resolve(subHeadingsPath).then(function(subHeadings){
		return subHeadings.getChildResources();
	}).then(function(subHeadingResources){
		resource.properties.subHeadingResources = subHeadingResources;

		deferred.resolve();
	}).fail(deferred.reject);

	return deferred.promise;
};

const resolveHomepage = function(resource){
	const deferred = Q.defer();

	resource.getAbsoluteParentResource(2).then(function(homepageResource){

		resource.properties.homePage = homepageResource;

		deferred.resolve();
	}).fail(deferred.reject);

	return deferred.promise;
};