# Backend

This is the backend repo for the shmoogle project

# Routes
## Api
All routes under api will have a router group of ``/api/``.
And all routes under api will be protected with oauth.
### Search routes
All routes under search will have a router group of ``/search/`` under api
Furthermore all routes must include a Key in the querystring which is used to authenticate the use of the api.

#### Regular Search routes

* ``/:query/unshuffled``
  * Returns a unshuffled search query result
* ``/:query/shuffled``
  * Returns a shuffled search query result
* ``/:query`` 
  * Returns a shuffled and unshuffled search query result
  
#### Images Search routes

* ``/images/:query/unshuffled``
  * Returns a unshuffled search query result
* ``/images/:query/shuffled``
  * Returns a shuffled search query result
* ``/images/:query`` 
  * Returns a shuffled and unshuffled search query result
  
####  In Site Search
All routes are under custom and will have a router group of ``/custom/`` under api

* ``/search/:query``
  * Returns a unshuffled search query result
* ``/signup/shuffled``
  * Returns text including the key token for the api and a html code that can be implanted into the site
 

[Link To the Api](https://shmoogle.azurewebsites.net/docs)
