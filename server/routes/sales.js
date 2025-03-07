const router = require(`express`).Router()
const salesModel = require(`../models/sales`)
const instrumentsModel = require(`../models/instruments`)

router.post('/sales', async (req, res, next) => {
    try {
        const { paymentID, items, total, userId, customerName, customerEmail } = req.body

        // Validate request
        if (!paymentID || !items || !total || !userId) {
            return res.status(400).json({ error: 'Missing required fields' })
        }

        // Check product availability
        for (const item of items) {
            const product = await instrumentsModel.findById(item.productId)
            if (!product) {
                return res.status(404).json({ error: `Product ${item.productId} not found` })
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ error: `Insufficient stock for ${product.name}` })
            }
        }

        // Update stock
        await Promise.all(items.map(async item => {
            await instrumentsModel.findByIdAndUpdate(
                item.productId,
                { $inc: { stock: -item.quantity } },
                { new: true }
            )
        }))

        // Create sale record
        const sale = await salesModel.create({
            paypalPaymentID: paymentID,
            userId,
            items,
            total,
            customerName,
            customerEmail
        })

        res.json({ success: true, data: sale })
    } catch (err) {
        next(err)
    }
})

module.exports = router
// const router = require(`express`).Router()
// const salesModel = require(`../models/sales.js`)
// const instrumentsModel = require(`../models/instruments.js`)
//
// const createNewSaleDocument = (req, res, next) =>
// {
//     // Use the PayPal details to create a new sale document
//     let saleDetails = new Object()
//
//     saleDetails.paypalPaymentID = req.params.paymentID
//     saleDetails.productID = req.params.productID
//     saleDetails.price = req.params.price
//     saleDetails.customerName = req.params.customerName
//     saleDetails.customerEmail = req.params.customerEmail
//
//     instrumentsModel.findByIdAndUpdate({_id:req.params.productID}, {sold: true}, (err, data) =>
//     {
//         if(err)
//         {
//             return next(err)
//         }
//     })
//
//     salesModel.create(saleDetails, (err, data) =>
//     {
//         if(err)
//         {
//             return next(err)
//         }
//     })
//
//     return res.json({success:true})
// }
//
//
// router.post('/sales/:paymentID/:productID/:price/:customerName/:customerEmail', createNewSaleDocument)
//
//
// module.exports = router
// const router = require(`express`).Router()
// const salesModel = require(`../models/sales`)
// const instrumentsModel = require(`../models/instruments`)
//
// router.post('/sales', async (req, res, next) => {
//     try {
//         const { paymentID, items, total, userId, customerName, customerEmail } = req.body
//
//         if (!paymentID || !items || !total || !userId) {
//             return res.status(400).json({ error: 'Missing required fields' })
//         }
//
//         // Check stock before processing
//         for (const item of items) {
//             const product = await instrumentsModel.findById(item.productId)
//             if (!product) {
//                 return res.status(404).json({ error: `Product ${item.productId} not found` })
//             }
//             if (product.stock < item.quantity) {
//                 return res.status(400).json({ error: `Insufficient stock for ${product.name}` })
//             }
//         }
//         // Update product stock
//         await Promise.all(items.map(async item => {
//             await instrumentsModel.findByIdAndUpdate(
//                 item.productId,
//                 { $inc: { stock: -item.quantity } },
//                 { new: true }
//             )
//         }))
//
//         // Create sale record
//         const sale = await salesModel.create({
//             paypalPaymentID: paymentID,
//             userId,
//             items,
//             total,
//             customerName,
//             customerEmail
//         })
//
//         res.json({ success: true, data: sale })
//     } catch (err) {
//         next(err)
//     }
// })
//
// module.exports = router