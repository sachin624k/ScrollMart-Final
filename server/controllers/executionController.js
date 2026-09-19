const axios = require("axios");
const CampaignExecution = require("../models/CampaignExecution");
const Offer = require("../models/Offer");
const InfluencerProfile = require("../models/InfluencerProfile");
const Campaign = require("../models/Campaign");
const InstagramAccount = require("../models/InstagramAccount");
const createNotification = require("../utils/notificationHelper");

const createExecution = async (req, res) => {
  try {
    // Only influencers can start campaign execution
    if (req.user.role !== "influencer") {
      return res.status(403).json({
        success: false,
        message: "Only influencers can start campaign execution",
      });
    }

    const { offerId } = req.params;

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

    // Make sure offer belongs to this influencer
    if (offer.influencerId.toString() !== influencer._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to start this campaign",
      });
    }

    // Offer must be accepted
    if (offer.status !== "accepted") {
      return res.status(400).json({
        success: false,
        message: "Campaign can only start after offer is accepted",
      });
    }

    // Check if execution already exists
    const existingExecution = await CampaignExecution.findOne({
      offerId: offer._id,
    });

    if (existingExecution) {
      return res.status(400).json({
        success: false,
        message: "Campaign execution already exists",
        execution: existingExecution,
      });
    }

    // Create execution
    const execution = await CampaignExecution.create({
      campaignId: offer.campaignId,
      offerId: offer._id,
      influencerId: influencer._id,
      executionStatus: "in_progress",
    });

    res.status(201).json({
      success: true,
      message: "Campaign execution started successfully",
      execution,
    });
  } catch (error) {
    console.error("Create execution error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to start campaign execution",
      error: error.message,
    });
  }
};

const submitExecution = async (req, res) => {
  try {
    // Only influencers can submit campaign content
    if (req.user.role !== "influencer") {
      return res.status(403).json({
        success: false,
        message: "Only influencers can submit campaign content",
      });
    }

    const { executionId } = req.params;

    const { instagramPostUrl, caption, hashtags } = req.body;

    // Validate post URL
    if (!instagramPostUrl) {
      return res.status(400).json({
        success: false,
        message: "Instagram post URL is required",
      });
    }

    // Find execution
    const execution = await CampaignExecution.findById(executionId);

    if (!execution) {
      return res.status(404).json({
        success: false,
        message: "Campaign execution not found",
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

    // Make sure execution belongs to this influencer
    if (execution.influencerId.toString() !== influencer._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to submit this campaign",
      });
    }

    // Only in-progress campaigns can be submitted
    if (
      execution.executionStatus !== "in_progress" &&
      !(
        execution.executionStatus === "submitted" &&
        execution.verificationStatus === "rejected"
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Campaign is not currently in progress",
      });
    }

    // Save submitted content
    execution.instagramPostUrl = instagramPostUrl;
    execution.caption = caption || "";
    execution.hashtags = hashtags || [];
    execution.submittedAt = new Date();
    execution.executionStatus = "submitted";
    execution.verificationStatus = "pending";

    await execution.save();

    res.status(200).json({
      success: true,
      message: "Campaign content submitted successfully",
      execution,
    });
  } catch (error) {
    console.error("Submit execution error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to submit campaign content",
      error: error.message,
    });
  }
};

