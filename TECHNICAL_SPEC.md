# Technical Specification Document
## TaskFlow - System Architecture & Implementation

**Version:** 1.0  
**Last Updated:** February 6, 2026  
**Author:** [Your Name]

---

## 1. System Architecture

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │   React 18 + TypeScript + Tailwind CSS          │  │
│  │   - Components (UI)                              │  │
│  │   - State Management (Zustand/Context)           │  │
│  │   - Service Worker (PWA)                         │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↕ HTTPS/REST
┌─────────────────────────────────────────────────────────┐
│                      API LAYER                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │   Node.js + Express                              │  │
│  │   - Route Handlers                                │  │
│  │   - Middleware (Auth, Validation, Error)         │  │
│  │   - Controllers                                   │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↕ SQL
┌─────────────────────────────────────────────────────────┐
│                   DATABASE LAYER                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │   PostgreSQL 15+                                 │  │
│  │   - Relational Tables                             │  │
│  │   - Indexes                                       │  │
│  │   - Constraints                                   │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### 1.2 Technology Stack

#### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2+ | UI library |
| TypeScript | 5.0+ | Type safety |
| Vite | 5.0+ | Build tool |
| Tailwind CSS | 3.4+ | Styling |
| Zustand | 4.5+ | State management (lightweight) |
| React Router | 6.20+ | Client-side routing |
| React DnD | 16.0+ | Drag-and-drop |
| Axios | 1.6+ | HTTP client |
| date-fns | 3.0+ | Date manipulation |
| React Hot Toast | 2.4+ | Notifications UI |

#### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 20 LTS | Runtime |
| Express | 4.18+ | Web framework |
| TypeScript | 5.0+ | Type safety |
| PostgreSQL | 15+ | Database |
| Prisma | 5.8+ | ORM |
| jsonwebtoken | 9.0+ | JWT auth |
| bcrypt | 5.1+ | Password hashing |
| express-validator | 7.0+ | Input validation |
| dotenv | 16.3+ | Environment variables |
| cors | 2.8+ | CORS handling |
| helmet | 7.1+ | Security headers |

#### DevOps & Tools
| Tool | Purpose |
|------|---------|
| Git/GitHub | Version control |
| ESLint | Code linting |
| Prettier | Code formatting |
| Vercel | Frontend hosting |
| Railway/Render | Backend hosting |
| Supabase | PostgreSQL hosting |
| GitHub Actions | CI/CD (optional) |
| Postman | API testing |

---

## 2. System Components

### 2.1 Frontend Architecture

