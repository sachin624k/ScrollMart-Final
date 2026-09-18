const express = require("express");
const { protect } = require("../middleware/authMiddleware");

const { connectInstagram } = require("../controllers/instagramController");

const router = express.Router();

router.post("/connect", protect, connectInstagram);

module.exports = router;
