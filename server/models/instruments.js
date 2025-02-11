const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    brand: { type: String},
    category: { type: String},
    name: { type: String},
    description: { type: String},
    price: { type: Number},
    stock: { type: Number},
    image: { type: String }  // Image may not be required
},{
    collection: "products",
});

const Instruments = mongoose.model("instruments", ProductSchema);
module.exports = Instruments;