const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    title: {
      type: String,
      required: true
    },

    message: {
      type: String,
      required: true
    },

    type: {
      type: String,
      required: true,
      enum: [
        "TASK_ASSIGNED",
        "TASK_ACCEPTED",
        "SOLUTION_SUBMITTED",
        "SOLUTION_APPROVED",
        "SOLUTION_REWORK",
        "NEW_MESSAGE",
        "EOD_SUBMITTED",
        "EMPLOYEE_REGISTRATION_APPROVED",
        "EMPLOYEE_REGISTRATION_REJECTED"
      ]
    },

    relatedId: {
      type: mongoose.Schema.Types.ObjectId
    },

    isRead: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Notification", notificationSchema);