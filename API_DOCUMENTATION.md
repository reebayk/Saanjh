# API Documentation
## TaskFlow REST API v1.0

**Base URL:** `https://taskflow-api.railway.app/api`  
**Authentication:** JWT Bearer Token  
**Content-Type:** `application/json`

---

## Table of Contents
1. [Authentication](#1-authentication)
2. [Tasks](#2-tasks)
3. [Notifications](#3-notifications)
4. [Pomodoro Sessions](#4-pomodoro-sessions)
5. [User Profile](#5-user-profile)
6. [Error Codes](#6-error-codes)

---

## Authentication

All authenticated endpoints require:
```
Authorization: Bearer <JWT_TOKEN>
```

### 1.1 Register User

**Endpoint:** `POST /auth/register`  
**Authentication:** None  
**Description:** Create a new user account

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "name": "John Doe"
}
```

**Validation Rules:**
- `email`: Valid email format, unique
- `password`: Min 8 characters, at least 1 uppercase, 1 lowercase, 1 number
- `name`: 2-50 characters

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "clx1a2b3c4d5e6f7g8h9i0",
      "email": "user@example.com",
      "name": "John Doe",
      "createdAt": "2026-02-06T12:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "User registered successfully"
}
```

**Error Responses:**
- `400 Bad Request`: Validation errors
- `409 Conflict`: Email already exists

---

### 1.2 Login User

**Endpoint:** `POST /auth/login`  
**Authentication:** None  
**Description:** Authenticate user and receive JWT token

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "clx1a2b3c4d5e6f7g8h9i0",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}
```

**Error Responses:**
- `400 Bad Request`: Missing fields
- `401 Unauthorized`: Invalid credentials

---

### 1.3 Verify Token

**Endpoint:** `GET /auth/verify`  
**Authentication:** Required  
**Description:** Verify if token is valid and return user data

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "clx1a2b3c4d5e6f7g8h9i0",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid or expired token

---

### 1.4 Request Password Reset

**Endpoint:** `POST /auth/forgot-password`  
**Authentication:** None  
**Description:** Send password reset email (placeholder for MVP)

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password reset email sent (if email exists)"
}
```

*Note: Always returns success to prevent email enumeration*

---

## 2. Tasks

### 2.1 Get All Tasks

**Endpoint:** `GET /tasks`  
**Authentication:** Required  
**Description:** Retrieve all tasks for authenticated user

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `day` | string | No | - | Filter by day (monday-sunday, someday) |
| `status` | string | No | - | Filter by status (pending, in_progress, completed) |
| `priority` | string | No | - | Filter by priority (low, medium, high) |
| `search` | string | No | - | Search in title/description |
| `limit` | number | No | 100 | Max results |
| `offset` | number | No | 0 | Pagination offset |

**Example Request:**
```
GET /tasks?day=monday&status=pending&limit=50
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": "clx1a2b3c4d5e6f7g8h9i0",
        "title": "Complete project proposal",
        "description": "Write 5-page proposal for client",
        "day": "monday",
        "status": "pending",
        "priority": "high",
        "position": 0,
        "completed": false,
        "createdAt": "2026-02-03T10:00:00.000Z",
        "updatedAt": "2026-02-06T12:00:00.000Z",
        "userId": "clx0u9v8w7x6y5z4a3b2c1"
      }
    ],
    "total": 1,
    "limit": 50,
    "offset": 0
  }
}
```

---

### 2.2 Get Single Task

**Endpoint:** `GET /tasks/:id`  
**Authentication:** Required  
**Description:** Retrieve a specific task by ID

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "clx1a2b3c4d5e6f7g8h9i0",
    "title": "Complete project proposal",
    "description": "Write 5-page proposal for client",
    "day": "monday",
    "status": "pending",
    "priority": "high",
    "position": 0,
    "completed": false,
    "createdAt": "2026-02-03T10:00:00.000Z",
    "updatedAt": "2026-02-06T12:00:00.000Z",
    "notifications": [],
    "pomodoroSessions": []
  }
}
```

**Error Responses:**
- `404 Not Found`: Task not found or doesn't belong to user

---

### 2.3 Create Task

**Endpoint:** `POST /tasks`  
**Authentication:** Required  
**Description:** Create a new task

**Request Body:**
```json
{
  "title": "Complete project proposal",
  "description": "Write 5-page proposal for client",
  "day": "monday",
  "priority": "high"
}
```

**Validation Rules:**
- `title`: Required, 1-200 characters
- `description`: Optional, max 2000 characters
- `day`: Optional, enum: monday-sunday, someday (default: someday)
- `priority`: Optional, enum: low, medium, high (default: medium)
- `status`: Optional, enum: pending, in_progress, completed (default: pending)

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "clx1a2b3c4d5e6f7g8h9i0",
    "title": "Complete project proposal",
    "description": "Write 5-page proposal for client",
    "day": "monday",
    "status": "pending",
    "priority": "high",
    "position": 0,
    "completed": false,
    "createdAt": "2026-02-06T12:00:00.000Z",
    "updatedAt": "2026-02-06T12:00:00.000Z",
    "userId": "clx0u9v8w7x6y5z4a3b2c1"
  },
  "message": "Task created successfully"
}
```

**Error Responses:**
- `400 Bad Request`: Validation errors

---

### 2.4 Update Task

**Endpoint:** `PUT /tasks/:id`  
**Authentication:** Required  
**Description:** Update an existing task (full update)

**Request Body:**
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "day": "tuesday",
  "status": "in_progress",
  "priority": "medium",
  "completed": false
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "clx1a2b3c4d5e6f7g8h9i0",
    "title": "Updated title",
    "description": "Updated description",
    "day": "tuesday",
    "status": "in_progress",
    "priority": "medium",
    "position": 0,
    "completed": false,
    "createdAt": "2026-02-03T10:00:00.000Z",
    "updatedAt": "2026-02-06T12:30:00.000Z",
    "userId": "clx0u9v8w7x6y5z4a3b2c1"
  },
  "message": "Task updated successfully"
}
```

---

### 2.5 Partial Update Task

**Endpoint:** `PATCH /tasks/:id`  
**Authentication:** Required  
**Description:** Partially update a task (only send fields to update)

**Request Body (Example: Toggle completed):**
```json
{
  "completed": true,
  "status": "completed"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "clx1a2b3c4d5e6f7g8h9i0",
    "completed": true,
    "status": "completed",
    "updatedAt": "2026-02-06T12:45:00.000Z"
  },
  "message": "Task updated successfully"
}
```

---

### 2.6 Delete Task

**Endpoint:** `DELETE /tasks/:id`  
**Authentication:** Required  
**Description:** Delete a task permanently

**Success Response (200):**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

**Error Responses:**
- `404 Not Found`: Task not found

---

### 2.7 Bulk Update Tasks

**Endpoint:** `PATCH /tasks/bulk`  
**Authentication:** Required  
**Description:** Update multiple tasks at once (e.g., reorder, bulk delete)

**Request Body (Reorder example):**
```json
{
  "tasks": [
    { "id": "task1", "position": 0 },
    { "id": "task2", "position": 1 },
    { "id": "task3", "position": 2 }
  ]
}
```

**Request Body (Bulk delete example):**
```json
{
  "ids": ["task1", "task2", "task3"],
  "action": "delete"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "updated": 3
  },
  "message": "Bulk update successful"
}
```

---

### 2.8 Duplicate Task

**Endpoint:** `POST /tasks/:id/duplicate`  
**Authentication:** Required  
**Description:** Create a copy of an existing task

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "clx_NEW_TASK_ID",
    "title": "Complete project proposal (Copy)",
    "description": "Write 5-page proposal for client",
    "day": "someday",
    "status": "pending",
    "priority": "high",
    "completed": false
  },
  "message": "Task duplicated successfully"
}
```

