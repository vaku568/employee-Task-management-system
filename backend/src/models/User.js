const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    employeeId: {
      type: String,
      unique: true
    },

    qualification: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: [
        "TEAM_LEAD",
        "EMPLOYEE"
      ],
      required: true
    },

    status: {
      type: String,
      enum: [
        "PENDING",
        "APPROVED",
        "REJECTED"
      ],
      default: "PENDING"
    },

    team: {
      type: String,
      enum: [
        "ML",
        "DB",
        "CYBER",
        "GEN",
        "WRITING"
      ],
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports =
  mongoose.model(
    "User",
    userSchema
  );