#### Folder Structure
```
frontend/
├── public/
│   ├── favicon.ico
│   ├── manifest.json
│   └── service-worker.js
├── src/
│   ├── assets/
│   │   ├── sounds/
│   │   └── icons/
│   ├── components/
│   │   ├── common/          # Reusable components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Spinner.tsx
│   │   ├── tasks/           # Task-related components
│   │   │   ├── TaskCard.tsx
│   │   │   ├── TaskList.tsx
│   │   │   ├── TaskForm.tsx
│   │   │   └── TaskDetails.tsx
│   │   ├── layout/          # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Footer.tsx
│   │   └── pomodoro/        # Pomodoro components
│   │       ├── PomodoroTimer.tsx
│   │       └── PomodoroSettings.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Dashboard.tsx
│   │   └── Settings.tsx
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useTasks.ts
│   │   ├── useNotifications.ts
│   │   └── usePomodoro.ts
│   ├── store/               # Zustand stores
│   │   ├── authStore.ts
│   │   ├── taskStore.ts
│   │   └── pomodoroStore.ts
│   ├── services/            # API services
│   │   ├── api.ts           # Axios instance
│   │   ├── authService.ts
│   │   ├── taskService.ts
│   │   └── notificationService.ts
│   ├── utils/               # Utility functions
│   │   ├── dateHelpers.ts
│   │   ├── validators.ts
│   │   └── constants.ts
│   ├── types/               # TypeScript types
│   │   ├── task.types.ts
│   │   ├── user.types.ts
│   │   └── api.types.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

#### Key Frontend Patterns

**1. Component Pattern**
- Functional components only
- Props typed with TypeScript interfaces
- Composition over inheritance

**2. State Management**
- Zustand for global state (user, tasks)
- React Query for server state (optional)
- Local state with useState for UI

**3. API Communication**
- Centralized Axios instance with interceptors
- Service layer abstracts API calls
- Error handling with try-catch + toast

**4. Routing**
- Protected routes (require authentication)
- Public routes (login, register)
- 404 fallback

### 2.2 Backend Architecture

#### Folder Structure
```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts      # Prisma client
│   │   └── env.ts           # Environment variables
│   ├── middleware/
│   │   ├── auth.ts          # JWT verification
│   │   ├── errorHandler.ts
│   │   ├── validator.ts
│   │   └── rateLimiter.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── task.routes.ts
│   │   ├── notification.routes.ts
│   │   └── user.routes.ts
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── taskController.ts
│   │   ├── notificationController.ts
│   │   └── userController.ts
│   ├── services/
│   │   ├── authService.ts
│   │   ├── taskService.ts
│   │   └── notificationService.ts
│   ├── utils/
│   │   ├── jwt.ts
│   │   ├── bcrypt.ts
│   │   └── validators.ts
│   ├── types/
│   │   ├── express.d.ts     # Extended Express types
│   │   └── models.ts
│   ├── app.ts               # Express app setup
│   └── server.ts            # Server entry point
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── package.json
├── tsconfig.json
└── .env.example
```

#### Key Backend Patterns

**1. MVC Pattern (Modified)**
- **Routes:** Define endpoints
- **Controllers:** Handle HTTP logic
- **Services:** Business logic
- **Prisma:** Data access layer

**2. Middleware Chain**
```typescript
Request → Rate Limiter → CORS → Auth → Validation → Controller → Response
```

**3. Error Handling**
- Custom error classes
- Global error handler middleware
- Consistent error response format

**4. Database Access**
- Prisma ORM for type-safe queries
- Repository pattern (optional)
- Transaction support for complex operations

---

## 3. Data Flow

### 3.1 Task Creation Flow
```
User Input (TaskForm)
    ↓
Validate Client-side (React Hook Form)
    ↓
POST /api/tasks (Axios)
    ↓
Auth Middleware (Verify JWT)
    ↓
Validation Middleware (express-validator)
    ↓
Task Controller
    ↓
Task Service (Business Logic)
    ↓
Prisma Query (INSERT)
    ↓
PostgreSQL Database
    ↓
Response (201 Created)
    ↓
Update Zustand Store
    ↓
Re-render UI
```

### 3.2 Authentication Flow
```
Login Form Submission
    ↓
POST /api/auth/login
    ↓
Find User by Email (Prisma)
    ↓
Compare Password (bcrypt)
    ↓
Generate JWT Token
    ↓
Return { user, token }
    ↓
Store Token in localStorage
    ↓
Set Auth State (Zustand)
    ↓
Redirect to Dashboard
```

### 3.3 Notification Flow
```
User Sets Reminder
    ↓
Store in Database (notifications table)
    ↓
Frontend: Check Due Notifications (setInterval every 30s)
    ↓
If Due: Trigger Browser Notification API
    ↓
Play Sound (optional)
    ↓
Mark as Sent (PATCH /api/notifications/:id)
```

---

## 4. API Design

### 4.1 REST Principles
- Resource-based URLs
- HTTP verbs (GET, POST, PUT, DELETE)
- Stateless (JWT in header)
- JSON request/response

### 4.2 Response Format
**Success (200-299)**
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation successful"
}
```

