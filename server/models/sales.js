const mongoose = require("mongoose")

const saleItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Instrument", required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    name: { type: String, required: true },
    brand: { type: String },
    category: { type: String },
})

const salesSchema = new mongoose.Schema(
    {
        paypalPaymentID: { type: String, required: true },
        userId: { type: String, required: true },
        items: [saleItemSchema],
        total: { type: Number, required: true },
        customerName: { type: String, required: true },
        customerEmail: { type: String, required: true },
    },
    { timestamps: true } // Automatically add createdAt and updatedAt fields
)

module.exports = mongoose.model("Sale", salesSchema)