const express = require("express");

const { protect } = require("../middleware/authMiddleware");
const {
  createCampaign,
  getCampaigns,
  getCampaignMatches,
  updateCampaignStatus,
} = require("../controllers/campaignController");

const router = express.Router();

router.post("/", protect, createCampaign);
router.get("/", protect, getCampaigns);
router.get("/:campaignId/matches", protect, getCampaignMatches);
router.patch("/:campaignId/status", protect, updateCampaignStatus);

module.exports = router;