**Error (400-599)**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [
      { "field": "title", "message": "Title is required" }
    ]
  }
}
```

### 4.3 Authentication
- **Method:** JWT (JSON Web Token)
- **Header:** `Authorization: Bearer <token>`
- **Token Storage:** localStorage (frontend)
- **Expiry:** 7 days
- **Refresh:** Re-login required (MVP)

---

## 5. Database Design

### 5.1 Prisma Schema Overview

**Core Principles:**
- Normalized (3NF)
- Foreign keys for relationships
- Indexed fields for performance
- Timestamps on all tables

### 5.2 Relationships
```
User (1) ────── (Many) Task
User (1) ────── (Many) Notification
Task (1) ────── (Many) Notification
User (1) ────── (Many) PomodoroSession
Task (1) ────── (Many) PomodoroSession
```

---

## 6. Security Implementation

### 6.1 Authentication & Authorization
| Mechanism | Implementation |
|-----------|----------------|
| Password Storage | bcrypt (salt rounds: 10) |
| JWT Secret | 256-bit random string (env variable) |
| Token Expiry | 7 days |
| Password Reset | Email token (expires in 1 hour) |

### 6.2 Input Validation
| Layer | Tool | Purpose |
|-------|------|---------|
| Frontend | React Hook Form + Zod | Client-side validation |
| Backend | express-validator | Server-side validation |
| Database | Prisma schema | Type constraints |

### 6.3 Security Headers (Helmet.js)
```typescript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));
```

### 6.4 Rate Limiting
```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests, please try again later.',
});

app.use('/api/', limiter);
```

### 6.5 CORS Configuration
```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL, // Vercel URL
  credentials: true,
}));
```

---

## 7. Notification System

### 7.1 Architecture

**Components:**
1. **Database:** Stores scheduled notifications
2. **Backend API:** CRUD for notifications
3. **Frontend Service:** Polls for due notifications
4. **Browser API:** Displays notifications
5. **Service Worker:** Background notifications (PWA)

### 7.2 Implementation Flow

**Step 1: Permission Request**
```typescript
// Frontend: Request permission on app load
if ('Notification' in window) {
  Notification.requestPermission();
}
```

**Step 2: Create Notification**
```typescript
// User sets reminder → POST /api/notifications
{
  "taskId": "123",
  "triggerTime": "2026-02-07T10:00:00Z",
  "type": "reminder",
  "message": "Time to work on Project!"
}
```

**Step 3: Poll for Due Notifications**
```typescript
// Frontend: Every 30 seconds
setInterval(async () => {
  const dueNotifications = await fetchDueNotifications();
  dueNotifications.forEach(showNotification);
}, 30000);
```

**Step 4: Display Notification**
```typescript
function showNotification(notif) {
  new Notification(notif.title, {
    body: notif.message,
    icon: '/icon.png',
    tag: notif.id,
  });
  playSound(); // Optional
  markAsSent(notif.id); // PATCH /api/notifications/:id
}
```

### 7.3 Alarm vs Reminder
| Type | Trigger | Sound | Persistence |
|------|---------|-------|-------------|
| Reminder | X minutes before task | Optional | One-time |
| Alarm | Specific time | Always | Repeats until dismissed |

---

## 8. Pomodoro Timer

### 8.1 State Machine

```
IDLE ──start──> WORK (25 min)
                   ↓ complete
                SHORT_BREAK (5 min)
                   ↓ complete (session < 4)
                WORK (25 min)
                   ↓ complete (session === 4)
                LONG_BREAK (15 min)
                   ↓ complete
                IDLE
