const Offer = require("../models/Offer");
const Campaign = require("../models/Campaign");
const InfluencerProfile = require("../models/InfluencerProfile");
const CampaignExecution = require("../models/CampaignExecution");
const createNotification = require("../utils/notificationHelper");

const createOffer = async (req, res) => {
  try {
    // Only brands can send offers
    if (req.user.role !== "brand") {
      return res.status(403).json({
        success: false,
        message: "Only brands can send offers",
      });
    }

    const { campaignId } = req.params;
    const { influencerId, amount, message } = req.body;

    // Basic validation
    if (!influencerId || !amount) {
      return res.status(400).json({
        success: false,
        message: "Influencer and amount are required",
      });
    }

    // Find campaign
    const campaign = await Campaign.findById(campaignId);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }

    // Make sure campaign belongs to logged-in brand
    if (campaign.brandId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to send offers for this campaign",
      });
    }

    // Make sure campaign is active
    if (campaign.status !== "active") {
      return res.status(400).json({
        success: false,
        message: "Offers can only be sent for active campaigns",
      });
    }

    // Find influencer
    const influencer = await InfluencerProfile.findById(influencerId);

    if (!influencer) {
      return res.status(404).json({
        success: false,
        message: "Influencer not found",
      });
    }

    // Make sure influencer is verified
    if (
      !influencer.instagramConnected ||
      influencer.verificationStatus !== "verified"
    ) {
      return res.status(400).json({
        success: false,
        message: "Influencer is not verified",
      });
    }

    // Create offer
    const offer = await Offer.create({
      campaignId: campaign._id,
      brandId: req.user.userId,
      influencerId: influencer._id,
      amount,
      message: message || "",
    });

    await createNotification({
      recipientId: influencer.userId,
      type: "offer_received",
      title: "New Offer Received",
      message: `You received a new offer of ₹${amount} for the campaign.`,
      relatedId: offer._id,
    });

    res.status(201).json({
      success: true,
      message: "Offer sent successfully",
      offer,
    });
  } catch (error) {
    console.error("Create offer error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to send offer",
      error: error.message,
    });
  }
};

const getInfluencerOffers = async (req, res) => {
  try {
    // Only influencers can view influencer offers
    if (req.user.role !== "influencer") {
      return res.status(403).json({
        success: false,
        message: "Only influencers can view these offers",
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

    // Find offers for this influencer
    const offers = await Offer.find({
      influencerId: influencer._id,
    })
      .populate("campaignId", "title description category budget deadline")
      .populate("brandId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: offers.length,
      offers,
    });
  } catch (error) {
    console.error("Get influencer offers error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch offers",
      error: error.message,
    });
  }
};

const updateOfferStatus = async (req, res) => {
  try {
    // Only influencers can accept/reject offers
    if (req.user.role !== "influencer") {
      return res.status(403).json({
        success: false,
        message: "Only influencers can accept or reject offers",
      });
    }

    const { offerId } = req.params;
    const { status } = req.body;

    // Validate status
    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be accepted or rejected",
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

    // Find offer
    const offer = await Offer.findById(offerId);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found",
      });
    }

    // Make sure this offer belongs to this influencer
    if (offer.influencerId.toString() !== influencer._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this offer",
      });
    }

    // Only pending offers can be responded to
    if (offer.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Offer is already ${offer.status}`,
      });
    }

    // Update offer
    offer.status = status;
    offer.respondedAt = new Date();

    await offer.save();

    const notificationType =
      status === "accepted" ? "offer_accepted" : "offer_rejected";

    const notificationTitle =
      status === "accepted" ? "Offer Accepted" : "Offer Rejected";

    const notificationMessage =
      status === "accepted"
        ? "The influencer has accepted your offer."
        : "The influencer has rejected your offer.";

    await createNotification({
      recipientId: offer.brandId,
      type: notificationType,
      title: notificationTitle,
      message: notificationMessage,
      relatedId: offer._id,
    });

    res.status(200).json({
      success: true,
      message: `Offer ${status} successfully`,
      offer,
    });
  } catch (error) {
    console.error("Update offer status error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to update offer",
      error: error.message,
    });
  }
};

const fundOffer = async (req, res) => {
  try {
    // Only brands can fund an offer
    if (req.user.role !== "brand") {
      return res.status(403).json({
        success: false,
        message: "Only brands can fund an offer",
      });
    }

    const { offerId } = req.params;

    // Find offer
    const offer = await Offer.findById(offerId);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found",
      });
    }

    // Make sure offer belongs to logged-in brand
    if (offer.brandId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to fund this offer",
      });
    }

    // Offer must be accepted
    if (offer.status !== "accepted") {
      return res.status(400).json({
        success: false,
        message: "Offer must be accepted before funding",
      });
    }

    // Prevent funding twice
    if (offer.paymentStatus !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Offer has already been funded or payment processed",
        paymentStatus: offer.paymentStatus,
      });
    }

    // Simulate funding
    offer.paymentStatus = "funded";

    await offer.save();

    return res.status(200).json({
      success: true,
      message: "Campaign funds added successfully",
      payment: {
        amount: offer.amount,
        status: offer.paymentStatus,
      },
      offer,
    });
  } catch (error) {
    console.error("Fund offer error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fund offer",
      error: error.message,
    });
  }
};

const releasePayout = async (req, res) => {
  try {
    // Only brands can release payouts
    if (req.user.role !== "brand") {
      return res.status(403).json({
        success: false,
        message: "Only brands can release payouts",
      });
    }

    const { offerId } = req.params;

    // Find offer
    const offer = await Offer.findById(offerId);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found",
      });
    }

    // Make sure offer belongs to logged-in brand
    if (offer.brandId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to release this payout",
      });
    }

    // Payment must be funded first
    if (offer.paymentStatus !== "funded") {
      return res.status(400).json({
        success: false,
        message: "Offer must be funded before payout can be released",
      });
    }

    // Find campaign execution
    const execution = await CampaignExecution.findOne({
      offerId: offer._id,
    });

    if (!execution) {
      return res.status(404).json({
        success: false,
        message: "Campaign execution not found",
      });
    }

    const influencer = await InfluencerProfile.findById(offer.influencerId);

    if (!influencer) {
      return res.status(404).json({
        success: false,
        message: "Influencer profile not found",
      });
    }

    // Campaign must be completed
    if (execution.executionStatus !== "completed") {
      return res.status(400).json({
        success: false,
        message: "Campaign must be completed before payout",
      });
    }

    // Post must be verified
    if (execution.verificationStatus !== "verified") {
      return res.status(400).json({
        success: false,
        message: "Campaign content must be verified before payout",
      });
    }

    // Release payout
    offer.paymentStatus = "released";

    await offer.save();

    await createNotification({
      recipientId: influencer.userId,
      type: "payout_released",
      title: "Payout Released",
      message: `Your payout of ₹${offer.amount} has been released.`,
      relatedId: offer._id,
    });

    return res.status(200).json({
      success: true,
      message: "Payout released successfully",
      payout: {
        amount: offer.amount,
        status: offer.paymentStatus,
        influencerId: offer.influencerId,
      },
      offer,
    });
  } catch (error) {
    console.error("Release payout error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to release payout",
      error: error.message,
    });
  }
};

module.exports = {
  createOffer,
  getInfluencerOffers,
  updateOfferStatus,
  fundOffer,
  releasePayout,
};
