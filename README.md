# 🛒 C# React Shopping Cart

A full-stack **Shopping Cart demo application** built with **ASP.NET (C#)** on the backend and **React** on the frontend.  
This project demonstrates clean architecture, state management, unit testing, and a modern frontend toolchain.

> ⚠️ This repository is a **demo project** intended for portfolio and learning purposes.

---

## ✨ Features

- 🧾 Product listing  
- ➕ Add / remove items from cart  
- 🛍️ Cart state management (Context / Provider pattern)  
- 🔄 In-memory order storage (demo-friendly)  
- ✅ Backend unit tests (xUnit)  
- ⚛️ React + Vite frontend  
- 🧪 Frontend testing with React Testing Library  
- 🧹 ESLint (Flat Config)

---

## 🧱 Tech Stack

### Backend
- C# / ASP.NET  
- xUnit for unit testing  
- In-memory data store (no database required)

### Frontend
- React  
- Vite  
- React Router  
- Context API  
- ESLint (eslint.config.js)  
- @testing-library/react

---

## 📁 Project Structure

```
ShoppingCartApp/
├── ShoppingCartApp/              # ASP.NET backend
│   ├── Models/
│   ├── Services/
│   └── Controllers/
│
├── ShoppingCartApp.Tests/        # Backend unit tests
│   └── Services/
│       └── OrderStoreTests.cs
│
└── frontend/                     # React frontend
    ├── src/
    │   ├── cart/
    │   ├── components/
    │   ├── pages/
    │   └── tests/
    ├── .env.example
    ├── eslint.config.js
    └── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites

- .NET SDK 7+  
- Node.js 18+  
- npm or pnpm

---

### 🔧 Backend Setup

```bash
cd ShoppingCartApp
dotnet restore
dotnet build
dotnet run
```

Backend runs on:
```
https://localhost:7296
```

---

### 🎨 Frontend Setup

```bash
cd frontend
npm install
```

#### Environment Variables

Create a `.env` file inside the `frontend` directory:

```env
VITE_API_BASE=https://localhost:7296
VITE_GOOGLE_MAPS_API_KEY=<your key>
```

> ℹ️ Vite only exposes environment variables prefixed with `VITE_`.

Then start the frontend:

```bash
npm run dev
```

Frontend runs on:
```
http://localhost:5173
```

---

## 🧪 Running Tests

### Backend

```bash
cd ShoppingCartApp.Tests
dotnet test
```

### Frontend

```bash
cd frontend
npm run test
```

---

## 🧠 Design Notes

- Uses **in-memory storage** to keep the demo simple and fast to run
- No real emails or credentials are included
- Environment variables are required for API base URL and Google Maps
- ESLint uses the **modern flat config** instead of `.eslintrc`

---

## 🔐 Security & Demo Disclaimer

- No production secrets
- No real user data
- Safe for public GitHub repositories
- `.env` files should **not** be committed — use `.env.example` instead

---

## 📌 Possible Improvements

- Database persistence
- Authentication & authorization
- Checkout flow
- Payment gateway integration
- Docker support
- GitHub Actions CI

---

## 👨‍💻 Author

PancakeBaker
Senior Full-Stack Web Developer

---

## 📄 License

MIT License
