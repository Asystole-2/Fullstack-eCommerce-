const mongoose = require(`mongoose`);

let usersSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: [3, "Name must be at least 3 characters long"],
            maxlength: [50, "Name must not exceed 50 characters"],
            match: [/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"]
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            trim: true,
            unique: true,
            lowercase: true,
            match: [/\S+@\S+\.\S+/, "Invalid email format"]
        },

        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [8, "Password must be at least 8 characters long"],
            validate: {
                validator: function (value) {
                    return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/.test(value);
                },
                message:
                    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
            }
        },

        profilePhotoFilename: {
            type: String,
            default: ""
        },

        accessLevel: {
            type: Number,
            default: parseInt(process.env.ACCESS_LEVEL_NORMAL_USER),
            min: [0, "Access level cannot be negative"],
            max: [2, "Access level must be 0 (user), 1 (moderator), or 2 (admin)"]
        },

        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        }
    },
    {
        collection: `users`,
        timestamps: true
    }
);

module.exports = mongoose.model(`users`, usersSchema);
