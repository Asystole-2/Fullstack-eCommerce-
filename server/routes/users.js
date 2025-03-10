<<<<<<< HEAD
const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/users');

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

// Register user with validation
router.post('/users/register', async (req, res) => {
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

    try {
        //Check if user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        //Hash password
        const saltRounds = parseInt(process.env.PASSWORD_HASH_SALT_ROUNDS) || 10;
        const hashPassword = await bcrypt.hash(password, saltRounds);

        //Create new user
        const newUser = new UserModel({ name, email, password: hashPassword });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
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

// Update user details (name, email, or password)
router.put('/users/update', verifyToken, async (req, res) => {
    const { name, email, password } = req.body;
    let updates = {};

    try {
        // Fetch the user from the database
        const user = await UserModel.findById(req.user.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        // Validate and update name
        if (name) {
            if (!isValidName(name)) {
                return res.status(400).json({ error: "Name must be between 3 and 50 characters and contain only letters and spaces." });
            }
            updates.name = name;
        }

        // Validate and update email
        if (email) {
            if (!isValidEmail(email)) {
                return res.status(400).json({ error: "Invalid email format." });
            }
            const emailExists = await UserModel.findOne({ email });
            if (emailExists && emailExists._id.toString() !== user._id.toString()) {
                return res.status(400).json({ error: "Email already in use by another account." });
            }
            updates.email = email;
        }

        // Validate and update password
        if (password) {
            if (!isValidPassword(password)) {
                return res.status(400).json({ error: "Password must be at least 8 characters, include one uppercase, one lowercase, one number, and one special character." });
            }
            const saltRounds = parseInt(process.env.PASSWORD_HASH_SALT_ROUNDS) || 10;
            updates.password = await bcrypt.hash(password, saltRounds);
        }

        // Apply updates
        const updatedUser = await UserModel.findByIdAndUpdate(req.user.id, updates, { new: true });

        res.json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Internal Server Error" });
=======
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const UserModel = require("../models/users");
const authenticateJWT = require("../middleware/authMiddleware");

const JWT_PRIVATE_KEY = fs.readFileSync(process.env.JWT_PRIVATE_KEY_FILENAME, 'utf8')

// Delete user
router.delete("/api/user/:id", authenticateJWT, async (req, res) => {
    try {
        console.log("Attempting to delete user with ID:", req.params.id);

        // Ensure ID is provided
        if (!req.params.id) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Ensure the request includes a valid token
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized. No valid JWT token." });
        }

        console.log("Authenticated User:", req.user);

        // Check if the user exists
        const userToDelete = await UserModel.findById(req.params.id);
        if (!userToDelete) {
            console.log("User not found with ID:", req.params.id);
            return res.status(404).json({ message: "User not found" });
        }

        // Delete the user
        const deletedUser = await UserModel.findByIdAndDelete(req.params.id);
        console.log("User deleted successfully:", deletedUser);

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
>>>>>>> admin-login3
    }
});

// Get all users
<<<<<<< HEAD
router.get('/users', verifyToken, async (req, res) => {
=======
router.get("/users", async (req, res) => {
>>>>>>> admin-login3
    try {
        const users = await UserModel.find({}, {password: 0}); // Exclude password for security
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get a single user by ID
<<<<<<< HEAD
router.get('/users/:id', verifyToken, async (req, res) => {
    if (req.user.id !== req.params.id && !req.user.isAdmin) {
        return res.status(403).json({ error: 'Access denied' });
    }
    try {
        const user = await UserModel.findById(req.params.id, { password: 0 });
        if (!user) return res.status(404).json({ error: 'User not found' });
=======
router.get("/users/:id", async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id, {password: 0}); // Exclude password
        if (!user) return res.status(404).json({error: "User not found"});
>>>>>>> admin-login3
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

<<<<<<< HEAD
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
=======

// const multer  = require('multer')
// const upload = multer({dest: `${process.env.UPLOADED_FILES_FOLDER}`})
//
// const emptyFolder = require('empty-folder')

// Register User
router.post('/users/register', async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Check if user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const saltRounds = parseInt(process.env.PASSWORD_HASH_SALT_ROUNDS) || 10;
        const hashPassword = await bcrypt.hash(password, saltRounds);

        // Set access level based on role (default: normal user)
        const accessLevel = role === "admin" ? 2 : 1;

        // Create user
        const newUser = new UserModel({ name, email, password: hashPassword, role, accessLevel });
        await newUser.save();

        // Generate JWT Token
        const token = jwt.sign(
            { id: newUser._id, email: newUser.email, accessLevel: newUser.accessLevel, role: newUser.role },
            JWT_PRIVATE_KEY,
            { algorithm: "RS256", expiresIn: process.env.JWT_EXPIRES || "1h" }
        );

        res.status(201).json({
            message: "User registered successfully",
            token,
            user: { name: newUser.name, email: newUser.email, role: newUser.role }
        });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Login
router.post(`/users/login`, async (req, res) => {
    try {
        const { email, password } = req.body; // Get login credentials from request body

        if (!email || !password) {
            return res.status(400).json({ errorMessage: "Email and password are required." });
        }

        const user1 = await UserModel.findOne({ email: "admin@example.com" });
        console.log(user1.accessLevel); // Should be 'admin' for admin, 'user' for normal users

        console.log("User role: ", user1.accessLevel); // Add this before sending response

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
            { email: user.email, accessLevel: user.accessLevel, role: user.role },
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
});


router.post(`/users/logout/`, (req,res) =>
{
    res.json({})
})

module.exports = router;
>>>>>>> admin-login3
