# HireLink Backend

REST API for the HireLink job board platform. Connects employers with job seekers through authentication, profiles, job listings, and applications.

---

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| Runtime | Node.js (ES modules) |
| Framework | Express 5 |
| Database | PostgreSQL (`pg`) |
| Auth | JWT (`jsonwebtoken`) + bcrypt |
| Validation | express-validator |
| Email | Nodemailer (Gmail) |

---

## Project Structure

```
backend/
├── app.js
├── package.json
└── app/
    ├── auth/
    │   ├── auth.routes.js
    │   └── auth.controller.js          # Register, login, logout, password reset
    ├── users/
    │   ├── users.routes.js
    │   ├── users.controller.js         # Profile CRUD, admin user management
    │   └── users.model.js
    ├── jobs/
    │   ├── jobs.routes.js
    │   ├── jobs.controller.js          # Job CRUD + search/filter
    │   └── jobs.model.js
    ├── applications/
    │   ├── apply.routes.js             # POST /api/apply/:job_id
    │   ├── applications.routes.js      # List, withdraw, employer views, PATCH status
    │   ├── applications.controller.js
    │   ├── applications.model.js
    │   └── applications.utils.js       # Maps DB rows to API model (user_id, etc.)
    └── core/
        ├── db.js
        ├── middleware.js               # JWT auth + role-based access
        ├── validators.js
        ├── errorHandler.js
        ├── email.js
        ├── init.sql                    # Database schema
        └── migrations/
            └── 001_applied_status.sql  # Upgrade script for existing databases
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Installation

```bash
cd backend
npm install
```

### Database Setup

**New database** — run the full schema:

```bash
psql -d your_database_name -f app/core/init.sql
```

**Existing database** (upgrading from `pending` status) — run the migration:

```bash
psql -d your_database_name -f app/core/migrations/001_applied_status.sql
```

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/hirelink
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:3000
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
```

| Variable | Description |
| :--- | :--- |
| `PORT` | Server port (default: `5000`) |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret for signing JWT tokens (7-day expiry) |
| `CLIENT_URL` | Frontend base URL (used in password reset links) |
| `EMAIL_USER` | Gmail address for sending reset emails |
| `EMAIL_PASS` | Gmail app password |
| `NODE_ENV` | Set to `development` to include error stacks in responses |

### Run the Server

```bash
# Production
npm start

# Development (with nodemon)
npm run dev
```

Health check: `GET /` returns `API running`.

---

## Authentication

Protected routes require a JWT in the `Authorization` header:

```
Authorization: Bearer <token>
```

Tokens are issued on register and login, valid for **7 days**. Roles: `jobseeker`, `employer`, `admin`.

---

## Database Schema

Defined in `app/core/init.sql`.

| Table | Purpose |
| :--- | :--- |
| `users` | Core accounts (`name`, `email`, `password`, `role`) |
| `jobseeker_profiles` | Bio, skills, experience, resume URL, location |
| `employer_profiles` | Company name, description, industry, website, location |
| `jobs` | Listings linked to `employer_id` |
| `applications` | Job applications (`job_id`, `jobseeker_id`, `status`, `cover_letter`) |
| `password_reset_tokens` | One-time reset tokens (15-minute expiry) |

On registration, an empty profile row is created automatically based on role (`jobseeker` or `employer`).

**Applications table** — `jobseeker_id` is stored in the database; API responses expose it as `user_id`.

| Column | Notes |
| :--- | :--- |
| `status` | `applied` (default), `accepted`, `rejected` |
| `UNIQUE(job_id, jobseeker_id)` | Prevents duplicate applications |

---

## API Reference

All routes are prefixed with `/api`. Unless noted, routes require authentication.

### Auth — `/api/auth`

No authentication required.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/register` | Register as `jobseeker`, `employer`, or `admin`. Returns JWT + user. |
| `POST` | `/login` | Authenticate with email/password. Returns JWT + user. |
| `POST` | `/logout` | Client-side logout acknowledgment. |
| `POST` | `/forgot-password` | Send password reset email (always returns success to avoid email enumeration). |
| `POST` | `/reset-password` | Reset password with token + `newPassword`. |

**Register body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "securepass",
  "role": "jobseeker"
}
```

---

### Users — `/api/users`

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/me` | Authenticated | Get current user + role-specific profile. |
| `PUT` | `/me` | Authenticated | Update name, email, and profile fields. |
| `PUT` | `/me/password` | Authenticated | Change password (`currentPassword`, `newPassword`). |
| `DELETE` | `/me` | Authenticated | Delete own account. |
| `GET` | `/` | Admin | List all users. |
| `DELETE` | `/:id` | Admin | Delete a user by ID. |
| `GET` | `/:id` | Authenticated | Get a jobseeker or employer public profile. |

**Jobseeker profile fields:** `bio`, `skills`, `experience`, `resume_url`, `location`

**Employer profile fields:** `company_name`, `company_description`, `industry`, `website`, `location`

---

### Jobs — `/api/jobs`

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/search` | Authenticated | Search jobs by `title` and/or `location`. |
| `GET` | `/` | Authenticated | List all jobs, or filter via query params. |
| `GET` | `/:id` | Authenticated | Get a single job with employer name. |
| `POST` | `/` | Employer | Create a job listing. |
| `PUT` | `/:id` | Employer (owner) | Update a job listing. |
| `DELETE` | `/:id` | Employer (owner) | Delete a job listing. |

#### Search jobs

```http
GET /api/jobs/search?title=engineer&location=toronto
Authorization: Bearer <token>
```

| Param | Required | Description |
| :--- | :--- | :--- |
| `title` | At least one of `title` or `location` | Partial match on job title (case-insensitive) |
| `location` | At least one of `title` or `location` | Partial match on location (case-insensitive) |

