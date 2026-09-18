const express = require("express");

const { protect } = require("../middleware/authMiddleware");
const {
  createOffer,
  getInfluencerOffers,
  updateOfferStatus,
  fundOffer,
  releasePayout,
} = require("../controllers/offerController");

const router = express.Router();

router.post("/:campaignId", protect, createOffer);
router.get("/influencer", protect, getInfluencerOffers);
router.patch("/:offerId/status", protect, updateOfferStatus);
router.patch("/:offerId/fund", protect, fundOffer);
router.patch("/:offerId/release", protect, releasePayout);

module.exports = router;
