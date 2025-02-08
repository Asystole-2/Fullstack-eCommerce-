
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require("bcrypt");

const uri = 'mongodb://localhost/fullStack_ecommerce';

mongoose.connect(uri)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {console.log("connected to", db.client.s.url)})


async function connectDB() {
    try {
        await mongoose.connect(uri); // No need for useNewUrlParser or useUnifiedTopology
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1); // Stop app if connection fails
    }
}

// const UserSchema = new mongoose.Schema({
//     username: String,
//     password: String,
//     role: {type: String, default: "user"}
// })
//
// const User = mongoose.model('User', UserSchema)
//
// // Middleware to verify JWT Token
// const verifyToken = (req, res, next) => {
//     const token = req.headers['Authorization']
//     if (!token) return res.status(401).json('Access denied')
//
//     try {
//         const verified = jwt.verify(token, process.env.JWT_SECRET)
//         req.user = verified
//         next()
//     }catch(err) {
//         res.status(400).json({error: 'Invalid token'})
//     }
// }

// app.post('/Register', async (req, res) => {
//     const { username, password, role } = req.body
//     const salt = await bcrypt.genSalt(10)
//     const hashPassword = await bcrypt.hash(password, salt)
//
//     const user = new User({username, password: hashPassword, role})
//     await user.save()
//     res.json({ message: 'Registered successfully' })
// })
//
// app.post('/login', async (req, res) => {
//     const { username, password } = req.body
//
//     const user = await User.findOne({ username })
//     if (!user) return res.status(400).json({ error: 'User not found' })
//
//     const isMatch = await bcrypt.compare(password, user.password)
//     if (!isMatch) return res.status(400).json({ error: 'Wrong Password' })
//
//     const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
//     res.json({ token, role: user.role });
//     res.json({ message: 'Registered successfully' })
// })

module.exports = connectDB;