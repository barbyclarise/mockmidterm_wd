# PulseDeck

A small full-stack incident tracker. Users register, log in, and then create, search, update, and delete incidents. Each incident has a severity and a status.

- **Backend:** Express 5, TypeScript, PostgreSQL (`pg`), JWT auth (`jsonwebtoken` + `bcrypt`), request validation with Zod
- **Frontend:** React 19, TypeScript, Vite, styled-components

## Project structure

```
pulsedeck/
├── backend/
│   └── src/
│       ├── index.ts           # Express app entry point
│       ├── db.ts              # PostgreSQL connection pool
│       ├── authRoutes.ts      # /api/auth: register, login, delete user
│       ├── incidentRoutes.ts  # /api/incidents: CRUD (JWT protected)
│       ├── authMiddleware.ts  # Verifies the Bearer token
│       ├── schemas.ts         # Zod request schemas
│       ├── validate.ts        # Validation middleware
│       └── type.ts            # Shared types
└── frontend/
    └── src/
        ├── api/               # authService, incidentService (fetch wrappers)
        ├── context/           # Auth and incident React contexts
        ├── components/        # authForm, incidentForm, incidentList
        └── App.tsx
```

## Prerequisites

- Node.js 20+
- PostgreSQL

## Database setup

Create a database and the two tables the API uses:

```sql
CREATE TABLE users (
  id            SERIAL PRIMARY KEY,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL
);

CREATE TABLE incidents (
  id          SERIAL PRIMARY KEY,
  title       TEXT NOT NULL,
  description TEXT NOT NULL,
  severity    TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status      TEXT NOT NULL DEFAULT 'open'
              CHECK (status IN ('open', 'in-progress', 'resolved', 'closed')),
  created_by  INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## Backend

Create `backend/.env`:

```env
PORT=3000
PGUSER=postgres
PGHOST=localhost
PGPASSWORD=your_password
PGPORT=5432
PGDATABASE=pulsedeck
JWT_SECRET=change_me
```

> The frontend calls `http://localhost:3000/api`, so set `PORT=3000`. Without it the API defaults to port 4000.

Install and run:

```bash
cd backend
npm install
npm run dev
```

| Script          | What it does                          |
| --------------- | ------------------------------------- |
| `npm run dev`   | Runs with `tsx watch` (auto-reload)   |
| `npm run build` | Compiles TypeScript to `dist/`        |
| `npm start`     | Runs the compiled `dist/index.js`     |

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Vite serves the app at http://localhost:5173 by default. Other scripts: `npm run build`, `npm run preview`, `npm run lint` (oxlint).

## API reference

Base URL: `http://localhost:3000/api`

### Auth

| Method   | Endpoint          | Auth | Body                  | Description                          |
| -------- | ----------------- | ---- | --------------------- | ------------------------------------ |
| `POST`   | `/auth`           | No   | `{ email, password }` | Register. Returns `201`, or `409` if the email is taken |
| `POST`   | `/auth/login`     | No   | `{ email, password }` | Log in. Returns `{ token, user }`; the token lasts 1 hour |
| `DELETE` | `/auth/:id`       | Yes  | n/a                   | Delete a user                        |

Validation: `email` must be a valid email; `password` must be at least 6 characters.

### Incidents

Every incident route requires an `Authorization: Bearer <token>` header.

| Method   | Endpoint                    | Body                               | Description                                  |
| -------- | --------------------------- | ---------------------------------- | -------------------------------------------- |
| `GET`    | `/incidents?search=<text>`  | n/a                                | List incidents; `search` filters by title (case-insensitive) |
| `POST`   | `/incidents`                | `{ title, description, severity }` | Create an incident                           |
| `PATCH`  | `/incidents/:id`            | `{ status?, severity? }`           | Update status and/or severity (at least one is required) |
| `DELETE` | `/incidents/:id`            | n/a                                | Delete an incident                           |

Validation:

- `title`: at least 3 characters
- `description`: at least 10 characters
- `severity`: `low` | `medium` | `high` | `critical`
- `status`: `open` | `in-progress` | `resolved` | `closed`

### Error responses

| Status | Meaning                               |
| ------ | ------------------------------------- |
| `400`  | Request failed Zod validation         |
| `401`  | Missing token or bad login            |
| `403`  | Invalid or expired token              |
| `404`  | User or incident not found            |
| `409`  | Email already registered              |
| `500`  | Database or server error              |
