const express = require('express');
const productRouter = express.Router();
const productController = require('../controllers/productController');

productRouter.get('/list',productController.getProduct);// get product table data
productRouter.get('/list/:id',productController.getProductById);// get perticular data by product ID
productRouter.post('/create',productController.createProduct);// add data in product table

module.exports = productRouter;