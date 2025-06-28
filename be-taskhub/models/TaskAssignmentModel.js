const mongoose = require("mongoose");

const TaskAssignmentSchema = new mongoose.Schema(
    {
        taskId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task",
            required: true
        },
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true
        },
        assignedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        assignedDate: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            enum: ["in_progress", "completed"],
            default: "in_progress"
        },
        completeAt: {
            type: Date
        }
    });

const TaskAssignmentModel = mongoose.model("TaskAssignment", TaskAssignmentSchema);

module.exports = TaskAssignmentModel;