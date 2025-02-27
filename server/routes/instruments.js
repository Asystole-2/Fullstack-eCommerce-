const express = require("express")
const router = express.Router()
const InstrumentModel = require("../models/instruments"); // Import the Product model
console.log("Instrument model: ", InstrumentModel)
const mongoose = require("mongoose")

class Instrument {
    constructor(id) {
        this.id = id;
    }

    async getInstrument() {
        return await InstrumentModel.findById(this.id);
    }

    async increaseStock(amount) {
        const instrument = await this.getInstrument();
        if (!instrument) throw new Error("Instrument not found");
        instrument.stock += amount;
        await instrument.save();
        return instrument;
    }

    async decreaseStock(amount) {
        const instrument = await this.getInstrument();
        if (!instrument) throw new Error("Instrument not found");
        if (instrument.stock < amount) throw new Error("Insufficient stock");
        instrument.stock -= amount;
        await instrument.save();
        return instrument;
    }
}

// Read all instruments
router.get("/instruments", async (req, res) => {
    try {
        const instruments = await InstrumentModel.find()
        res.json(instruments)
    } catch (error) {
        console.error("Error fetching instruments:", error)
        res.status(500).json({error: "Internal Server Error"})
    }
})

// Read one instrument by ID
router.get("/instruments/:id", async (req, res) => {
    try {
        const instrument = await InstrumentModel.findById(req.params.id)
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
        const newInstrument = await InstrumentModel.create(req.body)
        res.status(201).json(newInstrument)
    } catch (error) {
        console.error("Error adding instrument:", error)
        res.status(500).json({error: "Internal Server Error"})
    }
})

// Update instrument
router.put("/instruments/:id", async (req, res) => {
    try {
        const updatedInstrument = await InstrumentModel.findByIdAndUpdate(
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

        const deletedInstrument = await InstrumentModel.findByIdAndDelete(req.params.id);

        if (!deletedInstrument) {
            console.log("Instrument not found with ID:", req.params.id);
            return res.status(404).json({message: "Instrument not found"});
        }

        console.log("Instrument deleted successfully:", deletedInstrument);
        res.json({message: "Instrument deleted successfully"});
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({message: "Server error", error});
    }
});

// ✅ Fixed Increase Stock Route
router.put("/instruments/:id/increase", async (req, res) => {
    try {
        const { id } = req.params;
        const { amount } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid instrument ID" });
        }

        if (!amount || amount <= 0) {
            return res.status(400).json({ error: "Invalid amount" });
        }

        const updatedInstrument = await InstrumentModel.findByIdAndUpdate(
            id,
            { $inc: { stock: amount } }, // ✅ Atomic increment
            { new: true }
        );

        if (!updatedInstrument) return res.status(404).json({ error: "Instrument not found" });

        res.json({ message: "Stock increased", stock: updatedInstrument.stock });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Fixed Decrease Stock Route
router.put("/instruments/:id/decrease", async (req, res) => {
    try {
        const { id } = req.params;
        const { amount } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid instrument ID" });
        }

        if (!amount || amount <= 0) {
            return res.status(400).json({ error: "Invalid amount" });
        }

        const instrument = await InstrumentModel.findById(id);
        if (!instrument) return res.status(404).json({ error: "Instrument not found" });

        if (instrument.stock < amount) {
            return res.status(400).json({ error: "Stock cannot be negative" });
        }

        instrument.stock -= amount;
        await instrument.save();

        res.json({ message: "Stock decreased", stock: instrument.stock });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router
