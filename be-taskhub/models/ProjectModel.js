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
        routerId: {
            type: String,
            unique: true // Đảm bảo không bị trùng
        }
    },
    { timestamps: true }
);

// Tự động tạo routerId sau khi project được lưu lần đầu
ProjectSchema.pre('save', function (next) {
    if (!this.routerId) {
        const slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        this.routerId = `${slug}-${this._id}`;
    }
    next();
});


const ProjectModel = mongoose.model("Project", ProjectSchema);

module.exports = ProjectModel;
