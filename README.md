# thrive365-backend
Backend API for Thrive365 - goals, subtasks, auth (TripleTen Jan'26 CodeJam)
# Thrive365 Backend

Backend API for **Thrive365**, an intentional yearly planning and goal-tracking application designed to help users define meaningful goals, break them into actionable steps, and track progress throughout the year.

Built as part of the **TripleTen January 2026 Code Jam** by a multidisciplinary team of software engineers and designers.

**Production API:**  
https://thrive365-api-kw6sl5hh5q-uw.a.run.app/

---

## About Thrive365

Thrive365 is not a simple to-do list.

It is a structured **year-planning system** that helps users focus on long-term growth by limiting attention to a small set of meaningful goals and tracking consistent progress toward them.

Users can:

- Define up to four major yearly goals  
- Clearly describe what each goal means and why it matters  
- Break goals into small actionable steps  
- Track completion progress visually  
- Pause or complete goals intentionally  

This backend service provides all business logic, data persistence, authentication, and progress calculation for the application.

---

## Responsibilities of This Service

This API handles:

- User authentication and authorization  
- Goal creation, updates, deletion, and slot ordering  
- Step (subtask) management for each goal  
- Goal status transitions (`active`, `paused`, `completed`)  
- Automatic progress calculation based on completed steps  
- Request validation and access control  

---

## Tech Stack

- Node.js  
- Express  
- MongoDB with Mongoose  
- JWT Authentication  
- Zod for request validation  

---

## Core Data Models

### User
- Authenticated account  
- Owns all goals and steps  

### Goal
- Slot (1–4 yearly focus slots)  
- Title  
- Definition and reason  
- Notes and optional images  
- Status: active, paused, completed  
- Progress computed from steps  

### Step
- Text description  
- Completion state (done / not done)  

---

## Authentication Flow

- User signs up or logs in  
- Backend issues a JWT token  
- All protected routes require:

Authorization: Bearer <token>

---

## Main API Routes

### Authentication
- POST /signup  
- POST /signin  

### Goals
- GET /goals  
- POST /goals  
- GET /goals/:goalId  
- PATCH /goals/:goalId  
- DELETE /goals/:goalId  

### Steps
- POST /goals/:goalId/steps  
- PATCH /goals/:goalId/steps/:stepId  
- DELETE /goals/:goalId/steps/:stepId  

---

## Running Locally

Install dependencies:

npm install  

Create a .env file:

PORT=3000  
MONGODB_URI=mongodb://127.0.0.1:27017/thrive365  
JWT_SECRET=your_secret_key  
CORS_ORIGIN=http://localhost:5173  

Start the server:

npm run dev  

Server runs at:

http://localhost:3000  

---

## Deployment

This API is deployed on **Google Cloud Run**:

https://thrive365-api-kw6sl5hh5q-uw.a.run.app/

---

## Team & Contributions

Software Engineers  
- Farida Nelson — Frontend & Backend  
- Serouj Kdenian — Frontend & Backend  
- Blake — Frontend styling & animations  

UI / UX Designers  
- Beth  
- Andrea  

The backend architecture, data models, authentication system, and goal logic were primarily implemented by **Farida Nelson and Serouj Kdenian**.

---

## License

MIT
