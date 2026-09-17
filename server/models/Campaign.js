const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema(
  {
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    budget: {
      type: Number,
      required: true,
      min: 0,
    },

    location: {
      city: String,
      state: String,
      country: {
        type: String,
        default: "India",
      },
    },

    languages: {
      type: [String],
      default: [],
    },

    minFollowers: {
      type: Number,
      default: 0,
    },

    minEngagementRate: {
      type: Number,
      default: 0,
    },

    deliverables: {
      type: [String],
      default: [],
    },

    deadline: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["draft", "active", "completed", "cancelled"],
      default: "draft",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Campaign", campaignSchema);
