const router = require('express').Router();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');

// Define user schema
const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: 'user' }
});

const User = mongoose.model('User', UserSchema);

// Middleware to verify JWT Token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json('Access denied');

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ error: 'Invalid token' });
    }
};

// Register route
router.post('/users/register', (req, res) => {
    const { name, email, password } = req.body;

    // Check if user already exists
    User.findOne({ email }).then(uniqueData => {
        if (uniqueData) {
            res.json({ errorMessage: 'User already exists' });
        } else {
            bcrypt.hash(password, parseInt(process.env.PASSWORD_HASH_SALT_ROUNDS)).then(hash => {
                User.create({ name, email, password: hash }).then(data => {
                    if (data) {
                        res.json({ name: data.name });
                    } else {
                        res.json({ errorMessage: 'User was not registered' });
                    }
                });
            });
        }
    });
});

// Login route
router.post('/users/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Wrong Password' });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, role: user.role });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('Internal Server Error');
    }
});


// Admin route
router.get('/Admin', verifyToken, (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access Denied' });
    res.json({ message: 'Welcome Admin!' });
});

module.exports = router;