const FolderCard = ({ folder, onClick, onDelete, onRename }) => {
  return (
    <div className="glass-card p-4 flex flex-col gap-3 hover:shadow-xl hover:shadow-violet-500/10 hover:-translate-y-1 transition-all duration-300 group cursor-pointer" onClick={() => onClick(folder)}>
      <div className="flex items-start justify-between">
        <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
          📁
        </div>
        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
          <button 
            onClick={() => onRename(folder)}
            className="text-gray-400 hover:text-violet-500 p-1 rounded-md transition-colors"
            title="Rename Folder"
          >
            ✏️
          </button>
          <button 
            onClick={() => onDelete(folder._id)}
            className="text-gray-400 hover:text-rose-500 p-1 rounded-md transition-colors"
            title="Delete Folder"
          >
            🗑️
          </button>
        </div>
      </div>
      
      <h3 className="font-bold text-gray-800 dark:text-white line-clamp-1 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
        {folder.name}
      </h3>
      
      <div className="text-xs text-gray-400 dark:text-gray-500 mt-auto pt-2 border-t border-gray-100 dark:border-gray-700/50">
        Created {new Date(folder.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
};

export default FolderCard;
