// DarkModeToggle.jsx — Button to switch between light and dark mode

// Props:
// - isDark: boolean — is dark mode currently on?
// - toggleDark: function — called when user clicks the toggle
const DarkModeToggle = ({ isDark, toggleDark }) => {
  return (
    <button
      id="dark-mode-toggle"
      onClick={toggleDark}
      className="relative w-14 h-7 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
      style={{
        // Change background color based on dark mode state
        backgroundColor: isDark ? "#7c3aed" : "#e2e8f0",
      }}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {/* The sliding circle inside the toggle */}
      <span
        className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 flex items-center justify-center text-xs"
        style={{
          // Slide the circle: right side when dark, left side when light
          left: isDark ? "calc(100% - 1.5rem)" : "0.25rem",
        }}
      >
        {/* Show sun (☀️) in light mode, moon (🌙) in dark mode */}
        {isDark ? "🌙" : "☀️"}
      </span>
    </button>
  );
};

export default DarkModeToggle;
