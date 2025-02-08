const mongoose = require('mongoose')

const uri = 'mongodb://localhost/fullstack_ecommerce_project';

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

module.exports = connectDB;