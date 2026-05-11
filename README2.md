# HireLink
HireLink is a full-stack job board platform designed to connect employers with job seekers efficiently. Employers can post job openings, while job seekers can browse listings and apply for positions.
This project was developed as part of the CSC 202 - Computer Programming II group project.

## Features

- User Authentication
- Job Listings
- Job Applications
- Employer Dashboard
- Search and Filtering
- Responsive User Interface
- REST API Integration

## Tech Stack

### Frontend
- React.js
- Material UI

### Backend
- Node.js
- Express.js
- TypeScript

### Database
- PostgreSQL

### Version Control
- Git & GitHub
## 👥 Team Members

| Name | Role |
|---|---|
| Fawaz Salimanu | Team Lead |
| Jason | Backend Developer |
| David Alamutu | Backend Developer |
| Hillary Ilona | Frontend Developer |
| Muhammad Nasiru | Frontend Developer |
| Anthony Okpuruka | DevOps / Integration |
| Tomba Bobmanuel | QA / Documentation |
| Timilehin Adeyoyin | QA / Documentation |

## Installation Guide

### Clone the Repository

```bash
git clone https://github.com/Faweezee/HireLink.git
```

### Navigate Into the Project

```bash
cd HireLink
```

### Install Frontend Dependencies

```bash
cd front-end
npm install
```

### Install Backend Dependencies

```bash
cd backend
npm install

##  Running the Project

### Start Backend Server

```bash
cd backend
npm run dev
```

### Start Frontend Server

```bash
cd front-end
npm start
```

##  API Endpoints

### Job Routes

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/jobs` | Fetch all jobs |
| GET | `/api/jobs/:id` | Fetch a single job |
| POST | `/api/jobs` | Create a new job |
| PUT | `/api/jobs/:id` | Update a job |
| DELETE | `/api/jobs/:id` | Delete a job |

---

### Authentication Routes

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/users/register` | Register a new user |
| POST | `/api/users/login` | Login user |

---

### Application Routes

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/applications` | Submit job application |

## Testing

Testing tools used:
- Postman
- Thunder Client

Testing includes:
- API endpoint testing
- Authentication testing
- CRUD operation testing
- End-to-end testing

## Project Status

Project is currently under active development.


