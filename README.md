### Basic shopping cart api

for data storage used mongo, integration tests included

### How to start:

Install docker https://www.docker.com/

To run server api:

`docker-compose up`

To run tests:
 
`docker-compose -f docker-compose.test.yml up --abort-on-container-exit`

### some hints

To emulate authentication application uses bearer token, check the file `auth.js`, 
so users with `Bearer X` treated as logged in with `id=1`, 
that means owner could be only one (with token). Also for example look tests how token assigned:
`.set('Authorization', 'Bearer X')`.

### input parameters validation

For validation/sanitizing used library `express-validator`, for example check the file `ShoppingListController.js`
