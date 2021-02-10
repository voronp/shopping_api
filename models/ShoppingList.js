const mongoose = require('mongoose')

const { Schema } = mongoose;
const {shoppingListItemSchema} = require('./ShoppingListItem')

const shoppingListSchema = new Schema({
    name:  String,
    owner: Number,
    other:   String,
    items: [shoppingListItemSchema],
});

module.exports = {
    shoppingListSchema,
    ShoppingList: mongoose.model('ShoppingList', shoppingListSchema),
};
