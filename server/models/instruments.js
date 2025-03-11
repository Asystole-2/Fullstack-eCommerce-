const mongoose = require("mongoose");

// Main product schema
const ProductSchema = new mongoose.Schema({
    brand: {
        type: String,
        required: [true, "Brand is required"],
        trim: true
    },

    category: {
        type: String,
        required: [true, "Category is required"],
        trim: true
    },

    name: {
        type: String,
        required: [true, "Product name is required"],
        trim: true,
        minlength: [3, "Product name must be at least 3 characters long"],
        maxlength: [100, "Product name must not exceed 100 characters"]
    },

    description: {
        type: String,
        required: [true, "Description is required"],
        trim: true,
        minlength: [10, "Description must be at least 10 characters long"]
    },

    rating: {
        type: Number,
        default: 0,
        min: [0, "Rating cannot be negative"],
        max: [5, "Rating cannot exceed 5"]
    },

    reviews: {
        type: Number,
        default: 0,
        min: [0, "Reviews cannot be negative"]
    },

    price: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price cannot be negative"]
    },

    stock: {
        type: Number,
        required: [true, "Stock quantity is required"],
        min: [0, "Stock cannot be negative"]
    },

    images: { type: [String], required: [true, "At least one image is required"] },

    sold: {
        type: Boolean,
        default: false
    }
}, {
    collection: "products",
    timestamps: true
});

// Export the model
const Instruments = mongoose.model("instruments", ProductSchema);
module.exports = Instruments;
