# Employee Task Management System - Backend

## Project Overview

The Employee Task Management System is a Node.js and MongoDB based backend application designed to manage employee assignments, task submissions, reviews, approvals, solutions, dashboards, notifications, and reporting.

The system supports two user roles:

* TEAM_LEAD
* EMPLOYEE

The Team Lead can assign tasks, review submissions, approve or request rework, manage employees, and view reports.

Employees can view assigned tasks, submit work, view solutions, receive notifications, and monitor their dashboard.

---

# Technology Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Multer (File Upload)
* bcryptjs
* express-validator

---

# Installation

## Clone Repository

```bash
git clone <repository-url>
cd employee-task-management-system/backend
```

## Install Dependencies

```bash
npm install
```

## Create Environment File

Create a `.env` file in the project root.

```env
PORT=5000

MONGO_URI=mongodb://localhost:27017/employee_task_management

JWT_SECRET=your_jwt_secret_key
```

## Start Application

```bash
npm start
```

Server will run on:

```text
http://localhost:5000
```

---

# Project Structure

```text
src
│
├── config
├── middleware
├── models
│
├── modules
│   ├── auth
│   ├── employee-management
│   ├── work-allocation
│   ├── work-assigned
│   ├── work-submission
│   ├── review-approval
│   ├── rework
│   ├── solutions
│   ├── employee-dashboard
│   ├── teamlead-dashboard
│   ├── team-management
│   ├── search-filter
│   ├── reports
│   └── notifications
│
└── server.js
```

---

# Authentication Flow

## Login

### Request

```http
POST /api/auth/login
```

```json
{
  "email": "teamlead@gmail.com",
  "password": "password"
}
```

### Response

```json
{
  "token": "JWT_TOKEN",
  "user": {
    "_id": "...",
    "role": "TEAM_LEAD"
  }
}
```

---

# Authorization

Protected APIs require:

```http
Authorization: Bearer JWT_TOKEN
```

---

# API Modules

## Authentication

| Method | Endpoint           |
| ------ | ------------------ |
| POST   | /api/auth/register |
| POST   | /api/auth/login    |

---

## Employee Management

| Method | Endpoint           |
| ------ | ------------------ |
| POST   | /api/employees     |
| GET    | /api/employees     |
| GET    | /api/employees/:id |
| PUT    | /api/employees/:id |
| DELETE | /api/employees/:id |

---

## Work Allocation

| Method | Endpoint       |
| ------ | -------------- |
| POST   | /api/tasks     |
| GET    | /api/tasks     |
| GET    | /api/tasks/:id |

---

## Employee Tasks

| Method | Endpoint          |
| ------ | ----------------- |
| GET    | /api/my-tasks     |
| GET    | /api/my-tasks/:id |

---

## Work Submission

| Method | Endpoint                    |
| ------ | --------------------------- |
| POST   | /api/submissions            |
| GET    | /api/submissions            |
| PATCH  | /api/submissions/:id/review |

---

## Rework

| Method | Endpoint    |
| ------ | ----------- |
| GET    | /api/rework |

---

## Solutions

| Method | Endpoint                    |
| ------ | --------------------------- |
| GET    | /api/solutions              |
| GET    | /api/solutions/my-solutions |
| GET    | /api/solutions/:id          |

---

## Employee Dashboard

| Method | Endpoint                |
| ------ | ----------------------- |
| GET    | /api/dashboard/employee |

Response:

```json
{
  "assignedTasks": 7,
  "submittedTasks": 1,
  "reworkTasks": 1,
  "approvedSolutions": 1,
  "completedTasks": 0
}
```

---

## Team Lead Dashboard

| Method | Endpoint                 |
| ------ | ------------------------ |
| GET    | /api/dashboard/team-lead |

Response:

```json
{
  "totalEmployees": 1,
  "totalTasks": 7,
  "pendingReviews": 0,
  "approvedTasks": 0,
  "reworkTasks": 1,
  "solutionsCount": 1
}
```

---

## Team Management

| Method | Endpoint                       |
| ------ | ------------------------------ |
| GET    | /api/teams                     |
| GET    | /api/teams/:teamName/employees |

---

## Search & Filter

| Method | Endpoint                            |
| ------ | ----------------------------------- |
| GET    | /api/search/employees?name=value    |
| GET    | /api/search/tasks?studentName=value |
| GET    | /api/search/solutions               |

---

## Reports

| Method | Endpoint             |
| ------ | -------------------- |
| GET    | /api/reports/summary |

Response:

```json
{
  "totalEmployees": 1,
  "totalTasks": 7,
  "totalSubmissions": 1,
  "totalSolutions": 1,
  "approvedTasks": 0,
  "reworkTasks": 1
}
```

---

## Notifications

### Create Notification

```http
POST /api/notifications
```

```json
{
  "userId": "employee_id",
  "title": "Task Assigned",
  "message": "A new task has been assigned to you"
}
```

### Get Notifications

```http
GET /api/notifications
```

---

# Database Models

* User
* Task
* Submission
* Solution
* Notification

---

# Roles

## TEAM_LEAD

Permissions:

* Manage Employees
* Allocate Tasks
* Review Submissions
* Approve Work
* Request Rework
* View Reports
* Manage Teams
* Create Notifications

## EMPLOYEE

Permissions:

* View Assigned Tasks
* Submit Work
* View Dashboard
* View Solutions
* Receive Notifications

---

# File Uploads

Uploaded files are stored in:

```text
uploads/submissions
```

---

# Developer

Employee Task Management System

Backend Project using Node.js, Express.js, MongoDB, JWT Authentication, and Role-Based Access Control.
