const express = require("express")
const router = express.Router()
const InstrumentModel = require("../models/instruments"); // Import the Product model
const { authenticateJWT } = require("../middleware/authMiddleware");
console.log("Instrument model: ", InstrumentModel)
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken");
const fs = require("fs");

const JWT_PRIVATE_KEY = fs.readFileSync(process.env.JWT_PRIVATE_KEY_FILENAME, 'utf8')

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
        jwt.verify(req.headers.authorization, JWT_PRIVATE_KEY, {algorithm: "RS256"}, (err, decodedToken) => {
            if (err) {
                res.json({errorMessage:`User is not logged in`})
            }
            else {
                InstrumentModel.findById(req.params.id, (error, data) => {
                    res.json(data)
                })
            }
        })
    } catch (error) {
        console.error("Error fetching instrument:", error)
        res.status(500).json({error: "Internal Server Error"})
    }
})

// // Add new record
router.post('/instruments/add',authenticateJWT, async (req, res) => {
    try {
        // Extract the token from the Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ errorMessage: "User is not logged in" });
        }

        // Create a new car record
        const newInstrument = await InstrumentModel.create(req.body);

        res.status(201).json(newInstrument);
    } catch (error) {
        console.error("Error adding instruments:", error);
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ errorMessage: "Invalid token" });
        }
        res.status(500).json({ errorMessage: "Internal server error" });
    }
});

// Update instrument
router.put("/instruments/:id", authenticateJWT, async (req, res) => {
    try {
        // Extract the token from the Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ errorMessage: "User is not logged in" });
        }

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
router.delete("/api/instruments/delete/:id",authenticateJWT, async (req, res) => {
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

// Increase Stock Route
router.put("/instruments/:id/increase",authenticateJWT, async (req, res) => {
    try {
        const {id} = req.params;
        const {amount} = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({error: "Invalid instrument ID"});
        }

        if (!amount || amount <= 0) {
            return res.status(400).json({error: "Invalid amount"});
        }

        const updatedInstrument = await InstrumentModel.findByIdAndUpdate(
            id,
            {$inc: {stock: amount}}, // Atomic increment
            {new: true}
        );

        if (!updatedInstrument) return res.status(404).json({error: "Instrument not found"});

        res.json({message: "Stock increased", stock: updatedInstrument.stock});

    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

// Decrease Stock Route
router.put("/instruments/:id/decrease",authenticateJWT, async (req, res) => {
    try {
        const {id} = req.params;
        const {amount} = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({error: "Invalid instrument ID"});
        }

        if (!amount || amount <= 0) {
            return res.status(400).json({error: "Invalid amount"});
        }

        const instrument = await InstrumentModel.findById(id);
        if (!instrument) return res.status(404).json({error: "Instrument not found"});

        if (instrument.stock < amount) {
            return res.status(400).json({error: "Stock cannot be negative"});
        }

        instrument.stock -= amount;
        await instrument.save();

        res.json({message: "Stock decreased", stock: instrument.stock});

    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

module.exports = router