const fs = require("fs");
const jwt = require("jsonwebtoken");

// Load public key for verifying JWTs
const publicKey = fs.readFileSync(process.env.JWT_PUBLIC_KEY_FILENAME, "utf8");

const authenticateJWT = (req, res, next) => {
    console.log(" Received Authorization Header:", req.headers.authorization);

    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
        console.error(" No valid Authorization header received.");
        return res.status(401).json({ errorMessage: "User is not logged in" });
    }

    const token = req.headers.authorization.split(" ")[1];
    console.log("🛠 Extracted Token:", token);

    try {
        const decoded = jwt.verify(token, publicKey, { algorithms: ["RS256"] });
        console.log(" Decoded User:", decoded);
        req.user = decoded;
        next();
    } catch (error) {
        console.error(" JWT Verification Failed:", error.message);
        return res.status(401).json({ errorMessage: "Invalid or expired token." });
    }
};

// const authorizeAdmin = (req, res, next) => {
//     if (req.user.role !== "admin") {
//         return res.status(403).json({ errorMessage: "Admin access required." });
//     }
//     next();
// };


module.exports = authenticateJWT;