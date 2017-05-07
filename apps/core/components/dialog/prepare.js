prepare = exports;

let processDialogEntries = function(dialogEntriesSource, dialogEntriesDestination, resource) {
	let dialogElementIndex = 0;
	for (let dialogElement of dialogEntriesSource)
	{
		if (typeof dialogElement === "object")
		{
			let dialogEntry = {};
			dialogEntry.script = dialogElement.input + ".jazz";
			dialogEntry.name = dialogElementIndex++;
			dialogEntry.value = resource.properties[dialogElement.property];
			dialogEntry.element = dialogElement;
			dialogEntriesDestination.push(dialogEntry);
			if (dialogElement.input === "expandable")
			{
				let dialogEntries = [];
				dialogEntry.dialogEntries = dialogEntries;
				processDialogEntries(dialogElement.elements, dialogEntries, resource);
			}
		}
	}
};

prepare.handle = function(req, res, pathInfo, resource, component) {
	let dialogEntries = [];

	processDialogEntries(component.componentResource.properties.dialog, dialogEntries, resource)

	component.componentResource.properties.dialogEntries = dialogEntries;
};