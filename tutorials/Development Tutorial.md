### 1 - Create Hello World Example

To start with a new site, the required folder structure has to be created first. Dachshund splits application logic and content, so both parts have to be defined in order to access our first application.

#### 1.1 - Create Content Resource
Create the folder ```/content/helloWorld``` and create within a new file called ```.properties.json```. The content has to be:
```javascript
{
    "componentPath": "/apps/helloWorld/pageComponents/helloWorld",
    "title": "Hello World",
    "description": "This is my first Web Page with dachshund"
}
```

#### 1.2 - Create Component Resource
Create the folder ```/apps/helloWorld/pageComponents/helloWorld``` and create within a new file called ```helloWorld.jazz```. The content has to be:
```html
<html>
    <head>
        <title>{properties.title}</title>
    </head>
    <body>
        <h1>{properties.title}</h1>
        <p>{properties.description}</p>
    </body>
</html>
```

Finally _start Dachshund_ and access [http://localhost:8888/content/helloWorld.html](http://localhost:8888/content/helloWorld.html). You should see the rendered web page filled with the properties defined in the content resource.

### 2 - Organize Component Resource 
Our component resource consists at the moment out of one file. It's so simple that organizing it in multiple file doesn't really make sense, but usually components are way more complex and organizing them in different files helps maintaining them. Furthermore it will utilize component inheritance later on.

Within the folder ```/apps/helloWorld/pageComponents/helloWorld``` create the file ```head.jazz``` with the content:
```html
<head>
    <title>{properties.title}</title>
</head>
```

and a file called ```body.jazz``` with the content:
```html
<body>
    <h1>{properties.title}</h1>
    <p>{properties.description}</p>
</body>
```

finally we change the ```helloWorld.jazz``` and replace the current content with the ```{includeScript('templateFile.jazz')}``` statements. 
```html
<html>
    {includeScript('head.jazz')}
    {includeScript('body.jazz')}
</html>
```

When we access [http://localhost:8888/content/helloWorld.html](http://localhost:8888/content/helloWorld.html) with the running Dachshund server, we should see the rendered web page as it was in the previous exercise. Change the _title_ and _description_ properties in ```/content/helloWorld/.properties.json``` and reload the page to see if the changes get applied. 

### 3 - Use component Inheritance 
Components can be build upon each other by using inheritance. As OOP with classes makes it possible to override methods with Dachshund it's possible to override scripts in Dachshund components. When scripts are included with ```{includeScript('myFile.jazz')}``` the script will be looked up along the inheritance chain of components and the first match is included. To use inheritance we have to define the suprt component within our component.

Within the folder ```/apps/helloWorld/pageComponents/helloWorld``` create the file ```.properties.json``` with the content:
```javascript
{
    "superComponent": "/apps/core/components/page"
}
```

Now the page component inherits the page component which is part of the _core components_ from Dachshund. The advantage is that basic functionality can be reused and functionality for the purpose of the particular component is overwritten. For our example the files ```helloWorld.jazz``` and ```head.jazz``` can be deleted. Reload [http://localhost:8888/content/helloWorld.html](http://localhost:8888/content/helloWorld.html) to check that the page still works.

The ```head.jazz``` is already defined in the super component. When we want to adjust stylesheets or scripts which are included in the head, we can create a ```headScripts.jazz``` or ```headStyles.jazz``` in our ```helloWorld``` component to do the adjustments for our website in there.

The demo application __Hello Dachshund__ shows how pages can be build on top of each other. The component ```/apps/helloDachshund/pageComponents/contentPage``` is inherited from the component ```homePage``` in the same folder. It overrides the ```content.jazz``` to define the page component specific logic.

### 4 - Create and Include Other Components
A website is usually subdivided into smaller functional blocks which we want to control and develop independently. To archive this the component model can be applied to page fragments as well.

#### 4.1 - Create Content Resources
Create the folder ```/content/helloWorld/.content/contacts/johnDoe``` and create within a new file called ```.properties.json```. The content has to be:
```javascript
{
    "componentPath": "/apps/helloWorld/components/contactData",
    "firstName": "John",
    "lastName": "Doe",
    "gender": "male",
    "age": 42,
    "street": "John Dorian Lane 42",
    "city": "Virtuopolis",
    "postalCode": "123456"
}
```

Create the folder ```/content/helloWorld/.content/contacts/janeDoe``` and create within a new file called ```.properties.json```. The content has to be:
```javascript
{
    "componentPath": "/apps/helloWorld/components/contactData",
    "firstName": "Jane",
    "lastName": "Doe",
    "gender": "female",
    "age": 24,
    "street": "John Dorian Lane 42",
    "city": "Virtuopolis",
    "postalCode": "123456"
}
```

#### 4.2 - Create Component Resource
Create the folder ```/apps/helloWorld/components/contactData``` and create within a new file called ```contactData.jazz```. The content has to be:
```html
<address>
    <h2>{properties.firstName} {properties.lastName} ({properties.age})</h2>
    <div>{properties.street}</div>
    <div>{properties.postalCode} {properties.city}</div>
</address>
```

#### 4.3 - Include Component in the Page Component
Open the ```body.jazz``` from ```/apps/helloWorld/pageComponents/helloWorld``` and add the ```{includeComponent('pathToComponent')}``` statements to add the component at this point. After the modification the file should look like this:
```html
<body>
    <h1>{properties.title}</h1>
    <p>{properties.description}</p>
    <hr>
    {includeComponent('.content/contacts/johnDoe')}
    {includeComponent('.content/contacts/janeDoe')}
</body>
```

[All options how to include components are described in the internal Jazz documentation](/module-component-script-handler_jazzHandler.html#includeComponent). 

### 5. Page Build Prepare Script
Usually web pages do more then just printing variables pebbed up with some stylesheets. Usually it requires server side logic to collect or to enhance the information which shall be displayed. Dachshund components provide the possibility to define a file called ```prepare.js``` this one is executed prior to the script which builds the rendition.

```javascript
'use strict';

const Q = require('q');
const prepare = exports;

prepare.handle = function(req, res, pathInfo, resource, component) {
    const deferred = Q.defer();

    // here comes your code which has to call "deferred.resolve()" when it's done
    // or "deferred.reject(new Error("<reason>")) in case there was an error while processing 

    return deferred.promise;
};
```

#### 5.1 - Add Prepare Script

For our demo page we implement a ```prepare.js``` in the path ```/apps/helloWorld/pageComponents/helloWorld```. The comments show how the _contacts_ resource get resolved by {@link RepositorySession} which is attached to the request. Based on this resource the child resources get resolved which contain the two user contacts which we've created before. The result is attached to ```resource.properties``` to use them in the subsequent executed Jazz template.

```javascript
'use strict';

const Q = require('q');
const prepare = exports;

prepare.handle = function(req, res, pathInfo, resource, component) {
    const deferred = Q.defer();
    
    // Define the path to the contacts located below '/content/helloDachshund'
    // which is referenced through the 'resource' variable
    const pathToContacts = resource.path + '/.content/contacts';

    // Resolve the defined path
    req.session.resolve(pathToContacts).then(function(contactsResource){
        // Lookup the child resources of the resolved contacts-resource
        return contactsResource.getChildResources();
    }).then(function(contactChildResources){
        // Attach the list of contact resources to the properties to reuse
        // them in the Jazz template
        resource.properties.contactResources = contactChildResources;
        deferred.resolve();
    }).fail(deferred.reject);

    return deferred.promise;
};
```

#### 5.2 - Include Contact Resources 

To make use of the resolved contact resources, open the ```body.jazz``` from ```/apps/helloWorld/pageComponents/helloWorld``` and change it so that ```{includeComponent('pathToComponent')}``` is surrounded by ```{foreach contactResource in properties.contactResources}``` to include the contact components dynamically.

```html
<body>
    <h1>{properties.title}</h1>
    <p>{properties.description}</p>
    <hr>
    {foreach contactResource in properties.contactResources}
        {includeComponent(contactResource.path)}
    {end}
</body>
```