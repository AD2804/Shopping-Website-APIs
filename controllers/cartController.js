
const { error } = require('console');
const Cart = require('../models/cart');
const User = require('../models/user');
const Product = require('../models/product');
const Category = require('../models/categories');
const { Sequelize } = require('../models');
const auth = require('../middleware/auth');

exports.showCart = async(req, res)=>{
    const user_id = req.user.id;
    try {
        const cartItems = await Cart.findAll({
            where: { user_id },
            include:{
                model: Product, as: 'product', attributes: [],
                include: [{
                    model: Category, as: 'category', attributes: [] 
                }]
            },
            attributes: {include: [[Sequelize.col('product.name'),'product_name'],
                [Sequelize.col('product.category.name'),'category_name']]}, 
            raw: true,
        });

        if (cartItems.length === 0) {
            return res.status(404).json({error: 'Product not found.'})
        }
        res.json(cartItems);
    } catch (error) {
        console.error('Error getting cart items',error.message, error.stack);
        res.status(500).json({error: "Internel Server error"});
    }
};

exports.addToCart = async(req,res)=>{
    const { product_id, quantity } = req.body;
    const user_id = req.user.id;
    console.log(`Received user_id: ${user_id}, product_id: ${product_id}, quantity: ${quantity}`);
    try {
        if (!Number.isInteger(quantity) || quantity <= 0) {
            return res.status(400).json({ error: "Invalid quantity value." });
        }           
        
        const product = await Product.findByPk(product_id);
        if (!product) {
            return res.status(404).json({error: "Product not found."});
        }

        if (product.stock < quantity) {
            return res.status(404).json({ message: 'Stock is not available.'})
        }

        const cartItem = await Cart.findOne({ where:{user_id, product_id}});
        if (cartItem) {
            cartItem.quantity += quantity;
            cartItem.price = product.price * cartItem.quantity;
            await cartItem.save();
        } else {
            const price = product.price * quantity;
            await Cart.create({ user_id, product_id, quantity, price});
        }

        res.status(201).json({ message:"Item added to cart successfully." });
    } catch (error) {
        console.error('Error additng item to cart!',error.message, error.stack);
        res.status(500).json({error: "Internel Server error"});
    }
};

exports.updateCart = async (req, res) => {
    const {product_id, quantity } = req.body;
    const user_id = req.user.id;
    try {
        if (!Number.isInteger(quantity) || quantity <= 0) {
            return res.status(400).json({ error: "Invalid quantity value." });
        }
        const product = await Product.findByPk(product_id);
        const cartItem = await Cart.findOne({ where: { user_id, product_id} });
        if (!cartItem) {
            return res.status(404).json({error: "Product not found in Cart."});
        }

        if (product.stock < quantity) {
            return res.status(404).json({ message: 'Stock is not available.'})
        }

        cartItem.quantity = quantity;
        cartItem.price = product.price * cartItem.quantity;
        await cartItem.save();

        res.status(200).json({message: "Cart updated successfully"});
    } catch (error) {
        console.error('Error updating item in cart!',error.message, error.stack);
        res.status(500).json({error: "Internel Server error"});
    }
};


exports.removeItemFromCart = async (req, res) => {
    const { product_id } = req.params;
    const user_id = req.user.id;
    try {
        const cartItem = await Cart.findOne({where: {user_id, product_id}});

        if(!cartItem) {
            return res.status(404).json({error: "Item not found in Cart."});
        }

        await cartItem.destroy();
        res.status(200).json({message: "Item deleted successfully"});
    } catch (error) {
        console.error('Error updating item in cart!',error.message, error.stack);
        res.status(500).json({error: "Internel Server error"});
    }
};

