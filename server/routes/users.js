const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/users');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Set up multer to handle image uploads
const upload = multer({ dest: `${process.env.UPLOADED_FILES_FOLDER}` });

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ error: 'Invalid token' });
    }
};

// Validation functions
const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
}
const isValidPassword = (password) => {
    return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/.test(password);
}
const isValidName = (name) => {
    return /^[a-zA-Z\s]{3,50}$/.test(name);
}

// Register user with validation and image upload
router.post('/users/register', upload.single("profilePhoto"), async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (!isValidName(name)) {
        return res.status(400).json({ error: 'Name must be between 3 and 50 characters and contain only letters and spaces.' });
    }

    if (!isValidEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format.' });
    }

    if (!isValidPassword(password)) {
        return res.status(400).json({ error: 'Password must be at least 8 characters, include one uppercase letter, one lowercase letter, one number, and one special character.' });
    }

    if (!req.file) {
        return res.status(400).json({ errorMessage: 'No file was selected to be uploaded' });
    }

    if (!['image/png', 'image/jpg', 'image/jpeg'].includes(req.file.mimetype)) {
        fs.unlink(path.join(__dirname, req.file.path), (error) => {
            return res.status(400).json({ errorMessage: 'Only .png, .jpg, and .jpeg formats are accepted' });
        });
    } else {
        // File is valid, continue processing the user registration
        try {
            const existingUser = await UserModel.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ error: 'User already exists' });
            }

            // Hash password
            const saltRounds = parseInt(process.env.PASSWORD_HASH_SALT_ROUNDS) || 10;
            const hashPassword = await bcrypt.hash(password, saltRounds);

            // Create new user
            const newUser = new UserModel({
                name,
                email,
                password: hashPassword,
                profilePhotoFilename: req.file.filename, // Save the filename in the database
            });

            await newUser.save();

            res.status(201).json({ message: 'User registered successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});

// User login with validation
router.post('/users/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    if (!isValidEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    try {
        const user = await UserModel.findOne({ email });
        if (!user) return res.status(400).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Wrong Password' });

        if (!user.role) {
            return res.status(400).json({ error: 'User role is missing in the database' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        let redirectURL = user.role === 'admin' ? '/MainPage' : '/MainPage';
        res.json({ token, role: user.role, redirectURL });
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

// Get all users
router.get('/users', verifyToken, async (req, res) => {
    try {
        const users = await UserModel.find({}, { password: 0 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get a single user by ID
router.get('/users/:id', verifyToken, async (req, res) => {
    if (req.user.id !== req.params.id && !req.user.isAdmin) {
        return res.status(403).json({ error: 'Access denied' });
    }
    try {
        const user = await UserModel.findById(req.params.id, { password: 0 });
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete user
router.delete('/api/user/:id', verifyToken, async (req, res) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ error: 'Access denied. Admins only.' });
    }

    try {
        const deletedUser = await UserModel.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;
