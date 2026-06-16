const mongoose = require("mongoose");

const solutionSchema = new mongoose.Schema(
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

    finalFile: {
      type: String,
      required: true
    },

    approvedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Solution", solutionSchema);