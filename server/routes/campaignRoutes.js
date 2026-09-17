const express = require("express");

const protect = require("../middleware/authMiddleware");
const { createCampaign } = require("../controllers/campaignController");

const router = express.Router();

router.post("/", protect, createCampaign);

module.exports = router;
