const mongoose = require("mongoose");

const SectionShema = (
    {
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project", 
            required: true
        },
        title: {
            type: String,
            required: true
        },
        order: {
            type: Number,
            default: 0
        },
        status: {
            type: String,
            enum: ["complete", "in_progress"],
            default: "in_progress"
        },
        completedAt: {
            type: Date
        }
    }, { timestamps: true });

const SectionModel = mongoose.model("Section", SectionShema);

module.exports = SectionModel;