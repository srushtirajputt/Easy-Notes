// Load environment variables from .env file FIRST (before anything else)
require("dotenv").config();

// Import required packages
const express = require("express"); // Web framework for building APIs
const mongoose = require("mongoose"); // Library to connect and talk to MongoDB
const cors = require("cors"); // Allows frontend (different port/domain) to talk to backend

// Import our routes
const notesRouter = require("./routes/notes");
const authRouter = require("./routes/auth");
const foldersRouter = require("./routes/folders");

// Create the Express app
const app = express();

// ============================================
// MIDDLEWARE — runs on every request
// ============================================

// Enable CORS — this allows your React frontend (running on port 5173)
// to make requests to this backend (running on port 5000)
app.use(
  cors({
    origin: "*", // In production, replace "*" with your Vercel frontend URL
  })
);

// Parse JSON request bodies — so we can read req.body
app.use(express.json());

// ============================================
// ROUTES
// ============================================

// Mount the routers
app.use("/api/auth", authRouter);
app.use("/api/folders", foldersRouter);
app.use("/api/notes", notesRouter);

// Simple health-check route — visit http://localhost:5000/ to verify server is running
app.get("/", (req, res) => {
  res.json({ message: "Smart Notes Manager API is running! 🚀" });
});

// ============================================
// DATABASE CONNECTION + SERVER START
// ============================================

// Get values from environment variables
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB Atlas, then start the server
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas successfully!");

    // Only start the server AFTER database is connected
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    // If database connection fails, log the error and exit
    console.error("❌ Failed to connect to MongoDB:", error.message);
    process.exit(1); // Exit the process with an error code
  });
