const app = require("../app");
const mongoose = require("mongoose");
const supertest = require("supertest");
const {ShoppingList} = require('../models/ShoppingList')

beforeAll((done) => {
    mongoose.connect(process.env.MONGO_TEST_URI,
        { useNewUrlParser: true, useUnifiedTopology: true },
        () => done());
});

afterAll((done) => {
    ShoppingList.deleteMany({}, () => {
        mongoose.connection.close(() => done())
    });
});

let listId = null;
let itemId = null;

test("GET /shopping-list/getall", async () => {

    await supertest(app)
        .get("/shopping-list/getall")
        .expect(200)
        .then((response) => {
            // Check the response type and length
            expect(Array.isArray(response.body)).toBeTruthy();
            expect(response.body.length).toEqual(0);

        })
})

test("POST /shopping-list/create", async () => {
    const data = {
        name: "List 1",
        other: "Lorem ipsum",
    }

    await supertest(app)
        .post("/shopping-list/create")
        .set('Authorization', 'Bearer X')
        .send(data)
        .expect(200)
        .then(async (response) => {
            listId = response.body._id;
            // Check the response
            expect(response.body._id).toBeTruthy();
            expect(response.body.name).toBe(data.name);
            expect(response.body.other).toBe(data.other);
            expect(response.body.owner).toBe(1);

            // Check the data in the database
            const list = await ShoppingList.findOne({ _id: response.body._id });
            expect(list).toBeTruthy();
            expect(list.name).toBe(data.name);
            expect(list.other).toBe(data.other);

        })
})

test("GET /shopping-list/get/32", async () => {
    await supertest(app)
        .get("/shopping-list/get/32")
        .expect(500)
        .then((response) => {
            // Check the response type and length
            expect(Array.isArray(response.body.errors)).toBeTruthy();
            expect(response.body.errors.length).toEqual(1);
            expect(response.body.errors[0].value).toEqual('32');
        })
})

test("GET /shopping-list/get/", async () => {

    await supertest(app)
        .get("/shopping-list/get/"+listId)
        .expect(200)
        .then((response) => {
            // Check the response type and length
            expect(response.body).toBeTruthy();
            expect(response.body.name).toEqual('List 1');

        })
})

test("PUT /shopping-list/update/", async () => {
    const data = {
        name: "List 2",
    }

    await supertest(app)
        .put(`/shopping-list/update/${listId}`)
        .set('Authorization', 'Bearer X')
        .send(data)
        .expect(200)
        .then(async (response) => {
            listId = response.body._id;
            // Check the response
            expect(response.body._id).toBeTruthy();
            expect(response.body.name).toBe(data.name);

            // Check the data in the database
            const list = await ShoppingList.findOne({ _id: listId });
            expect(list).toBeTruthy();
            expect(list.name).toBe(data.name);

        })
})

test("PUT unauth /shopping-list/update/", async () => {
    const data = {
        name: "List 3",
    }

    await supertest(app)
        .put(`/shopping-list/update/${listId}`)
        .send(data)
        .expect(403);
})

test("DELETE unauth /shopping-list/delete/", async () => {

    await supertest(app)
        .delete(`/shopping-list/delete/${listId}`)
        .expect(403);
})

test("DELETE /shopping-list/delete/", async () => {
    await supertest(app)
        .delete(`/shopping-list/delete/${listId}`)
        .set('Authorization', 'Bearer X')
        .expect(200)
        .then(async () => {
            // Check the data in the database
            const list = await ShoppingList.findOne({ _id: listId });
            expect(list).toBeFalsy();

        })
})

test("POST /shopping-list/create", async () => {
    const data = {
        name: "List with items",
        other: "something",
    }

    await supertest(app)
        .post("/shopping-list/create")
        .set('Authorization', 'Bearer X')
        .send(data)
        .expect(200)
        .then(async (response) => {
            listId = response.body._id;
            // Check the response
            expect(response.body._id).toBeTruthy();
            expect(response.body.name).toBe(data.name);
            expect(response.body.other).toBe(data.other);
            expect(response.body.owner).toBe(1);
            expect(Array.isArray(response.body.items)).toBeTruthy();

            // Check the data in the database
            const list = await ShoppingList.findOne({ _id: response.body._id });
            expect(list).toBeTruthy();
            expect(list.name).toBe(data.name);
            expect(list.other).toBe(data.other);

        })
})

test("POST /shopping-list-item/create/", async () => {
    const data = {
        "name": "item1",
        "other": "descr",
        "amount": 34,
    }

    await supertest(app)
        .post(`/shopping-list-item/create/${listId}`)
        .set('Authorization', 'Bearer X')
        .send(data)
        .expect(200)
        .then(async (response) => {
            // Check the response
            expect(response.body._id).toBeTruthy();
            expect(Array.isArray(response.body.items)).toBeTruthy();

            // Check the data in the database
            const list = await ShoppingList.findOne({ _id: listId });
            expect(list).toBeTruthy();
            expect(Array.isArray(list.items)).toBeTruthy();
            expect(list.items.length).toEqual(1);
            itemId = list.items[0]._id;
            expect(list.items[0].name).toEqual(data.name);
            expect(list.items[0].other).toEqual(data.other);
            expect(list.items[0].amount).toEqual(data.amount);
        })
})

test("POST unauth /shopping-list-item/create", async () => {
    const data = {
        "name": "item1",
        "other": "descr",
        "amount": 34,
    }

    await supertest(app)
        .post(`/shopping-list-item/create/${listId}`)
        .send(data)
        .expect(403)
})

test("PUT /shopping-list-item/update/", async () => {
    const data = {
        "amount": 134,
    }

    await supertest(app)
        .put(`/shopping-list-item/update/${itemId}`)
        .set('Authorization', 'Bearer X')
        .send(data)
        .expect(200)
        .then(async (response) => {
            // Check the response
            expect(response.body.amount).toBe(data.amount);
            expect(response.body.name).toBeTruthy();

            // Check the data in the database
            const list = await ShoppingList.findOne({'items._id': itemId});
            const item = list.items.id(itemId);
            expect(item).toBeTruthy();

            expect(item.name).toEqual(response.body.name);
            expect(item.other).toEqual(response.body.other);
            expect(item.amount).toEqual(response.body.amount);
        })
})

test("PUT unauth /shopping-list-item/update", async () => {
    const data = {
        "name": "item1",
        "other": "descr",
        "amount": 34,
    }

    await supertest(app)
        .put(`/shopping-list-item/update/${itemId}`)
        .send(data)
        .expect(403)
})

test("DELETE unauth /shopping-list-item/delete", async () => {
    await supertest(app)
        .delete(`/shopping-list-item/delete/${itemId}`)
        .expect(403)
})

test("DELETE /shopping-list-item/delete/", async () => {

    await supertest(app)
        .delete(`/shopping-list-item/delete/${itemId}`)
        .set('Authorization', 'Bearer X')
        .expect(200)
        .then(async (response) => {
            // Check the response
            const list = await ShoppingList.findOne({'items._id': itemId});
            expect(list).toBeFalsy();
        })
})
