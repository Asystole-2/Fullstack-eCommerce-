const mongoose = require(`mongoose`)

let usersSchema = new mongoose.Schema(
    {
        name: {type: String, required: true},
        email: {type: String, required: true},
        password: {type: String, required: true},
        // profilePhotoFilename: {type:String, default:""}
        accessLevel: {type: Number, default: parseInt(process.env.ACCESS_LEVEL_NORMAL_USER)},
        role: {type: String, enum: ['user', 'admin'], default: 'user'}
    },
    {
        collection: `users`
    })

module.exports = mongoose.model(`users`, usersSchema)