---

## 3. Notifications

### 3.1 Get All Notifications

**Endpoint:** `GET /notifications`  
**Authentication:** Required  
**Description:** Get all notifications for user

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `sent` | boolean | No | Filter by sent status |
| `taskId` | string | No | Filter by task |

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx_notif_1",
      "taskId": "clx_task_1",
      "type": "reminder",
      "message": "Time to work on: Complete project proposal",
      "triggerTime": "2026-02-07T10:00:00.000Z",
      "sent": false,
      "soundEnabled": true,
      "createdAt": "2026-02-06T12:00:00.000Z"
    }
  ]
}
```

---

### 3.2 Create Notification

**Endpoint:** `POST /notifications`  
**Authentication:** Required  
**Description:** Create a new notification/reminder/alarm

**Request Body:**
```json
{
  "taskId": "clx_task_1",
  "type": "reminder",
  "triggerTime": "2026-02-07T10:00:00.000Z",
  "message": "Custom reminder message",
  "soundEnabled": true
}
```

**Validation Rules:**
- `taskId`: Required, must exist and belong to user
- `type`: Required, enum: reminder, alarm
- `triggerTime`: Required, ISO 8601 datetime
- `message`: Optional, max 200 characters
- `soundEnabled`: Optional, boolean (default: true)

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "clx_notif_1",
    "taskId": "clx_task_1",
    "type": "reminder",
    "message": "Custom reminder message",
    "triggerTime": "2026-02-07T10:00:00.000Z",
    "sent": false,
    "soundEnabled": true,
    "createdAt": "2026-02-06T12:00:00.000Z"
  },
  "message": "Notification created successfully"
}
```

