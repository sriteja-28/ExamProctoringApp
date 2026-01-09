# ExamProctoringApp

A full-stack Exam Management and Proctoring application with role-based access, user authentication, Google OAuth login, and exam management features.

---

## Prerequisites

- Node.js v22+
- MySQL / MySQL Workbench
- npm

---

## Database Setup

1. Open MySQL Workbench.
2. Create a new database:

CREATE DATABASE exam_db;

3. Update `.env` in the backend folder with your database credentials:

PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=Sriteja
DB_NAME=exam_db
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback


---

## Frontend Setup

1. Navigate to frontend folder:

cd frontend


2. Install dependencies:
npm install


3. Start the development server:
npm run dev


- The frontend will run on `http://localhost:5173`.
---

cd backend


2. Install dependencies:



npm install


3. Start the backend server:

npm start


- The backend will run on `http://localhost:5000`.

---

## Seeding Data

- Seed admin user:
npm run seed:admin


- Seed sample users:
npm run seed:users


- Delete admin (if needed):

npm run delete:admin


---

## Default Users

### Admin

- Email: `admin@example.com`
- Password: `admin`

### Super Admin (Google Login)

- Email: `sritejamuthnagi336@gmail.com`

### Users

- Email: `sai@gmail.com` | Password: `sai`
- Email: `ram@gmail.com` | Password: `ram@123`

---

## Running Tests
### Backend
- Run all tests:
npm test

- Run a specific test file:
npx jest tests/authController.test.js

### Frontend

- Run Jest tests:
npm test


- Run Cypress e2e tests:
npx cypress open


---

## API Endpoints

### Auth

- `POST /api/auth/register` → register new user
- `POST /api/auth/login` → login user
- `GET /api/auth/google` → Google OAuth login
- `GET /api/auth/google/callback` → OAuth callback

### Admin

- `GET /api/admin/users` → list users
- `PATCH /api/admin/users/:id/status` → update user active status
- `PATCH /api/admin/users/:id/role` → update user role (cannot self-update for admin)

### Super Admin

- `/categories` → create, update, delete, list categories
- `/questions` → create, update, delete, bulk upload questions
- `/exams` → create, update, delete exams
- `/exam-attempts` → get all or per-user exam attempts
- `/test-submissions` → view all test submissions

### User

- `/submissions` → view user exam submissions

---

## Notes

- Make sure backend and frontend servers are running simultaneously for full functionality.
- Use Google login only for the super admin account.(can use for users also)
- JWT tokens are valid for 3 hours.

---

## License

MIT License
