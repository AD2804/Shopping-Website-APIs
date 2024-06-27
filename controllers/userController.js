const { error } = require('console');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const User = require('../models/user');
const { Sequelize } = require('sequelize');

function generateToken(user) {
    const payload = {
        id: user.id,
        username: user.username,
        email: user.email
    };
    return jwt.sign(payload, 'your_jwt_secret_key', { expiresIn: '1h' });
}

exports.getUsers = async(req, res)=>{
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        console.error('Error getting users',error.message, error.stack);
        res.status(500).json({error: "Internel Server error"});
    }
};

exports.userRegistration = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existUser = await User.findOne({
            where: {
                [Op.or]: [{ username: username }, { email: email }]
            }
        });
        if(existUser){
            return res.status(200).json({error: "User with this email or username already exists."})
        }
        await User.create({ username, email, password });
        res.status(201).json({ message: "The user registered successfully." });
    } catch (error) {
        console.error('Error while registering!!!', error); // Log the full error object
        res.status(500).json({ error: "Internal Server error" });
    }
}

exports.userLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ 
                where: { email: email }
        });
        if (!user || !await user.isValidPassword(password)) {
            return res.status(401).json({ error: "Invalid Email or Password!!"});
        }
        const token = generateToken(user);
        res.json({ token });
        // res.json({ message: "The user logged in succesfully." })
    } catch (error) {
        console.error('Error while logging in!!!', error.stack);
        res.status(500).json({ error: "Internel Server error" });
    }
}