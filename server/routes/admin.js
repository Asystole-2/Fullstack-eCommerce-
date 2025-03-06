const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const adminAuth = require('../middleware/adminAuth');

const fs = require('fs')
const JWT_PRIVATE_KEY = fs.readFileSync(process.env.JWT_PRIVATE_KEY_FILENAME, 'utf8')

const router = express.Router();

// Admin login route
router.post('/login', async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await User.findOne({email});
        if (!user || user.role !== 'admin') {
            return res.status(403).send({message: 'Unauthorized: Admin only'});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(403).send({message: 'Unauthorized: Invalid Password'});
        }

        const token = jwt.sign(
            {id: user._id, role: user.role},
            JWT_PRIVATE_KEY,
            {expiresIn: '15m'}
        );

        res.json({token});
    } catch (error) {
        return res.status(500).json({message: 'Server Error'});
    }
});

// Admin Dashboard Route
router.get('/dashboard', adminAuth, (req, res) => { // Fixed missing '/'
    res.json({message: 'Welcome to Admin Dashboard', admin: req.user});
});

module.exports = router;