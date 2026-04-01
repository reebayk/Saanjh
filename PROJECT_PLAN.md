# Saanjh (Tweek MVP) - Project Plan & File Structure

---

## **1. Project Goal**

Build a Tweek-like weekly planner full-stack MVP with:

* Week view + Someday tasks
* Add/Edit/Complete/Delete tasks
* Drag & drop between days
* Styled-components for modular CSS
* Persistent backend database for real users (Firebase Firestore)
* User authentication via Firebase Auth
* Ready for GitHub deployment and showcase

---

## **2. Technology Stack**

* **Frontend:** React 18, styled-components
* **State Management:** React Context + Custom Hooks
* **Backend / Database:** Firebase (Firestore + Auth)
* **Drag & Drop:** react-beautiful-dnd
* **Version Control:** Git + GitHub
* **Hosting:** Firebase Hosting or Vercel

---

## **3. File Structure**

```
Saanjh/
├─ frontend/
│  ├─ public/
│  │  └─ index.html                 # HTML shell
│  ├─ src/
│  │  ├─ components/                # Reusable UI components
│  │  │  ├─ Navbar.jsx
│  │  │  ├─ DayColumn.jsx
│  │  │  ├─ SomedayColumn.jsx
│  │  │  └─ TaskItem.jsx
│  │  ├─ pages/                     # Main pages/screens
│  │  │  └─ Planner.jsx              # Main planner page
│  │  ├─ context/                   # React context for state
│  │  │  └─ TaskContext.jsx
│  │  ├─ hooks/                     # Custom hooks
│  │  │  └─ useTasks.js
│  │  ├─ utils/                     # Helper functions (tasks, dates)
│  │  │  └─ tasks.js
│  │  ├─ firebase/                  # Firebase config
│  │  │  └─ config.js
│  │  ├─ App.jsx                    # Main app component
│  │  ├─ index.jsx                  # React entry point
│  │  └─ styles/                    # Styled-components
│  │     └─ globalStyles.js
├─ package.json  (frontend dependencies)
├─ PROJECT_PLAN.md
```

**Notes:**

* Components are small, reusable, and focused.
* Pages handle layout and combine components.
* Context provides global state for tasks.
* Hooks encapsulate reusable logic.
* Firebase handles backend, auth, and persistent storage.
* Styles are modular using styled-components.

---

## **4. MVP Features**

1. Weekly view with days (Sun-Sat)
2. Someday column for unscheduled tasks
3. Add/Edit/Delete tasks
4. Mark tasks as done/undone
5. Drag & drop tasks between days
6. Persist tasks in Firebase Firestore
7. User authentication via Firebase Auth
8. Responsive design
9. Styled-components for theming and scoped CSS

---

## **5. Developer Workflow**

1. **Plan & Structure**

   * Define MVP scope
   * Set file/folder structure

2. **Setup Project**

   * `create-react-app` or `Vite` for frontend
   * Install dependencies: `styled-components`, `react-beautiful-dnd`, `firebase`

3. **Frontend Development**

   * Build React components (`Navbar`, `DayColumn`, `TaskItem`, `SomedayColumn`)
   * Build pages (`Planner.jsx`)
   * Add state management (Context + Hooks)
   * Connect to Firebase Firestore and Auth
   * Implement drag & drop
   * Use styled-components for all styling

4. **Backend / Database**

   * Firebase handles tasks and auth
   * Firestore stores user tasks
   * Firebase Auth manages users

5. **Version Control**

   * `git init`, frequent commits
   * Push to GitHub repo `Saanjh`

   ```bash
   git init
   git add .
   git commit -m "Initial commit: updated full-stack plan"
   git branch -M main
   git remote add origin https://github.com/<username>/Saanjh.git
   git push -u origin main
   ```

6. **Testing & Iteration**

   * Test frontend components with real Firebase data
   * Fix UI/UX bugs
   * Ensure drag/drop and task sync works

7. **Deployment**

   * Frontend + backend via Firebase Hosting

---

## **6. Future Improvements (Post-MVP)**

* Recurring tasks
* Notifications / reminders
* Dark/light mode
* Mobile app support
* More advanced analytics for tasks

---

## **7. References / Inspirations**

* Tweek.so app design & functionality
* Firebase Firestore & Auth docs
* React + styled-components best practices
* GitHub workflow for frontend projects

---

> This document serves as the single source of truth for our full-stack Tweek MVP project. Always refer back here before adding new features or restructuring files.
