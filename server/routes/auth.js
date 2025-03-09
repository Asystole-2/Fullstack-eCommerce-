const express = require("express");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const usersModel = require("../models/users"); // Adjust the path to your User model

const router = express.Router();

// Load private key for signing JWTs
const privateKey = fs.readFileSync("./config/private.pem", "utf8");

router.post("/register", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const existingUser = await usersModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ errorMessage: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const accessLevel = role === "admin" ? 10 : 1;

        const newUser = new usersModel({ name, email, password: hashedPassword, role, accessLevel });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ errorMessage: "Error registering user" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ errorMessage: "Email and password are required." });
        }

        const user = await usersModel.findOne({ email });

        if (!user) {
            return res.status(401).json({ errorMessage: "Invalid email or password." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ errorMessage: "Invalid email or password." });
        }

        // Create JWT token with RS256 using private.pem
        const token = jwt.sign(
            { email: user.email, accessLevel: user.accessLevel, role: user.role },
            privateKey,
            { algorithm: "RS256", expiresIn: process.env.JWT_EXPIRY || "1h" }
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

module.exports = router;