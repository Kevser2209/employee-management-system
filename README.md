# Personnel Leave & Overtime Tracking System

A full-stack web application that lets employees create and track leave and overtime requests, while Manager and HR users review, filter, and approve or reject those requests through a dedicated management panel.

Built as a portfolio project to demonstrate REST API design, JWT authentication, role-based access control, and a React frontend connected to a real PostgreSQL database.

---

## Features

### Authentication

- User registration
- User login and logout
- JWT-based authentication
- Protected frontend routes

### Employee Features

- Dashboard with personal leave and overtime summaries
- Create leave requests
- View personal leave requests
- Create overtime records
- View personal overtime records
- Status tracking (pending, approved, rejected)

### Manager / HR Features

- Role-based management panel
- View employee leave requests
- View employee overtime requests
- Filter requests by status
- Approve requests
- Reject requests

### User Experience

- Responsive interface
- Loading, empty, and error states
- Client-side form validation
- Confirmation dialogs for approve/reject actions

---

## Tech Stack

### Backend

- Python
- FastAPI
- SQLAlchemy
- PostgreSQL
- Alembic
- JWT authentication (python-jose)
- Pydantic
- Passlib (bcrypt) for password hashing

Key versions (from `backend/requirements.txt`):

- FastAPI 0.140.0
- SQLAlchemy 2.0.43
- Alembic 1.14.1
- Pydantic 2.13.4

### Frontend

- React 18
- Vite 5
- Tailwind CSS 3
- React Router 6
- Axios

---

## Architecture

```
Frontend (React + Vite)
        ↓ REST API (JSON)
FastAPI Backend
        ↓ SQLAlchemy
PostgreSQL
```

- **Authentication:** JWT tokens are issued on login and sent via the `Authorization: Bearer` header.
- **Authorization:** Role checks are enforced on the backend through FastAPI dependencies (`require_roles`).
- **Frontend RoleGuard:** Improves user experience by hiding management navigation and blocking the management page for non-manager/non-HR users. It is **not** the security layer — unauthorized API calls still return `403 Forbidden` from the backend.

---

## Project Structure

```
employee-management-system/
├── backend/
│   ├── alembic/              # Database migrations
│   ├── app/
│   │   ├── api/              # API routes and dependencies
│   │   ├── core/             # Config, database, JWT, security
│   │   ├── models/           # SQLAlchemy models
│   │   ├── schemas/          # Pydantic request/response schemas
│   │   └── services/         # Business logic
│   ├── scripts/              # Dev seed and E2E test scripts
│   ├── alembic.ini
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/              # Axios client
│   │   ├── components/       # UI components
│   │   ├── context/          # Auth context
│   │   ├── hooks/            # Custom hooks
│   │   ├── layouts/          # App layouts
│   │   ├── pages/            # Page components
│   │   ├── routes/           # Route definitions
│   │   ├── services/         # API service layer
│   │   └── utils/            # Helpers and labels
│   ├── package.json
│   └── .env.example
├── .gitignore
└── README.md
```

---

## Database

Main tables:

| Table | Description |
| ----- | ----------- |
| `users` | Application users and authentication data |
| `roles` | Role definitions (`employee`, `manager`, `hr`) |
| `user_roles` | Many-to-many link between users and roles |
| `leaves` | Employee leave requests |
| `overtimes` | Employee overtime records |

Schema changes are managed with **Alembic** migrations.

---

## Roles & Permissions

| Feature | Employee | Manager | HR |
| ------- | -------- | ------- | -- |
| Register / Login | Yes | Yes | Yes |
| Create leave (own) | Yes | Yes | Yes |
| View own leaves | Yes | Yes | Yes |
| Create overtime (own) | Yes | Yes | Yes |
| View own overtimes | Yes | Yes | Yes |
| Management panel | No | Yes | Yes |
| View all employee requests | No | Yes | Yes |
| Approve / Reject requests | No | Yes | Yes |

Notes:

- New users receive the `employee` role on registration.
- Manager and HR users can also hold the `employee` role and use employee features for their own records.
- Management and approve/reject endpoints return `403 Forbidden` for users without the `manager` or `hr` role.

---

## Installation

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL 14+

### 1. Clone the repository

```bash
git clone https://github.com/Kevser2209/employee-management-system.git
cd employee-management-system
```

### 2. Backend setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Create the PostgreSQL database (adjust credentials as needed):

```bash
createdb employee_management
# or: psql -c "CREATE DATABASE employee_management;"
```

Run migrations:

```bash
alembic upgrade head
```

Optional — seed development test users:

```bash
python -m scripts.seed_dev_users
```

Start the backend server:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Frontend setup

Open a new terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

---

## Environment Variables

Never commit `.env` files. Use `.env.example` as a template.

### Backend (`backend/.env`)

```env
APP_ENV=development
DEBUG=true
HOST=0.0.0.0
PORT=8000

DATABASE_URL=postgresql+psycopg2://postgres:postgres@localhost:5432/employee_management

SECRET_KEY=your-secret-key-change-in-production
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALGORITHM=HS256

CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

### Frontend (`frontend/.env`)

```env
VITE_API_BASE_URL=http://localhost:8000
```

---

## Database Migration

From the `backend` directory with the virtual environment activated:

```bash
alembic upgrade head
```

Check migration status:

```bash
alembic current
alembic heads
```

---

## Running the Application

Run backend and frontend in separate terminals.

| Service | URL |
| ------- | --- |
| Backend API | http://localhost:8000 |
| Frontend | http://localhost:5173 |
| Swagger API docs | http://localhost:8000/docs |
| Health check | http://localhost:8000/health |
| Database health | http://localhost:8000/health/db |

---

## Testing

This project does not include a full automated unit test suite yet. Available checks:

### Backend E2E API script

With the backend running and PostgreSQL available:

```bash
cd backend
source venv/bin/activate
bash scripts/e2e_api_test.sh
```

Optional: set `DEV_TEST_PASSWORD` if your seeded users use a different password.

### Frontend quality checks

```bash
cd frontend
npm run lint
npm run build
```

---

## Security

Implemented in this project:

- JWT authentication for protected endpoints
- Password hashing with bcrypt (Passlib)
- Backend role-based authorization on management and approve/reject routes
- Environment-based secrets via `.env` (not committed to Git)
- Production guard for weak `SECRET_KEY` when `APP_ENV=production`

This is a development/portfolio project. Additional hardening would be required before a real production deployment.

---

## Screenshots

Application screenshots will be added here.

---

## Future Improvements

Possible next steps (not implemented yet):

- Automated test coverage (unit and integration tests)
- Email notifications for request status changes
- Leave balance management
- Reporting and export features
- Deployment and CI/CD pipeline

---

## Author

**Kevser Ünaldı**

GitHub: [Kevser2209](https://github.com/Kevser2209)

---

## License

This project was built for portfolio and learning purposes.
