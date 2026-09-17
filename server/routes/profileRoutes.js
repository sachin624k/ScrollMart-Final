const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  createInfluencerProfile,
  createBrandProfile,
  getInfluencerProfile,
  getBrandProfile,
} = require("../controllers/profileController");

const router = express.Router();

router.post("/influencer", protect, createInfluencerProfile);

router.post("/brand", protect, createBrandProfile);

router.get("/influencer", protect, getInfluencerProfile);

router.get("/brand", protect, getBrandProfile);

module.exports = router;
