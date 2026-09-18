const express = require("express");

const { protect } = require("../middleware/authMiddleware");
const { createExecution, submitExecution, verifyExecution, trackPerformance } = require("../controllers/executionController");

const router = express.Router();

router.post("/:offerId/start", protect, createExecution);
router.patch("/:executionId/submit", protect, submitExecution);
router.post("/:executionId/verify", protect, verifyExecution);
router.post("/:executionId/performance", protect, trackPerformance);

module.exports = router;
