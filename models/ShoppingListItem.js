const mongoose = require('mongoose')

const { Schema } = mongoose;

const shoppingListItemSchema = new Schema({
    name:  String,
    other:   String,
    amount: Number,
});

module.exports = {
    shoppingListItemSchema,
    ShoppingListItem: mongoose.model('ShoppingListItem', shoppingListItemSchema),
};
