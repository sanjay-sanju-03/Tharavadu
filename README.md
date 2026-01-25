# 🏛️ Tharavad - Community Management System

A modern, full-stack web application for managing Tharavad (family clan) membership and payments with a premium UI/UX design.

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)

## ✨ Features

- **📊 Dashboard** - Real-time statistics with animated progress tracking
- **👥 Members** - Complete member management (Add, Edit, Search)
- **💳 Payments** - Track and update payment status for multiple years
- **🔍 Search** - Instant search across all records
- **🔐 Authentication** - Secure admin login system

## 🎨 UI Highlights

- Premium gradient themes
- Glassmorphism effects
- Smooth animations & micro-interactions
- Fully responsive design
- Modern card-based layout

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, Axios, CSS3 |
| **Backend** | Node.js, Express.js |
| **Styling** | Custom CSS with CSS Variables |

## 🚀 Quick Start

### Prerequisites
- Node.js v14 or higher
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/tharavad.git
cd tharavad
```

2. **Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
npm start
```
Server runs on `http://localhost:5000`

3. **Setup Frontend** (new terminal)
```bash
cd frontend
npm install
npm start
```
App opens on `http://localhost:3000`

## 🔐 Demo Credentials

```
Username: admin
Password: admin123
```

## 📁 Project Structure

```
tharavad/
├── README.md
├── .gitignore
│
├── backend/
│   ├── server.js          # Express API server
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── App.js         # Main component
    │   ├── App.css        # All styles
    │   ├── index.js       # Entry point
    │   └── pages/
    │       ├── Dashboard.js
    │       ├── Members.js
    │       ├── Payments.js
    │       └── Search.js
    ├── package.json
    └── .gitignore
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/login` | Admin authentication |
| `GET` | `/api/dashboard` | Dashboard statistics |
| `GET` | `/api/members` | List all members |
| `POST` | `/api/members` | Add new member |
| `PUT` | `/api/members/:id` | Update member |
| `GET` | `/api/payments` | List all payments |
| `PUT` | `/api/payments/:id` | Update payment status |
| `GET` | `/api/health` | Server health check |

## 📸 Screenshots

### Login Page
Premium glassmorphism design with animated background

### Dashboard
Real-time statistics with progress tracking

### Members Management
Full CRUD operations with search & filter

### Payment Tracking
Year-wise payment status management

## 🔮 Future Enhancements

- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] JWT authentication
- [ ] Payment receipt generation (PDF)
- [ ] Email notifications
- [ ] Data export (Excel/CSV)
- [ ] Dashboard charts

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ for Tharavad Community**
