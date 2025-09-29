const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Register a new user (with password hashing)
const registerUser = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Please add all fields' });
    }
    const userExists = await User.findOne({ username });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user with the hashed password
    const user = await User.create({ username, password: hashedPassword });

    if (user) {
        res.status(201).json({ _id: user.id, username: user.username });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Authenticate a user and get token
const loginUser = async (req, res) => {
    const { username, password } = req.body;
    console.log(`Attempting login for user: ${username}`);

    const user = await User.findOne({ username });

    // --- TEMPORARY DEBUGGING LOGIC ---
    // This will log in the user if the username exists, regardless of password.
    if (user) { 
        console.log('User found! Bypassing password check for this test.');
        res.json({
            _id: user.id,
            username: user.username,
            token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: '1d',
            }),
        });
    } else {
        console.log('User not found during login attempt.');
        res.status(400).json({ message: 'Invalid credentials' });
    }
};

module.exports = { registerUser, loginUser };