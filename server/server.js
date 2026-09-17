const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);

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
