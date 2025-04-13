const UserModel = require("../models/UserModel");
const AuthRouter = require("express").Router();
const bcrypt = require("bcryptjs");
require("dotenv").config();

AuthRouter.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    console.error("Signup error:", error.message);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
});

AuthRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "No record existed" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "The password is incorrect" });
    }

    return res.status(200).json({
      message: "Login successful",
      userId: user._id,
      user: { id: user._id, email: user.email },
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      message: "Something went wrong",
    });
  }
});

module.exports = AuthRouter;
