# 🩺 DocAppoint – Doctor Appointment Booking System

**DocAppoint** is a full-stack web application that allows patients to book appointments with doctors based on their specialization and availability. 
Built using the **MERN stack**, it simplifies the healthcare appointment process with a modern and user-friendly interface.

---

## 🚀 Features

- 👨‍⚕️ Doctor and Patient user roles with secure login
- 📅 Book and manage appointments in real-time
- 🔍 Search doctors by name or specialization
- ⏰ View available slots and confirm bookings
- 🔐 Password hashing and authentication with JWT
- 🖥️ Admin can view all users and appointments

---

## 🛠️ Tech Stack

| Tech         | Purpose                              |
|--------------|---------------------------------------|
| **MongoDB**  | NoSQL database for storing data       |
| **Express.js**| Backend framework (Node.js)         |
| **React.js** | Frontend UI                          |
| **Node.js**  | Backend runtime                      |
| **JWT**      | Secure authentication                |
| **Tailwind CSS** | Styling framework                 |
| **Axios**    | API calls between frontend and backend

---


## 👥 User Roles

### 🔹 Patients
- Register and log in
- View available doctors
- Book appointments by selecting date & time
- Track booking status

### 🔹 Doctors
- Log in to view upcoming appointments

### 🔹 Admin
- Manage doctors (add/view)
- View all Patients

---

## 🔐 Authentication

- Passwords are securely stored using bcrypt
- JWT-based login session
- Protected routes for users, doctors, and admins

---

## 🔐 Environment Variables

Your `.env` file should be placed in the `backend/` folder and may include:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3000
PORT=your_port
```
---

## 📦 Installation & Setup

```bash
git clone https://github.com/riyalchandrakar/DocAppoint.git
cd docappoint
```
### Backend

```bash
cd backend
npm install

# Set up your .env file with MONGO_URI, JWT_SECRET, FRONTEND_URL

node createAdmin.js
node server.js
```

### Frontend

```bash
cd ../frontend
npm install

# Optional: configure REACT_APP_BACKEND_URL in frontend/.env

npm start
```




