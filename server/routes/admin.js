const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// Admin login route
router.post('/admin/login', async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await User.findOne({email})
        if (!user || user.role !== 'admin') {
            return res.status(403).send( { message: 'Unauthorized: Admin only' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(403).send( { message: 'Unauthorized: Invalid Password' });
        }

        // Generate a JWT token
        const token = jwt.sign({
            id: user._id, role: user.role
        },
            process.env.JWT_SECRET, {
            expiresIn: '15m'
            })
        res.json({ token })
    } catch (error) {
        return res.status(500).json({message: 'Server Error'});
    }
})

router.get('dashboard', adminAuth, (req, res) => {
    res.json({ message: 'Welcome to Admin Dashboard', admin: req.user });
})

module.exports = router;