# vShield — Background Verification & Compliance Audit Platform

A full-stack web application for managing background verification checks for candidates, including Aadhaar and PAN card validation.

## Tech Stack

### Backend
- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **JWT** Authentication
- **bcryptjs** for password hashing
- `mongodb-memory-server` as fallback DB (no local Mongo required)

### Frontend
- **React** (Vite)
- **React Router DOM**
- **Axios**
- **Lucide React** icons

---

## Project Structure

```
verification_platform/
├── backend/
│   ├── config/          # DB connection
│   ├── controllers/     # Route handlers
│   ├── middleware/      # JWT auth guard
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routers
│   ├── services/        # Mock verification logic
│   ├── .env.example
│   └── server.js
└── frontend/
    ├── src/
    │   ├── context/     # Auth & Toast context
    │   ├── pages/       # Login, Signup, Dashboard, Report, SubmitCandidate
    │   └── services/    # API client & service helpers
    └── index.html
```

---

## Getting Started

### Backend
```bash
cd backend
npm install
cp .env.example .env   # Fill in your MONGO_URI and JWT_SECRET
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` and the backend on `http://localhost:5001`.

---

## Features
- 🔐 JWT-based authentication (Signup / Login)
- 👤 Candidate registration with Aadhaar & PAN
- ✅ Automated mock Aadhaar + PAN verification
- 📊 Dashboard with stats and candidate table
- 📄 Printable verification audit report
- 🌙 Dark-mode glassmorphism UI
