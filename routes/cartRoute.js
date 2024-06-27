const express = require('express');
const cartRouter = express.Router();
const cartController = require('../controllers/cartController');
const auth = require('../middleware/auth');

cartRouter.use(auth);

cartRouter.get('/get', cartController.showCart);
cartRouter.post('/add', cartController.addToCart);
cartRouter.put('/update', cartController.updateCart);
cartRouter.delete('/remove/:product_id', cartController.removeItemFromCart);

module.exports = cartRouter;    