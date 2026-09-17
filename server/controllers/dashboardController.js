const Campaign = require("../models/Campaign");
const Offer = require("../models/Offer");
const CampaignExecution = require("../models/CampaignExecution");
const InfluencerProfile = require("../models/InfluencerProfile");
const InstagramAccount = require("../models/InstagramAccount");

const getBrandDashboard = async (req, res) => {
  try {
    // Only brands can access brand dashboard
    if (req.user.role !== "brand") {
      return res.status(403).json({
        success: false,
        message: "Only brands can access the brand dashboard",
      });
    }

    const brandId = req.user.userId;

    // Get brand campaigns
    const campaigns = await Campaign.find({
      brandId,
    }).sort({ createdAt: -1 });

    // Get brand offers
    const offers = await Offer.find({
      brandId,
    });

    // Calculate campaign counts
    const totalCampaigns = campaigns.length;

    const activeCampaigns = campaigns.filter(
      (campaign) => campaign.status === "active",
    ).length;

    const completedCampaigns = campaigns.filter(
      (campaign) => campaign.status === "completed",
    ).length;

    // Calculate total spent from released payouts
    const releasedOffers = offers.filter(
      (offer) => offer.paymentStatus === "released",
    );

    const totalSpent = releasedOffers.reduce(
      (total, offer) => total + offer.amount,
      0,
    );

    return res.status(200).json({
      success: true,
      dashboard: {
        totalCampaigns,
        activeCampaigns,
        completedCampaigns,
        totalOffers: offers.length,
        totalSpent,
        recentCampaigns: campaigns.slice(0, 5),
      },
    });
  } catch (error) {
    console.error("Brand dashboard error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to load brand dashboard",
      error: error.message,
    });
  }
};

const getInfluencerDashboard = async (req, res) => {
  try {
    // Only influencers can access influencer dashboard
    if (req.user.role !== "influencer") {
      return res.status(403).json({
        success: false,
        message: "Only influencers can access the influencer dashboard",
      });
    }

    // Find influencer profile
    const influencer = await InfluencerProfile.findOne({
      userId: req.user.userId,
    });

    if (!influencer) {
      return res.status(404).json({
        success: false,
        message: "Influencer profile not found",
      });
    }

    // Find connected Instagram account
    const instagramAccount = await InstagramAccount.findOne({
      influencerId: influencer._id,
    }).select("-accessToken");

    // Find offers
    const offers = await Offer.find({
      influencerId: influencer._id,
    })
      .populate("campaignId", "title description category budget deadline")
      .populate("brandId", "name email")
      .sort({ createdAt: -1 });

    // Find campaign executions
    const executions = await CampaignExecution.find({
      influencerId: influencer._id,
    })
      .populate("campaignId", "title category budget deadline")
      .populate("offerId", "amount status paymentStatus")
      .sort({ createdAt: -1 });

    // Active executions
    const activeExecutions = executions.filter(
      (execution) =>
        execution.executionStatus === "in_progress" ||
        execution.executionStatus === "submitted",
    );

    // Completed executions
    const completedExecutions = executions.filter(
      (execution) => execution.executionStatus === "completed",
    );

    // Calculate released earnings
    const releasedEarnings = offers
      .filter((offer) => offer.paymentStatus === "released")
      .reduce((total, offer) => total + offer.amount, 0);

    return res.status(200).json({
      success: true,
      dashboard: {
        profile: influencer,
        instagram: instagramAccount,
        totalOffers: offers.length,
        activeExecutions: activeExecutions.length,
        completedExecutions: completedExecutions.length,
        releasedEarnings,
        offers,
        executions,
      },
    });
  } catch (error) {
    console.error("Influencer dashboard error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to load influencer dashboard",
      error: error.message,
    });
  }
};

module.exports = {
  getBrandDashboard,
  getInfluencerDashboard,
};
