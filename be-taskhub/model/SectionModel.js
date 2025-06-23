const mongoose = require("mongoose");

const SectionShema = (
    {
        sectionId: {
            type: mongoose.Schema.Types.ObjectId,
            auto: true,
        },
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true,
        },
        title: {
            type: String,
            require: true,
        },
        order: {
            type: Number,
            default: 0
        },
        deletedAt: {
            type: Date,
            default: null
        }
    },
    { timestamps: true }
)

const SectionModel = mongoose.model("Section", SectionShema);

module.exports = SectionModel;