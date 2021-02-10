const {ShoppingList} = require('../models/ShoppingList');

const getShoppingListItems = async (req, res) => {
    const id = req.params.parent_id;
    try {
        const list = await ShoppingList.findById(id);
        res.status(200).json(list.items);
    } catch(error) {
        res.status(500).json({message: 'error'})
    }
}

const getSingleShoppingListItem = async (req, res) => {
    const id = req.params.id;
    try {
        const list = await ShoppingList.findOne({'items._id': id});
        const item = list.items.id(id);
        res.status(200).json(item);
    } catch(error) {
        res.status(500).json({message: 'error'})
    }
}

const createShoppingListItem = async (req, res) => {
    const id = req.params.parent_id;
    try {
        const item = await ShoppingList.findById(id);
        if(!req.user || item.owner !== req.user.id) {
            return res.status(403).json({
                message: "unauth",
            });
        }
        const {name, other, amount} = {...req.body};
        item.items.push({name, other, amount});
        const data = await item.save();
        res.status(200).json(data);
    } catch(error) {
        res.status(500).json({message: 'error'})
    }
}

const updateShoppingListItem = async (req, res) => {
    const id = req.params.id;
    try {
        const list = await ShoppingList.findOne({'items._id': id});
        if(!req.user || list.owner !== req.user.id) {
            return res.status(403).json({
                message: "unauth",
            });
        }
        const item = list.items.id(id);
        ['name', 'other', 'amount'].forEach( k => {
            if(k in req.body)
                item[k] = req.body[k]
        })
        await list.save();
        res.status(200).json(item);
    } catch(error) {
        res.status(500).json({message: 'error'})
    }
}

const deleteShoppingListItem = async (req, res) => {
    const id = req.params.id;
    try {
        const list = await ShoppingList.findOne({'items._id': id});
        if(!req.user || list.owner !== req.user.id) {
            return res.status(403).json({
                message: "unauth",
            });
        }
        list.items.id(id).remove();
        const data = await list.save();
        res.status(200).json(data);
    } catch(error) {
        res.status(500).json({message: 'error', error})
    }
}

module.exports = {
    getShoppingListItems,
    getSingleShoppingListItem,
    createShoppingListItem,
    updateShoppingListItem,
    deleteShoppingListItem,
}
