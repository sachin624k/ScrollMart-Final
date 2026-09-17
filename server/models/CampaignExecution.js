const mongoose = require("mongoose");

const campaignExecutionSchema = new mongoose.Schema(
  {
    campaignId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
    },

    offerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Offer",
      required: true,
      unique: true,
    },

    influencerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InfluencerProfile",
      required: true,
    },

    instagramPostUrl: {
      type: String,
      default: "",
    },

    caption: {
      type: String,
      default: "",
    },

    hashtags: {
      type: [String],
      default: [],
    },

    submittedAt: {
      type: Date,
      default: null,
    },

    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },

    likes: {
      type: Number,
      default: 0,
    },

    comments: {
      type: Number,
      default: 0,
    },

    views: {
      type: Number,
      default: 0,
    },

    performanceUpdatedAt: {
      type: Date,
      default: null,
    },

    executionStatus: {
      type: String,
      enum: ["not_started", "in_progress", "submitted", "completed"],
      default: "not_started",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("CampaignExecution", campaignExecutionSchema);
