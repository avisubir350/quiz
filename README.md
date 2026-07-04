# QuizApp — Three-Tier Quiz Application

A full-stack quiz application with React frontend, Node.js/Express backend, and PostgreSQL database.

## Architecture

```
quiz/
├── backend/          # Node.js + Express REST API
│   ├── config/       # Database config
│   ├── controllers/  # Route handlers
│   ├── middleware/   # Auth middleware
│   ├── migrations/   # Sequelize DB migrations
│   ├── models/       # Sequelize ORM models
│   ├── routes/       # Express routes
│   ├── seeders/      # Demo data
│   └── server.js     # Entry point
└── frontend/         # React SPA
    └── src/
        ├── context/  # Auth context
        ├── pages/    # Page components
        │   └── admin/
        └── components/
```

## Prerequisites

- Node.js 18+
- PostgreSQL 14+

## Setup

### 1. Database

Create a PostgreSQL database:
```sql
CREATE DATABASE quizapp;
```

### 2. Backend

```bash
cd backend
npm install
```

Copy and configure environment:
```bash
copy .env.example .env
```

Edit `.env` with your database credentials:
```
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=quizapp
JWT_SECRET=some_long_random_string
```

Run migrations and seed demo data:
```bash
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

Start the server:
```bash
npm run dev
```
Backend runs on http://localhost:5000

### 3. Frontend

```bash
cd frontend
npm install
npm start
```
Frontend runs on http://localhost:3000

## Demo Credentials

| Role  | Email            | Password |
|-------|------------------|----------|
| Admin | admin@quiz.com   | admin123 |
| User  | john@quiz.com    | user123  |

## Features

### Users
- Register / Login with JWT auth
- Browse and search published quizzes
- Take timed quizzes with instant scoring
- View quiz history and detailed results with answer review

### Admins
- Dashboard with stats (users, quizzes, attempts)
- Create, edit, publish/unpublish, delete quizzes
- Add/edit/delete questions (single choice, multiple choice, true/false)
- Manage answer options and mark correct answers
- View all users

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register |
| POST | /api/auth/login | Login |
| GET | /api/quizzes | List published quizzes |
| GET | /api/quizzes/:id | Quiz detail |
| GET | /api/quizzes/history | User's attempt history |
| POST | /api/attempts/quiz/:id/start | Start attempt |
| POST | /api/attempts/:id/submit | Submit answers |
| GET | /api/attempts/:id | Attempt details/result |
| GET | /api/admin/stats | Dashboard stats (admin) |
| GET | /api/admin/quizzes | All quizzes (admin) |
| POST | /api/admin/quizzes | Create quiz (admin) |
| PUT | /api/admin/quizzes/:id | Update quiz (admin) |
| DELETE | /api/admin/quizzes/:id | Delete quiz (admin) |
| PATCH | /api/admin/quizzes/:id/publish | Toggle publish (admin) |
| POST | /api/admin/quizzes/:id/questions | Add question (admin) |
| PUT | /api/admin/questions/:id | Update question (admin) |
| DELETE | /api/admin/questions/:id | Delete question (admin) |
| GET | /api/admin/users | All users (admin) |
