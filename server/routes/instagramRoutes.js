const express = require("express");

const { protect } = require("../middleware/authMiddleware");
const {
  startInstagramAuth,
  instagramCallback,
  disconnectInstagram,
} = require("../controllers/instagramController");

const router = express.Router();

router.get("/auth", protect, startInstagramAuth);
router.get("/callback", instagramCallback);
router.delete("/disconnect", protect, disconnectInstagram);

module.exports = router;