```

### 8.2 Implementation

**Zustand Store (pomodoroStore.ts)**
```typescript
interface PomodoroState {
  status: 'idle' | 'work' | 'short_break' | 'long_break';
  timeLeft: number; // seconds
  currentTask: Task | null;
  sessionsCompleted: number;
  settings: {
    workDuration: number; // minutes
    shortBreakDuration: number;
    longBreakDuration: number;
    autoStartBreaks: boolean;
    sound: string;
  };
  start: () => void;
  pause: () => void;
  reset: () => void;
  skipBreak: () => void;
}
```

**Timer Logic (usePomodoro hook)**
```typescript
useEffect(() => {
  if (status !== 'idle' && timeLeft > 0) {
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }
  
  if (timeLeft === 0) {
    handleComplete(); // Transition to next state
  }
}, [status, timeLeft]);
```

### 8.3 Task Linking
- User can select a task from dropdown
- Pomodoro sessions logged to database
- Stats: `GET /api/tasks/:id/pomodoros` → Total time spent

---

## 9. Deployment

### 9.1 Frontend (Vercel)

**Setup:**
1. Connect GitHub repo to Vercel
2. Build command: `npm run build`
3. Output directory: `dist`
4. Environment variables:
   - `VITE_API_URL` → Backend URL

**Build Configuration (vite.config.ts)**
```typescript
export default defineConfig({
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  server: {
    proxy: {
      '/api': process.env.VITE_API_URL || 'http://localhost:5000',
    },
  },
});
```

### 9.2 Backend (Railway/Render)

**Setup:**
1. Connect GitHub repo
2. Detect Node.js
3. Build command: `npm run build`
4. Start command: `npm start`
5. Environment variables:
   - `DATABASE_URL` → PostgreSQL connection string
   - `JWT_SECRET` → Random 256-bit string
   - `PORT` → Auto-assigned
   - `NODE_ENV=production`

**Production Prisma Setup**
```bash
# In build step
npx prisma generate
npx prisma migrate deploy
```

### 9.3 Database (Supabase)

**Setup:**
1. Create project on Supabase
2. Copy PostgreSQL connection string
3. Update `DATABASE_URL` in backend .env
4. Run migrations: `npx prisma migrate deploy`

**Connection String Format:**
```
postgresql://user:password@host:5432/database?schema=public
```

### 9.4 Environment Variables

**Frontend (.env)**
```
VITE_API_URL=https://taskflow-api.railway.app
```

**Backend (.env)**
```
DATABASE_URL=postgresql://...
JWT_SECRET=your_256_bit_secret_here
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://taskflow.vercel.app
```

---

## 10. Performance Optimization

### 10.1 Frontend

| Technique | Implementation |
|-----------|----------------|
| Code Splitting | React.lazy() + Suspense |
| Image Optimization | WebP format, lazy loading |
| Bundle Size | Tree shaking, analyze with `vite-bundle-visualizer` |
| Caching | Service Worker cache API |
| Debouncing | Search inputs (300ms delay) |
| Virtual Scrolling | Large task lists (react-window) |

### 10.2 Backend

| Technique | Implementation |
|-----------|----------------|
| Database Indexing | Index on userId, day, createdAt |
| Query Optimization | Select only needed fields |
| Connection Pooling | Prisma default (10 connections) |
| Compression | gzip middleware |
| Caching | Redis (future enhancement) |

### 10.3 Database Indexes

```prisma
model Task {
  @@index([userId, day]) // Common query: tasks by user and day
  @@index([userId, status]) // Filter by status
  @@index([createdAt]) // Sort by creation date
}
```

---

## 11. Testing Strategy

### 11.1 Frontend Testing

**Tools:**
- Jest (unit tests)
- React Testing Library (component tests)
- Playwright (E2E tests - optional)

**Example Test (TaskCard.test.tsx)**
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import TaskCard from './TaskCard';

test('marks task as complete on checkbox click', () => {
  const mockTask = { id: '1', title: 'Test Task', completed: false };
  const mockOnToggle = jest.fn();
  
  render(<TaskCard task={mockTask} onToggle={mockOnToggle} />);
  
  const checkbox = screen.getByRole('checkbox');
  fireEvent.click(checkbox);
  
  expect(mockOnToggle).toHaveBeenCalledWith('1');
});
```

### 11.2 Backend Testing

**Tools:**
- Jest (unit tests)
- Supertest (API tests)

