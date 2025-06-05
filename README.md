# OAuth 2.0 with Google Login

A full-stack application demonstrating OAuth 2.0 authentication with Google login, JWT tokens, and React frontend.

## Prerequisites

- Node.js installed
- MongoDB instance running
- Google OAuth 2.0 credentials (Client ID and Secret)

## Project Structure

```
├── backend/           # Express server
├── frontend/          # React frontend
```

## Setup Instructions

### 1. Backend Setup

1. Navigate to backend directory:
```sh
cd backend
npm install
```

2. Create `.env` file in `backend` directory:
```sh
PORT=backend_port
DB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_TIMEOUT=1h
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

3. Start the backend server:
```sh
npm start
```

### 2. Frontend Setup

1. Navigate to frontend directory:
```sh
cd frontend
npm install
```

2. Create `.env` file in `frontend` directory:
```sh
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_Server_URL=http://localhost:backend_port
```

3. Start the frontend development server:
```sh
npm run dev
```

## Features

- Google OAuth 2.0 authentication
- JWT-based session management 
- Protected routes
- User profile dashboard
- MongoDB integration for user storage

## Tech Stack

- **Frontend**: React, Vite, React Router, axios
- **Backend**: Express.js, MongoDB, JWT
- **Authentication**: Google OAuth 2.0

## API Endpoints

### Auth Routes
- `POST /auth/google`: Google OAuth authentication
- `GET /auth/test`: Test endpoint

## Security Features

- CORS enabled with credentials
- HTTP-only cookies for JWT
- Secure password-less authentication
- Protected API endpoints