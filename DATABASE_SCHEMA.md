# Database Schema Documentation
## TaskFlow PostgreSQL Database Design

**Database:** PostgreSQL 15+  
**ORM:** Prisma 5.8+  
**Schema Version:** 1.0  
**Last Updated:** February 6, 2026

---

## Table of Contents
1. [Entity Relationship Diagram](#1-entity-relationship-diagram)
2. [Tables Overview](#2-tables-overview)
3. [Prisma Schema](#3-prisma-schema)
4. [Table Specifications](#4-table-specifications)
5. [Indexes](#5-indexes)
6. [Constraints](#6-constraints)
7. [Migration Strategy](#7-migration-strategy)

---

## 1. Entity Relationship Diagram

```
┌─────────────────────────┐
│         User            │
│─────────────────────────│
│ id (PK)                 │
│ email (unique)          │
│ password                │
│ name                    │
│ settings (JSON)         │
│ createdAt               │
│ updatedAt               │
└─────────────────────────┘
          │ 1
          │
          │ has many
          │
          ├──────────────────────────┬──────────────────────────┐
          │                          │                          │
          │ N                        │ N                        │ N
┌─────────────────────┐   ┌─────────────────────┐   ┌─────────────────────┐
│       Task          │   │   Notification      │   │  PomodoroSession    │
│─────────────────────│   │─────────────────────│   │─────────────────────│
│ id (PK)             │   │ id (PK)             │   │ id (PK)             │
│ userId (FK)         │   │ userId (FK)         │   │ userId (FK)         │
│ title               │   │ taskId (FK, null)   │   │ taskId (FK, null)   │
│ description         │   │ type                │   │ duration            │
│ day                 │   │ message             │   │ completedAt         │
│ status              │   │ triggerTime         │   │ createdAt           │
│ priority            │   │ sent                │   └─────────────────────┘
│ position            │   │ sentAt              │
│ completed           │   │ soundEnabled        │
│ createdAt           │   │ createdAt           │
│ updatedAt           │   │ updatedAt           │
└─────────────────────┘   └─────────────────────┘
          │ 1
          │
          │ has many
          │
          ├────────────────────┐
          │                    │
          │ N                  │ N
┌─────────────────────┐   ┌─────────────────────┐
│   Notification      │   │  PomodoroSession    │
│   (linked above)    │   │   (linked above)    │
└─────────────────────┘   └─────────────────────┘
```

---

## 2. Tables Overview

| Table | Purpose | Row Estimate (per user) |
|-------|---------|--------------------------|
| User | Store user accounts | 1 |
| Task | Store tasks/todos | 50-500 |
| Notification | Store scheduled notifications | 10-100 |
| PomodoroSession | Log completed pomodoros | 100-1000 |

**Total Tables:** 4  
**Relationships:** 6 foreign keys

---

## 3. Prisma Schema

**File Location:** `/backend/prisma/schema.prisma`

```prisma
// This is your Prisma schema file
// Learn more: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// USER TABLE
// ============================================
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // bcrypt hashed
  name      String
  settings  Json?    @default("{\"pomodoroWorkDuration\": 25, \"pomodoroShortBreak\": 5, \"pomodoroLongBreak\": 15, \"notificationsEnabled\": true, \"soundEnabled\": true}")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  tasks            Task[]
  notifications    Notification[]
  pomodoroSessions PomodoroSession[]

  @@map("users")
}

// ============================================
// TASK TABLE
// ============================================
model Task {
  id          String   @id @default(cuid())
  userId      String
  title       String   @db.VarChar(200)
  description String?  @db.Text
  day         Day      @default(SOMEDAY)
  status      Status   @default(PENDING)
  priority    Priority @default(MEDIUM)
  position    Int      @default(0) // For ordering within a day
  completed   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  user             User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  notifications    Notification[]
  pomodoroSessions PomodoroSession[]

  // Indexes
  @@index([userId, day]) // Common query: get tasks by user and day
  @@index([userId, status]) // Filter by status
  @@index([userId, completed]) // Filter completed tasks
  @@index([createdAt]) // Sort by creation date
  @@map("tasks")
}

// ============================================
// NOTIFICATION TABLE
// ============================================
model Notification {
  id           String           @id @default(cuid())
  userId       String
  taskId       String?          // Nullable: notification can exist without task
  type         NotificationType
  message      String           @db.VarChar(200)
  triggerTime  DateTime         // When to trigger the notification
  sent         Boolean          @default(false)
  sentAt       DateTime?        // Timestamp when notification was sent
  soundEnabled Boolean          @default(true)
  createdAt    DateTime         @default(now())
  updatedAt    DateTime         @updatedAt

  // Relations
  user User  @relation(fields: [userId], references: [id], onDelete: Cascade)
  task Task? @relation(fields: [taskId], references: [id], onDelete: Cascade)

  // Indexes
  @@index([userId, sent]) // Get unsent notifications
  @@index([triggerTime]) // Query by trigger time
  @@index([taskId]) // Get notifications for a task
  @@map("notifications")
}

// ============================================
// POMODORO SESSION TABLE
// ============================================
model PomodoroSession {
  id          String   @id @default(cuid())
  userId      String
  taskId      String?  // Nullable: pomodoro can be general focus session
  duration    Int      // Duration in minutes (typically 25)
  completedAt DateTime @default(now())
  createdAt   DateTime @default(now())

  // Relations
  user User  @relation(fields: [userId], references: [id], onDelete: Cascade)
  task Task? @relation(fields: [taskId], references: [id], onDelete: SetNull)

  // Indexes
  @@index([userId, completedAt]) // Get sessions by user and date
  @@index([taskId]) // Get sessions for a task
  @@map("pomodoro_sessions")
}

// ============================================
// ENUMS
// ============================================

enum Day {
  MONDAY
  TUESDAY
  WEDNESDAY
  THURSDAY
  FRIDAY
  SATURDAY
  SUNDAY
  SOMEDAY // For tasks without specific day (backlog)

  @@map("day")
}

enum Status {
  PENDING
  IN_PROGRESS
  COMPLETED

  @@map("status")
}

enum Priority {
  LOW
  MEDIUM
  HIGH

  @@map("priority")
}

enum NotificationType {
  REMINDER   // General reminder (e.g., 15 min before)
  ALARM      // Time-specific alarm

  @@map("notification_type")
}
```

---

## 4. Table Specifications

### 4.1 User Table

**Purpose:** Store user account information

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | String (CUID) | PK, NOT NULL | Unique user identifier |
| email | String | UNIQUE, NOT NULL | User email (login) |
| password | String | NOT NULL | bcrypt hashed password |
| name | String | NOT NULL | User display name |
| settings | JSON | NULL | User preferences (Pomodoro durations, etc.) |
| createdAt | DateTime | NOT NULL, DEFAULT now() | Account creation timestamp |
| updatedAt | DateTime | NOT NULL, AUTO UPDATE | Last update timestamp |

**Settings JSON Structure:**
```json
{
  "pomodoroWorkDuration": 25,
  "pomodoroShortBreak": 5,
  "pomodoroLongBreak": 15,
  "notificationsEnabled": true,
  "soundEnabled": true,
  "theme": "light"
}
```

**Indexes:**
- PRIMARY KEY (id)
- UNIQUE INDEX (email)

**Sample Row:**
```sql
{
  "id": "clx1a2b3c4d5e6f7g8h9i0",
  "email": "user@example.com",
  "password": "$2b$10$...", -- bcrypt hash
  "name": "John Doe",
  "settings": {"pomodoroWorkDuration": 25, ...},
  "createdAt": "2026-01-15T10:00:00.000Z",
  "updatedAt": "2026-02-06T12:00:00.000Z"
}
```

---

### 4.2 Task Table

**Purpose:** Store user tasks/todos

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | String (CUID) | PK, NOT NULL | Unique task identifier |
| userId | String | FK → User.id, NOT NULL | Owner of task |
| title | VARCHAR(200) | NOT NULL | Task title |
| description | TEXT | NULL | Task description (optional) |
| day | Enum(Day) | NOT NULL, DEFAULT SOMEDAY | Day assignment |
| status | Enum(Status) | NOT NULL, DEFAULT PENDING | Task status |
| priority | Enum(Priority) | NOT NULL, DEFAULT MEDIUM | Task priority |
| position | Integer | NOT NULL, DEFAULT 0 | Order within day (for drag-drop) |
| completed | Boolean | NOT NULL, DEFAULT false | Completion flag |
| createdAt | DateTime | NOT NULL, DEFAULT now() | Creation timestamp |
| updatedAt | DateTime | NOT NULL, AUTO UPDATE | Last update timestamp |

**Day Enum Values:**
- MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY, SOMEDAY

**Status Enum Values:**
- PENDING, IN_PROGRESS, COMPLETED

**Priority Enum Values:**
- LOW, MEDIUM, HIGH

**Indexes:**
- PRIMARY KEY (id)
- INDEX (userId, day) — Most common query
- INDEX (userId, status)
- INDEX (userId, completed)
- INDEX (createdAt)

**Sample Row:**
```sql
{
  "id": "clx_task_123",
  "userId": "clx_user_1",
  "title": "Complete project proposal",
  "description": "Write 5-page proposal for client",
  "day": "MONDAY",
  "status": "PENDING",
  "priority": "HIGH",
  "position": 0,
  "completed": false,
  "createdAt": "2026-02-03T10:00:00.000Z",
  "updatedAt": "2026-02-06T12:00:00.000Z"
}
```

---

### 4.3 Notification Table

**Purpose:** Store scheduled notifications and alarms

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | String (CUID) | PK, NOT NULL | Unique notification identifier |
| userId | String | FK → User.id, NOT NULL | Owner of notification |
| taskId | String | FK → Task.id, NULL | Related task (optional) |
| type | Enum(NotificationType) | NOT NULL | Notification type |
| message | VARCHAR(200) | NOT NULL | Notification message |
| triggerTime | DateTime | NOT NULL | When to trigger |
| sent | Boolean | NOT NULL, DEFAULT false | Whether sent to user |
| sentAt | DateTime | NULL | When it was sent |
| soundEnabled | Boolean | NOT NULL, DEFAULT true | Play sound or not |
| createdAt | DateTime | NOT NULL, DEFAULT now() | Creation timestamp |
| updatedAt | DateTime | NOT NULL, AUTO UPDATE | Last update timestamp |

**NotificationType Enum:**
- REMINDER: General reminder (e.g., "15 minutes before task")
- ALARM: Specific time alarm

**Indexes:**
- PRIMARY KEY (id)
- INDEX (userId, sent) — Get unsent notifications
- INDEX (triggerTime) — Query by time
- INDEX (taskId)

**Sample Row:**
```sql
{
  "id": "clx_notif_1",
  "userId": "clx_user_1",
  "taskId": "clx_task_123",
  "type": "REMINDER",
  "message": "Time to work on: Complete project proposal",
  "triggerTime": "2026-02-07T09:45:00.000Z",
  "sent": false,
  "sentAt": null,
  "soundEnabled": true,
  "createdAt": "2026-02-06T12:00:00.000Z",
  "updatedAt": "2026-02-06T12:00:00.000Z"
}
```

---

### 4.4 PomodoroSession Table

**Purpose:** Log completed Pomodoro sessions

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | String (CUID) | PK, NOT NULL | Unique session identifier |
| userId | String | FK → User.id, NOT NULL | Owner of session |
| taskId | String | FK → Task.id, NULL | Related task (optional) |
| duration | Integer | NOT NULL | Session duration (minutes) |
| completedAt | DateTime | NOT NULL, DEFAULT now() | When session completed |
| createdAt | DateTime | NOT NULL, DEFAULT now() | Record creation timestamp |

**Indexes:**
- PRIMARY KEY (id)
- INDEX (userId, completedAt) — Get sessions by user and date
- INDEX (taskId) — Get sessions for a task

**Sample Row:**
```sql
{
  "id": "clx_pomo_1",
  "userId": "clx_user_1",
  "taskId": "clx_task_123",
  "duration": 25,
  "completedAt": "2026-02-06T12:30:00.000Z",
  "createdAt": "2026-02-06T12:30:00.000Z"
}
```

---

## 5. Indexes

**Purpose:** Optimize query performance

### User Table Indexes
```sql
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
```

### Task Table Indexes
```sql
CREATE INDEX "tasks_userId_day_idx" ON "tasks"("userId", "day");
CREATE INDEX "tasks_userId_status_idx" ON "tasks"("userId", "status");
CREATE INDEX "tasks_userId_completed_idx" ON "tasks"("userId", "completed");
CREATE INDEX "tasks_createdAt_idx" ON "tasks"("createdAt");
```

**Rationale:**
- `userId + day`: Most common query (show tasks for Monday)
- `userId + status`: Filter by status (pending, completed)
- `userId + completed`: Show only incomplete tasks
- `createdAt`: Sort by creation date

### Notification Table Indexes
```sql
CREATE INDEX "notifications_userId_sent_idx" ON "notifications"("userId", "sent");
CREATE INDEX "notifications_triggerTime_idx" ON "notifications"("triggerTime");
CREATE INDEX "notifications_taskId_idx" ON "notifications"("taskId");
```

**Rationale:**
- `userId + sent`: Get unsent notifications for user
- `triggerTime`: Find notifications due now
- `taskId`: Get all notifications for a task

### PomodoroSession Table Indexes
```sql
CREATE INDEX "pomodoro_sessions_userId_completedAt_idx" ON "pomodoro_sessions"("userId", "completedAt");
CREATE INDEX "pomodoro_sessions_taskId_idx" ON "pomodoro_sessions"("taskId");
```

**Rationale:**
- `userId + completedAt`: Get sessions in date range
- `taskId`: Get time spent on task

---

## 6. Constraints

### Foreign Key Constraints

**Task → User**
```sql
CONSTRAINT "tasks_userId_fkey" FOREIGN KEY ("userId") 
  REFERENCES "users"("id") ON DELETE CASCADE
```
- **Cascade:** Deleting user deletes all their tasks

**Notification → User**
```sql
CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") 
  REFERENCES "users"("id") ON DELETE CASCADE
```
- **Cascade:** Deleting user deletes all their notifications

**Notification → Task**
```sql
CONSTRAINT "notifications_taskId_fkey" FOREIGN KEY ("taskId") 
  REFERENCES "tasks"("id") ON DELETE CASCADE
```
- **Cascade:** Deleting task deletes its notifications

**PomodoroSession → User**
```sql
CONSTRAINT "pomodoro_sessions_userId_fkey" FOREIGN KEY ("userId") 
  REFERENCES "users"("id") ON DELETE CASCADE
```
- **Cascade:** Deleting user deletes all their sessions

**PomodoroSession → Task**
```sql
CONSTRAINT "pomodoro_sessions_taskId_fkey" FOREIGN KEY ("taskId") 
  REFERENCES "tasks"("id") ON DELETE SET NULL
```
- **Set Null:** Deleting task keeps session but removes taskId

### Unique Constraints

**User Email**
```sql
CONSTRAINT "users_email_key" UNIQUE ("email")
```
- Ensures no duplicate accounts

---

## 7. Migration Strategy

### 7.1 Initial Migration

**Create Migration:**
```bash
npx prisma migrate dev --name init
```

**Migration File Generated:**
`/prisma/migrations/20260206_init/migration.sql`

**Apply to Production:**
```bash
npx prisma migrate deploy
```

### 7.2 Adding New Columns

**Example: Add `dueDate` to Task**

1. Update schema.prisma:
```prisma
model Task {
  // ... existing fields
  dueDate DateTime? // New field
}
```

2. Create migration:
```bash
npx prisma migrate dev --name add_task_due_date
```

3. Deploy to production:
```bash
npx prisma migrate deploy
```

### 7.3 Seeding Database (Optional)

**File:** `/prisma/seed.ts`

```typescript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create demo user
  const hashedPassword = await bcrypt.hash('demo123', 10);
  
  const user = await prisma.user.create({
    data: {
      email: 'demo@taskflow.app',
      password: hashedPassword,
      name: 'Demo User',
    },
  });

  // Create sample tasks
  await prisma.task.createMany({
    data: [
      {
        userId: user.id,
        title: 'Complete onboarding',
        day: 'MONDAY',
        priority: 'HIGH',
      },
      {
        userId: user.id,
        title: 'Read documentation',
        day: 'MONDAY',
        priority: 'MEDIUM',
      },
    ],
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

**Run Seed:**
```bash
npx prisma db seed
```

---

## 8. Query Examples

### 8.1 Get All Tasks for User (Monday)

**Prisma Query:**
```typescript
const tasks = await prisma.task.findMany({
  where: {
    userId: 'clx_user_1',
    day: 'MONDAY',
  },
  orderBy: {
    position: 'asc',
  },
});
```

**Generated SQL:**
```sql
SELECT * FROM "tasks"
WHERE "userId" = 'clx_user_1' AND "day" = 'MONDAY'
ORDER BY "position" ASC;
```

### 8.2 Get Due Notifications

**Prisma Query:**
```typescript
const dueNotifications = await prisma.notification.findMany({
  where: {
    userId: 'clx_user_1',
    sent: false,
    triggerTime: {
      lte: new Date(), // Less than or equal to now
    },
  },
  include: {
    task: true, // Include task details
  },
});
```

**Generated SQL:**
```sql
SELECT n.*, t.* FROM "notifications" n
LEFT JOIN "tasks" t ON n."taskId" = t."id"
WHERE n."userId" = 'clx_user_1' 
  AND n."sent" = false 
  AND n."triggerTime" <= NOW();
```

### 8.3 Get Pomodoro Stats (Today)

**Prisma Query:**
```typescript
const startOfDay = new Date();
startOfDay.setHours(0, 0, 0, 0);

const sessions = await prisma.pomodoroSession.findMany({
  where: {
    userId: 'clx_user_1',
    completedAt: {
      gte: startOfDay,
    },
  },
  include: {
    task: true,
  },
});

const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0);
```

---

## 9. Backup & Recovery

### 9.1 Backup Strategy

**Automated (Supabase):**
- Daily automated backups
- 7-day retention

**Manual Backup:**
```bash
# Using pg_dump
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Restore
psql $DATABASE_URL < backup_20260206.sql
```

### 9.2 Data Export (User Request)

**Export User Data (JSON):**
```typescript
async function exportUserData(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      tasks: true,
      notifications: true,
      pomodoroSessions: true,
    },
  });

  return JSON.stringify(user, null, 2);
}
```

---

## 10. Performance Considerations

### 10.1 Connection Pooling

**Prisma Default:** 10 connections

**Production Configuration:**
```typescript
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// Set connection pool size
// In DATABASE_URL: ?connection_limit=10
```

### 10.2 Query Optimization

**Bad Query (N+1 Problem):**
```typescript
const tasks = await prisma.task.findMany();
for (const task of tasks) {
  const notifications = await prisma.notification.findMany({
    where: { taskId: task.id },
  });
}
```

**Good Query (Single Query):**
```typescript
const tasks = await prisma.task.findMany({
  include: {
    notifications: true,
  },
});
```

### 10.3 Pagination

**Always paginate large datasets:**
```typescript
const tasks = await prisma.task.findMany({
  where: { userId: 'clx_user_1' },
  take: 50, // Limit
  skip: 0,  // Offset
});
```

---

## 11. Security Considerations

### 11.1 Password Storage

**Never store plain text passwords!**

```typescript
import bcrypt from 'bcrypt';

// Hash password
const hashedPassword = await bcrypt.hash(plainPassword, 10);

// Verify password
const isValid = await bcrypt.compare(plainPassword, hashedPassword);
```

### 11.2 SQL Injection Prevention

**Prisma automatically prevents SQL injection:**
```typescript
// SAFE - Prisma uses parameterized queries
await prisma.task.findMany({
  where: {
    title: userInput, // Automatically escaped
  },
});
```

### 11.3 Row-Level Security

**Ensure users can only access their own data:**
```typescript
// Always filter by userId
const tasks = await prisma.task.findMany({
  where: {
    userId: req.user.id, // From JWT
  },
});
```

---

## 12. Testing Database

### 12.1 Test Database Setup

**Use separate database for testing:**

```bash
# .env.test
DATABASE_URL="postgresql://user:pass@localhost:5432/taskflow_test"
```

**Reset database before each test:**
```typescript
beforeEach(async () => {
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "tasks" CASCADE');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "users" CASCADE');
});
```

### 12.2 Mock Data

**Use Prisma Client in tests:**
```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

test('create task', async () => {
  const task = await prisma.task.create({
    data: {
      userId: 'test_user',
      title: 'Test Task',
    },
  });
  
  expect(task.title).toBe('Test Task');
});
```

---

## 13. Monitoring

### 13.1 Query Logging

**Enable in development:**
```typescript
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
```

**Output:**
```
prisma:query SELECT * FROM "tasks" WHERE "userId" = 'clx_user_1'
```

### 13.2 Slow Query Detection

**Supabase Dashboard:**
- Monitor slow queries (> 1 second)
- Identify missing indexes

---

## Appendix A: Useful Prisma Commands

```bash
# Generate Prisma Client
npx prisma generate

# Create migration
npx prisma migrate dev --name <migration_name>

# Deploy migrations to production
npx prisma migrate deploy

# Reset database (DEV ONLY)
npx prisma migrate reset

# Open Prisma Studio (DB GUI)
npx prisma studio

# Format schema file
npx prisma format

# Validate schema
npx prisma validate

# Seed database
npx prisma db seed
```

---

## Appendix B: Database Size Estimates

**Per User:**
- 500 tasks × 1 KB = 500 KB
- 100 notifications × 0.5 KB = 50 KB
- 1000 pomodoro sessions × 0.3 KB = 300 KB
- **Total per user:** ~850 KB

**10,000 users:**
- 10,000 × 850 KB = 8.5 GB
- With indexes: ~12 GB

**Free tier limits:**
- Supabase: 500 MB (expandable)
- Railway: 512 MB (free tier)

---

## Appendix C: Common SQL Commands

**Count tasks by day:**
```sql
SELECT day, COUNT(*) as count
FROM tasks
WHERE "userId" = 'clx_user_1'
GROUP BY day;
```

**Get top priority tasks:**
```sql
SELECT * FROM tasks
WHERE "userId" = 'clx_user_1' AND completed = false
ORDER BY 
  CASE priority
    WHEN 'HIGH' THEN 1
    WHEN 'MEDIUM' THEN 2
    WHEN 'LOW' THEN 3
  END;
```

---

**Schema Maintained By:** [Your Name]  
**Last Updated:** February 6, 2026  
**Questions:** Refer to Prisma docs or open GitHub issue