const verifyExecution = async (req, res) => {
  try {
    // Only brands can verify campaign content
    if (req.user.role !== "brand") {
      return res.status(403).json({
        success: false,
        message: "Only brands can verify campaign content",
      });
    }

    const { executionId } = req.params;

    // Find execution
    const execution = await CampaignExecution.findById(executionId);

    if (!execution) {
      return res.status(404).json({
        success: false,
        message: "Campaign execution not found",
      });
    }

    // Find campaign
    const campaign = await Campaign.findById(execution.campaignId);

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
        message: "You are not allowed to verify this campaign",
      });
    }

    // Content must be submitted
    if (execution.executionStatus !== "submitted") {
      return res.status(400).json({
        success: false,
        message: "Campaign content has not been submitted",
      });
    }

    // Find influencer profile
    const influencer = await InfluencerProfile.findById(execution.influencerId);

    if (!influencer) {
      return res.status(404).json({
        success: false,
        message: "Influencer profile not found",
      });
    }

    // Get the Instagram account connected to this influencer
    const instagramAccount = await InstagramAccount.findOne({
      influencerId: influencer._id,
    });

    if (!instagramAccount || !instagramAccount.connected) {
      return res.status(400).json({
        success: false,
        message: "Instagram account is not connected",
      });
    }

    const accessToken = instagramAccount.accessToken;

    if (!accessToken) {
      return res.status(400).json({
        success: false,
        message: "Instagram access token is missing",
      });
    }

    // Fetch Instagram media
    const response = await axios.get(`${process.env.META_GRAPH_URL}/me/media`, {
      params: {
        fields: "id,caption,media_type,media_product_type,permalink,timestamp",
        access_token: accessToken,
      },
    });

    const media = response.data.data || [];

    // Find submitted post by permalink
    // Normalize Instagram URLs
    const normalizeInstagramUrl = (url) => {
      if (!url) return "";

      try {
        const parsedUrl = new URL(url);
        return `${parsedUrl.origin}${parsedUrl.pathname}`.replace(/\/$/, "");
      } catch {
        return url.split("?")[0].replace(/\/$/, "");
      }
    };

    // Find submitted post by permalink
    const submittedPost = media.find(
      (post) =>
        normalizeInstagramUrl(post.permalink) ===
        normalizeInstagramUrl(execution.instagramPostUrl),
    );

    if (!submittedPost) {
      execution.verificationStatus = "rejected";

      await execution.save();

      return res.status(400).json({
        success: false,
        message: "Instagram post could not be found",
        verificationStatus: "rejected",
      });
    }

    const caption = submittedPost.caption || "";

    // Check campaign required hashtags
    const requiredHashtags = campaign.requiredHashtags || [];

    const missingHashtags = requiredHashtags.filter(
      (hashtag) => !caption.toLowerCase().includes(hashtag.toLowerCase()),
    );

    const hashtagMatch = missingHashtags.length === 0;

    // Check post timestamp
    const postDate = new Date(submittedPost.timestamp);
    const campaignCreatedAt = new Date(campaign.createdAt);
    const campaignDeadline = new Date(campaign.deadline);

    const dateMatch =
      postDate >= campaignCreatedAt && postDate <= campaignDeadline;

    // Final verification
    if (hashtagMatch && dateMatch) {
      execution.verificationStatus = "verified";
      execution.executionStatus = "completed";

      await execution.save();

      // Mark campaign as completed
      campaign.status = "completed";
      await campaign.save();

      await createNotification({
        recipientId: influencer.userId,
        type: "execution_verified",
        title: "Post Verified",
        message: "Your Instagram post has been verified successfully.",
        relatedId: execution._id,
      });

      return res.status(200).json({
        success: true,
        message: "Instagram post verified successfully",
        verification: {
          postFound: true,
          hashtagMatch,
          missingHashtags,
          dateMatch,
          status: "verified",
        },
        execution,
      });
    }

    execution.verificationStatus = "rejected";

    await execution.save();

    await createNotification({
      recipientId: influencer.userId,
      type: "execution_rejected",
      title: "Post Verification Failed",
      message: "Your Instagram post could not be verified.",
      relatedId: execution._id,
    });

    res.status(400).json({
      success: false,
      message: "Instagram post verification failed",
      verification: {
        postFound: true,
        hashtagMatch,
        dateMatch,
        status: "rejected",
      },
      execution,
    });
  } catch (error) {
    console.error(
      "Verify execution error:",
      error.response?.data || error.message,
    );

    res.status(500).json({
      success: false,
      message: "Failed to verify Instagram post",
      error: error.response?.data || error.message,
    });
  }
};

const trackPerformance = async (req, res) => {
  try {
    // Only brands can track campaign performance
    if (req.user.role !== "brand") {
      return res.status(403).json({
        success: false,
        message: "Only brands can track campaign performance",
      });
    }

    const { executionId } = req.params;

    // Find execution
    const execution = await CampaignExecution.findById(executionId);

    if (!execution) {
      return res.status(404).json({
        success: false,
        message: "Campaign execution not found",
      });
    }

    // Find campaign
    const campaign = await Campaign.findById(execution.campaignId);

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
        message: "You are not allowed to track this campaign",
      });
    }

    // Post must be verified first
    if (execution.verificationStatus !== "verified") {
      return res.status(400).json({
        success: false,
        message: "Instagram post must be verified first",
      });
    }

    // Get the Instagram account connected to this influencer
    const instagramAccount = await InstagramAccount.findOne({
      influencerId: execution.influencerId,
    });

    if (!instagramAccount || !instagramAccount.connected) {
      return res.status(400).json({
        success: false,
        message: "Instagram account is not connected",
      });
    }

    const accessToken = instagramAccount.accessToken;

    if (!accessToken) {
      return res.status(400).json({
        success: false,
        message: "Instagram access token is missing",
      });
    }

    // Fetch Instagram media
    const response = await axios.get(`${process.env.META_GRAPH_URL}/me/media`, {
      params: {
        fields:
          "id,caption,media_type,media_product_type,permalink,timestamp,like_count,comments_count",
        access_token: accessToken,
      },
    });

    const media = response.data.data || [];

    // Find the verified post
    const normalizeInstagramUrl = (url) => {
      if (!url) return "";

      try {
        const parsedUrl = new URL(url);
        return `${parsedUrl.origin}${parsedUrl.pathname}`.replace(/\/$/, "");
      } catch {
        return url.split("?")[0].replace(/\/$/, "");
      }
    };

    const submittedPost = media.find(
      (post) =>
        normalizeInstagramUrl(post.permalink) ===
        normalizeInstagramUrl(execution.instagramPostUrl),
    );

    if (!submittedPost) {
      return res.status(404).json({
        success: false,
        message: "Instagram post could not be found",
      });
    }

    // Save performance data
    execution.likes = submittedPost.like_count || 0;
    execution.comments = submittedPost.comments_count || 0;
    execution.views = submittedPost.views || 0;
    execution.performanceUpdatedAt = new Date();

    await execution.save();

    return res.status(200).json({
      success: true,
      message: "Campaign performance updated successfully",
      performance: {
        likes: execution.likes,
        comments: execution.comments,
        views: execution.views,
        updatedAt: execution.performanceUpdatedAt,
      },
      execution,
    });
  } catch (error) {
    console.error(
      "Track performance error:",
      error.response?.data || error.message,
    );

    return res.status(500).json({
      success: false,
      message: "Failed to track campaign performance",
      error: error.response?.data || error.message,
    });
  }
};

module.exports = {
  createExecution,
  submitExecution,
  verifyExecution,
  trackPerformance,
};
