# Dachshund WCMS
Dachshund is a fast and lightweight WCMS. It's goal is to provide a content centric WCMS with a transparent and structured REST API to access and modify its data. It is tailored to support state of the art web application development with HTML5, CSS3 and Javascript.

## Unstructured Content / Hierarchical Relationship
Dachshund comes bundled with a content repository and the API to access it. So there is no need for an additional database. Everything you need is your local file system. As the web is unstructured our content is unstructured as well. There is no need of database design. As web pages and their content is hierarchical structured, the relationship between data elements - we call them _resources_ - is defined in the same same way.

![Content Hierarchy](http://dachshund-wcms.github.io/tutorials/relationship.svg)

## Resource
A resource has always a parent resource and may have multiple child resources. Furthermore, each resource has properties which represent the specific information of the resource.

![Rest API](http://dachshund-wcms.github.io/tutorials/resource.svg)

The abstract class [Resource](Resource.html) and documents the members and the methods to access the resource information. 

## REST API
Each resource can be referenced through it's path in the hierarchy. The access takes place by stating the resource path, which is usually a subpath of _/content_, directly behind the URL. To render the content, the representation of the content is stated in the extension. To get more flexibility on rendering differend kind of views one or multiple dot separated selectors can be defined between the resource path and the extension. 

![Rest API](http://dachshund-wcms.github.io/tutorials/rest-api.svg)

The class [RequestPathInfo](RequestPathInfo.html) documents the members and methods to access the information passed with the request.

## Component Handling
To render a resource it requires a component which is able to generate the requested view. The component is referenced trough the property _componentPath_ in the requested resource. During a request the content resource is loaded, the property _componentPath_ is resolved to the component and both are processed to send the requested view in the response. Within the component Javascript or Jazz Templates can be defined to build the view. To utilize the development process components can be inherited and build upon each other.

![Rest API](http://dachshund-wcms.github.io/tutorials/component-handling.svg)

## Component Script Handler
To lookup the script which handles the request the URL part behind the first dot is evaluated. This part states the optional selector(s) and the the extension. Within the component the available files are filtered to build a best match between requested rendition and available script files. When no matching script can be found but inheritance is used, the lookup for a matching script is extended to the super component.

The following parameter are matched:
- __Selector(s)__ within the URI the HTTP request (see REST API)
- __Extension__ of the URI in the HTTP request (see REST API)
- __Method__ used in the HTTP request

__Best to worst match:__
- __&lt;selector(s)>.&lt;extension>.&lt;scriptExtension>__ (e.g. detailView.html.jazz)
- __&lt;selector(s)>.&lt;scriptExtension>__ (e.g. detailView.jazz)
- __&lt;extension>.&lt;scriptExtension>__ (e.g. html.jazz)
- __&lt;method>.&lt;scriptExtension>__ (e.g. GET.jazz)
- __&lt;componentName>.&lt;scriptExtension>__ (e.g. homepage.jazz)

The filtering is applied to the file name, while the _script extension_ states how the script has to be processed like _*.js_ for javascript files or _*.jazz_ for html templates.

## Application Server Structure
- __/apps__ _(system as well as custom application code)_
- __/content__ _(content for each site and their sub pages)_
- __/config__ _(application configuration)_
- __/home/users__ _(system users)_
- __/home/groups__ _(system usergroups)_
- __/libs__ _(Client side libraries for javascript, stylesheet frameworks or images)_

## System Requirements
- Mac OS X or Linux (Theoretical Windows)
- Node.js including npm (Version 5.2 and greater)
- Internet access to clone Dachshund from git and to download 3rd party npm modules
- GIT Version Control System (command line client or some UI client; just in case you want to download or)

## Setup

### Step 1.1 - Download and Unpack ...
All releases are listed here. Download the source code from [https://github.com/dachshund-wcms/core/releases](https://github.com/dachshund-wcms/core/releases/latest) and unpack it into your file system.

### Step 1.2 - ... or Clone Latest Version from GitHub
Use your UI client and clone the repository [https://github.com/dachshund-wcms/core](https://github.com/dachshund-wcms/core) change to the flag version 2.0 or use a command line client.

```bash
cd basepath/to/clone/dachshund
git clone https://github.com/dachshund-wcms/core dachshund
```

### Step 2 - Finish installation
Open a command line window and change to the dachshund folder. There you have to download the dependencies with node package manager as they're defined in the _package.json_.

```bash
cd path/to/dachshund
npm install
```

## Startup
Dachshund provides two methods to be started as normal or as debug application from the shell. The difference is that with one method its possible to use remote debugging like [node-inspector](https://github.com/node-inspector/node-inspector). The other one starts just the application and redirects the log output into a log file.

## Version History
- __2.0__ - First publicly available version. It is contains the core of _Dachshund_ and all functionality to build applications or rich frontend on top of it.
  - REST API
  - Resource Resolving and Managing
  - Component Handling
  - Basic Authentication and Authorization
  - Central [configuration framework](https://www.npmjs.com/package/config)
  - Render HTML templates with [Jazz](https://github.com/shinetech/jazz) templating engine
  - Render CSS templates with [Less](https://www.npmjs.com/package/less)
  - Multilingual Support with [i18n](https://www.npmjs.com/package/i18n)
- __1.0__ - Was the first implementation which was a proof of concept and used only for internal implementations, it provided the same functionality as the first published version 2.0 but wasn't tested or documented in any kind

## Wishlist
Even when Dachshund reached the version 2.0 the current implementation provide primarily the core functionality for a WCMS. 
- Authoring and administration web HTML5 frontend
- Functionality to replicate content between dachshund instances
- Functionality to use Dachshund with SAML and/or LDAP
- Possibility to use databases like MongoDB or CouchDB