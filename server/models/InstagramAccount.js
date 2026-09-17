const mongoose = require("mongoose");

const instagramAccountSchema = new mongoose.Schema(
  {
    influencerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InfluencerProfile",
      required: true,
      unique: true,
    },

    instagramUserId: {
      type: String,
      required: true,
      unique: true,
    },

    username: {
      type: String,
      default: "",
    },

    name: {
      type: String,
      default: "",
    },

    profilePicture: {
      type: String,
      default: "",
    },

    followersCount: {
      type: Number,
      default: 0,
    },

    mediaCount: {
      type: Number,
      default: 0,
    },

    accessToken: {
      type: String,
      default: "",
    },

    connected: {
      type: Boolean,
      default: true,
    },

    connectedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("InstagramAccount", instagramAccountSchema);
