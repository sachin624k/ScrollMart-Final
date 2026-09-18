const express = require("express");

const {
  createOrGetConversation,
  getMyConversations,
  sendMessage,
  getConversationMessages,
} = require("../controllers/messageController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Create or get a conversation
router.post("/conversations", protect, createOrGetConversation);

// Get conversations for logged-in user
router.get("/conversations", protect, getMyConversations);

// Send a message
router.post("/conversations/:conversationId/messages", protect, sendMessage);

// Get messages from a conversation
router.get(
  "/conversations/:conversationId/messages",
  protect,
  getConversationMessages,
);

module.exports = router;
