const { error } = require('console');
const Category = require('../models/categories');
const Product = require('../models/product');

// Read data from table 
exports.getCategory = async(req, res)=>{
    try {
        const categories = await Category.findAll();
        res.json(categories);
    } catch (error) {
        console.error('Error getting category',error.message, error.stack);
        res.status(500).json({error: "Internel Server error"});
    }
};

exports.getCategoryById = async(req, res)=>{
    const { id } = req.params;
    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
        return res.status(400).json({ error: "Invalid id. Id must be a positive integer." });
    }
    try {
        const categories = await Category.findByPk(id);
        if (categories) {
            res.json(categories);
        }
        else {
            res.status(404).json({error:"id not found."});
        }
    } catch (error) {
        console.error('Error getting category', error.stack);
        res.status(500).json({error: "Internel Server error"});
    }
};

exports.createCategory = async(req, res)=>{
    const{ name, description } = req.body;
    try {
        await Category.create({ name, description});
        res.json({ message: "created the category succesfully."})
    } catch (error) {
        console.error('Error creating category', error.stack);
        res.status(500).json({error: "Internel Server error"});
    }
}