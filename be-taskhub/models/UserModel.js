const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
            default: process.env.DEFAULT_AVT_URL
        },
    },
    { timestamps: true }
);

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
