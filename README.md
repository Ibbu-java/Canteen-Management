# 🍽️ Canteen Management System

A full-stack MERN (MongoDB, Express.js, React, Node.js) application for managing college canteen operations. This system allows students and teachers to place food orders, while admins can manage the menu, confirm orders, and handle payments.

![MERN Stack](https://img.shields.io/badge/Stack-MERN-green)
![Node.js](https://img.shields.io/badge/Node.js-14.x+-green)
![React](https://img.shields.io/badge/React-17.0.2-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [Database Setup](#-database-setup)
- [API Endpoints](#-api-endpoints)
- [User Roles](#-user-roles)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### For Users (Students & Teachers)
- 🔐 User authentication (Sign up/Sign in)
- 🍕 Browse food items by category (Breakfast, Indian, Chinese, Chat)
- 🛒 Add items to cart and place orders
- 📍 Specify room number for delivery (Teachers)
- 💳 Online payment via Stripe or offline payment option
- 📊 View order history and status

### For Admins
- ➕ Add, edit, and delete food items
- 🖼️ Upload food images using direct image URLs
- ✅ Confirm/Reject orders
- 💰 Track payment status
- 📈 View all orders and manage the canteen

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (MongoDB Atlas)
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

### Frontend
- **React** - UI library
- **Redux** - State management
- **React Router** - Routing
- **Axios** - HTTP client
- **Stripe** - Payment integration
- **React Icons** - Icon library

## 📁 Project Structure

```
SEWDL-main/
├── config/
│   └── db.js                 # MongoDB connection
├── middleware/
│   ├── auth.js              # JWT authentication middleware
│   └── cloudinary.js        # Image URL handler (pass-through)
├── models/
│   ├── auth.models.js       # User model
│   ├── food.models.js       # Food item model
│   └── order.models.js      # Order model
├── routes/
│   ├── auth.routes.js       # Authentication routes
│   ├── food.routes.js       # Food management routes
│   └── order.routes.js      # Order management routes
├── frontend/
│   ├── public/              # Static files
│   └── src/
│       ├── components/      # Reusable components
│       ├── pages/           # Page components
│       ├── redux/           # Redux store & reducers
│       └── utils/           # Utility functions
├── .env                     # Environment variables (not in repo)
├── .gitignore               # Git ignore rules
├── package.json             # Backend dependencies
├── populate-food-data.js    # Database seeding script
├── server.js                # Express server entry point
└── README.md               # This file
```

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14.x or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB Atlas Account** (Free tier works) - [Sign up](https://www.mongodb.com/cloud/atlas)
- **Git** (optional, for cloning)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd SEWDL-main
```

### 2. Install Backend Dependencies

```bash
npm install
```

### 3. Install Frontend Dependencies

```bash
cd frontend
npm install
cd ..
```

**OR** use the setup script:

```bash
npm run setup
```

## ⚙️ Configuration

### 1. Create Environment Variables

Create a `.env` file in the root directory:

```env
# MongoDB Atlas Connection
MONGO_URI=your_mongodb_atlas_connection_string

# JWT Secret (generate a random long string)
JWT_SECRET=your_super_secret_jwt_key_here

# Server Port (optional, defaults to 5000)
PORT=5000

# Node Environment
NODE_ENV=development
```

### 2. MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist your IP address (or use `0.0.0.0/0` for development)
5. Get your connection string and add it to `.env` as `MONGO_URI`

**Example connection string format:**
```
mongodb+srv://username:password@cluster.mongodb.net/canteen?retryWrites=true&w=majority
```

### 3. Generate JWT Secret

You can generate a secure JWT secret using Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output and use it as your `JWT_SECRET` in `.env`.

## 🏃 Running the Application

### Development Mode

To run both backend and frontend together:

```bash
npm start
```

This will start:
- **Backend server** on `http://localhost:5000`
- **Frontend React app** on `http://localhost:3000`

### Run Servers Separately

**Backend only:**
```bash
npm run server
```

**Frontend only:**
```bash
npm run frontend
```

### Populate Database with Sample Data

To add sample food items to the database:

```bash
npm run populate
```

This will add 22 food items across 4 categories (Breakfast, Indian, Chinese, Chat).

## 🗄️ Database Setup

### Create Admin User

After signing up as a regular user, you need to manually set a user as admin:

1. Connect to your MongoDB Atlas cluster
2. Find the `users` collection
3. Update a user document:
   ```json
   {
     "role": "admin",
     "isAdmin": true
   }
   ```

**OR** use MongoDB Compass or any MongoDB client to update the user.

## 📡 API Endpoints

### Authentication
- `POST /signup` - Register new user
- `POST /signin` - Login user
- `GET /me` - Get current user (protected)

### Food Management
- `GET /food/:food` - Get food items by category
- `GET /food-item/:id` - Get single food item
- `POST /add` - Add food item (admin only)
- `PUT /edit/:id` - Update food item (admin only)
- `DELETE /delete/:id` - Delete food item (admin only)

### Order Management
- `GET /myorders` - Get user's orders
- `GET /orders` - Get all orders (admin only)
- `POST /place/order` - Create new order
- `PUT /orders/:id` - Update order confirmation status (admin only)
- `PUT /order/payment-type/:id` - Set payment type
- `PUT /payment-status/:id` - Update payment status

## 👥 User Roles

### Student
- Browse food items
- Add to cart and place orders
- View order history
- Make payments

### Teacher
- All student features
- Specify room number for delivery

### Admin
- All user features
- Manage food items (add/edit/delete)
- Confirm/Reject orders
- View all orders
- Track payments

## 🖼️ Screenshots

*Add your screenshots here or link to a screenshots folder*

## 🔧 Troubleshooting

### MongoDB Connection Error
- Verify `MONGO_URI` in `.env` is correct
- Check if your IP is whitelisted in MongoDB Atlas
- Ensure MongoDB Atlas cluster is running

### Port Already in Use
```bash
# Windows PowerShell
Get-NetTCPConnection -LocalPort 5000 | Select-Object -ExpandProperty OwningProcess | Stop-Process -Force
Get-NetTCPConnection -LocalPort 3000 | Select-Object -ExpandProperty OwningProcess | Stop-Process -Force
```

### Module Not Found Errors
```bash
# Delete node_modules and reinstall
rm -rf node_modules frontend/node_modules
npm install
cd frontend && npm install
```

### Frontend Not Connecting to Backend
- Ensure backend is running on port 5000
- Check `proxy` setting in `frontend/package.json`

## 📝 Notes

- Food images use direct URLs from the internet (no file upload required)
- JWT tokens are stored in `localStorage`
- Payment processing uses Stripe (test mode by default)
- The app supports multiple branches: COMPUTER, IT, EXTC, ETRX, MECHANICAL, CIVIL

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Vinay Pawar**
- GitHub: [@Vinay4912](https://github.com/Vinay4912)

## 🙏 Acknowledgments

- React community for excellent documentation
- MongoDB Atlas for free cloud database
- All contributors and users of this project

---

**Made with ❤️ using MERN Stack**
