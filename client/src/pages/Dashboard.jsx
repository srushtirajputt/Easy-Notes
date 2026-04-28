import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import NoteList from "../components/NoteList";
import NoteForm from "../components/NoteForm";
import SearchBar from "../components/SearchBar";
import DarkModeToggle from "../components/DarkModeToggle";
import Sidebar from "../components/Sidebar";
import Breadcrumb from "../components/Breadcrumb";
import FolderCard from "../components/FolderCard";
import { useAuth } from "../context/AuthContext";

const Dashboard = ({ isDark, toggleDark }) => {
  const { user, logout } = useAuth();
  
  // App Data State
  const [rootFolders, setRootFolders] = useState([]);
  const [subfolders, setSubfolders] = useState([]);
  const [notes, setNotes] = useState([]);
  
  // Navigation State
  const [currentFolder, setCurrentFolder] = useState(null); // null = Home
  const [folderPath, setFolderPath] = useState([]); // Breadcrumb path
  
  // UI State
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal State
  const [isNoteFormOpen, setIsNoteFormOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  // ============================================
  // FETCH DATA BASED ON CURRENT FOLDER
  // ============================================
  useEffect(() => {
    fetchData();
  }, [currentFolder]); // Re-run when currentFolder changes

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!currentFolder) {
        // We are at HOME (Root)
        const folderRes = await axios.get(`${API_URL}/folders`);
        setRootFolders(folderRes.data);
        setSubfolders(folderRes.data);
        
        // Fetch root notes (notes without a folder aren't technically allowed now, but we'll fetch them if they exist or just fetch everything? No, let's just fetch notes where folder is null, wait... our Note schema requires a folder. So at Home, we either show no notes, or all notes. Let's show all notes at Home for easy search, or no notes. Let's fetch NO notes at root, only folders.)
        setNotes([]);
      } else {
        // We are inside a FOLDER
        const folderRes = await axios.get(`${API_URL}/folders/${currentFolder._id}`);
        setSubfolders(folderRes.data.subfolders);
        
        // Fetch notes inside this folder
        const notesRes = await axios.get(`${API_URL}/notes?folder=${currentFolder._id}`);
        setNotes(notesRes.data);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data.");
    } finally {
      setIsLoading(false);
    }
  };

  // Ensure rootFolders is always populated for the Sidebar
  useEffect(() => {
    const fetchRootFolders = async () => {
      try {
        const res = await axios.get(`${API_URL}/folders`);
        setRootFolders(res.data);
      } catch (err) {
        console.error("Error fetching root folders", err);
      }
    };
    if (currentFolder) {
      fetchRootFolders();
    }
  }, [currentFolder]);


  // ============================================
  // FOLDER CRUD
  // ============================================
  const handleCreateFolder = async (parentFolderId) => {
    const name = window.prompt("Enter folder name:");
    if (!name || !name.trim()) return;

    try {
      const res = await axios.post(`${API_URL}/folders`, {
        name: name.trim(),
        parent: parentFolderId
      });
      
      // Update UI immediately
      if (parentFolderId === null) {
        setRootFolders([res.data, ...rootFolders]);
      }
      if ((!currentFolder && parentFolderId === null) || (currentFolder && currentFolder._id === parentFolderId)) {
        setSubfolders([res.data, ...subfolders]);
      }
    } catch (err) {
      console.error("Error creating folder:", err);
      setError("Failed to create folder.");
    }
  };

  const handleRenameFolder = async (folder) => {
    const newName = window.prompt("Enter new folder name:", folder.name);
    if (!newName || !newName.trim() || newName === folder.name) return;

    try {
      const res = await axios.put(`${API_URL}/folders/${folder._id}`, { name: newName.trim() });
      setSubfolders(prev => prev.map(f => f._id === folder._id ? res.data : f));
      setRootFolders(prev => prev.map(f => f._id === folder._id ? res.data : f));
      
      // Update breadcrumb if we rename a folder in the path
      setFolderPath(prev => prev.map(f => f._id === folder._id ? res.data : f));
    } catch (err) {
      console.error("Error renaming folder:", err);
      setError("Failed to rename folder.");
    }
  };

  const handleDeleteFolder = async (folderId) => {
    if (!window.confirm("Are you sure? This will delete the folder (subfolders/notes inside are currently left orphaned in the DB in this version).")) return;

    try {
      await axios.delete(`${API_URL}/folders/${folderId}`);
      setSubfolders(prev => prev.filter(f => f._id !== folderId));
      setRootFolders(prev => prev.filter(f => f._id !== folderId));
    } catch (err) {
      console.error("Error deleting folder:", err);
      setError("Failed to delete folder.");
    }
  };

  // ============================================
  // NOTE CRUD
  // ============================================
  const handleNoteSubmit = async ({ title, content }) => {
    try {
      setIsSubmitting(true);
      setError(null);

      if (editingNote) {
        // Edit existing
        const res = await axios.put(`${API_URL}/notes/${editingNote._id}`, { title, content, folder: currentFolder._id });
        setNotes(prev => prev.map(n => n._id === editingNote._id ? res.data : n));
      } else {
        // Add new
        const res = await axios.post(`${API_URL}/notes`, { title, content, folder: currentFolder._id });
        setNotes(prev => [res.data, ...prev]);
      }
      setIsNoteFormOpen(false);
      setEditingNote(null);
    } catch (err) {
      console.error("Error saving note:", err);
      setError("Failed to save note.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteNote = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      await axios.delete(`${API_URL}/notes/${id}`);
      setNotes(prev => prev.filter(n => n._id !== id));
    } catch (err) {
      console.error("Error deleting note:", err);
      setError("Failed to delete note.");
    }
  };

  // ============================================
  // NAVIGATION
  // ============================================
  const navigateToFolder = (folder) => {
    setCurrentFolder(folder);
    if (!folder) {
      setFolderPath([]);
    } else {
      // Rebuild path logic: if navigating from breadcrumb, truncate path. Otherwise, append.
      const indexInPath = folderPath.findIndex(f => f._id === folder._id);
      if (indexInPath >= 0) {
        setFolderPath(folderPath.slice(0, indexInPath + 1));
      } else {
        setFolderPath([...folderPath, folder]);
      }
    }
    setSearchQuery(""); // Clear search on navigation
  };

  // Search filtering
  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return notes;
    return notes.filter(n => n.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [notes, searchQuery]);

  const filteredFolders = useMemo(() => {
    if (!searchQuery.trim()) return subfolders;
    return subfolders.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [subfolders, searchQuery]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-indigo-50/50 dark:from-gray-950 dark:via-violet-950/20 dark:to-gray-950 transition-colors duration-300">
      
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b border-white/20 dark:border-gray-800/50 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-xl shadow-lg shadow-violet-500/30">📝</div>
            <div>
              <h1 className="text-xl font-extrabold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
                Smart Notes
              </h1>
              <p className="text-xs text-gray-500 font-medium">Welcome, {user?.username}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <DarkModeToggle isDark={isDark} toggleDark={toggleDark} />
            <button onClick={logout} className="text-sm font-semibold text-gray-500 hover:text-rose-500 transition-colors">
              🚪 Logout
            </button>
          </div>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* SIDEBAR */}
        <Sidebar 
          folders={rootFolders} 
          currentFolderId={currentFolder?._id || null} 
          onNavigate={navigateToFolder} 
          onCreateFolder={() => handleCreateFolder(null)}
        />

        {/* CONTENT AREA */}
        <main className="flex-1 p-6 overflow-y-auto h-[calc(100vh-73px)]">
          <Breadcrumb folderPath={folderPath} onNavigate={navigateToFolder} />
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            
            <div className="flex gap-2">
              <button onClick={() => handleCreateFolder(currentFolder ? currentFolder._id : null)} className="btn-secondary flex items-center gap-2">
                <span>📁+</span> New Folder
              </button>
              
              {currentFolder && (
                <button onClick={() => { setEditingNote(null); setIsNoteFormOpen(true); }} className="btn-primary flex items-center gap-2">
                  <span>📝+</span> Add Note
                </button>
              )}
            </div>
          </div>

          {error && (
             <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/50 rounded-2xl text-rose-700 dark:text-rose-400 flex justify-between text-sm">
               <span>{error}</span>
               <button onClick={() => setError(null)} className="text-rose-400 hover:text-rose-600 ml-4 text-lg leading-none">×</button>
             </div>
          )}

          {isLoading ? (
            <div className="flex justify-center py-20"><svg className="animate-spin w-8 h-8 text-violet-600" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg></div>
          ) : (
            <>
              {/* RENDER FOLDERS */}
              {filteredFolders.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4 border-b border-gray-200 dark:border-gray-800 pb-2">Folders</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredFolders.map(folder => (
                      <FolderCard 
                        key={folder._id} 
                        folder={folder} 
                        onClick={navigateToFolder} 
                        onDelete={handleDeleteFolder}
                        onRename={handleRenameFolder}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* RENDER NOTES */}
              {currentFolder && (
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4 border-b border-gray-200 dark:border-gray-800 pb-2">Notes in {currentFolder.name}</h3>
                  <NoteList 
                    notes={filteredNotes} 
                    onEdit={(note) => { setEditingNote(note); setIsNoteFormOpen(true); }} 
                    onDelete={handleDeleteNote} 
                    isLoading={false} 
                  />
                </div>
              )}

              {/* EMPTY STATE */}
              {filteredFolders.length === 0 && (!currentFolder || filteredNotes.length === 0) && (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4 opacity-50">👻</div>
                  <h3 className="text-xl font-bold text-gray-500 dark:text-gray-400 mb-2">It's quiet here...</h3>
                  <p className="text-gray-400">Create a folder or add a note to get started.</p>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {isNoteFormOpen && (
        <NoteForm 
          onSubmit={handleNoteSubmit} 
          editingNote={editingNote} 
          onCancel={() => { setIsNoteFormOpen(false); setEditingNote(null); }} 
          isLoading={isSubmitting} 
        />
      )}
    </div>
  );
};

export default Dashboard;
