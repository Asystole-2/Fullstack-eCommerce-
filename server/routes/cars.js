// const router = require(`express`).Router()
//
//
//
// const cars = [{_id:0, model:"Avensis", colour:"Red", year:2020, price:30000},
//               {_id:1, model:"Yaris", colour:"Green", year:2010, price:2000},
//               {_id:2, model:"Corolla", colour:"Red", year:2019, price:20000},
//               {_id:3, model:"Avensis", colour:"Silver", year:2018, price:20000},
//               {_id:4, model:"Camry", colour:"White", year:2020, price:50000}]
//
// let uniqueId = cars.length
//
//
//
// // read all items from cars JSON
// router.get(`/cars`, (req, res) => {
//     res.json(cars)
// })
//
//
// // Read one item from cars JSON
// router.get(`/cars/:id`, (req, res) =>
// {
//     const selectedCars = cars.filter(car => car._id === parseInt(req.params.id))
//
//     res.json(selectedCars[0])
// })
//
//
// // Add new item to cars JSON
// router.post(`/cars`, (req, res) => {
//     let newCar = req.body
//     newCar._id = uniqueId
//     cars.push(newCar)
//
//     uniqueId++
//
//     res.json(cars)
// })
//
//
// // Update one item in cars JSON
// router.put(`/cars/:id`, (req, res) =>
// {
//     const updatedCar = req.body
//     cars.map(car =>
//     {
//         if(car._id === parseInt(req.params.id))
//         {
//             car.model = updatedCar.model
//             car.colour = updatedCar.colour
//             car.year = updatedCar.year
//             car.price = updatedCar.price
//         }
//     })
//
//     res.json(cars)
// })
//
//
// // Delete one item from cars JSON
// router.delete(`/cars/:id`, (req, res) =>
// {
//     let selectedIndex
//     cars.map((car, index) =>
//     {
//         if(car._id === parseInt(req.params.id))
//         {
//             selectedIndex = index
//         }
//     })
//     cars.splice(selectedIndex, 1)
//
//     res.json(cars)
// })
//
// module.exports = router

const router = require("express").Router()

const instruments = [
    {
        _id: 0,
        name: "Acoustic Guitar",
        price: 199.99,
        stock: 10,
        description: "High-quality acoustic guitar.",
        image: "https://example.com/images/acoustic-guitar.jpg",
    },
    {
        _id: 1,
        name: "Electric Keyboard",
        price: 299.99,
        stock: 5,
        description: "Professional electric keyboard.",
        image: "https://example.com/images/electric-keyboard.jpg",
    },
    {
        _id: 2,
        name: "Drum Set",
        price: 599.99,
        stock: 3,
        description: "Complete drum set for beginners and pros.",
        image: "https://example.com/images/drum-set.jpg",
    },
    {
        _id: 3,
        name: "Violin",
        price: 149.99,
        stock: 8,
        description: "Elegant violin with bow included.",
        image: "https://example.com/images/violin.jpg",
    },
    {
        _id: 4,
        name: "Electric Guitar",
        price: 249.99,
        stock: 7,
        description: "Powerful electric guitar for rock lovers.",
        image: "https://example.com/images/electric-guitar.jpg",
    },
]

let uniqueId = instruments.length

// Read all items from instruments JSON
router.get(`/instruments`, (req, res) => {
    res.json(instruments)
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
router.post(`/instruments`, (req, res) => {
    const newInstrument = req.body
    newInstrument._id = uniqueId
    instruments.push(newInstrument)

    uniqueId++

    res.json(instruments)
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
