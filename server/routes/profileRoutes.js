const express = require("express");
const { protect } = require("../middleware/authMiddleware");

const {
  createInfluencerProfile,
  createBrandProfile,
  getInfluencerProfile,
  getBrandProfile,
  getInfluencers,
} = require("../controllers/profileController");

const router = express.Router();

router.post("/influencer", protect, createInfluencerProfile);

router.post("/brand", protect, createBrandProfile);

router.get("/influencer", protect, getInfluencerProfile);

router.get("/brand", protect, getBrandProfile);

router.get("/influencers", protect, getInfluencers);

module.exports = router;
