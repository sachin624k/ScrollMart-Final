const Campaign = require("../models/Campaign");

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

module.exports = {
  createCampaign,
};
