const express = require('express');
const orderRouter = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');

orderRouter.use(auth);

orderRouter.get('/OBI/', orderController.getOrderById); //get specific order by its ID
orderRouter.get('/OBU/', orderController.getOrderByUser); //get all order list for user
orderRouter.post('/create/', orderController.createOrder); //Create a new order
orderRouter.put('/update/', orderController.updateOrderStatus); //Update status
orderRouter.delete('/remove/', orderController.deleteOrder); //Delete an order
orderRouter.post('/direct', orderController.createOrderDirect); //Create a new order directly

module.exports = orderRouter;
