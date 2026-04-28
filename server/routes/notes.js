// Import express Router — lets us define routes in a separate file
const express = require("express");
const router = express.Router();

// Import our Note model so we can interact with the database
const Note = require("../models/Note");
const auth = require("../middleware/auth");

// All note routes require authentication
router.use(auth);

// ============================================
// GET /api/notes — Fetch notes (optionally filtered by folder)
// ============================================
router.get("/", async (req, res) => {
  try {
    // Check if a folder ID was provided in the query string (e.g. ?folder=123)
    const { folder } = req.query;
    
    // Build query object: always filter by the logged-in user
    const query = { user: req.user._id };
    
    // If a folder is specified, add it to the query
    if (folder) {
      query.folder = folder;
    }

    // Find all matching notes, sorted by newest first
    const notes = await Note.find(query).sort({ createdAt: -1 });

    // Send back the notes as JSON with a 200 (OK) status
    res.status(200).json(notes);
  } catch (error) {
    // If something goes wrong, send a 500 (Server Error) response
    console.error("Error fetching notes:", error.message);
    res.status(500).json({ message: "Failed to fetch notes" });
  }
});

// ============================================
// POST /api/notes — Create a NEW note
// ============================================
router.post("/", async (req, res) => {
  try {
    // Get title, content, and folder from the request body
    const { title, content, folder } = req.body;

    // Validate — make sure all required fields are provided
    if (!title || !content || !folder) {
      return res
        .status(400)
        .json({ message: "Title, content, and folder are required" });
    }

    // Create a new Note document in the database, assigned to current user
    const newNote = await Note.create({ 
      title, 
      content, 
      folder, 
      user: req.user._id 
    });

    // Send back the created note with a 201 (Created) status
    res.status(201).json(newNote);
  } catch (error) {
    console.error("Error creating note:", error.message);
    res.status(500).json({ message: "Failed to create note" });
  }
});

// ============================================
// PUT /api/notes/:id — Update an EXISTING note
// ============================================
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, folder } = req.body;

    // Find the note by ID AND user to ensure they own it
    const updatedNote = await Note.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { title, content, folder },
      { new: true, runValidators: true }
    );

    // If no note found with that ID, send a 404 (Not Found)
    if (!updatedNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Send back the updated note
    res.status(200).json(updatedNote);
  } catch (error) {
    console.error("Error updating note:", error.message);
    res.status(500).json({ message: "Failed to update note" });
  }
});

// ============================================
// DELETE /api/notes/:id — Delete a note
// ============================================
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Find the note by ID AND user, then delete it
    const deletedNote = await Note.findOneAndDelete({ _id: id, user: req.user._id });

    // If no note found with that ID, send a 404
    if (!deletedNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Send a success message
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error deleting note:", error.message);
    res.status(500).json({ message: "Failed to delete note" });
  }
});

// Export the router so we can use it in server.js
module.exports = router;
