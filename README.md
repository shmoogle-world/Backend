# Backend

This is the backend repo for the shmoogle project

# Routes
## Api
All routes under api will have a router group of ``/api/``.
And all routes under api will be protected with oauth.
### Search routes
All routes under search will have a router group of ``/search/`` under api
#### Image search routes
Smoogle world search routes.
* ``/images/:query``
  * Returns a shuffled query of 100 images.

#### Regular Search routes

* ``/:query/unshuffled``
  * Returns a unshuffled search query result
* ``/:query/shuffled``
  * Returns a shuffled search query result
* ``/:query`` 
  * Returns a shuffled and unshuffled search query result

[Link To the Api](https://bingsearchapiv1.azurewebsites.net/docs)