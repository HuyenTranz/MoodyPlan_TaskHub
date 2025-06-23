const mongoose = require("mongoose");

const ProjectShema = (
    {
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            auto: true,
        },
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            require: true,
        },
        name: {
            type: String,
            require: true,
        },
        color: {
            type: String,
            require: true,
        },
        isDefault: {
            type: Boolean,
            default: null
        },
        deletedAt: {
            type: Date,
            default: null
        },
        members: [
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    require: true,
                },
                role: {
                    type: String,
                    enum: ["owner", "editor", "viewer"],
                    default: "editor"
                }
            }
        ]
    },
    { timestamps: true }
)

const ProjectModel = mongoose.model("Project", ProjectShema);

module.exports = ProjectModel;