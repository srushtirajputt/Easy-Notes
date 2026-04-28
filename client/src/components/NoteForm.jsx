// NoteForm.jsx — Modal form for Adding OR Editing a note
// When editingNote is null → we're adding a new note
// When editingNote has data → we're editing an existing note

import { useState, useEffect } from "react";

// Props:
// - onSubmit: function called when user submits the form (add or update)
// - editingNote: the note being edited (null if adding new)
// - onCancel: function called when user closes/cancels the form
// - isLoading: boolean — shows spinner while API call is in progress
const NoteForm = ({ onSubmit, editingNote, onCancel, isLoading }) => {
  // Form state — title and content fields
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // When editingNote changes (user clicks Edit on a card), fill the form with that note's data
  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title);
      setContent(editingNote.content);
    } else {
      // If no note being edited, clear the form
      setTitle("");
      setContent("");
    }
  }, [editingNote]); // Re-run this effect when editingNote changes

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload on form submit

    // Basic client-side validation
    if (!title.trim() || !content.trim()) return;

    // Call the parent's onSubmit with the form data
    onSubmit({ title: title.trim(), content: content.trim() });
  };

  // Is this form for adding or editing?
  const isEditing = !!editingNote;

  return (
    // Modal overlay — dark semi-transparent background
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
      
      {/* Modal card */}
      <div className="glass-card w-full max-w-lg p-6 animate-in slide-in-from-bottom-4">
        
        {/* Modal header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEditing ? "✏️ Edit Note" : "📝 Add New Note"}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {isEditing ? "Update your note below" : "Fill in the details below"}
            </p>
          </div>
          {/* Close button */}
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors text-2xl leading-none"
            title="Close"
          >
            ×
          </button>
        </div>

        {/* The form itself */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {/* Title input */}
          <div>
            <label htmlFor="note-title" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Title
            </label>
            <input
              id="note-title"
              type="text"
              placeholder="Give your note a title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              required
              autoFocus // Auto-focus the title field when modal opens
              maxLength={100}
            />
            {/* Character count */}
            <p className="text-xs text-gray-400 mt-1 text-right">{title.length}/100</p>
          </div>

          {/* Content textarea */}
          <div>
            <label htmlFor="note-content" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Content
            </label>
            <textarea
              id="note-content"
              placeholder="Write your note here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="input-field resize-none"
              rows={5}
              required
              maxLength={2000}
            />
            <p className="text-xs text-gray-400 mt-1 text-right">{content.length}/2000</p>
          </div>

          {/* Form action buttons */}
          <div className="flex gap-3 pt-2">
            {/* Cancel button */}
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary flex-1"
              disabled={isLoading}
            >
              Cancel
            </button>

            {/* Submit button — shows spinner while loading */}
            <button
              type="submit"
              className="btn-primary flex-1 flex items-center justify-center gap-2"
              disabled={isLoading || !title.trim() || !content.trim()}
            >
              {isLoading ? (
                // Spinner animation
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving...
                </>
              ) : (
                isEditing ? "💾 Save Changes" : "➕ Add Note"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteForm;
