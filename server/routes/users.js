const router = require(`express`).Router()
const bcrypt = require(`bcrypt`)
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require('cors')
const UserModel = require("../models/users");

const fs = require('fs')
const JWT_PRIVATE_KEY = fs.readFileSync(process.env.JWT_PRIVATE_KEY_FILENAME, 'utf8')

// Delete user
router.delete("/api/user/:id", async (req, res) => {
    try {
        console.log("Attempting to delete user with ID:", req.params.id);

        const deletedUser = await UserModel.findByIdAndDelete(req.params.id);

        if (!deletedUser) {
            console.log("User not found with ID:", req.params.id);
            return res.status(400).json({message: "User not found"});
        }

        console.log("User deleted successfully:", deletedUser);
        res.json({message: "User deleted successfully"});
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({message: "Server error", error});
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

router.post(`/users/register/:name/:email/:password`, (req, res) => {
    console.log(req.params.name);

    // Check if user already exists
    UserModel.findOne({email: req.params.email}).then(uniqueData => {
        if (uniqueData) {
            res.json({errorMessage: `User already exists`})
        } else {
            bcrypt.hash(req.params.password, parseInt(process.env.PASSWORD_HASH_SALT_ROUNDS)).then(hash => {
                UserModel.create({name: req.params.name, email: req.params.email, password: hash}).then(data => {
                    if (data) {
                        const token = jwt.sign( { email: data.email, accessLevel: data.accessLevel }, JWT_PRIVATE_KEY, {algorithm: "RS256", expiresIn: process.env.JWT_EXPIRES });
                        res.json({name: data.name, accessLevel: data.accessLevel, token: token});
                    } else {
                        res.json({errorMessage: `User was not registered`})
                    }
                })
            })
        }
    })
})

router.post('/users/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(`Login attempt: ${email}`);

        // Find user in database
        const user = await UserModel.findOne({ email });

        if (!user) {
            console.error("Login error: User not found");
            return res.status(400).json({ error: 'User not found' });
        }

        if (!user.role) {
            console.error("Login error: User role is missing");
            return res.status(400).json({ error: 'User role is missing in the database' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.error("Login error: Wrong password");
            return res.status(400).json({ error: 'Wrong Password' });
        }

        // Generate JWT Token
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: user.role,
            },
            JWT_PRIVATE_KEY, // Secret key from `.env`
            { algorithm: 'RS256', expiresIn: process.env.JWT_EXPIRY } // Expiry from `.env`
        );

        console.log(`User ${user.email} logged in successfully with role ${user.role}`);

        // Send response with token
        res.json({
            message: "Login successful",
            role: user.role,
            token: token
        });

    } catch (error) {
        console.error("Server Error in Login:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});


router.post(`/users/logout/`, (req,res) =>
{
    res.json({})
})

// Middleware to verify JWT Token
const verifyToken = (req, res, next) => {
    const token = req.headers['Authorization']
    if (!token) return res.status(401).json('Access denied')

    try {
        const verified = jwt.verify(token, JWT_PRIVATE_KEY)
        req.user = verified
        next()
    } catch (err) {
        res.status(400).json({error: 'Invalid token'})
    }
}

router.post('/register', async (req, res) => {
    const {username, password, role} = req.body
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)

    new UserModel({username, password: hashPassword, role})
    await UserModel.save()
    res.json({message: 'Registered successfully'})
})

module.exports = router;