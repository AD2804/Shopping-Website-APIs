const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        allownull: false,
        primaryKey: true
    },
    name : {
        type: DataTypes.STRING,
        allownull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allownull: false,
    },
    price: {
        type: DataTypes.DECIMAL,
        allownull: false,
    },
    stock: {
        type: DataTypes.INTEGER,
        allownull: false,
    },
    category_id: {
        type: DataTypes.INTEGER,
        references:{
            model: 'categories',
            key: 'id'
        }
    }
},{
    tableName: "product",
    timestamps : false,
})

module.exports = Product;