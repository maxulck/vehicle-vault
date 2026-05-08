import User from "../models/User.js";
import { signToken } from "../utils/token.js";

function buildAuthResponse(user) {
  return {
    user: user.toSafeJSON(),
    token: signToken(user._id)
  };
}

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    const user = await User.create({ name, email, password });
    res.status(201).json(buildAuthResponse(user));
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email }).select("+password");
    const passwordMatches = user ? await user.comparePassword(password) : false;

    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json(buildAuthResponse(user));
  } catch (error) {
    next(error);
  }
}

export async function profile(req, res) {
  res.json({ user: req.user.toSafeJSON() });
}
