const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/users');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { authenticateJWT, authorizeAdmin } = require("../middleware/authMiddleware");
const mongoose = require("mongoose");
const express = require("express");

// Set up multer to handle image uploads
const upload = multer({ dest: process.env.UPLOADED_FILES_FOLDER || './uploads' });

const JWT_PRIVATE_KEY = fs.readFileSync(process.env.JWT_PRIVATE_KEY_FILENAME, 'utf8')

const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);
const isValidPassword = (password) => /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/.test(password);
const isValidName = (name) => /^[a-zA-Z\s]{3,50}$/.test(name);


// Delete user
router.delete("/users/:id", authenticateJWT, async (req, res) => {
    try {
        console.log("Deleting user with ID:", req.params.id);

        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Invalid user ID format" });
        }

        const deletedUser = await UserModel.findByIdAndDelete(req.params.id);

        if (!deletedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        console.log("User deleted successfully:", deletedUser);
        res.json({ message: "User deleted successfully" });

    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

// Get all users
router.get("/users", async (req, res) => {
    try {
        const users = await UserModel.find({}, {password: 0});
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({error: "Internal Server Error"});
    }
});

// Get a single user by ID
router.get("/users/:id", async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id, {password: 0});
        if (!user) return res.status(404).json({error: "User not found"});
        res.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({error: "Internal Server Error"});
    }
});


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
                profilePhotoFilename: req.file.filename,
            });

            await newUser.save();

            res.status(201).json({ message: 'User registered successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});

// User login with validation
// Login
router.post(`/users/login`, async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!isValidEmail(email)) {
            return res.status(400).json({ error: 'Invalid email format.' });
        }

        if (!email || !password) {
            return res.status(400).json({ errorMessage: "Email and password are required." });
        }

        const user1 = await UserModel.findOne({ email: "admin@example.com" });
        console.log(user1.accessLevel);

        console.log("User role: ", user1.accessLevel);

        // Find the user by email
        const user = await UserModel.findOne({ email });

        if (!user) {
            console.log("User not found in DB");
            return res.status(401).json({ errorMessage: "Invalid email or password" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ errorMessage: "Invalid email or password" });
        }

        // Create JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email, accessLevel: user.accessLevel, role: user.role },
            JWT_PRIVATE_KEY,
            { algorithm: "RS256", expiresIn: process.env.JWT_EXPIRY }
        );

        res.json({
            name: user.name,
            accessLevel: user.accessLevel,
            role: user.role,
            token: token,
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ errorMessage: "An error occurred during login." });
    }
})

// Get user profile
router.get('/users/me', authenticateJWT, async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

// Update User
router.put('/users/update', authenticateJWT, async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const updateData = {};

        if (name) {
            if (!isValidName(name)) {
                return res.status(400).json({ error: "Invalid name format" });
            }
            updateData.name = name;
        }

        if (email) {
            if (!isValidEmail(email)) {
                return res.status(400).json({ error: "Invalid email format" });
            }
            const emailExists = await UserModel.findOne({ email });
            if (emailExists && emailExists._id.toString() !== req.user.id) {
                return res.status(400).json({ error: "Email already in use" });
            }
            updateData.email = email;
        }

        if (password) {
            if (!isValidPassword(password)) {
                return res.status(400).json({ error: "Password does not meet security requirements" });
            }
            updateData.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await UserModel.findByIdAndUpdate(req.user.id, updateData, { new: true }).select("-password");
        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Update error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

// Delete user - Admin only
router.delete("/api/user/:id", authenticateJWT, authorizeAdmin, async (req, res) => {
    try {
        console.log("Attempting to delete user with ID:", req.params.id);

        if (!req.params.id) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const userToDelete = await UserModel.findById(req.params.id);
        if (!userToDelete) {
            return res.status(404).json({ message: "User not found" });
        }

        await UserModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
})

// Logout (Dummy)
router.post(`/users/logout/`, (req, res) => {
    res.json({})
})

module.exports = router;
