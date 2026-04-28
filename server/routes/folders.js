const express = require("express");
const router = express.Router();
const Folder = require("../models/Folder");
const auth = require("../middleware/auth");

// All folder routes require authentication
router.use(auth);

// ============================================
// GET /api/folders — Fetch all top-level folders for the user
// ============================================
router.get("/", async (req, res) => {
  try {
    const folders = await Folder.find({ user: req.user._id, parent: null }).sort({ createdAt: -1 });
    res.status(200).json(folders);
  } catch (error) {
    console.error("Error fetching folders:", error.message);
    res.status(500).json({ message: "Failed to fetch folders" });
  }
});

// ============================================
// GET /api/folders/:id — Fetch a specific folder and its subfolders
// ============================================
router.get("/:id", async (req, res) => {
  try {
    const folder = await Folder.findOne({ _id: req.params.id, user: req.user._id });
    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    const subfolders = await Folder.find({ parent: folder._id, user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ folder, subfolders });
  } catch (error) {
    console.error("Error fetching folder details:", error.message);
    res.status(500).json({ message: "Failed to fetch folder details" });
  }
});

// ============================================
// POST /api/folders — Create a new folder (or subfolder)
// ============================================
router.post("/", async (req, res) => {
  try {
    const { name, parent } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Folder name is required" });
    }

    const newFolder = await Folder.create({
      name,
      parent: parent || null,
      user: req.user._id,
    });

    res.status(201).json(newFolder);
  } catch (error) {
    console.error("Error creating folder:", error.message);
    res.status(500).json({ message: "Failed to create folder" });
  }
});

// ============================================
// PUT /api/folders/:id — Rename a folder
// ============================================
router.put("/:id", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Folder name is required" });
    }

    const updatedFolder = await Folder.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { name },
      { new: true, runValidators: true }
    );

    if (!updatedFolder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    res.status(200).json(updatedFolder);
  } catch (error) {
    console.error("Error updating folder:", error.message);
    res.status(500).json({ message: "Failed to update folder" });
  }
});

// ============================================
// DELETE /api/folders/:id — Delete a folder (Note: this should ideally delete subfolders/notes too)
// ============================================
router.delete("/:id", async (req, res) => {
  try {
    const deletedFolder = await Folder.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!deletedFolder) {
      return res.status(404).json({ message: "Folder not found" });
    }
    // We should also delete subfolders and notes, but keeping it simple for now, or you can implement cascading delete.
    res.status(200).json({ message: "Folder deleted successfully" });
  } catch (error) {
    console.error("Error deleting folder:", error.message);
    res.status(500).json({ message: "Failed to delete folder" });
  }
});

module.exports = router;
