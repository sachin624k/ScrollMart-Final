const express = require("express");
const protect = require("../middleware/authMiddleware");
const { getBrandDashboard, getInfluencerDashboard } = require("../controllers/dashboardController");

const router = express.Router();

router.get("/brand", protect, getBrandDashboard);
router.get("/influencer", protect, getInfluencerDashboard);

module.exports = router;
