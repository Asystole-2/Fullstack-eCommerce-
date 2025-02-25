
const express = require("express")
const router = express.Router()
const Instruments = require("../models/instruments"); // Import the Product model
console.log("Instrument model: ", Instruments)

// Read all instruments
router.get("/instruments", async (req, res) => {
    try {
        const instruments = await Instruments.find()
        res.json(instruments)
    } catch (error) {
        console.error("Error fetching instruments:", error)
        res.status(500).json({error: "Internal Server Error"})
    }
})

// Read one instrument by ID
router.get("/instruments/:id", async (req, res) => {
    try {
        const instrument = await Instruments.findById(req.params.id)
        if (!instrument) return res.status(404).json({error: "Instrument not found"})
        res.json(instrument)
    } catch (error) {
        console.error("Error fetching instrument:", error)
        res.status(500).json({error: "Internal Server Error"})
    }
})

// ✅ Add new record
router.post("/instruments", async (req, res) => {
    try {
        const newInstrument = await Instruments.create(req.body)
        res.status(201).json(newInstrument)
    } catch (error) {
        console.error("Error adding instrument:", error)
        res.status(500).json({error: "Internal Server Error"})
    }
})

// Update instrument
router.put("/instruments/:id", async (req, res) => {
    try {
        const updatedInstrument = await Instruments.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true}
        )
        if (!updatedInstrument) return res.status(404).json({error: "Instrument not found"})
        res.json(updatedInstrument)
    } catch (error) {
        console.error("Error updating instrument:", error)
        res.status(500).json({error: "Internal Server Error"})
    }
})

// Delete instrument
router.delete("/api/instruments/:id", async (req, res) => {
    try {
        console.log("Attempting to delete instrument with ID:", req.params.id);

        const deletedInstrument = await Instruments.findByIdAndDelete(req.params.id);

        if (!deletedInstrument) {
            console.log("Instrument not found with ID:", req.params.id);
            return res.status(404).json({ message: "Instrument not found" });
        }

        console.log("Instrument deleted successfully:", deletedInstrument);
        res.json({ message: "Instrument deleted successfully" });
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ message: "Server error", error });
    }
});s

module.exports = router
