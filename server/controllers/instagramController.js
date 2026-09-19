const axios = require("axios");
const jwt = require("jsonwebtoken");
const InstagramAccount = require("../models/InstagramAccount");
const InfluencerProfile = require("../models/InfluencerProfile");

const startInstagramAuth = (req, res) => {
  try {
    if (req.user.role !== "influencer") {
      return res.status(403).json({
        success: false,
        message: "Only influencers can connect Instagram",
      });
    }

    // Create a temporary state token containing the logged-in user ID
    const state = jwt.sign(
      {
        userId: req.user.userId,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "10m",
      },
    );

    const redirectUri = process.env.META_REDIRECT_URI;

    const scope = [
      "instagram_business_basic",
      "instagram_business_manage_messages",
      "instagram_business_manage_comments",
      "instagram_business_content_publish",
      "instagram_business_manage_insights",
    ].join(",");

    const authUrl =
      `https://www.instagram.com/oauth/authorize` +
      `?force_reauth=true` +
      `&client_id=${process.env.META_APP_ID}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=code` +
      `&scope=${encodeURIComponent(scope)}` +
      `&state=${encodeURIComponent(state)}`;

    res.json({
      success: true,
      authorizationUrl: authUrl,
    });
  } catch (error) {
    console.error("Instagram auth error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to start Instagram authentication",
    });
  }
};

const instagramCallback = async (req, res) => {
  try {
    const { code, state } = req.query;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Authorization code not received",
      });
    }

    if (!state) {
      return res.status(400).json({
        success: false,
        message: "OAuth state not received",
      });
    }

    // Verify the state and get the ScrollMart user ID
    let decodedState;

    try {
      decodedState = jwt.verify(state, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OAuth state",
      });
    }

    const userId = decodedState.userId;

    // Exchange authorization code for Instagram access token
    const tokenResponse = await axios.post(
      "https://api.instagram.com/oauth/access_token",
      new URLSearchParams({
        client_id: process.env.META_APP_ID,
        client_secret: process.env.META_APP_SECRET,
        grant_type: "authorization_code",
        redirect_uri: process.env.META_REDIRECT_URI,
        code: code,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    const { access_token: accessToken, user_id: instagramUserId } =
      tokenResponse.data;

    // Find the ScrollMart influencer who started the connection
    const influencerProfile = await InfluencerProfile.findOne({
      userId,
    });

    if (!influencerProfile) {
      return res.status(404).json({
        success: false,
        message: "Influencer profile not found",
      });
    }

    // Get Instagram account details using the new user's token
    const instagramResponse = await axios.get(
      `${process.env.META_GRAPH_URL}/me`,
      {
        params: {
          fields:
            "id,username,name,profile_picture_url,followers_count,media_count",
          access_token: accessToken,
        },
      },
    );

    const instagram = instagramResponse.data;

    // Make sure this Instagram account is not connected
    // to a different ScrollMart influencer
    const existingAccount = await InstagramAccount.findOne({
      instagramUserId: instagramUserId.toString(),
    });

    if (
      existingAccount &&
      existingAccount.influencerId.toString() !==
        influencerProfile._id.toString()
    ) {
      return res.status(409).json({
        success: false,
        message:
          "This Instagram account is already connected to another influencer",
      });
    }

    // Save / update Instagram account
    const instagramAccount = await InstagramAccount.findOneAndUpdate(
      {
        influencerId: influencerProfile._id,
      },
      {
        influencerId: influencerProfile._id,
        instagramUserId: instagramUserId.toString(),
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

    console.log("Instagram OAuth successful");
    console.log("Instagram User ID:", instagramUserId);

    return res.status(200).json({
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
      "Instagram callback error:",
      error.response?.data || error.message,
    );

    return res.status(400).json({
      success: false,
      message: "Instagram authorization failed",
      error: error.response?.data || error.message,
    });
  }
};

const disconnectInstagram = async (req, res) => {
  try {
    if (req.user.role !== "influencer") {
      return res.status(403).json({
        success: false,
        message: "Only influencers can disconnect Instagram",
      });
    }

    const userId = req.user.userId;

    const influencerProfile = await InfluencerProfile.findOne({
      userId,
    });

    if (!influencerProfile) {
      return res.status(404).json({
        success: false,
        message: "Influencer profile not found",
      });
    }

    const instagramAccount = await InstagramAccount.findOne({
      influencerId: influencerProfile._id,
    });

    if (!instagramAccount) {
      return res.status(404).json({
        success: false,
        message: "No Instagram account connected",
      });
    }

    await InstagramAccount.deleteOne({
      _id: instagramAccount._id,
    });

    influencerProfile.username = "";
    influencerProfile.profilePicture = "";
    influencerProfile.followers = 0;
    influencerProfile.instagramConnected = false;
    influencerProfile.verificationStatus = "pending";

    await influencerProfile.save();

    return res.status(200).json({
      success: true,
      message: "Instagram account disconnected successfully",
    });
  } catch (error) {
    console.error(
      "Instagram disconnect error:",
      error.response?.data || error.message,
    );

    return res.status(500).json({
      success: false,
      message: "Failed to disconnect Instagram account",
    });
  }
};

module.exports = {
  startInstagramAuth,
  instagramCallback,
  disconnectInstagram,
};
