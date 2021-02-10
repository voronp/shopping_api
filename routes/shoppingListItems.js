const express = require('express');
const router = express.Router();

const {
    createShoppingListItem,
    getShoppingListItems,
    deleteShoppingListItem,
    getSingleShoppingListItem,
    updateShoppingListItem,
} = require('../controllers/ShoppingListItemController');

router.get('/getall/:parent_id', getShoppingListItems);
router.get('/get/:id', getSingleShoppingListItem);
router.post('/create/:parent_id', createShoppingListItem);
router.put('/update/:id', updateShoppingListItem);
router.delete('/delete/:id', deleteShoppingListItem);

module.exports = router;
