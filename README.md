# 🏦 SecureBank - Modern Full-Stack Banking System

SecureBank is a production-grade, full-stack banking application built with a **double-entry ledger** at its core. It features a beautiful, responsive React-based Single Page Application (SPA) UI and a highly secure, RESTful backend.

![React + Vite](https://img.shields.io/badge/Frontend-React_|_Vite-indigo)
![Node.js](https://img.shields.io/badge/Backend-Node.js_|_Express-green)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue)
![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS-38bdf8)

## ✨ Features

### 💻 Frontend (Customer Portal)
- **Modern Dashboard:** Real-time animated stats, cashflow bar charts, and recent transactions.
- **Money Transfers:** Instant peer-to-peer transfers with confetti celebrations on success.
- **Card Management:** Issue virtual debit/credit cards and freeze them instantly.
- **Loans:** Apply for personal loans and view auto-generated amortization schedules.
- **History:** Paginated ledger history for all accounts.

### 🛡️ Frontend (Admin Console)
- **System Overview:** Real-time count-up animations for total users, accounts, and deposits.
- **Reconciliation:** Verify that database balances match the double-entry ledger.
- **Audit Logs:** Track all user activity and system events.

### ⚙️ Backend & Security
- **Double-Entry Ledger:** Every transaction generates two immutable ledger entries (debit + credit).
- **Atomicity & Concurrency:** Uses `SELECT ... FOR UPDATE` to prevent race conditions and double-spending.
- **Idempotency:** Transfers require an `Idempotency-Key` to prevent accidental duplicate charges.
- **Security:** Argon2id password hashing, JWT access tokens, and rotating HTTP-only refresh cookies.
- **Rate Limiting:** Protects against brute-force and DDoS attacks.
- **Analytics Engine:** Aggregates real-time cashflow data directly from the ledger.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, Redux Toolkit, Tailwind CSS, Vite, canvas-confetti, lucide-react
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL 18
- **Security:** Argon2, JSON Web Tokens (JWT), Helmet, CORS, Express Rate Limit
- **Validation:** Zod

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v20 or higher)
- **PostgreSQL** (v16 or higher)
- **Git**

### 2. Clone the Repository
```bash
git clone https://github.com/your-username/securebank.git
cd securebank