---

### 3.3 Get Due Notifications

**Endpoint:** `GET /notifications/due`  
**Authentication:** Required  
**Description:** Get notifications that should trigger now (triggerTime <= now, sent = false)

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx_notif_1",
      "taskId": "clx_task_1",
      "type": "reminder",
      "message": "Time to work on: Complete project proposal",
      "triggerTime": "2026-02-06T12:00:00.000Z",
      "soundEnabled": true,
      "task": {
        "id": "clx_task_1",
        "title": "Complete project proposal"
      }
    }
  ]
}
```

---

### 3.4 Mark Notification as Sent

**Endpoint:** `PATCH /notifications/:id/sent`  
**Authentication:** Required  
**Description:** Mark notification as sent (after displaying to user)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "clx_notif_1",
    "sent": true,
    "sentAt": "2026-02-06T12:00:05.000Z"
  },
  "message": "Notification marked as sent"
}
```

---

### 3.5 Delete Notification

**Endpoint:** `DELETE /notifications/:id`  
**Authentication:** Required  
**Description:** Delete a notification

**Success Response (200):**
```json
{
  "success": true,
  "message": "Notification deleted successfully"
}
```

---

## 4. Pomodoro Sessions

### 4.1 Get Pomodoro Sessions

**Endpoint:** `GET /pomodoro`  
**Authentication:** Required  
**Description:** Get all pomodoro sessions for user

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `taskId` | string | No | Filter by task |
| `startDate` | string | No | Filter from date (ISO 8601) |
| `endDate` | string | No | Filter to date (ISO 8601) |

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx_pomo_1",
      "taskId": "clx_task_1",
      "duration": 25,
      "completedAt": "2026-02-06T12:30:00.000Z",
      "task": {
        "id": "clx_task_1",
        "title": "Complete project proposal"
      }
    }
  ]
}
```

---

### 4.2 Create Pomodoro Session

**Endpoint:** `POST /pomodoro`  
**Authentication:** Required  
**Description:** Log a completed pomodoro session

**Request Body:**
```json
{
  "taskId": "clx_task_1",
  "duration": 25
}
```

**Validation Rules:**
- `taskId`: Optional (can be null for general focus session)
- `duration`: Required, number in minutes (1-60)

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "clx_pomo_1",
    "taskId": "clx_task_1",
    "duration": 25,
    "completedAt": "2026-02-06T12:30:00.000Z",
    "userId": "clx_user_1"
  },
  "message": "Pomodoro session logged"
}
```

---

### 4.3 Get Pomodoro Statistics

**Endpoint:** `GET /pomodoro/stats`  
**Authentication:** Required  
**Description:** Get aggregated pomodoro statistics

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `period` | string | No | today, week, month (default: today) |

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "period": "today",
    "totalSessions": 8,
    "totalMinutes": 200,
    "totalHours": 3.33,
    "topTasks": [
      {
        "taskId": "clx_task_1",
        "taskTitle": "Complete project proposal",
        "sessions": 4,
        "minutes": 100
      }
    ]
  }
}
```

---

### 4.4 Delete Pomodoro Session

**Endpoint:** `DELETE /pomodoro/:id`  
**Authentication:** Required  
**Description:** Delete a pomodoro session (in case of error)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Pomodoro session deleted"
}
```

---

## 5. User Profile

### 5.1 Get User Profile

