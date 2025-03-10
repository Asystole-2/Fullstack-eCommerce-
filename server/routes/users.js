const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/users');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { authenticateJWT, authorizeAdmin } = require("../middleware/authMiddleware");

// Set up multer for file uploads
const upload = multer({ dest: process.env.UPLOADED_FILES_FOLDER || './uploads' });

// Helper function to get JWT private key
const getPrivateKey = () => {
    try {
        return fs.readFileSync(process.env.JWT_PRIVATE_KEY_FILENAME, 'utf8');
    } catch (error) {
        console.error("Error loading JWT private key:", error);
        return null;
    }
};

// Validation functions
const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);
const isValidPassword = (password) => /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/.test(password);
const isValidName = (name) => /^[a-zA-Z\s]{3,50}$/.test(name);

//Register user
router.post('/users/register', upload.single("profilePhoto"), async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    if (!isValidName(name) || !isValidEmail(email) || !isValidPassword(password)) {
        return res.status(400).json({ error: 'Invalid input format' });
    }

    if (!req.file) {
        return res.status(400).json({ errorMessage: 'No file uploaded' });
    }

    if (!['image/png', 'image/jpg', 'image/jpeg'].includes(req.file.mimetype)) {
        await fs.promises.unlink(path.join(__dirname, req.file.path));
        return res.status(400).json({ errorMessage: 'Only .png, .jpg, and .jpeg formats are accepted' });
    }

    try {
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) return res.status(400).json({ error: 'User already exists' });

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = new UserModel({
            name,
            email,
            password: hashPassword,
            profilePhotoFilename: req.file.filename,
            accessLevel: 1
        })

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
})


// Login
router.post('/users/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ errorMessage: "Email and password are required." });
        }

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ errorMessage: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ errorMessage: "Invalid email or password" });
        }

        const JWT_PRIVATE_KEY = getPrivateKey();
        if (!JWT_PRIVATE_KEY) return res.status(500).json({ error: "JWT Private Key Error" });

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role, accessLevel: user.accessLevel },
            JWT_PRIVATE_KEY,
            { algorithm: "RS256", expiresIn: process.env.JWT_EXPIRY }
        );

        res.json({
            name: user.name,
            role: user.role,
            token,
            accessLevel: user.accessLevel // clearly included here
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ errorMessage: "An error occurred during login." });
    }
})

// Get user profile
router.get('/users/me', authenticateJWT, async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.id).select('-password'); // Exclude password
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

// Update User
router.put('/users/update', authenticateJWT, async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const updateData = {};

        if (name) {
            if (!isValidName(name)) {
                return res.status(400).json({ error: "Invalid name format" });
            }
            updateData.name = name;
        }

        if (email) {
            if (!isValidEmail(email)) {
                return res.status(400).json({ error: "Invalid email format" });
            }
            const emailExists = await UserModel.findOne({ email });
            if (emailExists && emailExists._id.toString() !== req.user.id) {
                return res.status(400).json({ error: "Email already in use" });
            }
            updateData.email = email;
        }

        if (password) {
            if (!isValidPassword(password)) {
                return res.status(400).json({ error: "Password does not meet security requirements" });
            }
            updateData.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await UserModel.findByIdAndUpdate(req.user.id, updateData, { new: true }).select("-password");
        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Update error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

// Delete user - Admin only
router.delete("/api/user/:id", authenticateJWT, authorizeAdmin, async (req, res) => {
    try {
        console.log("Attempting to delete user with ID:", req.params.id);

        if (!req.params.id) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const userToDelete = await UserModel.findById(req.params.id);
        if (!userToDelete) {
            return res.status(404).json({ message: "User not found" });
        }

        await UserModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
})

// Logout (Dummy)
router.post(`/users/logout/`, (req, res) => {
    res.json({});
})

module.exports = router;
