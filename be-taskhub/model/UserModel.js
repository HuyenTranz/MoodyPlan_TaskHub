const mongoose = require("mongoose");

const UserShema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            auto: true,
        },
        email: {
            type: String,
            require: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            require: true,
        },
        avatar: {
            type: String,
            default: "https://i.pinimg.com/736x/1a/6c/61/1a6c6151ed8647bbc13671d3f2f4b579.jpg",
        },
        deletedAt: {
            type: Date,
            default: null
        },
    },
    { timestamps: true }
);

const UserModel = mongoose.model("User", UserShema);

module.exports = UserModel;