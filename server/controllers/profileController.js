const User = require("../models/User");
const InfluencerProfile = require("../models/InfluencerProfile");
const BrandProfile = require("../models/BrandProfile");

const createInfluencerProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const {
      username,
      bio,
      profilePicture,
      city,
      state,
      categories,
      languages,
      experience,
      startingPrice,
    } = req.body;

    const user = await User.findById(userId);

    if (!user || user.role !== "influencer") {
      return res.status(403).json({
        success: false,
        message: "Only influencers can create an influencer profile",
      });
    }

    const existingProfile = await InfluencerProfile.findOne({ userId });

    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: "Influencer profile already exists",
      });
    }

    const profile = await InfluencerProfile.create({
      userId,
      username,
      bio,
      profilePicture,
      location: {
        city,
        state,
        country: "India",
      },
      categories,
      languages,
      experience,
      startingPrice,
    });

    res.status(201).json({
      success: true,
      message: "Influencer profile created successfully",
      profile,
    });
  } catch (error) {
    console.error("Influencer profile error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getInfluencerProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const profile = await InfluencerProfile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Influencer profile not found",
      });
    }

    res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("Get influencer profile error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getBrandProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const profile = await BrandProfile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Brand profile not found",
      });
    }

    res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("Get brand profile error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const createBrandProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const {
      brandName,
      description,
      website,
      industry,
      category,
      businessType,
      city,
      state,
      products,
    } = req.body;

    const user = await User.findById(userId);

    if (!user || user.role !== "brand") {
      return res.status(403).json({
        success: false,
        message: "Only brands can create a brand profile",
      });
    }

    const existingProfile = await BrandProfile.findOne({ userId });

    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: "Brand profile already exists",
      });
    }

    const profile = await BrandProfile.create({
      userId,
      brandName,
      description,
      website,
      industry,
      category,
      businessType,
      location: {
        city,
        state,
        country: "India",
      },
      products,
    });

    res.status(201).json({
      success: true,
      message: "Brand profile created successfully",
      profile,
    });
  } catch (error) {
    console.error("Brand profile error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  createInfluencerProfile,
  createBrandProfile,
  getInfluencerProfile,
  getBrandProfile,
};
