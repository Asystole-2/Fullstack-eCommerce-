
const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/users');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const authenticateJWT = require("../middleware/authMiddleware");
const express = require("express");

// Set up multer to handle image uploads
const upload = multer({ dest: process.env.UPLOADED_FILES_FOLDER || './uploads' });


const JWT_PRIVATE_KEY = fs.readFileSync(process.env.JWT_PRIVATE_KEY_FILENAME, 'utf8')

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


// Delete user
router.delete("/api/user/:id", authenticateJWT, async (req, res) => {
    try {
        console.log("Attempting to delete user with ID:", req.params.id);

        // Ensure ID is provided
        if (!req.params.id) {
            return res.status(400).json({message: "User ID is required"});
        }

        // Ensure the request includes a valid token
        if (!req.user) {
            return res.status(401).json({message: "Unauthorized. No valid JWT token."});
        }

        console.log("Authenticated User:", req.user);

        // Check if the user exists
        const userToDelete = await UserModel.findById(req.params.id);
        if (!userToDelete) {
            console.log("User not found with ID:", req.params.id);
            return res.status(404).json({message: "User not found"});
        }

        // Delete the user
        const deletedUser = await UserModel.findByIdAndDelete(req.params.id);
        console.log("User deleted successfully:", deletedUser);

        res.status(200).json({message: "User deleted successfully"});
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({message: "Server error", error: error.message});
    }
});

// Get all users
router.get("/users", async (req, res) => {
    try {
        const users = await UserModel.find({}, {password: 0}); // Exclude password for security
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({error: "Internal Server Error"});
    }
});

// Get a single user by ID
router.get("/users/:id", async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id, {password: 0}); // Exclude password
        if (!user) return res.status(404).json({error: "User not found"});
        res.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({error: "Internal Server Error"});
    }
});


// const multer  = require('multer')
// const upload = multer({dest: `${process.env.UPLOADED_FILES_FOLDER}`})
//
// const emptyFolder = require('empty-folder')

// Register user with validation and image upload
router.post('/users/register', upload.single("profilePhoto"), async (req, res) => {
    const { name, email, password } = req.body;

    // Validation
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

// Login
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

        const token = jwt.sign(
            { id: user._id, role: user.role },
            JWT_PRIVATE_KEY,
            { expiresIn: '1h' }
        )
        let redirectURL = user.role === 'admin' ? '/MainPage' : '/MainPage';
        res.json({ token, role: user.role,  profilePhoto: user.profilePhotoFilename ? `/uploads/${user.profilePhotoFilename}` : null, redirectURL });
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});


router.post(`/users/logout/`, (req, res) => {
    res.json({})
})

module.exports = router;
