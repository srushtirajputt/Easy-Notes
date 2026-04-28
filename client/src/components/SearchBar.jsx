// SearchBar.jsx — Live search input that filters notes by title

// Props:
// - searchQuery: current value of the search input (controlled by App.jsx)
// - setSearchQuery: function to update the search value
const SearchBar = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="relative w-full max-w-md">
      {/* Search icon inside the input */}
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* The actual search input */}
      <input
        id="search-input"
        type="text"
        placeholder="Search notes by title..."
        value={searchQuery}
        // Every time the user types, update the searchQuery state in App.jsx
        onChange={(e) => setSearchQuery(e.target.value)}
        className="input-field pl-12 pr-4" // pl-12 = left padding to make room for the icon
      />

      {/* Show a clear button when there's text in the search box */}
      {searchQuery && (
        <button
          onClick={() => setSearchQuery("")} // Clear the search
          className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          title="Clear search"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default SearchBar;
