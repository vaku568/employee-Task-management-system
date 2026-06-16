const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true
    },

    reviewerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    decision: {
      type: String,
      enum: ["APPROVED", "REWORK"],
      required: true
    },

    comments: {
      type: String
    },

    reviewedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Review", reviewSchema);