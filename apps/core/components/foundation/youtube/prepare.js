prepare = exports;

prepare.handle = function(req, res, pathInfo, resource, component) {
	resource.properties.width = 560;
	resource.properties.height = 315;

	if (resource.properties.size != undefined)
	{
		switch (resource.properties.size)
		{
			case "medium":
				resource.properties.width = 480;
				resource.properties.height = 360;
				break;
			case "large":
				resource.properties.width = 640;
				resource.properties.height = 480;
				break;
			case "hd720":
				resource.properties.width = 960;
				resource.properties.height = 720;
				break;
			case "custom":
				if (resource.properties.customWidth)
				{
					resource.properties.width = resource.properties.customWidth;
				}
				if (resource.properties.customHeight)
				{
					resource.properties.height = resource.properties.customHeight;
				}
				break;
		}
	}

	var playerOptions = [];
	if (resource.properties.showinfo == "true")
	{
		playerOptions.push("showinfo=1");
	}
	else
	{
		playerOptions.push("showinfo=0");
	}

	if (resource.properties.autoplayVideo == "true")
	{
		playerOptions.push("autoplay=1");
	}
	else
	{
		playerOptions.push("autoplay=0");
	}

	if (resource.properties.autohideControls == "true")
	{
		playerOptions.push("autohide=1");
	}
	else
	{
		playerOptions.push("autohide=0");
	}

	if (resource.properties.showcontrols == "true")
	{
		playerOptions.push("controls=1");
	}
	else
	{
		playerOptions.push("controls=0");
	}

	resource.properties.playerOptions = playerOptions.join("&");
}