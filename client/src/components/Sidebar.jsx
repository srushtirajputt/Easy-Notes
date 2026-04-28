import React from "react";

const Sidebar = ({ folders, currentFolderId, onNavigate, onCreateFolder }) => {
  return (
    <div className="w-64 flex-shrink-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border-r border-white/20 dark:border-gray-800/50 p-4 h-[calc(100vh-73px)] overflow-y-auto sticky top-[73px]">
      
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          My Folders
        </h2>
        <button 
          onClick={() => onCreateFolder(null)}
          className="text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/30 p-1 rounded transition-colors text-sm font-bold"
          title="New Root Folder"
        >
          + New
        </button>
      </div>

      <div className="flex flex-col gap-1">
        <button
          onClick={() => onNavigate(null)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            currentFolderId === null
              ? "bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300"
              : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          <span className="text-lg leading-none">🏠</span> Home (Root)
        </button>

        {folders.map(folder => (
          <button
            key={folder._id}
            onClick={() => onNavigate(folder)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              currentFolderId === folder._id
                ? "bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            <span className="text-lg leading-none">📁</span> 
            <span className="truncate">{folder.name}</span>
          </button>
        ))}
      </div>
      
      {folders.length === 0 && (
        <div className="text-center py-6 px-2 text-sm text-gray-400 dark:text-gray-500 border border-dashed border-gray-200 dark:border-gray-700 rounded-lg mt-4">
          No folders yet. Create one to organize your notes!
        </div>
      )}
    </div>
  );
};

export default Sidebar;
