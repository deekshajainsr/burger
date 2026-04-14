import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.ts";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-burger-key";

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, username, password } = req.body;

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email already exists" });
    }

    if (username) {
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return res.status(400).json({ error: "Username already exists" });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      username: username || email.split('@')[0],
      password: hashedPassword,
      role: email === "srdeekshajain@gmail.com" ? 'admin' : 'user'
    });

    await user.save();

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const userObj = user.toObject();
    delete (userObj as any).password;

    res.status(201).json({ 
      message: "Signup successful",
      user: { ...userObj, id: user._id.toString() } 
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Signup failed" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { userId, password } = req.body; // userId can be email or username

    const user = await User.findOne({
      $or: [{ email: userId }, { username: userId }]
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Bootstrap admin check
    if (user.email === "srdeekshajain@gmail.com" && user.role !== 'admin') {
      user.role = 'admin';
      await user.save();
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const userObj = user.toObject();
    delete (userObj as any).password;

    res.json({ 
      message: "Login successful",
      user: { ...userObj, id: user._id.toString() } 
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

// Logout
router.post("/logout", (req, res) => {
  res.clearCookie("auth_token");
  res.json({ message: "Logged out successfully" });
});

// Get current user
router.get("/me", async (req, res) => {
  const token = req.cookies.auth_token;
  if (!token) return res.status(401).json({ error: "Not authenticated" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    
    const userObj = user.toObject();
    res.json({ user: { ...userObj, id: user._id.toString() } });
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
});

export default router;
