const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const instagramRoutes = require("./routes/instagramRoutes");
const campaignRoutes = require("./routes/campaignRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/instagram", instagramRoutes);
app.use("/api/campaigns", campaignRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "ScrollMart API is running",
  });
});

connectDB();

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`ScrollMart server running on port ${PORT}`);
});
