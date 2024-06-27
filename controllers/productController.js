const { error } = require('console');
const Product = require('../models/product');
const Category = require('../models/categories');
const { includes } = require('lodash');
const { Model } = require('sequelize');
const { Sequelize } = require('../models');
const sequelize = require('../config/database');

exports.getProduct = async (req, res) =>{
    try {
        // const products = await sequelize.query(`
        //     SELECT 
        //         Product.id, 
        //         Product.name, 
        //         Product.description, 
        //         Product.price, 
        //         Product.stock, 
        //         Product.category_id, 
        //         Category.name AS category_name 
        //     FROM 
        //         product AS Product 
        //     LEFT OUTER JOIN 
        //         categories AS category 
        //     ON 
        //         Product.category_id = category.id;`, 
        // {
        //     type: Sequelize.QueryTypes.SELECT
        // });        
        const products = await Product.findAll({
            include:{
                model: Category, as: 'category', attributes: []
            },
            attributes: {include: [[Sequelize.col('category.name'),'category_name']]}, raw: true,
        });
        res.json(products); 
    } catch (error) {
        console.error('Error getting product', error.stack);
        res.status(500).json({error: "Internel Server error"});
    }
};

exports.getProductById = async (req, res) =>{
    const { id } = req.params;
    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
        return res.status(400).json({ error: "Invalid id. Id must be a positive integer." });
    }
    try {
        const products = await Product.findByPk(id, {
            include:{
                model: Category, as: 'category', attributes: []
            },
            attributes: {include: [[Sequelize.col('category.name'),'category_name']]}, raw: true,

    });
        if (products) {
            res.json(products);    
        }
        else {
            res.status(404).json({error:"id not found."});
        }
    } catch (error) {
        console.error('Error getting category', error.stack);
        res.status(500).json({error: "Internel Server error"});
    }
};

exports.createProduct = async(req, res) =>{
    const { name, description, price, stock, category_id } = req.body;
    try {
        const category = await Category.findByPk(category_id);
        if (!category) {
            return res.status(400).json({ error: "Invalid category_id. Category not found." });
        }
        await Product.create({name, description, price, stock, category_id});
        res.json({ message: "created the product succesfully."})
    } catch (error) {
        console.error('Error creating product.', error.stack);
        res.status(500).json({error: "Internel Server error"});
    }
}