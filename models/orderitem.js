const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Orderitem = sequelize.define('Orderitem',{
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: "order",
            key: "id"
        }
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: "product",
            key: "id"
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
},{
    tableName: "orderitem",
    timestamps: false
});

module.exports = Orderitem;