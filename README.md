### Basic shopping cart api

for data storage used mongo, integration tests included

### How to start:

install dependencies:
 
 `npm install`

rename `sample.env` into `.env`, optionally set another mongo connection

run the app:
 
 `DEBUG=shopping-list:* npm start`

or run tests:

`npm run test`

### some hints

To emulate authentication application uses bearer token, check the file `auth.js`, 
so users with `Bearer X` treated as logged in with `id=1`, 
that means owner could be only one (with token). Also for example look tests how token assigned:
`.set('Authorization', 'Bearer X')`.

