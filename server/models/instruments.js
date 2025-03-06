const mongoose = require("mongoose");

let productPhotosShcema = new mongoose.Schema({
    filename:{type:String,required:true}
})

const ProductSchema = new mongoose.Schema({
    brand: {type: String},
    category: {type: String},
    name: {type: String},
    description: {type: String},
    rating: {type: Number},
    reviews: {type: Number},
    price: {type: Number},
    stock: {type: Number},
    image: [{type: String}] , // Image may not be required
    // image:[productPhotosShcema],
    sold: {type: Boolean, default:false}
}, {
    collection: "products",
});

const Instruments = mongoose.model("instruments", ProductSchema)
module.exports = Instruments