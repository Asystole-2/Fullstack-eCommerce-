const router = require("express").Router()
const salesModel = require("../models/sales")
const instrumentsModel = require("../models/instruments")

router.post("/sales", async (req, res, next) => {
    try {
        const { paymentID, items, total, userId, customerName, customerEmail } = req.body

        console.log("Received sale data:", req.body) // Log the request payload

        // Validate request
        if (!paymentID || !items || !total || !userId || !customerName || !customerEmail) {
            console.error("Missing required fields:", {
                paymentID,
                items,
                total,
                userId,
                customerName,
                customerEmail,
            })
            return res.status(400).json({ error: "Missing required fields" })
        }

        // Check product availability and validate items
        for (const item of items) {
            const product = await instrumentsModel.findById(item.productId)
            if (!product) {
                console.error(`Product ${item.productId} not found`)
                return res.status(404).json({ error: `Product ${item.productId} not found` })
            }
            if (product.stock < item.quantity) {
                console.error(`Insufficient stock for ${product.name}`)
                return res.status(400).json({ error: `Insufficient stock for ${product.name}` })
            }

            // Add product details to the item
            item.name = product.name // Add instrument name
            item.brand = product.brand // Add instrument brand
            item.category = product.category // Add instrument category
        }

        // Update stock
        await Promise.all(
            items.map(async (item) => {
                await instrumentsModel.findByIdAndUpdate(
                    item.productId,
                    { $inc: { stock: -item.quantity } }, // Decrease stock by item quantity
                    { new: true }
                )
            })
        )

        // Create sale record
        const sale = await salesModel.create({
            paypalPaymentID: paymentID,
            userId: userId,
            items: items,
            total: total,
            customerName: customerName,
            customerEmail: customerEmail,
        })

        console.log("Sale created successfully:", sale) // Log the created sale
        res.status(201).json({ success: true, data: sale })
    } catch (err) {
        console.error("Error creating sale:", err)
        res.status(500).json({ error: "Internal server error", details: err.message })
    }
})

module.exports = router