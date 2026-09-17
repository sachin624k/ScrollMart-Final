const mongoose = require("mongoose");

const influencerProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    username: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
    },

    profilePicture: {
      type: String,
      default: "",
    },

    location: {
      city: String,
      state: String,
      country: {
        type: String,
        default: "India",
      },
    },

    categories: {
      type: [String],
      default: [],
    },

    languages: {
      type: [String],
      default: [],
    },

    experience: {
      type: String,
      default: "",
    },

    startingPrice: {
      type: Number,
      default: 0,
    },

    followers: {
      type: Number,
      default: 0,
    },

    engagementRate: {
      type: Number,
      default: 0,
    },

    audienceQualityScore: {
      type: Number,
      default: 0,
    },

    instagramConnected: {
      type: Boolean,
      default: false,
    },

    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("InfluencerProfile", influencerProfileSchema);
