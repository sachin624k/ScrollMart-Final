const express = require("express");

const { protect } = require("../middleware/authMiddleware");
const {
  createCampaign,
  getCampaigns,
  getCampaignMatches,
} = require("../controllers/campaignController");

const router = express.Router();

router.post("/", protect, createCampaign);

router.get("/", protect, getCampaigns);

router.get("/:campaignId/matches", protect, getCampaignMatches);

module.exports = router;
