db.auth('admin-user', 'admin-password')

const web = db.getSiblingDB('shopping_db');

web.createCollection('test_collection');


const test = db.getSiblingDB('shopping_test_db');

test.createCollection('test_collection');

db.createUser({ user: "user1" , pwd: "password1", roles: [{ role: 'readWrite', db: 'shopping_test_db' },
        { role: 'readWrite', db: 'shopping_db' }, "userAdminAnyDatabase", "dbAdminAnyDatabase", "readWriteAnyDatabase"]})

db.grantRolesToUser('user1', [{ role: 'readWrite', db: 'shopping_test_db' }]);
