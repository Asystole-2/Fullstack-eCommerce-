const mongoose = require(`mongoose`)

let usersSchema = new mongoose.Schema(
    {
        name: {type: String, required: true},
        email: {type: String, required: true},
        password: {type: String, required: true},
        profilePhotoFilename: {type:String, default:""}

    },
    {
        collection: `users`
    })

module.exports = mongoose.model(`users`, usersSchema)