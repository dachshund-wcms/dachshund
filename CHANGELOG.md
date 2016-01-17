# Changelog

## 2.2 [Unreleased]

### Added 
- [Socket.io](http://socket.io/) support including custom module to send changes directly to the web browser
- The applications initialiser itarates over all Dachshund application listes below _/apps_ and inits all node modules below _/apps/&lt;appName>/node_modules_
- Node module _resource-search_ to search recursive for node modules which are below a given base resource. A given matching function   

### Changed
- The [request-pathinfo](https://github.com/dachshund-wcms/dachshund/blob/master/apps/node_modules/request-pathinfo/lib/requestPathInfo.js) class has a new getter which provides a list of selectors which is especially handy when multiple selectors were passed with the request.
- The method _getChilds_ on the _resource_ class can now be called with a boolean parameter to include hidden childs. 

### Fixed
- The applications initialiser failed sometimes installing everything below _/apps/&lt;appName>/node_modules_ especially when there are many files. The mechanism now is more robust and reliable.

## 2.1
Enhanced functionality to manage applications and facilitate the development process. Added custom nodes modules which are part of Dachshund WCMS.

### Added
- Added custom node module _apps-initializer_. It Searches through each application in the '/apps' folder. In case they contain an 'install' folder their content get copied into the root of Dachshund.
- Added bash script to detect the Node.js installation and to download and install a compatible version, in case the system doesn't provide one

### Fixed
- Added missing custom _node_module_ which are part of Dachshund 

## 2.0
First publicly available version. It is contains the core of _Dachshund_ and all functionality to build applications or rich frontend on top of it.
  - REST API
  - Resource Resolving and Managing
  - Component Handling
  - Basic Authentication and Authorization
  - Central [configuration framework](https://www.npmjs.com/package/config)
  - Render HTML templates with [Jazz](https://github.com/shinetech/jazz) templating engine
  - Render CSS templates with [Less](https://www.npmjs.com/package/less)
  - Multilingual Support with [i18n](https://www.npmjs.com/package/i18n)

## 1.0
Was the first implementation which was a proof of concept and used only for internal implementations. It provided the same functionality as the first published version 2.0 but wasn't tested or documented in any kind