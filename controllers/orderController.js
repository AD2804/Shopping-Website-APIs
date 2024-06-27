const { error } = require('console');
const Order = require('../models/order');
const Orderitem = require('../models/orderitem');
const Product = require('../models/product');
const Category = require('../models/categories');
const Cart = require('../models/cart');
const { Sequelize } = require('../models');
const auth = require('../middleware/auth');

exports.getOrderById = async (req, res) =>{
    // const { id } = req.params;
    const id = req.user.id;
    try {
        const order = await Order.findByPk(id,{
            include: {
                model: Orderitem,
                as: 'Orderitems',
                attributes: ['id', 'order_id', 'productId', 'quantity', 'price'],
                include: {
                    model: Product,
                    as: 'Product',
                    attributes: ['name'],
                    include: {
                        model: Category,
                        as: 'category',
                        attributes: ['name'],
                    }
                }
            },
            attributes: ['id', 'userId', 'total_price', 'status'],
        });
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        // const formattedOrder = {
        //     id: order.id,
        //     userId: order.userId,
        //     total_price: order.total_price,
        //     status: order.status,
        //     Orderitems: order.Orderitems.map(item => ({
        //         id: item.id,
        //         order_id: item.order_id,
        //         productId: item.productId,
        //         quantity: item.quantity,
        //         price: item.price,
        //         Product_name: item.Product.name,
        //         Category: item.Product.category.name,
        //     }))
        // };
        res.json({ order });
    } catch (error) {
        console.error('Error getting order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getOrderByUser = async (req, res)=>{
    const userId = req.user.id;
    // const { userId } = req.params;
    try{
    const order = await Order.findAll({ 
        where: { userId },
        include: {
            model: Orderitem,
            as: 'Orderitems',
            attributes: ['id', 'order_id', 'productId', 'quantity', 'price'],
            include: {
                model: Product,
                as: 'Product',
                attributes: ['name'],
                include: {
                    model: Category,
                    as: 'category',
                    attributes: ['name'],
                }
            }
        },
        attributes: ['id', 'userId', 'total_price', 'status'],
    });
    res.json(order);
    } catch(error){
        console.error('Error getting order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.createOrderDirect = async (req, res)=>{
    const user_id = req.user.id;
    const { product_id, quantity } = req.body;
    const { status = 'Pending' } = req.body;
    try {
        const product = await Product.findByPk(product_id);
        if (!Number.isInteger(quantity) || quantity <= 0) {
            return res.status(400).json({ error: "Invalid quantity value." });
        }
        if (!product) {
            return res.status(404).json({ message: 'Product not found'});
        }

        if (product.stock < quantity) {
            return res.status(404).json({ message: 'Stock is not available.'})
        }
        
        const total_price = product.price * quantity;
        const order = await Order.create({
            userId: user_id, total_price: total_price, status: status,
            
        });
        
        await Orderitem.create({
            order_id: order.id,
            productId: product_id,
            quantity: quantity,
            price: product.price
        });
        product.stock -= quantity;
        await product.save();
   
        res.status(201).json({message: 'Order created succesfully', order});
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.createOrder = async (req, res) =>{
    const user_id = req.user.id;
    // const { user_id } = req.params;
    const { status = 'Pending' } = req.body;
    try {
        const cartItems = await Cart.findAll({
            where: { user_id },
            include: [{ model: Product, as: 'product' }]
        });

        if (cartItems.length === 0) {
            return res.status(404).json({ error: 'No items in cart to create an order' });
        }
        let totalprice = 0;
        for(const item of cartItems){
            if (item.product.stock < item.quantity) {
                return res.status(404).json({ message: 'Stock is not available.'})
            }
            totalprice += item.product.price * item.quantity;
        }

        // const order = await Order.findAll();
        // for(const item in order){
        //     if(item.userId === user_id) {
                
        //     }
        //     const order = await Order.create({
        //         userId: user_id, total_price: totalprice, status: status
        //     });
        // }
        const order = await Order.create({
            userId: user_id, total_price: totalprice, status: status
        });
        for (const item of cartItems){
            await Orderitem.create({
                order_id: order.id,
                productId: item.product.id,
                quantity: item.quantity,
                price: item.product.price
            });
            
            item.product.stock -= item.quantity;
            await item.product.save();
        }

        await Cart.destroy({where: {user_id}});
        res.status(201).json({message: 'order created succesfully', order});
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateOrderStatus = async (req, res) =>{
    const id = req.user.id;
    // const { id } = req.params;
    const { status } = req.body;
    try {
        const order = await Order.findOne({where: {userId: id}});

        if (!order) {
            return res.status(404).json({error: 'Order not found'});
        }

        order.status = status;
        await order.save();

        res.json({message: "Order status updated successfully.", order});
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deleteOrder = async (req, res) =>{
    const id = req.user.id;
    // const { id } = req.params;
    try {
        const order = await Order.findOne({where: {userId:id}});
        if (!order) {
            return res.status(404).json({error: 'Order not found'});
        }

        const orderitems = await Orderitem.findAll({
            where:{ order_id: order.id}
        })
        for(const item of orderitems){
            await item.destroy();
        }
        await order.destroy();

        res.json({message: "Order deleted successfully."});
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};