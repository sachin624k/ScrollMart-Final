const axios = require("axios");
const InstagramAccount = require("../models/InstagramAccount");
const InfluencerProfile = require("../models/InfluencerProfile");

const connectInstagram = async (req, res) => {
  try {
    // Get Meta access token from .env
    const accessToken = process.env.META_ACCESS_TOKEN;

    if (!accessToken) {
      return res.status(500).json({
        success: false,
        message: "Instagram access token is not configured",
      });
    }

    // Get Instagram data from Meta
    const response = await axios.get(`${process.env.META_GRAPH_URL}/me`, {
      params: {
        fields:
          "id,username,name,profile_picture_url,followers_count,media_count",
        access_token: accessToken,
      },
    });

    const instagram = response.data;

    // Find the logged-in influencer's profile
    const influencerProfile = await InfluencerProfile.findOne({
      userId: req.user.userId,
    });

    if (!influencerProfile) {
      return res.status(404).json({
        success: false,
        message: "Influencer profile not found",
      });
    }

    // Save Instagram account in MongoDB
    const instagramAccount = await InstagramAccount.findOneAndUpdate(
      {
        influencerId: influencerProfile._id,
      },
      {
        influencerId: influencerProfile._id,
        instagramUserId: instagram.id,
        username: instagram.username,
        name: instagram.name,
        profilePicture: instagram.profile_picture_url,
        followersCount: instagram.followers_count,
        mediaCount: instagram.media_count,
        accessToken: accessToken,
        connected: true,
        connectedAt: new Date(),
      },
      {
        new: true,
        upsert: true,
      },
    );

    // Update influencer profile
    influencerProfile.username = instagram.username;
    influencerProfile.profilePicture = instagram.profile_picture_url;
    influencerProfile.followers = instagram.followers_count;
    influencerProfile.instagramConnected = true;
    influencerProfile.verificationStatus = "verified";

    await influencerProfile.save();

    res.status(200).json({
      success: true,
      message: "Instagram account connected successfully",
      instagram: {
        id: instagramAccount.instagramUserId,
        username: instagramAccount.username,
        name: instagramAccount.name,
        profilePicture: instagramAccount.profilePicture,
        followersCount: instagramAccount.followersCount,
        mediaCount: instagramAccount.mediaCount,
      },
    });
  } catch (error) {
    console.error(
      "Instagram connection error:",
      error.response?.data || error.message,
    );

    res.status(400).json({
      success: false,
      message: "Failed to connect Instagram account",
      error: error.response?.data || error.message,
    });
  }
};

module.exports = {
  connectInstagram,
};
