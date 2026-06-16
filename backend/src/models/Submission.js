const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true
    },

    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    submissionType: {
      type: String,
      enum: ["FINAL", "PARAPHRASE"],
      required: true
    },

    fileUrl: {
      type: String,
      required: true
    },

    reviewStatus: {
      type: String,
      enum: [
        "PENDING",
        "APPROVED",
        "REWORK"
      ],
      default: "PENDING"
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    reviewedAt: {
      type: Date
    },

    reviewComments: {
      type: String,
      default: ""
    },

    submittedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Submission",
  submissionSchema
);