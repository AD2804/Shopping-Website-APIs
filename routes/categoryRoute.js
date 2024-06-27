const express = require('express');
const categoryRouter = express.Router();
const categoryController = require('../controllers/categoryController');

categoryRouter.get('/list', categoryController.getCategory); // get category table data
categoryRouter.get('/list/:id', categoryController.getCategoryById);// get perticular data by caategory ID 
categoryRouter.post('/create', categoryController.createCategory);// add data in category table

module.exports = categoryRouter;


