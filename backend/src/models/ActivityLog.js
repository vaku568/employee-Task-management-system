const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    action: {
      type: String,
      enum: [
        "TASK_ASSIGNED",
        "TASK_DOWNLOADED",
        "TASK_SUBMITTED",
        "TASK_APPROVED",
        "TASK_REWORK"
      ],
      required: true
    },

    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("ActivityLog", activityLogSchema);