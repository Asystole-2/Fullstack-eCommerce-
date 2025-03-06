const jwt = require("jsonwebtoken");

const adminAuth = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({error: "Access denied"});

    try {
        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
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