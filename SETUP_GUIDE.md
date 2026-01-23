# Canteen Management System - Setup Guide

## 📋 Project Overview

This is a **MERN Stack** (MongoDB, Express.js, React, Node.js) application for managing a college canteen system.

### Key Features:
- **User Authentication**: Sign up/Sign in with JWT tokens
- **Role-Based Access**: Students, Teachers, and Admins
- **Food Management**: Admins can add/edit food items with images
- **Order System**: Users can place orders, admins confirm them
- **Payment Integration**: Stripe for online payments or offline payment option
- **Image Upload**: Cloudinary integration for food images
- **Dashboard**: Separate dashboards for users and admins

---

## 🛠️ Prerequisites

Before starting, ensure you have installed:
- **Node.js** (version 14.x or higher) - [Download](https://nodejs.org/)
- **MongoDB** (local installation or MongoDB Atlas account) - [Download](https://www.mongodb.com/try/download/community)
- **npm** (comes with Node.js)
- **Git** (optional, if cloning from repository)

---

## 📦 Step-by-Step Setup Instructions

### Step 1: Install Dependencies

Open your terminal in the project root directory and run:

```bash
npm install
```

This will install both backend and frontend dependencies (the `package.json` has a script that installs frontend dependencies automatically).

**OR** install them separately:

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

---

### Step 2: Set Up MongoDB Database

You have two options:

#### Option A: Local MongoDB
1. Install MongoDB locally on your machine
2. Start MongoDB service:
   - **Windows**: MongoDB should start automatically as a service
   - **Mac/Linux**: Run `mongod` or `sudo systemctl start mongod`

#### Option B: MongoDB Atlas (Cloud - Recommended)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Create a database user (remember username and password)
5. Whitelist your IP address (or use `0.0.0.0/0` for development)
6. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority`)

---

### Step 3: Set Up Cloudinary (for Image Uploads)

1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up for a free account
3. Go to your Dashboard
4. Copy your:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

---

### Step 4: Create Environment Variables

Create a `.env` file in the **root directory** (same level as `server.js`):

```env
# MongoDB Connection
MONGO_URI=your_mongodb_connection_string_here

# JWT Secret (use a random long string)
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Server Port (optional, defaults to 5000)
PORT=5000

# Node Environment (optional)
NODE_ENV=development
```

**Example `.env` file:**
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/canteen?retryWrites=true&w=majority
JWT_SECRET=mySuperSecretJWTKey123456789!@#$%^&*
CLOUDINARY_CLOUD_NAME=mycloudname
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456
PORT=5000
NODE_ENV=development
```

**⚠️ Important**: Never commit your `.env` file to Git! It's already in `.gitignore`.

---

### Step 5: (Optional) Configure Stripe

The Stripe publishable key is currently hardcoded in `frontend/src/components/stripe-button/StripeButton.jsx`. 

For production, you should:
1. Get your Stripe keys from [Stripe Dashboard](https://dashboard.stripe.com/)
2. Create a `.env` file in the `frontend` directory:
   ```env
   REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```
3. Update `StripeButton.jsx` to use: `process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY`

---

### Step 6: Run the Application

You have two options to run the app:

#### Option A: Run Both Backend and Frontend Together (Recommended)
```bash
npm start
```
This uses `concurrently` to run both servers simultaneously.

#### Option B: Run Separately (in separate terminals)

**Terminal 1 - Backend:**
```bash
npm run server
```

**Terminal 2 - Frontend:**
```bash
npm run frontend
```

---

### Step 7: Access the Application

- **Frontend**: Open [http://localhost:3000](http://localhost:3000) in your browser
- **Backend API**: Running on [http://localhost:5000](http://localhost:5000)

---

## 🎯 First-Time Setup Checklist

- [ ] Node.js installed (v14+)
- [ ] MongoDB running (local or Atlas)
- [ ] Cloudinary account created
- [ ] `.env` file created with all required variables
- [ ] Dependencies installed (`npm install`)
- [ ] Backend server starts without errors
- [ ] Frontend server starts without errors
- [ ] Can access http://localhost:3000

---

## 👤 Creating Your First Admin User

The application doesn't have a built-in admin creation route. To create an admin user, you have two options:

### Option 1: Using MongoDB Compass or MongoDB Shell
1. Connect to your MongoDB database
2. Find the `users` collection
3. Create a user document or update an existing user:
   ```json
   {
     "name": "Admin User",
     "email": "admin@example.com",
     "password": "hashed_password_here",
     "branch": "COMPUTER",
     "role": "admin",
     "isAdmin": true
   }
   ```
   **Note**: You'll need to hash the password using bcrypt. The easiest way is to sign up normally first, then update the user in the database.

### Option 2: Sign Up First, Then Update in Database
1. Sign up as a regular user through the app
2. Connect to MongoDB
3. Find your user in the `users` collection
4. Update the document:
   - Set `role: "admin"`
   - Set `isAdmin: true`

---

## 🐛 Troubleshooting

### MongoDB Connection Error
- **Error**: `MongoDB connection failed`
- **Solution**: 
  - Check if MongoDB is running
  - Verify `MONGO_URI` in `.env` is correct
  - For Atlas: Check IP whitelist and credentials

### Port Already in Use
- **Error**: `Port 5000 is already in use`
- **Solution**: 
  - Change `PORT` in `.env` to a different port (e.g., 5001)
  - Or stop the process using port 5000

### Module Not Found Errors
- **Error**: `Cannot find module 'xyz'`
- **Solution**: 
  - Delete `node_modules` folders (root and frontend)
  - Delete `package-lock.json` files
  - Run `npm install` again

### Cloudinary Upload Fails
- **Error**: `Cloudinary upload error`
- **Solution**: 
  - Verify all three Cloudinary credentials in `.env`
  - Check Cloudinary dashboard for any account limits

### Frontend Not Connecting to Backend
- **Error**: API calls failing
- **Solution**: 
  - Ensure backend is running on port 5000
  - Check `proxy` setting in `frontend/package.json` (should be `"proxy": "http://localhost:5000"`)

---

## 📚 API Endpoints

### Authentication
- `POST /signup` - Register new user
- `POST /signin` - Login user
- `GET /me` - Get current user (protected)

### Food
- `GET /food` - Get all food items
- `POST /food` - Add food item (admin only)
- `PUT /food/:id` - Update food item (admin only)
- `DELETE /food/:id` - Delete food item (admin only)

### Orders
- `GET /order` - Get user orders
- `POST /order` - Create new order
- `PUT /order/:id` - Update order status (admin only)

---

## 🚀 Production Deployment

For production deployment:

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   cd ..
   ```

2. Set `NODE_ENV=production` in `.env`

3. The server will automatically serve the built React app from `frontend/build`

4. Deploy to platforms like:
   - **Heroku** (backend + frontend)
   - **Vercel/Netlify** (frontend) + **Heroku/Railway** (backend)
   - **AWS**, **DigitalOcean**, etc.

---

## 📝 Notes

- The project uses **Redux** for state management
- **JWT tokens** are stored in `localStorage`
- Food images are uploaded to **Cloudinary**
- Payment processing uses **Stripe** (test mode by default)
- The app supports multiple branches: COMPUTER, IT, EXTC, ETRX, MECHANICAL, CIVIL

---

## 🤝 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Verify all environment variables are set correctly
3. Check console logs for specific error messages
4. Ensure all dependencies are installed correctly

---

**Happy Coding! 🎉**
