const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const Category = require('./categories');
const Product = require('./product');
const Cart = require('./cart');
const User = require('./user');
const Order = require('./order');
const Orderitem = require('./orderitem');

const db = {
    Category,
    Product,
    Cart,
    User,
    Order,
    Orderitem
};

// Setting up associations
Category.hasMany(Product, { foreignKey: 'category_id' });
Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

User.hasMany(Cart, { foreignKey: 'id' });
Cart.belongsTo(User, { foreignKey: 'user_id' });

Product.hasMany(Cart, { foreignKey: 'id' });
Cart.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

User.hasMany(Order, { foreignKey: 'id' });
Order.belongsTo(User, { foreignKey: 'userId' });

Order.hasMany(Orderitem, { foreignKey: 'order_id' });
Orderitem.belongsTo(Order, { foreignKey: 'order_id' });

Product.hasMany(Orderitem, { foreignKey: 'productId' });
Orderitem.belongsTo(Product, { foreignKey: 'productId' });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
