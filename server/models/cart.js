// const mongoose = require('mongoose')
//
// const cartSchema = new mongoose.Schema({
//     userId: {type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true},
//     items: [
//         {
//             productId: {type: mongoose.Schema.Types.ObjectId, ref: 'instruments', required: true},
//             quantity: {type: Number, required: true, min: 1},
//             price: {type: Number, required: true}
//         }
//     ]
// }, {collection: 'carts'})
//
// module.exports = mongoose.model('Cart', cartSchema)
// models/cart.js
const mongoose = require('mongoose')

const cartItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Instrument', // Match your instrument model name
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true
    }
})

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [cartItemSchema]
}, {
    timestamps: true
})

module.exports = mongoose.model('Cart', cartSchema)