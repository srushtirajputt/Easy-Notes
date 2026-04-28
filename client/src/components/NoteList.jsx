// NoteList.jsx — Renders the grid of all (filtered) notes
// If no notes, shows an empty state message

import NoteCard from "./NoteCard";

// Props:
// - notes: array of note objects to display
// - onEdit: function to call when user clicks Edit on a card
// - onDelete: function to call when user clicks Delete on a card
// - isLoading: boolean — show skeleton placeholders while fetching
const NoteList = ({ notes, onEdit, onDelete, isLoading }) => {

  // LOADING STATE — show placeholder skeleton cards
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Render 6 skeleton cards */}
        {[...Array(6)].map((_, i) => (
          <div key={i} className="glass-card p-5 animate-pulse">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4 mb-3" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-2" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/6" />
          </div>
        ))}
      </div>
    );
  }

  // EMPTY STATE — no notes found
  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="text-7xl mb-4">📭</div>
        <h3 className="text-xl font-bold text-gray-500 dark:text-gray-400 mb-2">
          No notes found
        </h3>
        <p className="text-gray-400 dark:text-gray-500 text-sm max-w-xs">
          Try adding a new note or adjusting your search query
        </p>
      </div>
    );
  }

  // NORMAL STATE — render the grid of NoteCard components
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {notes.map((note) => (
        // Each NoteCard gets the note data + handler functions as props
        <NoteCard
          key={note._id}  // React needs a unique key for each list item
          note={note}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default NoteList;
