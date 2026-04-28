const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
    // Check if the authorization header exists and starts with Bearer
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No authentication token, access denied" });
    }

    // Extract the token
    const token = authHeader.replace("Bearer ", "");

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user associated with the token
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Token verification failed, user not found" });
    }

    // Attach the user to the request object so subsequent routes can use it
    req.user = user;
    next(); // Pass control to the next middleware or route handler
  } catch (error) {
    res.status(401).json({ message: "Invalid authentication token" });
  }
};

module.exports = auth;
