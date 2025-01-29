const router = require("express").Router()

// let uniqueId = instruments.length

const Instruments = require('./models/Instruments')

// Read all items from instruments JSON
router.get(`/instruments`, (req, res) => {
    Instruments.find({}, (err, data) => {
        res.json(data)
    })
})

// Read one item from instruments JSON
router.get(`/instruments/:id`, (req, res) => {
    const selectedInstrument = instruments.find(
        (instrument) => instrument._id === parseInt(req.params.id)
    )

    if (!selectedInstrument) {
        return res.status(404).json({ error: "Instrument not found" })
    }

    res.json(selectedInstrument)
})

// Add new item to instruments JSON
router.post(`/instruments`, (req, res) =>
{
  Instruments.create(req.body, (err, data) =>
  {
      res.json(data)
  })
})

// Update one item in instruments JSON
router.put(`/instruments/:id`, (req, res) => {
    const updatedInstrument = req.body
    let found = false

    instruments.map((instrument) => {
        if (instrument._id === parseInt(req.params.id)) {
            instrument.name = updatedInstrument.name
            instrument.price = updatedInstrument.price
            instrument.stock = updatedInstrument.stock
            instrument.description = updatedInstrument.description
            instrument.image = updatedInstrument.image
            found = true
        }
    })

    if (!found) {
        return res.status(404).json({ error: "Instrument not found" })
    }

    res.json(instruments)
})

// Delete one item from instruments JSON
router.delete(`/instruments/:id`, (req, res) => {
    const instrumentIndex = instruments.findIndex(
        (instrument) => instrument._id === parseInt(req.params.id)
    )

    if (instrumentIndex === -1) {
        return res.status(404).json({ error: "Instrument not found" })
    }

    instruments.splice(instrumentIndex, 1)

    res.json(instruments)
})

module.exports = router
