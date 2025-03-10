const fs = require("fs");
const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router()

// Load public key for verifying JWTs
const publicKey = fs.readFileSync(process.env.JWT_PUBLIC_KEY_FILENAME, "utf8");

const authenticateJWT = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ errorMessage: "User is not logged in" });
    }

    const token = authHeader.split(" ")[1]; // Expecting format: "Bearer <token>"

    if (!token) {
        return res.status(403).json({ errorMessage: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, publicKey, { algorithms: ["RS256"] });
        req.user = decoded; // Attach user data to request
        next();
    } catch (error) {
        console.error("JWT Verification Failed:", error);
        return res.status(401).json({ errorMessage: "Invalid or expired token." });
    }
};

router.use((req, res, next) => {
    console.log("Received Token:", req.headers.authorization);
    next();
});

module.exports = authenticateJWT;