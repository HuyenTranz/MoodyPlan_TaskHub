const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
    {
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        color: {
            type: String,
        },
        isDefault: {
            type: Boolean,
            default: false, // thường default là false, chỉ Inbox mới true
        },
    },
    { timestamps: true }
);

const ProjectModel = mongoose.model("Project", ProjectSchema);

module.exports = ProjectModel;
