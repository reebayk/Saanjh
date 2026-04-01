# Saanjh (Tweek MVP) - Project Plan & File Structure

---

## **1. Project Goal**
Build a Tweek-like weekly planner web app MVP with:
- Week view + Someday tasks
- Add/Edit/Complete/Delete tasks
- Drag & drop between days
- Styled-components for modular CSS
- LocalStorage persistence (optional backend later)
- Ready for GitHub deployment and showcase

---

## **2. Technology Stack**
- **Frontend:** React 18, styled-components
- **State Management:** React Context + Custom Hooks
- **Task Storage:** LocalStorage (MVP)
- **Optional Backend:** Node.js + Express + MongoDB/PostgreSQL
- **Drag & Drop:** react-beautiful-dnd
- **Version Control:** Git + GitHub

---

## **3. File Structure**

```
Saanjh/
├─ public/
│  └─ index.html                 # HTML shell
├─ src/
│  ├─ components/                # Reusable UI components
│  │  ├─ Navbar.jsx
│  │  ├─ DayColumn.jsx
│  │  ├─ SomedayColumn.jsx
│  │  └─ TaskItem.jsx
│  ├─ pages/                     # Main pages/screens
│  │  ├─ Planner.jsx              # Main planner page
│  │  └─ Dashboard.jsx            # Optional home/dashboard
│  ├─ context/                   # React context for state
│  │  └─ TaskContext.jsx
│  ├─ hooks/                     # Custom hooks
│  │  └─ useTasks.js
│  ├─ utils/                     # Helper functions (tasks, dates)
│  │  └─ tasks.js
│  ├─ App.jsx                    # Main app component
│  ├─ index.jsx                  # React entry point
│  └─ styles/                    # Styled-components
│     └─ globalStyles.js
├─ package.json
├─ .gitignore
└─ README.md
```

**Notes:**
- Components should be small, focused, and reusable.
- Pages handle layout and combine multiple components.
- Context provides global state for tasks.
- Hooks encapsulate reusable logic (e.g., localStorage sync).
- Styles are modular using styled-components.

---

## **4. MVP Features**
1. Weekly view with days (Sun-Sat)
2. Someday column for unscheduled tasks
3. Add/Edit/Delete tasks
4. Mark tasks as done/undone
5. Drag & drop tasks between days
6. Persist tasks in localStorage
7. Responsive design
8. Styled-components for theming and scoped CSS

---

## **5. Developer Workflow**

1. **Plan & Structure**
   - Decide MVP scope
   - Define file/folder structure

2. **Setup Project**
   - `create-react-app` or `Vite` for React project
   - Install dependencies: `styled-components`, `react-beautiful-dnd`

3. **Frontend Development**
   - Build components (`Navbar`, `DayColumn`, `TaskItem`)
   - Build pages (`Planner.jsx`)
   - Add state management (Context + Hooks)
   - Implement drag & drop
   - Use styled-components for all styling

4. **Backend (Optional)**
   - Node.js + Express
   - API endpoints: GET/POST/PATCH/DELETE tasks
   - Connect frontend via fetch/axios
   - Use MongoDB/PostgreSQL for storage

5. **Version Control**
   - `git init`, frequent commits
   - Push to GitHub repo `Saanjh`
   - Example:
     ```bash
     git init
     git add .
     git commit -m "Initial commit: structure & plan"
     git remote add origin https://github.com/<username>/Saanjh.git
     git branch -M main
     git push -u origin main
     ```

6. **Testing & Iteration**
   - Test manually
   - Fix UI/UX bugs
   - Optimize performance

7. **Deployment**
   - Frontend: Vercel / Netlify
   - Backend: Heroku / Render (optional)

---

## **6. Future Improvements (Post-MVP)**
- User authentication
- Persistent backend storage
- Real-time updates with WebSocket
- Reminders/notifications
- Recurring tasks
- Dark/light mode

---

## **7. References / Inspirations**
- Tweek.so app design & functionality
- React best practices for MVP
- Styled-components documentation
- GitHub workflow for frontend projects

---

> This document serves as the single source of truth for our Tweek MVP project. Always refer back here before adding new features or restructuring files.

