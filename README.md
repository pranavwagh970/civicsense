# LokSetu

Urban civic-complaint management prototype for Pune Municipal Corporation (PMC).

Phase 1 contains the MERN foundation:

- React + Tailwind frontend
- Node.js + Express backend
- MongoDB + Mongoose models
- JWT authentication
- Citizen complaint submission and tracking
- Admin complaint management and dashboard stats
- Marathi-first multilingual UI customized for Pune citizens and PMC officers

## Project structure

```txt
gov/
  backend/
  frontend/
```

## Backend setup

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Update `backend/.env` with your MongoDB connection string.

## Frontend setup

```bash
cd frontend
npm install
npm run dev
```

The frontend expects the backend at `http://localhost:5000`.

You can also use the root helper scripts:

```bash
npm run dev:backend
npm run dev:frontend
npm run build:frontend
```

## Demo flow

1. Register as a citizen.
2. Submit a Pune civic complaint in Marathi, such as a pothole, water supply, streetlight, garbage, drainage, or health issue.
3. Register an admin using the `ADMIN_SETUP_CODE` from backend `.env`.
4. Open `/admin` to use the dedicated officer/admin panel and update complaint statuses.
