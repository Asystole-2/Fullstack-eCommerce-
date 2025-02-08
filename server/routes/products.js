// const router = require("express").Router()
//
// const Instruments = require('../models/Instruments')
//
// // Read all items from instruments JSON
// router.get(`/instruments`, (req, res) => {
//     Instruments.find({}, (err, data) => {
//         res.json(data)
//     })
// })
//
// // Read one item from instruments JSON
// router.get(`/instruments/:id`, (req, res) => {
//     const selectedInstrument = instruments.find(
//         (instrument) => instrument._id === parseInt(req.params.id)
//     )
//
//     if (!selectedInstrument) {
//         return res.status(404).json({ error: "Instrument not found" })
//     }
//
//     res.json(selectedInstrument)
// })
//
// // Add new item to instruments JSON
// router.post(`/instruments`, (req, res) =>
// {
//   Instruments.create(req.body, (err, data) =>
//   {
//       res.json(data)
//   })
// })
//
// // Update one item in instruments JSON
// router.put(`/instruments/:id`, (req, res) => {
//     const updatedInstrument = req.body
//     let found = false
//
//     instruments.map((instrument) => {
//         if (instrument._id === req.params.id) {
//             instrument.name = updatedInstrument.name
//             instrument.price = updatedInstrument.price
//             instrument.stock = updatedInstrument.stock
//             instrument.description = updatedInstrument.description
//             instrument.image = updatedInstrument.image
//             found = true
//         }
//     })
//
//     if (!found) {
//         return res.status(404).json({ error: "Instrument not found" })
//     }
//
//     res.json(instruments)
// })
//
// // Delete one item from instruments JSON
// router.delete(`/instruments/:id`, (req, res) => {
//     const instrumentIndex = instruments.findIndex(
//         (instrument) => instrument._id === parseInt(req.params.id)
//     )
//
//     if (instrumentIndex === -1) {
//         return res.status(404).json({ error: "Instrument not found" })
//     }
//
//     instruments.splice(instrumentIndex, 1)
//
//     res.json(instruments)
// })
//
// module.exports = router
const express = require("express")
const router = express.Router()
const Instruments = require("../models/Instruments")

// Read all instruments
router.get("/instruments", async (req, res) => {
    try {
        const instruments = await Instruments.find()
        res.json(instruments)
    } catch (error) {
        console.error("Error fetching instruments:", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
})

// Read one instrument by ID
router.get("/instruments/:id", async (req, res) => {
    try {
        const instrument = await Instruments.findById(req.params.id)
        if (!instrument) return res.status(404).json({ error: "Instrument not found" })
        res.json(instrument)
    } catch (error) {
        console.error("Error fetching instrument:", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
})

// Add new instrument
router.post("/instruments", async (req, res) => {
    Instruments.create(req.body, (error, data) =>
    {
        res.json(data)
    })
})

// Update instrument
router.put("/instruments/:id", async (req, res) => {
    try {
        const updatedInstrument = await Instruments.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
        if (!updatedInstrument) return res.status(404).json({ error: "Instrument not found" })
        res.json(updatedInstrument)
    } catch (error) {
        console.error("Error updating instrument:", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
})

// Delete instrument
router.delete("/instruments/:id", async (req, res) => {
    try {
        const deletedInstrument = await Instruments.findByIdAndDelete(req.params.id)
        if (!deletedInstrument) return res.status(404).json({ error: "Instrument not found" })
        res.json({ message: "Instrument deleted successfully" })
    } catch (error) {
        console.error("Error deleting instrument:", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
})

module.exports = router
