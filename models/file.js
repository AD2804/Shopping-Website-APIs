const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const File = sequelize.define('File',{
    id:{
        type: DataTypes.STRING,
        allowNull: false,   
        autoIncrement: true,
        primaryKey: true
    },
    uID:{
        type: DataTypes.INTEGER,
        allowNull: false, 
        references:{
            model: 'user',
            key: 'id'
        }
    },
    filename:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    filepath:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    filetype:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    filesize:{
        type: DataTypes.INTEGER,
        allowNull: false,
    }
},{
    tableName: 'file',
    timestamps: false
});

module.exports = File;