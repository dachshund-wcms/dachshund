let prepare = exports;

prepare.handle = async function(req, res, pathInfo, resource, component) {

	resource.properties.contentPath = resource.path + "/content";

	let fileList = await resource.getFiles();
	fileList.forEach(function(file) {
		if (file.startsWith("thumb"))
		{
			resource.properties.thumb = resource.path + "/" + file;
		}
	});
};