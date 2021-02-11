const {ShoppingList} = require('../models/ShoppingList');
const { body, validationResult, param } = require("express-validator");

const getShoppingLists = async (req, res) => {
    const list = await ShoppingList.find({});
    res.status(200).json(list);
}

const validationResultHandler = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(500).json({
            errors: errors.array(),
            message: "validation error",
        });
    }
    next();
}

const getSingleShoppingList = [
    param('id', 'id must be a string (mongo object id').isString().isLength({ min: 24 }),
    validationResultHandler,
    async (req, res) => {
        try {
            const id = req.params.id;
            const list = await ShoppingList.findById(id);
            res.status(200).json(list);
        } catch(error) {
            res.status(500).json({
                message: "error",
            });
        }
    }
]

const createShoppingList = [
    body('name', 'name is required').isString().isLength({ min: 2 }).escape(),
    body('other', 'other is optional').optional({checkFalsy: true}).escape(),
    validationResultHandler,
    async (req, res) => {
        try {
            const {name, other} = {...req.body};
            const owner = req.user && req.user.id;
            const newList = new ShoppingList({name, owner, other});
            const data = await newList.save();
            res.status(200).json(data);
        } catch(error) {
            res.status(500).json({
                message: "error",
            });
        }
    },
]

const updateShoppingList = async (req, res) => {
    const id = req.params.id;
    try {
        const item = await ShoppingList.findById(id);
        if(!req.user || item.owner !== req.user.id) {
            return res.status(403).json({
                message: "unauth",
            });
        }
        const {name, other} = {...req.body};
        const data = await ShoppingList.findByIdAndUpdate(id, {name, other}, {'new': true});
        res.status(200).json(data);
    } catch(error) {
        res.status(500).json({
            message: "error",
        });
    }
}

const deleteShoppingList = async (req, res) => {
    const id = req.params.id;
    try {
        const item = await ShoppingList.findById(id);
        if(!req.user || item.owner !== req.user.id) {
            return res.status(403).json({
                message: "error",
            });
        }
        await ShoppingList.deleteOne({_id: id});
        res.status(200).json({message: 'success'});
    } catch(error) {
        res.status(500).json({
            message: "error",
        });
    }
}

module.exports = {
    getShoppingLists,
    getSingleShoppingList,
    createShoppingList,
    updateShoppingList,
    deleteShoppingList,
}
