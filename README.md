# 🌟 GovertX Task Web App

A full-stack web application that allows users (creators) to manage their profile, earn credits, and interact with a content feed. Admins can manage user data and update credits.

---

## 📌 Features

### ✅ User Side
- Register/Login (JWT-based)
- View and update profile
- Personalized feed (Twitter, Reddit, LinkedIn)
- Save, share, and report posts
- Earn credits for activity
- Dashboard with stats

### 🔐 Admin Side
- View all users
- Update user credit balances
- View all feed activity

---

## 🧱 Tech Stack

- **Frontend:** React.js, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Hosting:** Firebase (Frontend), Google Cloud Run (Backend)

---

## ⚙️ Setup Instructions

### 🔧 Clone the Repository

```bash
git clone https://github.com/your-username/govertx-task.git
cd govertx-task
```
## Backend Setup
Navigate to the backend folder:

```bash

cd creator-web-app
```
Install dependencies:

```bash

npm install
```
Create a .env file and add the following:

```bash

MONGO_URI=your_mongo_db_uri
JWT_SECRET=your_jwt_secret
TWITTER_BEARER_TOKEN
```
Start the backend server:

```bash

npm start
```
API runs at: http://localhost:5000

# Frontend Setup
Navigate to the frontend folder:

```bash

cd ../frontend
```
Install dependencies:

```bash

npm install
```
Create a .env file and add the following:

```env

VITE_BACKEND_URL=http://localhost:5000
```
Start the development server:

```bash

npm start
```
App runs at: http://localhost:3000
