const mongoose = require("mongoose");

const employeeDailyReportSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    taskIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task"
    }],

    date: {
      type: Date,
      required: true
    },

    typesOfWork: [{
      type: String,
      enum: [
        "Assignment",
        "Paraphrasing",
        "Research",
        "Presentation",
        "Report",
        "Dissertation",
        "Editing",
        "Formatting",
        "Referencing",
        "Report Writing",
        "Literature Review",
        "Other"
      ]
    }],

    wordCount: {
      type: Number,
      required: true,
      min: 1
    },

    receivedFrom: {
      type: String,
      required: true
    },

    submittedTo: {
      type: String,
      required: true
    },

    summary: {
      type: String,
      required: true,
      maxlength: 500
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

// Prevent duplicate submissions for same employee and date
employeeDailyReportSchema.index({ employeeId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("EmployeeDailyReport", employeeDailyReportSchema);
