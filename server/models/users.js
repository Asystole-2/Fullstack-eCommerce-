const mongoose = require("mongoose");

let usersSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 50,
            validate: {
                validator: function(v) {
                    return /^[a-zA-Z\s]+$/.test(v);
                },
                message: props => `${props.value} is not a valid name! Only letters and spaces are allowed.`
            }
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            validate: {
                validator: function(v) {
                    return /\S+@\S+\.\S+/.test(v);
                },
                message: props => `${props.value} is not a valid email!`
            }
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
            validate: {
                validator: function(v) {
                    return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/.test(v);
                },
                message: props => "Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character."
            }
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        },
        profilePhotoFilename: {
            type: String,
            default: ""
        }
    },
    {
        collection: "users",
        timestamps: true
    }
);

module.exports = mongoose.model("users", usersSchema);
