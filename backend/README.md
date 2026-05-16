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
├── app.js                          # Entry point, route mounting, error handling
├── package.json
└── app/
    ├── auth/
    │   ├── auth.routes.js
    │   └── auth.controller.js      # Register, login, logout, password reset
    ├── users/
    │   ├── users.routes.js
    │   ├── users.controller.js     # Profile CRUD, admin user management
    │   └── users.model.js
    ├── jobs/
    │   ├── jobs.routes.js
    │   ├── jobs.controller.js      # Job CRUD + search/filter
    │   └── jobs.model.js
    ├── applications/
    │   ├── applications.routes.js
    │   ├── applications.controller.js
    │   └── applications.model.js
    └── core/
        ├── db.js                   # PostgreSQL connection pool
        ├── middleware.js           # JWT auth + role-based access
        ├── validators.js           # Request validation rules
        ├── errorHandler.js         # Global + PostgreSQL error handling
        ├── email.js                # Password reset emails
        └── init.sql                # Database schema
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

Run the schema script against your PostgreSQL database:

```bash
psql -d your_database_name -f app/core/init.sql
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
| `applications` | Job applications with status (`applied`, `accepted`, `rejected`) |
| `password_reset_tokens` | One-time reset tokens (15-minute expiry) |

On registration, an empty profile row is created automatically based on role (`jobseeker` or `employer`).

---

## API Reference

All routes are prefixed with `/api`. Unless noted, routes require authentication (`protect` middleware).

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

**Reset password body:**
```json
{
  "token": "reset_token_from_email",
  "newPassword": "newsecurepass"
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
| `GET` | `/` | Authenticated | List all jobs, or filter via query params. |
| `GET` | `/:id` | Authenticated | Get a single job with employer name. |
| `POST` | `/` | Employer | Create a job listing. |
| `PUT` | `/:id` | Employer (owner) | Update a job listing. |
| `DELETE` | `/:id` | Employer (owner) | Delete a job listing. |

**Search/filter query params** (on `GET /`):

| Param | Description |
| :--- | :--- |
| `keyword` | Partial match on job title |
| `location` | Partial match on location |
| `industry` | Partial match on industry |
| `job_type` | Exact match: `full-time`, `part-time`, or `contract` |

**Job model fields:**

| Field | Required | Notes |
| :--- | :--- | :--- |
| `title` | Yes | |
| `description` | Yes | |
| `location` | Yes | |
| `industry` | Yes | |
| `job_type` | Yes | `full-time`, `part-time`, or `contract` |
| `salary` | No | |
| `deadline` | No | ISO date string |

---

### Applications

**Application model (API response):** `id`, `job_id`, `user_id`, `status` (`applied` | `accepted` | `rejected`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/apply/:job_id` | Jobseeker | Apply for a job. Optional `cover_letter` (max 1000 chars). |
| `POST` | `/api/applications/:jobId` | Jobseeker | Same as above (alias). |
| `GET` | `/api/applications` | Jobseeker | List the current user's applications with job details. |
| `GET` | `/api/applications/me` | Jobseeker | Same as above (alias). |
| `DELETE` | `/api/applications/:id` | Jobseeker (owner) | Withdraw an **applied** application. |
| `GET` | `/api/applications/job/:job_id` | Employer (job owner) | View all applicants for a job (includes jobseeker profile). |
| `PUT` | `/api/applications/:id/status` | Employer (job owner) | Update status to `applied`, `accepted`, or `rejected`. |

**Application statuses:** `applied` (default), `accepted`, `rejected`

Duplicate applications for the same job are rejected (`409`).

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
  "errors": [{ "field": "email", "message": "Please provide a valid email" }]
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
