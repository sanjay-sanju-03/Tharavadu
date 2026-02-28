# 🏛️ Tharavad - Community Management System

A full-stack **MERN** web application for managing Tharavad (family clan) membership and payments. Specifically crafted with a **bespoke "Royal Heritage" UI design**, secure JWT authentication, real-time data from MongoDB Atlas, and a fully fluid, responsive architecture.

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=flat-square&logo=jsonwebtokens)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)

---

## ✨ Features

- **📊 Dashboard** — Real-time stats: total members, payments (done/pending), total collected, completion rate.
- **👥 Members** — Full CRUD: Add, Edit, Delete members with cascaded payment cleanup.
- **💳 Payments** — Track and toggle payment status per member per year (2023/2024/2025).
- **🔍 Search** — Instant cross-filtering search across members and payments by name, ID, phone, or email.
- **🔐 Authentication** — Secure login with bcrypt-hashed passwords and 7-day JWT tokens.
- **🌐 URL Routing** — Real browser URL navigation (`/dashboard`, `/members`, `/payments`, `/search`).
- **💾 Persistent Sessions** — JWT stored in localStorage; session survives page refresh.
- **🗄️ Cloud Database** — All data stored permanently in MongoDB Atlas (no data loss on restart).
- **🆕 Auto Payments** — Adding a new member auto-creates payment records for 2023, 2024, 2025.

---

## 🎨 UI Highlights: "Royal Heritage Theme"

- **Bespoke Split-Card Login Screen:** A stunning, CSS-animated central floating card featuring a deep "Temple Red" gradient branding side, merging seamlessly into a premium cream login form.
- **Rich Micro-Interactions:** Custom `fadeUp` staggers, pulsed gold ring animations around the logo, and tactile button hover lift mechanics.
- **Glassmorphism:** Elegant use of `backdrop-filter: blur()` to soften the edges between UI elements and the rich background gradients.
- **Fully Responsive:** Custom `@media` breakpoints stack the split-screen seamlessly on mobile without losing the luxury aesthetic.
- **Modern Routing:** Active sidebar highlighting utilizing React Router DOM v6.

---

## 🛠️ Tech Stack — MERN

| Layer | Technology | Purpose |
|-------|------------|---------|
| **M** | MongoDB Atlas | Cloud database (persistent storage) |
| **E** | Express.js 4 | REST API server |
| **R** | React 18 | Frontend SPA |
| **N** | Node.js | Backend runtime |
| — | Mongoose | MongoDB ODM / schema validation |
| — | bcryptjs | Password hashing |
| — | jsonwebtoken | JWT auth tokens (7-day expiry) |
| — | React Router DOM v6 | Client-side URL routing |
| — | Axios | HTTP client with JWT interceptor |
| — | dotenv | Environment variable management |

---

## 📁 Project Structure

```
tharavad/
├── README.md
├── backend/
│   ├── server.js          # Express API + Mongoose models + all routes
│   ├── package.json
│   ├── .env               # Secrets (Database URI, JWT secret)
│   └── .env.example       # Template for env variables
│
└── frontend/
    ├── public/
    │   └── index.html     # Minimized HTML Shell
    └── src/
        ├── App.js         # Router, AuthContext, AppShell, LoginPage
        ├── App.css        # Full design system (CSS variables, responsive media queries, animations)
        ├── api.js         # Axios instance with auth headers
        ├── index.js       # React entry point
        └── pages/
            ├── Dashboard.js   # Stats overview
            ├── Members.js     # Member CRUD
            ├── Payments.js    # Payment tracking
            └── Search.js      # Cross-record search
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- A [MongoDB Atlas](https://cloud.mongodb.com) connection string (Free tier works perfectly)

### 1. Set up Backend
```bash
cd backend
npm install
cp .env.example .env
```

Edit your `.env` file to include your MongoDB string:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/tharavad?retryWrites=true&w=majority
JWT_SECRET=super-secret-key-123
```

Start the backend:
```bash
npm start
# Server will run on http://localhost:5000
```

### 2. Seed the Database (first time only)
```bash
# In an empty terminal / PowerShell
Invoke-RestMethod -Uri "http://localhost:5000/api/seed" -Method Post
```
*This handles DB initialization, creating the admin user, 6 dummy members, and populated payments.*

### 3. Set up Frontend
```bash
cd frontend
npm install
npm start
# Frontend will launch on http://localhost:3000
```

---

## 🔐 Default Credentials

After seeding, access the dashboard at `http://localhost:3000/login` with:
```
Username: admin
Password: admin123
```

> **Note:** Change these in production by updating the Admin document directly in your MongoDB Atlas cluster.

---

## 🤝 Contributing & License
This project is open-source and available under the MIT License. Built with ❤️ for the Mullachery Tharavad Community.
