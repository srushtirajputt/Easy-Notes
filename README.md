# Smart Notes Manager

A full-stack, secure, hierarchical note-taking application designed specifically for organizing Penetration Testing (CPTS) and hacking notes. 

## 🌟 Features

### 🔐 Authentication & Security
*   **User Registration & Login:** Secure sign-up with password validation.
*   **Password Hashing:** Passwords are cryptographically hashed using `bcryptjs`.
*   **JWT Authorization:** Stateless authentication using JSON Web Tokens.
*   **Protected Routes:** Users can *only* access their own folders and notes.

### 📁 Hierarchical Organization
*   **Root Folders:** Create top-level directories (e.g., `Reconnaissance`, `Exploitation`).
*   **Subfolders:** Infinite nesting capability (e.g., `Reconnaissance` → `Nmap`).
*   **Breadcrumb Navigation:** Clickable path tracking (`🏠 Home > Reconnaissance > Nmap`).
*   **Sidebar Tree:** Persistent left-hand sidebar for quick navigation.

### 📝 Note Management (CRUD)
*   **Create:** Add rich-text/code-snippet notes directly inside specific subfolders.
*   **Read:** View all notes within a folder as beautifully styled glassmorphism cards.
*   **Update:** Edit existing notes easily via modal overlays.
*   **Delete:** Permanently remove notes.

### 🎨 User Interface & Experience
*   **Glassmorphism Aesthetic:** Frosted glass cards and headers with vibrant gradient backgrounds.
*   **Dark Mode Toggle:** Smooth transition between light and dark themes.
*   **Live Search:** Instantly filter folders and notes by typing in the search bar.

---

## 💻 Tech Stack
*   **Frontend:** React.js (Vite), Tailwind CSS v3, React Router DOM, Axios
*   **Backend:** Node.js, Express.js
*   **Database:** MongoDB Atlas (Cloud)
*   **Security:** JWT, bcryptjs

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account and connection string.

### 1. Clone the Repository
```bash
git clone https://github.com/hackinsideadi/Notes-for-CPTS-Penetration-Testing-.git
cd Notes-for-CPTS-Penetration-Testing-
```

### 2. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory:
```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_super_secret_jwt_key
```
Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd client
npm install
```
Create a `.env` file in the `client` directory:
```env
VITE_API_URL=http://localhost:5000/api
```
Start the frontend server:
```bash
npm run dev
```

### 4. Open the App
Visit `http://localhost:5173` in your browser. Register an account and start organizing your notes!