Both params can be combined to narrow results. Returns `200` with an empty `jobs` array when nothing matches.

**Example response:**
```json
{
  "message": "Job search completed successfully",
  "count": 2,
  "jobs": [
    {
      "id": 1,
      "title": "Software Engineer",
      "location": "Toronto, ON",
      "employer_name": "Acme Corp",
      ...
    }
  ]
}
```

**Additional filter params** (on `GET /api/jobs`):

| Param | Description |
| :--- | :--- |
| `title` | Partial match on job title |
| `keyword` | Alias for `title` (backward compatible) |
| `location` | Partial match on location |
| `industry` | Partial match on industry |
| `job_type` | Exact match: `full-time`, `part-time`, or `contract` |

---

### Applications

#### Application model (API response)

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | number | Application ID |
| `job_id` | number | Job listing ID |
| `user_id` | number | Jobseeker who applied |
| `status` | string | `applied`, `accepted`, or `rejected` |
| `cover_letter` | string | Optional, set on apply |
| `applied_at` | timestamp | When the application was submitted |

List endpoints may include extra joined fields (e.g. `job_title`, `employer_name`, jobseeker profile fields).

#### Application workflow

```
Jobseeker applies          Employer reviews              Jobseeker sees result
─────────────────          ────────────────              ─────────────────────
POST /api/apply/:job_id    GET /applications/job/:id     GET /api/applications
        │                          │                              │
        ▼                          ▼                              ▼
   status: applied          view all applicants            status: accepted
                            PATCH /:id/status              or rejected
                            { "status": "accepted" }
                            { "status": "rejected" }
```

#### Endpoints

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/apply/:job_id` | Jobseeker | Submit an application for a job. |
| `POST` | `/api/applications/:jobId` | Jobseeker | Same as above (alias). |
| `GET` | `/api/applications` | Jobseeker | List the current user's applications (includes updated status). |
| `GET` | `/api/applications/me` | Jobseeker | Same as above (alias). |
| `DELETE` | `/api/applications/:id` | Jobseeker (owner) | Withdraw an application (only while `applied`). |
| `GET` | `/api/applications/job/:job_id` | Employer (job owner) | View all applicants for a job with jobseeker profiles. |
| `PATCH` | `/api/applications/:id/status` | Employer (job owner) | Accept or reject an application. |

#### Apply for a job

```http
POST /api/apply/5
Authorization: Bearer <token>
Content-Type: application/json

{
  "cover_letter": "I am interested in this role."
}
```

**Response (`201`):**
```json
{
  "message": "Application submitted successfully",
  "application": {
    "id": 1,
    "job_id": 5,
    "user_id": 12,
    "status": "applied",
    "cover_letter": "I am interested in this role.",
    "applied_at": "2026-05-16T10:00:00.000Z"
  }
}
```

Duplicate applications return `409`.

#### List user's applications (jobseeker)

```http
GET /api/applications
Authorization: Bearer <token>
```

**Response (`200`):**
```json
{
  "message": "Applications retrieved successfully",
  "count": 1,
  "applications": [
    {
      "id": 1,
      "job_id": 5,
      "user_id": 12,
      "status": "accepted",
      "cover_letter": "I am interested in this role.",
      "applied_at": "2026-05-16T10:00:00.000Z",
      "job_title": "Software Engineer",
      "location": "Remote",
      "job_type": "full-time",
      "industry": "Technology",
      "salary": "$80,000",
      "employer_name": "Acme Corp"
    }
  ]
}
```

#### View applicants for a job (employer)

```http
GET /api/applications/job/5
Authorization: Bearer <token>
```

**Response (`200`):**
```json
{
  "message": "Applications retrieved successfully",
  "count": 1,
  "applications": [
    {
      "id": 1,
      "job_id": 5,
      "user_id": 12,
      "status": "applied",
      "jobseeker_name": "Jane Doe",
      "jobseeker_email": "jane@example.com",
      "bio": "...",
      "skills": "JavaScript, Node.js",
      "experience": "3 years",
      "resume_url": "https://...",
      "location": "Toronto"
    }
  ]
}
```

#### Accept or reject (employer)

```http
PATCH /api/applications/1/status
Authorization: Bearer <token>
Content-Type: application/json

{ "status": "accepted" }
```

or

```json
{ "status": "rejected" }
```

**Rules:**
- Only `accepted` or `rejected` are allowed
- Application must currently be `applied`
- Employer must own the job listing

**Response (`200`):**
```json
{
  "message": "Application accepted",
  "application": {
    "id": 1,
    "job_id": 5,
    "user_id": 12,
    "status": "accepted"
  }
}
```

The jobseeker sees the updated status on their next `GET /api/applications` call.

---

## Error Handling

The global error handler (`app/core/errorHandler.js`) maps common errors:

| Condition | Status | Message |
| :--- | :--- | :--- |
| Route not found | 404 | Route not found |
| Duplicate record (PostgreSQL `23505`) | 409 | Record already exists |
| Foreign key violation (`23503`) | 400 | Referenced record does not exist |
| Invalid ID format (`22P02`) | 400 | Invalid id format |
| Invalid/expired JWT | 401 | Token error message |
| Validation failure | 400 | Field-level error array |

Validation errors return:
```json
{
  "message": "Validation failed",
  "errors": [{ "field": "status", "message": "Status must be accepted or rejected" }]
}
```

---

## Scripts

| Command | Description |
| :--- | :--- |
| `npm start` | Start server (`node app.js`) |
| `npm run dev` | Start with nodemon for hot reload |

---

## Not Yet Implemented

- Email notifications on application status changes
- In-app notification system
- Pagination on list endpoints
- Resume file upload (only `resume_url` text field supported)
- Dedicated admin dashboard endpoints beyond user management
