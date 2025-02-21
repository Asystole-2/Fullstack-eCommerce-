// Mongoose
const mongoose = require('mongoose');

// Cors
const cors = require('cors')

// Bcrypt
const bcrypt = require('bcrypt')

// jsonwebtoken
const jwt = require('jsonwebtoken')

// Express
const express = require(`express`)
const app = express()

// Server-side global variables
require(`dotenv`).config({path: `./config/.env`})

//mongoose stuff
require(`./config/db`)

// Middleware
app.use(express.json());
app.use(cors());

app.use(require(`body-parser`).json())


// Routers
app.use(require(`./routes/instruments`))


// Port
app.listen(process.env.SERVER_PORT, () => {
    console.log(`Connected to port ` + process.env.SERVER_PORT)
})


// Error 404
app.use((req, res, next) => {
    next(createError(404))
})

// Other errors
app.use(function (err, req, res, next) {
    console.error(err.message)
    if (!err.statusCode) {
        err.statusCode = 500
    }
    res.status(err.statusCode).send(err.message)
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

app.post('/Register', async (req, res) => {
    const {username, password, role} = req.body
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)

    const user = new User({username, password: hashPassword, role})
    await user.save()
    res.json({message: 'Registered successfully'})
})

app.post('/Login', async (req, res) => {
    const {username, password} = req.body

    const user = await User.findOne({username})
    if (!user) return res.status(400).json({error: 'User not found'})

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(400).json({error: 'Wrong Password'})

    const token = jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn: '1h'});
    res.json({token, role: user.role});
    res.json({message: 'Registered successfully'})
})

app.get('/Admin', verifyToken, (req, res) => {
    if (req.user.role !== 'admin@gmail.com') return res.status(403).json({error: 'Access Denied'})
    res.json({message: 'Welcome Admin!'});
})
