import { verifyJWT } from "../lib/auth.js";
import User from "../model/User.js";
const allowAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies["token"];
    if (!token) {
      return res.status(401).json({ message: "Authentication token missing" });
    }

    const decoded = verifyJWT(token);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid authentication token" });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in authentication middleware:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default allowAuthenticated;
