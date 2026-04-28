// Import mongoose — the library that helps us talk to MongoDB easily
const mongoose = require("mongoose");

// Define the "shape" of a Note in our database
// Think of a schema like a blueprint for what a Note looks like
const noteSchema = new mongoose.Schema({
  // Title of the note — must be provided (required: true)
  title: {
    type: String,
    required: [true, "Title is required"], // Custom error message if missing
    trim: true, // Removes extra spaces from start/end
  },

  // Content/body of the note — must be provided
  content: {
    type: String,
    required: [true, "Content is required"],
    trim: true,
  },

  // The folder this note belongs to
  folder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Folder",
    required: true,
  },

  // The user who owns this note
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // When the note was created — automatically set to "now"
  createdAt: {
    type: Date,
    default: Date.now, // Automatically fills in the current date/time
  },
});

// Create a "model" from the schema
// A model is like a class — it lets us create, read, update, delete notes
// "Note" will be stored as a "notes" collection in MongoDB (auto-pluralized)
module.exports = mongoose.model("Note", noteSchema);
