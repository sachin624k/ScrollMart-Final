const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const existingAdmin = await User.findOne({
      email: "admin@scrollmart.com",
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const passwordHash = await bcrypt.hash("Admin@12345", 10);

    const admin = await User.create({
      name: "ScrollMart Admin",
      email: "admin@scrollmart.com",
      passwordHash,
      role: "admin",
      emailVerified: true,
      accountStatus: "active",
    });

    console.log("Admin created successfully");
    console.log("Admin ID:", admin._id);

    process.exit(0);
  } catch (error) {
    console.error("Create admin error:", error.message);
    process.exit(1);
  }
};

createAdmin();
