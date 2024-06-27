const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'user',
    timestamps: false,
    hooks:{
        beforeCreate: async (user) => {
            if(user.password){
                const salt = await  bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }            
        },
        beforeUpdate: async (user) => {
            if (user.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        }
    }
});

// Method to validate password
User.prototype.isValidPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = User;