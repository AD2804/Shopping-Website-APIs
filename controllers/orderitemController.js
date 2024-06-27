const { error } = require('console');
const Order = require('../models/order');
const Orderitem = require('../models/orderitem');
const Product = require('../models/product');
const Cart = require('../models/cart');
const { Sequelize } = require('../models');

exports.addItemToOrder = async (req,res) => {
    const user_id = req.user.id;
    // const { order_id } = req.params;
    const { productId, quantity } = req.body;
    try {
        if (!Number.isInteger(quantity) || quantity <= 0) {
            return res.status(400).json({ error: "Invalid quantity value." });
        }
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        if (product.stock < quantity) {
            return res.status(404).json({ message: 'Stock is not available.'})
        }

        let orders = await Order.findOne({ where:{userId: user_id, status:"pending"} });
        if (!orders) {
            orders = await Order.create({ userId:user_id, total_price: 0, status: 'pending' })
        }

        const orderitem = await Orderitem.create({ order_id: orders.id, productId, quantity, price: product.price });

        const orderitems = await Orderitem.findAll({ where: { order_id: orders.id } });
        let total_price = 0;
        for(const item of orderitems) {
            total_price += item.price * item.quantity;
        }

        // const order = await Order.findByPk(order_id);
        orders.total_price = total_price;
        await orders.save();

        res.status(201).json({ message: 'Item added to order successfully.', orderitem });
    } catch (error) {
        console.error('Error adding item to order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateOrderStatus = async (req, res) => {
    const user_id = req.user.id;
    const { productId } = req.params;
    const { quantity } = req.body;
    try {
        if (!Number.isInteger(quantity) || quantity <= 0) {
            return res.status(400).json({ error: "Invalid quantity value." });
        }
        const product = await Product.findByPk(productId);

        const orders = await Order.findOne({ where: { userId:user_id, status: 'pending' } });
        if (!orders) {
            return res.status(404).json({ error: 'Order not found.' });
        }

        const orderitem = await Orderitem.findOne({ where:{ order_id: orders.id, productId: productId} });
        if (!orderitem) {
            return res.status(404).json({ error: 'Orderitem not found.' });
        }

        if (product.stock < quantity) {
            return res.status(404).json({ message: 'Stock is not available.'})
        }

        orderitem.quantity = quantity;
        await orderitem.save();

        const orderitems = await Orderitem.findAll({ where: { order_id: orders.id } });
        let total_price = 0;
        for(const item of orderitems) {
            total_price += item.price * item.quantity;
        }

        // const order = await Order.findByPk(order_id);
        orders.total_price = total_price;
        await orders.save();

        res.status(201).json({ message: 'Item updated successfully.', Orderitem });        
    } catch (error) {
        console.error('Error updating item:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

exports.deleteOrder = async (req, res) => {
    const user_id = req.user.id;
    const { productId } = req.params;
    try {
        const orders = await Order.findOne({ where: { userId:user_id, status: 'pending' } });
        if (!orders) {
            return res.status(404).json({ error: 'Order not found.' });
        }

        const orderitem = await Orderitem.findOne({ where:{ order_id: orders.id, productId} });
        if (!orderitem) {
            return res.status(404).json({ error: 'Orderitem not found.' });
        }

        await orderitem.destroy();

        const orderitems = await Orderitem.findAll({ where: { order_id: orders.id } });
        let total_price = 0;
        for(const item of orderitems) {
            total_price += item.price * item.quantity;
        }

        // const order = await Order.findByPk(order_id);
        orders.total_price = total_price;
        await orders.save();

        res.status(201).json({ message: 'Item deleted successfully.', Orderitem });
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
}