const mongoose = require("mongoose");

const ProjectMemberSchema = (
    {
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project", 
            required: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        role: {
            type: String,
            enum: ["owner", "editor", "viewer"],
            default: "viewer"
        },
        joinedAt: {
            type: Date,
            default: Date.now
        }
    }, { timestamps: false });


const ProjectMemberModel = mongoose.model("ProjectMember", ProjectMemberSchema);

module.exports = ProjectMemberModel;