# 🎓 ScholarPulse - Student CRUD & Management System

ScholarPulse is a modern, high-performance Student CRUD and Academic Management Web Application built with HTML5, modern Vanilla CSS (custom design system, glassmorphism, dark/light themes), and Vanilla JavaScript (ES6+ modular architecture), supported by a lightweight Node.js HTTP server and REST API.

---

## ✨ Features

- **Full CRUD Operations**:
  - **Create**: Add new students with real-time field validation, custom avatar color picker, and dynamic monogram generation.
  - **Read**: Live KPI analytics dashboard, dual view switcher (**Data Table View** vs **Profile Cards Grid View**), and Student Dossier modal.
  - **Update**: Edit existing student records seamlessly with immediate updates.
  - **Delete**: Safe single deletion with confirmation modal and multi-select bulk delete.
- **Search & Filtering**:
  - Instant multi-field search (by Name, Student ID, Email, Department).
  - Department and Academic Year filter dropdowns.
  - Status filter pills (`All`, `Active`, `On Leave`, `Inactive`).
- **Academic Analytics**:
  - Total Enrolled Students with active/inactive ratio.
  - Cumulative Average GPA with dynamic grade tiers (Dean's Honor, Distinction, Good Standing).
  - Attendance Rate with progress indicator.
  - Dean's Honor Roll count (GPA ≥ 3.80).
- **Data Export**:
  - Export filtered or all records to **CSV** (Spreadsheet) or **JSON**.
- **Dual Persistence**:
  - Syncs with local REST API backend (`/api/students`) and persists to `localStorage` offline.
- **Modern Design**:
  - Glassmorphic dark and light themes with smooth transitions.
  - Responsive layout for desktop, tablet, and mobile.

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, Vanilla CSS3 (Custom Design System, CSS Variables), Vanilla JavaScript (ES6+)
- **Backend / API**: Node.js Native HTTP Server (`server.js`) with file-backed JSON storage
- **Fonts**: Plus Jakarta Sans & JetBrains Mono (Google Fonts)

---

## 🚀 Quick Start

### 1. Run with Node.js
```bash
# Start the local server
npm start
# or
node server.js
```

Then open your browser at **http://localhost:3000**.

### 2. Standalone
You can also open `index.html` directly in any web browser; it will seamlessly run in `localStorage` mode with pre-seeded sample student data.

---

## 📝 License
MIT License
