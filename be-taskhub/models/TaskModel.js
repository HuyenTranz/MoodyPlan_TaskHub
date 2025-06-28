const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
    {
        sectionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Section",
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        dueDate: {
            type: Date
        },
        status: {
            type: String,
            enum: ["in_progress", "completed", "deleted"],
            default: "in_progress"
        },
        repeat: {
            type: String,
            enum: ["none", "daily", "weekly", "monthly", "yearly"],
            default: "none"
        },
        isImportant: {
            type: Boolean,
            default: false
        }
    }, { timestamps: true });

const TaskModel = mongoose.model("Task", TaskSchema);

module.exports = TaskModel;