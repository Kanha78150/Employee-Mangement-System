# 🏢 Employee Dashboard

A comprehensive full-stack Employee Management System built with React.js and Node.js, featuring task assignment, progress tracking, and analytics.

## ✨ Features

### 👨‍💼 Admin Features
- **Employee Management**: Create, edit, and delete employee profiles
- **Task Assignment**: Assign tasks with priorities, deadlines, and progress tracking
- **Analytics Dashboard**: Real-time insights into task completion and employee performance
- **Progress Monitoring**: Track task updates with timestamps and submission history
- **Secure Authentication**: JWT-based authentication with role-based access control

### 👩‍💻 Employee Features
- **Task Management**: View assigned tasks and update progress
- **Profile Management**: Update personal information and contact details
- **Progress Tracking**: Real-time task completion with automatic timestamp logging
- **Secure Login**: Individual employee authentication system

## 🛠️ Tech Stack

### Frontend
- **React.js** - Modern UI library
- **React Router DOM** - Client-side routing
- **TanStack Query** - Data fetching and caching
- **Tailwind CSS** - Utility-first CSS framework
- **React Icons** - Icon library
- **React Toastify** - Toast notifications
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing
- **Joi** - Data validation
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Winston** - Logging library

## 📁 Project Structure

```
Employee Dashboard/
├── frontend/                 # React.js frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context providers
│   │   ├── api/            # API configuration
│   │   └── utils/          # Utility functions
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
│
├── backend/                 # Node.js backend
│   ├── controllers/        # Route controllers
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── services/          # Business logic
│   ├── validations/       # Input validation schemas
│   ├── config/            # Configuration files
│   └── utils/             # Utility functions
│
└── README.md              # Project documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Employee Dashboard"
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

4. **Environment Configuration**
   
   Create `.env` files in both frontend and backend directories:

   **Backend `.env`:**
   ```env
   # Database
   MONGO_URI="YOUR MONOGODB DATABASE URI"
   
   # JWT Configuration
   JWT_SECRET=your_super_secure_jwt_secret_change_this_in_production
   JWT_EXPIRES_IN=7d
   
   # Server Configuration
   PORT="ADD YOUR PORT NUMBER"
   NODE_ENV=development
   
   # Default Admin Configuration
   # After first login you can change the password.
   ADMIN_EMAIL=admin@company.com
   ADMIN_PASSWORD=SecureAdmin123!
   ADMIN_NAME=System Administrator
   
   # CORS Configuration
   FRONTEND_URL=http://localhost:5173
   ALLOWED_ORIGINS=http://localhost:5173
   ```

   **Frontend `.env`:**
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_BACKEND_URL=http://localhost:5000
   VITE_NODE_ENV=development
   ```

5. **Start the Application**
   
   **Backend (Terminal 1):**
   ```bash
   cd backend
   npm start
   ```
   
   **Frontend (Terminal 2):**
   ```bash
   cd frontend
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 👤 Default Admin Credentials

- **Email**: admin@company.com
- **Password**: SecureAdmin123!

*Note: Change these credentials immediately after first login for security.*

## 📊 Database Schema

### Employee Model
- Personal Information (name, email, contact, gender, dates)
- Position & Department details
- Location information
- Authentication credentials
- Profile image support

### Task Model
- Task details (title, description, organization)
- Assignment information (employee, dates, times)
- Progress tracking (completion percentage, timestamps)
- Priority levels (Low, Medium, High)
- Submission tracking with automatic timestamping

### Admin Model
- Administrative credentials
- Role-based permissions
- Secure password storage

## 🔐 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - Bcrypt encryption for all passwords
- **Rate Limiting** - Protection against brute force attacks
- **Input Validation** - Joi schema validation for all inputs
- **CORS Protection** - Configured cross-origin resource sharing
- **Helmet Security** - Security headers and protection
- **Role-based Access** - Admin and employee permission levels

## 📈 Analytics & Tracking

- **Real-time Progress Tracking** - Live task completion updates
- **Submission Timestamps** - Automatic logging of task submissions
- **Employee Performance Metrics** - Completion rates and productivity insights
- **Task Analytics** - Priority distribution and completion patterns
- **Update History** - Complete audit trail of all task modifications

## 🎨 UI/UX Features

- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Interactive Dashboard** - Real-time data visualization
- **Toast Notifications** - User-friendly feedback system
- **Loading States** - Skeleton loaders and spinners
- **Error Boundaries** - Graceful error handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact with me.
- Fell free to contact with me.

---

**"Developed By Bholasankar Nanda ❤️**
