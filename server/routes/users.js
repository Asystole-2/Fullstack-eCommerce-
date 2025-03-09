
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
const upload = multer({ dest: `${process.env.UPLOADED_FILES_FOLDER}` });
=======


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


    if (!name || !email || !password) {
        return res.status(400).json({error: 'All fields are required'});
    }

    if (!isValidName(name)) {
        return res.status(400).json({error: 'Name must be between 3 and 50 characters and contain only letters and spaces.'});
    }

    if (!isValidEmail(email)) {
        return res.status(400).json({error: 'Invalid email format.'});
    }

    if (!isValidPassword(password)) {
        return res.status(400).json({error: 'Password must be at least 8 characters, include one uppercase letter, one lowercase letter, one number, and one special character.'});
    }

    if (!name || !email || !password) {
        return res.status(400).json({error: 'All fields are required'});
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
          
            // Set access level based on role (default: normal user)
            const accessLevel = role === "admin" ? 2 : 1;

            // Create new user
            const newUser = new UserModel({
                name,
                email,
                password: hashPassword,
                role, accessLevel,
                profilePhotoFilename: req.file.filename, // Save the filename in the database
            });

            await newUser.save();
          
            // Generate JWT Token
        const token = jwt.sign(
            {id: newUser._id, email: newUser.email, accessLevel: newUser.accessLevel, role: newUser.role},
            JWT_PRIVATE_KEY,
            {algorithm: "RS256", expiresIn: process.env.JWT_EXPIRES || "1h"}
        );

        res.status(201).json({
            message: "User registered successfully",
            token,
            user: {name: newUser.name, email: newUser.email, role: newUser.role}
        });

        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }

    }
});

// Login
router.post(`/users/login`, async (req, res) => {
    try {
        const {email, password} = req.body; // Get login credentials from request body


        if (!email || !password) {
            return res.status(400).json({errorMessage: "Email and password are required."});
        }


        if (!isValidEmail(email)) {
            return res.status(400).json({error: 'Invalid email format'});
        }

        const user1 = await UserModel.findOne({email: "admin@example.com"});
        console.log(user1.accessLevel); // Should be 'admin' for admin, 'user' for normal users

        console.log("User role: ", user1.accessLevel); // Add this before sending response

        // Find the user by email
        const user = await UserModel.findOne({email});

        if (!user) {
            console.log("User not found in DB");
            return res.status(401).json({errorMessage: "Invalid email or password"});
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({errorMessage: "Invalid email or password"});
        }

        // Create JWT token
        const token = jwt.sign(
            {email: user.email, accessLevel: user.accessLevel, role: user.role},
            JWT_PRIVATE_KEY,
            {algorithm: "RS256", expiresIn: process.env.JWT_EXPIRY}
        );

        res.json({
            name: user.name,
            accessLevel: user.accessLevel,
            role: user.role,
            token: token,
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({errorMessage: "An error occurred during login."});
    }
});


router.post(`/users/logout/`, (req, res) => {
    res.json({})
})

module.exports = router;
