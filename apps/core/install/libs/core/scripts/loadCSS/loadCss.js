define(["jquery"], function ($) {
	'use strict';

	var loadStyle = function(cssUrl)
	{
		var stylesheetIsAlreadyLoaded = $("head link[href='"+ cssUrl +"'][rel='stylesheet']").size() > 0
		if(!stylesheetIsAlreadyLoaded)
		{
			loadCss(cssUrl);
		}
	};

	var loadCss = function(cssUrl) {
		var link = $("<link></link>");
		link.attr("type", "text/css");
		link.attr("rel", "stylesheet");
		link.attr("href", cssUrl);
		link.appendTo($("head"));
	};

	return {
		loadStyle: loadStyle
	}
});
