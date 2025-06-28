const mongoose = require("mongoose");

const ProjectInvitationSchema = new mongoose.Schema(
    {
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true
        },
        invitedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        invitedUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        status: {
            type: String,
            enum: ["pending", "accepted", "declined", "expired"],
            default: "pending"
        },
        invitedAt: {
            type: Date,
            default: Date.now
        },
        respondedAt: {
            type: Date
        }
    });

const ProjectInvitationModel = mongoose.model("ProjectInvitation", ProjectInvitationSchema);

module.exports = ProjectInvitationModel;
