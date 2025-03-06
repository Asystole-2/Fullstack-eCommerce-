// Cors
const cors = require('cors')

// Express
const express = require(`express`)
const app = express()


const cartRoutes = require('./routes/cart')
app.use('/api', cartRoutes)

// Server-side global variables
require(`dotenv`).config({path: `./config/.env`})

//mongoose stuff
require(`./config/db`)

// Middleware
app.use(express.json())
app.use(cors())

app.use(require(`body-parser`).json())


// Routers

const adminRoutes = require(`./routes/admin`)
const userRoutes = require(`./routes/users`)
// const instrumentsRoutes = require(`./routes/instruments`)
// const salesRoutes = require(`./routes/sales`)

// app.use(instrumentsRoutes)
app.use(userRoutes)
app.use('/api/admin', adminRoutes)
// app.use(salesRoutes)
app.use(require(`./routes/instruments`))
app.use(require(`./routes/sales`))


// Port
app.listen(process.env.SERVER_PORT, () => {
    console.log(`Connected to port ` + process.env.SERVER_PORT)
})


// Error 404
app.use((req, res, next) => {
    next(createError(404))
})

// Other errors
app.use(function (err, req, res, next) {
    console.error(err.message)
    if (!err.statusCode) {
        err.statusCode = 500
    }
    res.status(err.statusCode).send(err.message)
})