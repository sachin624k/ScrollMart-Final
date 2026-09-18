const express = require("express");
const {
  getAllUsers,
  getAllCampaigns,
  updateUserStatus,
} = require("../controllers/adminController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Get all users
router.get("/users", protect, adminOnly, getAllUsers);

// Get all campaigns
router.get("/campaigns", protect, adminOnly, getAllCampaigns);

// Update user account status
router.patch("/users/:userId/status", protect, adminOnly, updateUserStatus);

module.exports = router;
