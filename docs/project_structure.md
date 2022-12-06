# Project Structure



```yaml
Resume_Portfolio:
  docs: # markdown and other documentation
  node_modules: # application dependencies
  src: # source files
    backend: # defined all backend modules
      # controller: houses all the controllers needed for the application. These controller methods 
      # get the request from the routes and convert them to HTTP responses with the use 
      # of any middleware as necessary
      controller: 
      # middleware: segregates any middleware needed for the application in one place. There can be 
      # middleware for authentication, logging, or any other purpose
      middleware:
      # routes: folder that will have a single file for each logical set of routes. For example, 
      # there can be routes for one type of resource. It can be further broken down by 
      # versions like v1 or v2 to separate the route files by the version of the API.
      routes: 
    # configs: keeps all the configs needed for the application. For 
    # example, if the app connects to a database, the configuration for the database 
    # (like database name and username) can be put in a file like db.config.js. Similarly, 
    # other configurations like the number of records to show on each page for pagination 
    # can be saved in a file named general.config.js inside this configs' folder.  
    configs: 
    # frontend: keeps all the ui file such as html and other ui helper files
    frontend:
      # houses the html files
      views: 
    # models: folder will have data models required for the application. This will 
    # also depend on the datastore used if it is a relational or a non-relational (NoSQL) 
    # database. Contents of this folder will also be defined by the use of an Object 
    # Relational Mapping (ORM) library. If an ORM like Sequelize or Prisma is used, 
    #  this folder will have data models defined as per its requirement. 
    models:
    # services folder will include all the business logic. It can have services that 
    # represent business objects and can run queries on the database. Depending on the 
    # need, even general services like a database can be placed here
    services:
    # utils: directory that will have all the utilities and helpers needed for the 
    # application. It will also act as a place to put shared logic, if any. For example, 
    # a simple helper to calculate the offset for a paginated SQL query can be put in a 
    # helper.util.js file in this folder.  
    utils:
  assets: # static files and pre-loaded dependencies into node_modules
  staging: # generated from packaging app by executing staging.sh script
  test: # put all tests and test dependencies here

```