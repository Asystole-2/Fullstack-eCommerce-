const mongoose = require(`mongoose`)

let Products = new mongoose.Schema(
    {

        _id: {type: ObjectId},
        name: {type: String},
        category: {type: String},
        price: {type: Double},
        stock: {type: Integer},
        description: {type: String},
        images: {type: {}},
        brand: {type: String},
        rating: {type: Double},
        reviews: {type: Integer}
    },
    {
        collection: `products`,
    })

module.exports = mongoose.model(`products`, Products)