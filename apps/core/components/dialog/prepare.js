prepare = exports;

var processDialogEntries = function(dialogEntriesSource, dialogEntriesDestination, resource) {
	for (dialogElementIndex in dialogEntriesSource)
	{
		var dialogElement = dialogEntriesSource[dialogElementIndex];
		if (typeof dialogElement == "object")
		{
			var dialogEntry = {};
			dialogEntry.script = dialogElement.input + ".jazz";
			dialogEntry.name = dialogElementIndex
			dialogEntry.value = resource.properties[dialogElement.property];
			dialogEntry.element = dialogElement;
			dialogEntriesDestination.push(dialogEntry);
			if (dialogElement.input == "expandable")
			{
				var dialogEntries = [];
				dialogEntry.dialogEntries = dialogEntries;
				processDialogEntries(dialogElement.elements, dialogEntries, resource);
			}
		}
	}
}

prepare.handle = function(req, res, pathInfo, resource, component) {
	var dialogEntries = [];

	processDialogEntries(component.componentResource.properties.dialog, dialogEntries, resource)

	component.componentResource.properties.dialogEntries = dialogEntries;
}