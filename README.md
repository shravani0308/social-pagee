
🚀 MERN Stack Social Media Application

A full-stack Social Media / Post Sharing web application built using the MERN stack (MongoDB, Express.js, React.js, Node.js).
The application supports user authentication, post creation, feed display, and user profiles.

✨ Features

User Authentication (Signup & Login)

-JWT-based Authorization
-Create & View Posts
-User Profile Page
-Secure API with Middleware
-Responsive Frontend UI
-RESTful API Architecture

🛠 Tech Stack
Frontend
.React.js
.Axios
.CSS
.JavaScript

Backend
.Node.js
.Express.js
.MongoDB
.Mongoose
-JWT (JSON Web Token)
-dotenv

📂 Project Structure
project-root/
│
├── backend/
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   └── Post.js
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── manifest.json
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js
│   │   ├── components/
│   │   │   ├── Login.js
│   │   │   ├── Signup.js
│   │   │   ├── Feed.js
│   │   │   ├── CreatePost.js
│   │   │   ├── PostCard.js
│   │   │   └── UserProfile.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
│
└── README.md

⚙️ Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name

2️⃣ Backend Setup
cd backend
npm install

Create .env file
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
Run Backend Server- npm start

3️⃣ Frontend Setup
cd frontend
npm install
npm start
