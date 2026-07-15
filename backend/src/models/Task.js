const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: true
    },

    university: {
      type: String,
      required: true
    },

    moduleCode: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

  additionalNotes: {
    type: String
    },

  employeeRemarks: {
    type: String,
    default: ""
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

    uploadedFile: {
      type: String,
      default: ""
    },

    uploadedFiles: [
      {
        type: String
      }
    ],

    parentTaskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task"
    },

    status: {
      type: String,
      enum: [
        "ASSIGNED",
        "PROGRESS",
        "PENDING_REVIEW",
        "APPROVED",
        "REWORK"
      ],
      default: "ASSIGNED"
    },

    assignedAt: {
      type: Date,
      default: Date.now
    },

    downloadedAt: {
      type: Date
    },

    submittedAt: {
      type: Date
    },

    reviewedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Task", taskSchema);