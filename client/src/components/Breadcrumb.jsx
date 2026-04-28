import React from "react";

const Breadcrumb = ({ folderPath, onNavigate }) => {
  return (
    <nav className="flex items-center text-sm mb-6 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
      <button 
        onClick={() => onNavigate(null)} 
        className="text-gray-500 hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400 flex items-center transition-colors"
      >
        <span className="text-lg mr-1 leading-none">🏠</span> Home
      </button>

      {folderPath.map((folder, index) => (
        <React.Fragment key={folder._id}>
          <span className="mx-2 text-gray-400 dark:text-gray-600">/</span>
          <button 
            onClick={() => onNavigate(folder)}
            className={`transition-colors ${
              index === folderPath.length - 1 
                ? "font-semibold text-gray-800 dark:text-white" 
                : "text-gray-500 hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400"
            }`}
          >
            {folder.name}
          </button>
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
