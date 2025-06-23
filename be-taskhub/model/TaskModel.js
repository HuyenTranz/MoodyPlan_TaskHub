const mongoose = require("mongoose");

const TaskSchema = (
    {
        sectionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Section",
            required: true,
        },
        title: {
            type: String,
            require: true
        },
        description: {
            type: String,
            require: false
        },
        dueDate: {
            type: Date,
            require: false,
        },
        isCompleted: {
            type: Boolean,
            default: false,
        },
        deletedAt: {
            type: Date,
            default: null,
        },
        attachments: [
            {
                fileName: {
                    type: String,
                    require: true
                },
                fileType: {
                    type: String,
                    required: true,
                },
                fileUrl: {
                    type: String,
                    required: true,
                },
                uploadedAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ]
    },
    { timestamps: true }
)

const TaskModel = mongoose.model("Task", TaskSchema);

module.exports = TaskModel;