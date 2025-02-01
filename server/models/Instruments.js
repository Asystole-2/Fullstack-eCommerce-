const mongoose = require(`mongoose`)

let Products = new mongoose.Schema(
    {

        name: { type: String, required: true },
        category: { type: String, required: true },
        price: { type: Number, required: true },
        stock: { type: Number, required: true },
        description: { type: String },
        images: [{ type: String }],
        brand: { type: String },
        rating: { type: Number, default: 0 },
        reviews: { type: Number, default: 0 }
    },
    {
        collection: `products`,
    })

module.exports = mongoose.model(`products`, Products)