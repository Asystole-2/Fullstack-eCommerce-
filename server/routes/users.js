const router = require(`express`).Router()
const usersModel = require(`../models/users`)
const bcrypt = require(`bcrypt`)
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require('cors')

// const multer  = require('multer')
// const upload = multer({dest: `${process.env.UPLOADED_FILES_FOLDER}`})
//
// const emptyFolder = require('empty-folder')

router.post(`/users/register/:name/:email/:password`, (req, res) => {
    console.log(req.params.name);

    // Check if user already exists
    usersModel.findOne({email: req.params.email}).then(uniqueData => {
        if (uniqueData) {
            res.json({errorMessage: `User already exists`})
        } else {
            bcrypt.hash(req.params.password, parseInt(process.env.PASSWORD_HASH_SALT_ROUNDS)).then(hash => {
                usersModel.create({name: req.params.name, email: req.params.email, password: hash}).then(data => {
                    if (data) {
                        res.json({name: data.name})
                    } else {
                        res.json({errorMessage: `User was not registered`})
                    }
                })
            })
        }
    })
})

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    role: {type: String, default: "user"}
})

const User = mongoose.model('User', UserSchema)

// Middleware to verify JWT Token
const verifyToken = (req, res, next) => {
    const token = req.headers['Authorization']
    if (!token) return res.status(401).json('Access denied')

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET)
        req.user = verified
        next()
    } catch (err) {
        res.status(400).json({error: 'Invalid token'})
    }
}

router.post('/Register', async (req, res) => {
    const {username, password, role} = req.body
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)

    const user = new User({username, password: hashPassword, role})
    await user.save()
    res.json({message: 'Registered successfully'})
})

router.post('/users/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Wrong Password' });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, role: user.role });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('Internal Server Error');
    }
});



router.get('/Admin', verifyToken, (req, res) => {
    if (req.user.role !== 'admin@gmail.com') return res.status(403).json({error: 'Access Denied'})
    res.json({message: 'Welcome Admin!'});
})

module.exports = router;