**Example Test (taskController.test.ts)**
```typescript
import request from 'supertest';
import app from '../app';

describe('POST /api/tasks', () => {
  it('creates a new task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${validToken}`)
      .send({ title: 'New Task', day: 'monday' });
    
    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty('id');
  });
});
```

### 11.3 Test Coverage Goals
- **Unit Tests:** 60%+ coverage
- **Integration Tests:** Critical paths (auth, task CRUD)
- **E2E Tests:** Happy path (login → create task → complete)

---

## 12. Monitoring & Logging

### 12.1 Frontend
- **Console Errors:** Sentry (free tier)
- **User Analytics:** Plausible (privacy-friendly, optional)

### 12.2 Backend
- **Logging:** Winston logger
- **Error Tracking:** Sentry
- **Health Check:** `GET /api/health` endpoint

**Example Health Check**
```typescript
app.get('/api/health', async (req, res) => {
  const dbStatus = await checkDatabaseConnection();
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: dbStatus,
  });
});
```

---

## 13. Development Workflow

### 13.1 Git Workflow

**Branch Strategy:**
- `main` → Production-ready code
- `develop` → Integration branch
- `feature/*` → New features
- `bugfix/*` → Bug fixes

**Commit Convention:**
```
feat: add pomodoro timer
fix: resolve drag-drop bug
docs: update API documentation
style: format code with Prettier
refactor: simplify task service logic
test: add tests for auth controller
```

### 13.2 Development Steps
1. Create feature branch from `develop`
2. Implement feature + write tests
3. Run linter: `npm run lint`
4. Run tests: `npm test`
5. Commit with conventional message
6. Push and create PR to `develop`
7. Merge to `main` for deployment

---

## 14. Code Quality

### 14.1 Linting & Formatting

**ESLint (.eslintrc.json)**
```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "prettier"
  ],
  "rules": {
    "no-console": "warn",
    "@typescript-eslint/explicit-module-boundary-types": "off"
  }
}
```

**Prettier (.prettierrc)**
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

### 14.2 Code Review Checklist
- [ ] Code follows style guide
- [ ] No console.log statements
- [ ] Error handling implemented
- [ ] Types defined (no `any`)
- [ ] Comments for complex logic
- [ ] Tests passing
- [ ] No security vulnerabilities

---

## 15. Migration Plan

### 15.1 Database Migrations (Prisma)

**Create Migration:**
```bash
npx prisma migrate dev --name add_pomodoro_table
```

**Deploy to Production:**
```bash
npx prisma migrate deploy
```

**Rollback (if needed):**
```sql
-- Manual SQL to revert changes
```

### 15.2 Zero-Downtime Deployment
1. Deploy backend first (backward compatible)
2. Run database migrations
3. Deploy frontend
4. Monitor for errors

---

## 16. Future Enhancements

### 16.1 Technical Debt to Address
- Add Redis for caching
- Implement WebSockets for real-time updates
- Migrate to React Query for server state
- Add comprehensive E2E tests
- Set up CI/CD pipeline

### 16.2 Scalability Improvements
- Database read replicas
- CDN for static assets
- Microservices architecture (if needed)

---

## 17. Appendix

### A. Useful Commands

**Frontend**
```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run format       # Run Prettier
npm test             # Run tests
```

**Backend**
```bash
npm run dev          # Start with nodemon
npm run build        # Compile TypeScript
npm start            # Start production server
npm run migrate      # Run Prisma migrations
npm run seed         # Seed database
npm test             # Run tests
```

### B. Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS errors | Check `FRONTEND_URL` in backend .env |
| JWT invalid | Clear localStorage, re-login |
| Database connection failed | Verify `DATABASE_URL` |
| Build fails | Clear `node_modules`, reinstall |
| Notifications not working | Check browser permissions |

### C. Resources
- [React Docs](https://react.dev)
- [Prisma Docs](https://www.prisma.io/docs)
- [Express Guide](https://expressjs.com/en/guide/routing.html)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

---

**Document Version Control**
- v1.0 - Initial specification (Feb 6, 2026)
- Next review: Post-MVP implementation