**Endpoint:** `GET /users/me`  
**Authentication:** Required  
**Description:** Get current user's profile

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "clx_user_1",
    "email": "user@example.com",
    "name": "John Doe",
    "settings": {
      "pomodoroWorkDuration": 25,
      "pomodoroShortBreak": 5,
      "pomodoroLongBreak": 15,
      "notificationsEnabled": true,
      "soundEnabled": true
    },
    "createdAt": "2026-01-15T10:00:00.000Z"
  }
}
```

---

### 5.2 Update User Profile

**Endpoint:** `PATCH /users/me`  
**Authentication:** Required  
**Description:** Update user profile (name, settings)

**Request Body:**
```json
{
  "name": "Jane Doe",
  "settings": {
    "pomodoroWorkDuration": 30,
    "notificationsEnabled": false
  }
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "clx_user_1",
    "email": "user@example.com",
    "name": "Jane Doe",
    "settings": {
      "pomodoroWorkDuration": 30,
      "notificationsEnabled": false
    }
  },
  "message": "Profile updated successfully"
}
```

---

### 5.3 Update Password

**Endpoint:** `PATCH /users/me/password`  
**Authentication:** Required  
**Description:** Change user password

**Request Body:**
```json
{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewPassword456!"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

**Error Responses:**
- `401 Unauthorized`: Current password incorrect

---

### 5.4 Delete Account

**Endpoint:** `DELETE /users/me`  
**Authentication:** Required  
**Description:** Permanently delete user account and all data

**Request Body:**
```json
{
  "password": "UserPassword123!",
  "confirmation": "DELETE"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```

---

## 6. Error Codes

### Standard HTTP Status Codes

| Code | Name | Description |
|------|------|-------------|
| 200 | OK | Success |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Authenticated but not authorized |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists |
| 422 | Unprocessable Entity | Validation error |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

### Custom Error Codes

| Code | Description |
|------|-------------|
| `AUTH_INVALID_CREDENTIALS` | Email or password incorrect |
| `AUTH_TOKEN_EXPIRED` | JWT token expired, re-login required |
| `AUTH_TOKEN_INVALID` | Invalid JWT token |
| `VALIDATION_ERROR` | Input validation failed |
| `RESOURCE_NOT_FOUND` | Requested resource doesn't exist |
| `EMAIL_ALREADY_EXISTS` | Email already registered |
| `PERMISSION_DENIED` | Cannot access this resource |
| `RATE_LIMIT_EXCEEDED` | Too many requests |

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "title",
        "message": "Title is required"
      },
      {
        "field": "day",
        "message": "Must be one of: monday, tuesday, wednesday, thursday, friday, saturday, sunday, someday"
      }
    ]
  }
}
```

---

## 7. Rate Limiting

**Global Limit:** 100 requests per 15 minutes per IP  
**Auth Endpoints:** 5 requests per 15 minutes per IP  

**Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1707220800
```

**Rate Limit Exceeded Response (429):**
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests, please try again later.",
    "retryAfter": 300
  }
}
```

---

## 8. Pagination

For endpoints returning lists (tasks, notifications, pomodoros):

**Query Parameters:**
- `limit`: Max results (default: 100, max: 500)
- `offset`: Skip N results (default: 0)

**Response Format:**
```json
{
  "success": true,
  "data": {
    "items": [...],
    "total": 250,
    "limit": 100,
    "offset": 0,
    "hasMore": true
  }
}
```

---

## 9. Filtering & Sorting

### Common Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `sortBy` | string | Field to sort by (createdAt, updatedAt, title) |
| `sortOrder` | string | asc or desc (default: desc) |
| `search` | string | Full-text search in title/description |

**Example:**
```
GET /tasks?sortBy=priority&sortOrder=desc&search=proposal
```

---

## 10. CORS Configuration

**Allowed Origins:**
- `https://taskflow.vercel.app` (production)
- `http://localhost:5173` (development)

**Allowed Methods:** GET, POST, PUT, PATCH, DELETE  
**Allowed Headers:** Content-Type, Authorization  

---

## 11. Webhook Events (Future)

*Placeholder for future webhook implementation*

Potential events:
- `task.created`
- `task.updated`
- `task.deleted`
- `task.completed`
- `notification.triggered`

---

## 12. API Versioning

Current version: **v1**  
Base URL includes version: `/api/v1/...`

Future versions will be backwards compatible for 6 months.

---

## 13. Testing the API

### Using cURL

**Login:**
```bash
curl -X POST https://taskflow-api.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

**Create Task:**
```bash
curl -X POST https://taskflow-api.railway.app/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"title":"New Task","day":"monday"}'
```

### Using Postman

1. Import this collection: [Link to Postman collection JSON]
2. Set environment variable `API_URL` = base URL
3. Set environment variable `TOKEN` after login
4. Use `{{API_URL}}` and `{{TOKEN}}` in requests

---

## Appendix A: Example Workflows

### Complete User Flow

1. **Register** → `POST /auth/register`
2. **Login** → `POST /auth/login` (get token)
3. **Create Task** → `POST /tasks`
4. **Set Reminder** → `POST /notifications`
5. **Start Pomodoro** → (client-side timer)
6. **Log Pomodoro** → `POST /pomodoro`
7. **Complete Task** → `PATCH /tasks/:id` (completed: true)

---

## Appendix B: Changelog

**v1.0 (2026-02-06)**
- Initial API release
- Auth endpoints
- Task CRUD
- Notifications
- Pomodoro sessions
- User profile management

---

**API Documentation Maintained By:** [Your Name]  
**Last Updated:** February 6, 2026  
**Questions/Issues:** Open GitHub issue or contact support
