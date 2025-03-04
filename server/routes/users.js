const router = require(`express`).Router()
const usersModel = require(`../models/users`)
const bcrypt = require(`bcrypt`)
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require('cors')
const UserModel = require("../models/users");

//Middleware to verify token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ error: "Invalid token" });
    }
};

// Delete user
router.delete("/api/user/:id", verifyToken, async (req, res) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ error: "Access denied. Admins only." });
    }

    try {
        console.log("Attempting to delete user with ID:", req.params.id);
        const deletedUser = await UserModel.findByIdAndDelete(req.params.id);

        if (!deletedUser) {
            console.log("User not found with ID:", req.params.id);
            return res.status(400).json({ message: "User not found" });
        }

        console.log("User deleted successfully:", deletedUser);
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ message: "Server error", error });
    }
});


// Get all users
router.get("/users", verifyToken, async (req, res) => {
    try {
        const users = await UserModel.find({}, { password: 0 });
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// Get a single user by ID
router.get("/users/:id", verifyToken, async (req, res) => {
    if (req.user.id !== req.params.id && !req.user.isAdmin) {
        return res.status(403).json({ error: "Access denied" });
    }
    try {
        const user = await UserModel.findById(req.params.id, { password: 0 });
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



// const multer  = require('multer')
// const upload = multer({dest: `${process.env.UPLOADED_FILES_FOLDER}`})
//
// const emptyFolder = require('empty-folder')

router.post("/users/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Check if user already exists
        const existingUser = await usersModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Hash password
        const saltRounds = parseInt(process.env.PASSWORD_HASH_SALT_ROUNDS) || 10;
        const hashPassword = await bcrypt.hash(password, saltRounds);

        // Create user
        const newUser = new usersModel({ name, email, password: hashPassword });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/users/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await usersModel.findOne({ email });
        if (!user) return res.status(400).json({ error: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Wrong password" });

        const isAdmin = email.endsWith("@admin.com");

        const token = jwt.sign(
            { id: user._id, isAdmin }, // Store isAdmin flag in token
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ token, isAdmin });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;