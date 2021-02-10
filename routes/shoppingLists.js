const express = require('express');
const router = express.Router();

const {
    createShoppingList,
    getShoppingLists,
    deleteShoppingList,
    getSingleShoppingList,
    updateShoppingList,
} = require('../controllers/ShoppingListController');

router.get('/getall', getShoppingLists);
router.get('/get/:id', getSingleShoppingList);
router.post('/create', createShoppingList);
router.put('/update/:id', updateShoppingList);
router.delete('/delete/:id', deleteShoppingList);

module.exports = router;
