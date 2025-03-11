const fs = require("fs");
const jwt = require("jsonwebtoken");

// Load public key for verifying JWTs
const publicKey = fs.readFileSync(process.env.JWT_PUBLIC_KEY_FILENAME, "utf8");

const authenticateJWT = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ errorMessage: "User is not logged in" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(403).json({ errorMessage: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, publicKey, { algorithms: ["RS256"] });
        req.user = decoded;
        next();
    } catch (error) {
        console.error("JWT Verification Failed:", error);
        return res.status(401).json({ errorMessage: "Invalid or expired token." });
    }
};

const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ errorMessage: "Admin access required." });
    }
    next();
};

module.exports = { authenticateJWT, authorizeAdmin };
