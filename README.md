# விழா மேலாண்மை | Vizha Management

A full-stack Tamil cultural function management web application.

## Tech Stack
- **Frontend**: React.js + Material UI v5 + react-i18next (Tamil/English)
- **Backend**: Node.js + Express.js
- **Database**: MongoDB Atlas (Mongoose)
- **Auth**: JWT + bcrypt

---

## Project Structure
```
vizha-app/
├── client/               # React frontend
│   └── src/
│       ├── components/   # Navbar, Modals, Cards
│       ├── context/      # AuthContext (JWT)
│       ├── i18n/         # en.json + ta.json translations
│       ├── pages/        # HomePage, DashboardPage
│       └── theme/        # MUI festive theme
├── server/               # Express backend
│   ├── controllers/      # authController, recordController
│   ├── middleware/        # JWT auth middleware
│   ├── models/           # User.js, Record.js (Mongoose)
│   └── routes/           # auth.js, records.js
├── .env.example
└── package.json          # root (concurrently)
```

---

## Setup Instructions

### 1. Clone & Install
```bash
git clone <repo-url>
cd vizha-app
npm run install-all
```

### 2. Configure Environment
```bash
cp .env.example server/.env
```
Edit `server/.env` and fill in:
- `MONGO_URI` — your MongoDB Atlas connection string
- `JWT_SECRET` — a long random secret key
- `PORT` — (optional, default 5000)
- `CLIENT_URL` — (default http://localhost:3000)

### 3. MongoDB Atlas Setup
1. Go to https://cloud.mongodb.com
2. Create a free cluster
3. Create a database user
4. Get the connection string and put it in `MONGO_URI`
5. Allow network access (0.0.0.0/0 for dev)

### 4. Run the App
```bash
npm run dev
```
This starts both server (port 5000) and client (port 3000) simultaneously.

---

## API Endpoints

| Method | Endpoint              | Description         | Auth |
|--------|-----------------------|---------------------|------|
| POST   | /api/auth/register    | Register user       | No   |
| POST   | /api/auth/login       | Login, get JWT      | No   |
| GET    | /api/records          | Get user records    | Yes  |
| POST   | /api/records          | Add new record      | Yes  |
| DELETE | /api/records/:id      | Delete record       | Yes  |
| GET    | /api/records/all      | Get all records     | Yes  |

---

## Features
- Bilingual UI (Tamil + English) with language toggle
- 5 Tamil function types with image cards
- JWT authentication (login/register modals)
- Dashboard with 5 default records
- Add/Delete records with MongoDB persistence
- CSV export
- Warm festive MUI theme (gold + red + cream)
- Fully responsive (mobile + desktop)

---

## Function Types (விழா வகைகள்)
| Key | Tamil | English |
|-----|-------|---------|
| kaathu_kuthu | காத்து குத்து | Ear Piercing Ceremony |
| kalyanam | கல்யாணம் | Wedding |
| veetu_punniyahavasanam | வீட்டு புண்ணியாஹவசனம் | House Warming |
| valaikappu | வளைகாப்பு | Baby Shower |
| virundhu | விருந்து | Feast / Dinner |
