# Employee Dashboard

A full-stack MERN application for employee management with task assignment, analytics, and role-based access control.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access (Admin/Employee)
- **Employee Management**: CRUD operations for employee profiles with image uploads
- **Task Management**: Task assignment, tracking, and completion monitoring
- **Analytics Dashboard**: Visual insights into employee performance and task statistics
- **File Upload**: Secure image upload with validation and size limits
- **Responsive Design**: Modern UI with TailwindCSS

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Multer** for file uploads
- **Joi** for validation
- **bcrypt** for password hashing

### Frontend
- **React 19** with Vite
- **TailwindCSS** for styling
- **React Router** for navigation
- **React Query** for state management
- **Axios** for API calls
- **React Icons** for UI icons

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd employee-dashboard
```

### 2. Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file in the Backend directory:
```bash
cp .env.example .env
```

Update the `.env` file with your configuration:
```env
# Database Configuration
MONGO_URI=mongodb://localhost:27017/employee_management

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_change_this_in_production
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
HOST=0.0.0.0
NODE_ENV=development

# Admin Configuration
ADMIN_EMAIL=admin@company.com
ADMIN_PASSWORD=your_secure_admin_password
ADMIN_NAME=System Administrator

# CORS Configuration
FRONTEND_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# File Upload Configuration
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,image/webp

# Security Configuration
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in the frontend directory:
```bash
cp .env.example .env
```

Update the frontend `.env` file:
```env
# API Configuration
VITE_API_URL=http://localhost:5000/api
VITE_BACKEND_URL=http://localhost:5000

# Environment
VITE_NODE_ENV=development

# App Configuration
VITE_APP_NAME=Employee Dashboard
VITE_APP_VERSION=1.0.0
```

### 4. Start the Application

#### Start Backend Server
```bash
cd Backend
npm start
```

#### Start Frontend Development Server
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 🔐 Security Features

- **Environment Variables**: All sensitive data stored in environment variables
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with configurable rounds
- **CORS Protection**: Environment-based origin validation
- **File Upload Security**: Type and size validation
- **Input Validation**: Joi schema validation
- **Rate Limiting**: Configurable request rate limiting

## 📁 Project Structure

```
employee-dashboard/
├── Backend/
│   ├── config/          # Database and security configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   ├── validations/     # Input validation schemas
│   └── uploads/         # File upload directory
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context
│   │   ├── hooks/       # Custom hooks
│   │   ├── api/         # API configuration
│   │   └── utils/       # Utility functions
│   └── public/          # Static assets
└── README.md
```

## 🔑 Default Admin Credentials

After first startup, a default admin account will be created:
- **Email**: As specified in ADMIN_EMAIL environment variable
- **Password**: As specified in ADMIN_PASSWORD environment variable

⚠️ **Important**: Change the default admin password after first login!

## 🚀 Deployment

### Environment Variables for Production

Ensure all environment variables are properly set for production:

1. Use a strong, unique JWT_SECRET (minimum 32 characters)
2. Set NODE_ENV=production
3. Configure proper CORS origins
4. Use a secure admin password
5. Set up proper MongoDB connection string

### Security Checklist

- [ ] Change default admin credentials
- [ ] Set strong JWT_SECRET
- [ ] Configure proper CORS origins
- [ ] Set up HTTPS in production
- [ ] Configure rate limiting
- [ ] Set up proper logging
- [ ] Regular security updates

## 📝 API Documentation

The API follows RESTful conventions. Main endpoints:

- `POST /api/auth/login` - User authentication
- `GET /api/employees` - Get employees list
- `POST /api/employees` - Create new employee
- `GET /api/tasks` - Get tasks list
- `POST /api/tasks` - Create new task
- `GET /api/analytics` - Get analytics data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the ISC License.
