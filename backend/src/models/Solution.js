const mongoose = require("mongoose");

const solutionSchema =
  new mongoose.Schema(
    {
      taskId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Task",
        required: true
      },

      employeeId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },

      solutionType: {
        type: String,
        enum: [
          "FINAL",
          "PARAPHRASE"
        ],
        required: true
      },

      files: [
        {
          type: String
        }
      ],

      reviewStatus: {
        type: String,
        enum: [
          "PENDING",
          "APPROVED",
          "REWORK"
        ],
        default: "PENDING"
      },

      reviewedAt: {
        type: Date
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

module.exports =
  mongoose.model(
    "Solution",
    solutionSchema
  );