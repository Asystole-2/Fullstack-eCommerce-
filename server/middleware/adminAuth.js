const jwt = require('jsonwebtoken');

const adminAuth = (req, res, next) => {
    const token = req.headers('Authorization');
    if (!token) return res.status(401).send('Access denied');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'admin') {
            return res.status(401).send('Access denied');
        }

        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).send('Invalid token');
    }
}

module.exports = adminAuth;