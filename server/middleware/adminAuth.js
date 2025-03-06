const jwt = require("jsonwebtoken");

const fs = require('fs');
const JWT_PRIVATE_KEY = fs.readFileSync(process.env.JWT_PRIVATE_KEY_FILENAME, 'utf8')

const adminAuth = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({error: "Access denied"});

    try {
        const decoded = jwt.verify(token.split(" ")[1], JWT_PRIVATE_KEY);
        if (decoded.role !== "admin") {
            return res.status(403).json({error: "Unauthorized: Admins only"});
        }

        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({error: "Invalid token"});
    }
};

module.exports = adminAuth;