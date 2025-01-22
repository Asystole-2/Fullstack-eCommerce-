const router = require(`express`).Router()



const cars = [{_id:0, model:"Avensis", colour:"Red", year:2020, price:30000},
              {_id:1, model:"Yaris", colour:"Green", year:2010, price:2000},
              {_id:2, model:"Corolla", colour:"Red", year:2019, price:20000},
              {_id:3, model:"Avensis", colour:"Silver", year:2018, price:20000},
              {_id:4, model:"Camry", colour:"White", year:2020, price:50000}]

let uniqueId = cars.length



// read all items from cars JSON
router.get(`/cars`, (req, res) => {   
    res.json(cars)
})


// Read one item from cars JSON
router.get(`/cars/:id`, (req, res) => 
{
    const selectedCars = cars.filter(car => car._id === parseInt(req.params.id))
    
    res.json(selectedCars[0])
})


// Add new item to cars JSON
router.post(`/cars`, (req, res) => {
    let newCar = req.body
    newCar._id = uniqueId
    cars.push(newCar)
    
    uniqueId++
    
    res.json(cars)
})


// Update one item in cars JSON
router.put(`/cars/:id`, (req, res) => 
{
    const updatedCar = req.body
    cars.map(car => 
    {
        if(car._id === parseInt(req.params.id))
        {
            car.model = updatedCar.model
            car.colour = updatedCar.colour
            car.year = updatedCar.year
            car.price = updatedCar.price
        }
    })
    
    res.json(cars)   
})


// Delete one item from cars JSON
router.delete(`/cars/:id`, (req, res) => 
{
    let selectedIndex
    cars.map((car, index) => 
    {
        if(car._id === parseInt(req.params.id))
        {
            selectedIndex = index
        }
    })
    cars.splice(selectedIndex, 1)
    
    res.json(cars)       
})

module.exports = router