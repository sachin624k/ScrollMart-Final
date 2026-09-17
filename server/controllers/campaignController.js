const Campaign = require("../models/Campaign");
const InfluencerProfile = require("../models/InfluencerProfile");

const createCampaign = async (req, res) => {
  try {
    // Only brands can create campaigns
    if (req.user.role !== "brand") {
      return res.status(403).json({
        success: false,
        message: "Only brands can create campaigns",
      });
    }

    const {
      title,
      description,
      category,
      budget,
      location,
      languages,
      minFollowers,
      minEngagementRate,
      deliverables,
      requiredHashtags,
      deadline,
      status,
    } = req.body;

    // Basic validation
    if (!title || !description || !category || !budget || !deadline) {
      return res.status(400).json({
        success: false,
        message:
          "Title, description, category, budget and deadline are required",
      });
    }

    // Create campaign
    const campaign = await Campaign.create({
      brandId: req.user.userId,
      title,
      description,
      category,
      budget,
      location,
      languages,
      minFollowers,
      minEngagementRate,
      deliverables,
      requiredHashtags,
      deadline,
      status: status || "draft",
    });

    res.status(201).json({
      success: true,
      message: "Campaign created successfully",
      campaign,
    });
  } catch (error) {
    console.error("Create campaign error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to create campaign",
      error: error.message,
    });
  }
};

const getCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({
      status: "active",
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: campaigns.length,
      campaigns,
    });
  } catch (error) {
    console.error("Get campaigns error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch campaigns",
      error: error.message,
    });
  }
};

const getCampaignMatches = async (req, res) => {
  try {
    // Only brands can view matches for their campaigns
    if (req.user.role !== "brand") {
      return res.status(403).json({
        success: false,
        message: "Only brands can view campaign matches",
      });
    }

    const { campaignId } = req.params;

    // Find campaign
    const campaign = await Campaign.findById(campaignId);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }

    // Make sure this campaign belongs to the logged-in brand
    if (campaign.brandId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to view this campaign",
      });
    }

    // Get verified and Instagram-connected influencers
    const influencers = await InfluencerProfile.find({
      instagramConnected: true,
      verificationStatus: "verified",
    });

    const matches = influencers.map((influencer) => {
      let score = 0;
      const matchedCriteria = [];

      // 1. CATEGORY - 25%
      const categoryMatch = influencer.categories.some(
        (category) =>
          category.toLowerCase() === campaign.category.toLowerCase(),
      );

      if (categoryMatch) {
        score += 25;
        matchedCriteria.push("Category");
      }

      // 2. FOLLOWERS - 20%
      let followerScore = 0;

      if (campaign.minFollowers > 0) {
        followerScore =
          Math.min(influencer.followers / campaign.minFollowers, 1) * 20;
      } else {
        followerScore = 20;
      }

      score += followerScore;

      if (influencer.followers >= campaign.minFollowers) {
        matchedCriteria.push("Followers");
      }

      // 3. ENGAGEMENT - 20%
      let engagementScore = 0;

      if (campaign.minEngagementRate > 0) {
        engagementScore =
          Math.min(influencer.engagementRate / campaign.minEngagementRate, 1) *
          20;
      } else {
        engagementScore = 20;
      }

      score += engagementScore;

      if (influencer.engagementRate >= campaign.minEngagementRate) {
        matchedCriteria.push("Engagement");
      }

      // 4. LOCATION - 10%
      const locationMatch =
        influencer.location?.city &&
        campaign.location?.city &&
        influencer.location.city.toLowerCase() ===
          campaign.location.city.toLowerCase();

      if (locationMatch) {
        score += 10;
        matchedCriteria.push("Location");
      }

      // 5. LANGUAGE - 10%
      const languageMatch = influencer.languages.some((language) =>
        campaign.languages.some(
          (campaignLanguage) =>
            language.toLowerCase() === campaignLanguage.toLowerCase(),
        ),
      );

      if (languageMatch) {
        score += 10;
        matchedCriteria.push("Language");
      }

      // 6. BUDGET - 15%
      const budgetMatch = influencer.startingPrice <= campaign.budget;

      if (budgetMatch) {
        score += 15;
        matchedCriteria.push("Budget");
      }

      return {
        influencerId: influencer._id,
        username: influencer.username,
        profilePicture: influencer.profilePicture,
        categories: influencer.categories,
        location: influencer.location,
        languages: influencer.languages,
        followers: influencer.followers,
        engagementRate: influencer.engagementRate,
        startingPrice: influencer.startingPrice,

        matchScore: Number(score.toFixed(1)),

        matchedCriteria,

        requirementsMet: {
          category: categoryMatch,
          followers: influencer.followers >= campaign.minFollowers,
          engagement: influencer.engagementRate >= campaign.minEngagementRate,
          location: locationMatch,
          language: languageMatch,
          budget: budgetMatch,
        },
      };
    });

    // Highest matching score first
    matches.sort((a, b) => b.matchScore - a.matchScore);

    res.status(200).json({
      success: true,
      campaign: {
        id: campaign._id,
        title: campaign.title,
        category: campaign.category,
        budget: campaign.budget,
      },
      count: matches.length,
      matches,
    });
  } catch (error) {
    console.error("Campaign matching error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to generate campaign matches",
      error: error.message,
    });
  }
};

module.exports = {
  createCampaign,
  getCampaigns,
  getCampaignMatches,
};
