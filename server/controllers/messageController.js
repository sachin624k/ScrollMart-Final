const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const InfluencerProfile = require("../models/InfluencerProfile");

// Create or get conversation
const createOrGetConversation = async (req, res) => {
  try {
    const { influencerId } = req.body;

    if (req.user.role !== "brand") {
      return res.status(403).json({
        success: false,
        message: "Only brands can start conversations",
      });
    }

    if (!influencerId) {
      return res.status(400).json({
        success: false,
        message: "Influencer ID is required",
      });
    }

    const influencer = await InfluencerProfile.findById(influencerId);

    if (!influencer) {
      return res.status(404).json({
        success: false,
        message: "Influencer not found",
      });
    }

    let conversation = await Conversation.findOne({
      brandId: req.user.userId,
      influencerId: influencer._id,
    });

    if (!conversation) {
      conversation = await Conversation.create({
        brandId: req.user.userId,
        influencerId: influencer._id,
      });
    }

    res.status(200).json({
      success: true,
      message: "Conversation ready",
      conversation,
    });
  } catch (error) {
    console.error("Create conversation error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to create conversation",
      error: error.message,
    });
  }
};

// Get conversations for logged-in user
const getMyConversations = async (req, res) => {
  try {
    let conversations;

    if (req.user.role === "brand") {
      conversations = await Conversation.find({
        brandId: req.user.userId,
      })
        .populate("influencerId", "username bio profilePicture followers")
        .sort({ lastMessageAt: -1, createdAt: -1 });
    } else if (req.user.role === "influencer") {
      const influencer = await InfluencerProfile.findOne({
        userId: req.user.userId,
      });

      if (!influencer) {
        return res.status(404).json({
          success: false,
          message: "Influencer profile not found",
        });
      }

      conversations = await Conversation.find({
        influencerId: influencer._id,
      })
        .populate("brandId", "name email")
        .sort({ lastMessageAt: -1, createdAt: -1 });
    } else {
      return res.status(403).json({
        success: false,
        message: "Only brands and influencers can view conversations",
      });
    }

    res.status(200).json({
      success: true,
      count: conversations.length,
      conversations,
    });
  } catch (error) {
    console.error("Get conversations error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch conversations",
      error: error.message,
    });
  }
};

// Send a message
const sendMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { message } = req.body;

    if (!["brand", "influencer"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Only brands and influencers can send messages",
      });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    // Check whether the logged-in user belongs to this conversation
    let isParticipant = false;

    if (
      req.user.role === "brand" &&
      conversation.brandId.toString() === req.user.userId
    ) {
      isParticipant = true;
    }

    if (req.user.role === "influencer") {
      const influencer = await InfluencerProfile.findOne({
        userId: req.user.userId,
      });

      if (
        influencer &&
        conversation.influencerId.toString() === influencer._id.toString()
      ) {
        isParticipant = true;
      }
    }

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: "You are not a participant in this conversation",
      });
    }

    const newMessage = await Message.create({
      conversationId: conversation._id,
      senderId: req.user.userId,
      message: message.trim(),
    });

    conversation.lastMessage = message.trim();
    conversation.lastMessageAt = new Date();

    await conversation.save();

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    console.error("Send message error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to send message",
      error: error.message,
    });
  }
};

// Get messages in a conversation
const getConversationMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    if (!["brand", "influencer"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Only brands and influencers can view messages",
      });
    }

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    let isParticipant = false;

    if (
      req.user.role === "brand" &&
      conversation.brandId.toString() === req.user.userId
    ) {
      isParticipant = true;
    }

    if (req.user.role === "influencer") {
      const influencer = await InfluencerProfile.findOne({
        userId: req.user.userId,
      });

      if (
        influencer &&
        conversation.influencerId.toString() === influencer._id.toString()
      ) {
        isParticipant = true;
      }
    }

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: "You are not a participant in this conversation",
      });
    }

    const messages = await Message.find({
      conversationId: conversation._id,
    })
      .populate("senderId", "name email role")
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    console.error("Get conversation messages error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
      error: error.message,
    });
  }
};

module.exports = {
  createOrGetConversation,
  getMyConversations,
  sendMessage,
  getConversationMessages,
};
