const express = require('express');
const orderitemRouter = express.Router();
const orderitemController = require('../controllers/orderitemController');
const auth = require('../middleware/auth');

orderitemRouter.use(auth);

orderitemRouter.post('/add', orderitemController.addItemToOrder); //Create a new order
orderitemRouter.put('/update/:productId', orderitemController.updateOrderStatus); //Update status
orderitemRouter.delete('/remove/:productId', orderitemController.deleteOrder); //Delete an order

module.exports = orderitemRouter;