// NoteCard.jsx — Displays a single note with title, content, date, and action buttons

// We receive "note", "onEdit", and "onDelete" as props (data passed from parent)
const NoteCard = ({ note, onEdit, onDelete }) => {
  // Format the date nicely (e.g., "April 28, 2025")
  const formattedDate = new Date(note.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    // The card container — uses our .glass-card class from index.css
    <div className="glass-card p-5 flex flex-col gap-3 hover:shadow-xl hover:shadow-violet-500/10 hover:-translate-y-1 transition-all duration-300 group">
      
      {/* Card header: title + date */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white line-clamp-1 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
          {note.title}
        </h3>
        {/* Small gradient dot — decorative */}
        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 mt-2 flex-shrink-0" />
      </div>

      {/* Note content — limited to 3 lines to keep cards uniform height */}
      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3 flex-1">
        {note.content}
      </p>

      {/* Card footer: date + action buttons */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
        {/* Creation date */}
        <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {formattedDate}
        </span>

        {/* Edit and Delete buttons */}
        <div className="flex gap-2">
          {/* Edit button — calls onEdit with this note's data */}
          <button
            onClick={() => onEdit(note)}
            className="btn-secondary text-xs px-3 py-1.5"
            title="Edit note"
          >
            ✏️ Edit
          </button>

          {/* Delete button — calls onDelete with this note's ID */}
          <button
            onClick={() => onDelete(note._id)}
            className="btn-danger text-xs px-3 py-1.5"
            title="Delete note"
          >
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
