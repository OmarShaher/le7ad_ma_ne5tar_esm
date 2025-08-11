# **NaviTech Learning Platform - Complete Project Documentation**

## **Project Overview**
NaviTech is a comprehensive educational technology platform designed specifically for Egyptian students learning computer science and programming. This is a full-stack MERN application with modern authentication, interactive learning features, and a beautiful UI.

## **Technology Stack**
- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: shadcn/ui components + Radix UI primitives
- **Styling**: Tailwind CSS with custom gradients and animations
- **Routing**: React Router DOM v6 with protected routes
- **State Management**: React Context API + TanStack Query v5
- **Backend**: Node.js + Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens + bcryptjs for password hashing
- **Icons**: Lucide React
- **Themes**: Next-themes for light/dark mode
- **Forms**: React Hook Form + Zod validation
- **Build Tool**: Vite with SWC plugin
- **Development**: Concurrently, Nodemon, ESLint

## **Project Structure & Architecture**

### **Frontend Structure**
```
src/
├── components/
│   ├── ui/ (shadcn/ui components - 30+ reusable components)
│   ├── AuthLayout.tsx (Clean auth pages layout)
│   ├── DashboardLayout.tsx (Main app layout with sidebar)
│   ├── ProtectedRoute.tsx (Route protection)
│   ├── PublicRoute.tsx (Auth page protection)
│   ├── NaviSidebar.tsx (Collapsible navigation)
│   ├── WelcomeSection.tsx (Personalized dashboard greeting)
│   ├── RoadmapSection.tsx (Learning path visualization)
│   └── ChatbotPanel.tsx (AI tutor interface)
├── contexts/
│   └── AuthContext.tsx (Global auth state management)
├── hooks/
│   ├── use-theme.tsx (Theme management)
│   ├── use-mobile.tsx (Responsive utilities)
│   └── use-toast.ts (Toast notifications)
├── lib/
│   ├── api.ts (API client with auth headers)
│   ├── utils.ts (Utility functions)
│   └── egypt-universities.ts (University data for Egyptian students)
├── pages/
│   ├── Index.tsx (Main dashboard/landing)
│   ├── Login.tsx (Standalone auth page)
│   ├── Register.tsx (Standalone auth page)
│   ├── Dashboard.tsx (User info page)
│   ├── Settings.tsx (Profile & logout management)
│   ├── Roadmap.tsx (Learning path details)
│   ├── Practice.tsx (Coding exercises)
│   ├── Tutor.tsx (AI tutoring)
│   ├── Interview.tsx (Mock interviews)
│   └── NotFound.tsx (404 page)
└── App.tsx (Route configuration with auth protection)
```

### **Backend Structure**
```
server/
├── models/
│   ├── User.js (User schema with stats tracking)
│   ├── Message.js (Chat messages)
│   ├── Question.js (Practice questions)
│   ├── QuestionAttempt.js (User attempts)
│   ├── MockInterview.js (Interview sessions)
│   └── DashboardSummary.js (User progress)
├── routes/
│   ├── auth.js (Registration, login, profile management)
│   ├── chat.js (AI chatbot interactions)
│   ├── dashboard.js (User statistics)
│   └── questions.js (Practice exercises)
├── utils/
│   └── password.js (bcrypt utilities)
└── index.js (Express server with CORS, MongoDB connection)
```

## **Key Features & Functionality**

### **1. Authentication System**
- **JWT-based authentication** with localStorage token storage
- **Protected routes** that redirect unauthenticated users to login
- **Public routes** that redirect authenticated users to main app
- **Automatic token validation** on app load and API requests
- **Session persistence** across browser sessions
- **Logout functionality** in settings page
- **User registration** with email validation and password confirmation

### **2. User Interface & Experience**
- **Dual Layout System**:
  - `AuthLayout`: Clean, centered design for login/register pages
  - `DashboardLayout`: Full app layout with collapsible sidebar
- **Responsive Design**: Mobile-first approach with breakpoint handling
- **Theme System**: Light/dark mode with system preference detection
- **Custom Styling**: Gradient backgrounds, elegant shadows, smooth animations
- **Egyptian Focus**: University selection for Egyptian institutions

### **3. Navigation & Routing**
- **Collapsible Sidebar** with navigation items:
  - Dashboard (/)
  - Roadmap (/roadmap)
  - Coding Practice (/practice)
  - AI Tutor (/tutor)
  - Interview Prep (/interview)
  - Settings (/settings)
- **Route Protection**: All main routes require authentication
- **Automatic Redirects**: Login success redirects to home page (/)
- **Remember Intended Destination**: Redirects to originally requested page after login

### **4. Dashboard & Welcome System**
- **Personalized Greeting**: Dynamic welcome message with user's name
- **Progress Tracking**: Overall learning progress visualization
- **Statistics Cards**: 
  - Completed tasks counter
  - In-progress items tracker
  - Study time accumulation
  - Learning streak counter
- **Real-time Data**: Statistics fetched from backend API

### **5. Learning Roadmap**
- **Visual Learning Path**: Three-stage progression (Beginner → Intermediate → Advanced)
- **Topic Tracking**: Individual topic completion status
- **Progress Indicators**: Visual completion badges and progress bars
- **Next Recommended**: AI-suggested next learning topics
- **Interactive Elements**: Click-to-start learning actions

### **6. AI Tutoring System**
- **Chatbot Interface**: Side panel for AI interactions
- **Message History**: Persistent chat conversations
- **Bilingual Support**: English and Arabic language support
- **Learning Context**: AI aware of user's progress and needs

### **7. Practice & Assessment**
- **Coding Exercises**: Programming challenges with difficulty levels
- **Question Bank**: Multiple choice and coding questions
- **Attempt Tracking**: User answer history and scoring
- **Progress Analytics**: Performance metrics and improvement tracking

### **8. Settings & Profile Management**
- **Profile Updates**: Name, email, university information
- **Egyptian Universities**: Comprehensive list of Egyptian educational institutions
- **Preferences**: Theme selection, language settings
- **Notifications**: Study reminders and progress updates
- **Privacy Controls**: Public profile settings, data download
- **Account Management**: Logout functionality (red destructive button)

## **Database Schema**

### **User Model**
```javascript
{
  name: String (required),
  email: String (unique, required),
  passwordHash: String (required),
  university: String (optional),
  stats: {
    completed: Number (default: 0),
    inProgress: Number (default: 0),
    studyTimeHours: Number (default: 0),
    streak: Number (default: 0),
    lastActivity: Date
  },
  timestamps: true
}
```

### **Question Model**
```javascript
{
  title: String,
  description: String,
  difficulty: Enum ['easy', 'medium', 'hard'],
  tags: [String],
  choices: [String],
  correctIndex: Number
}
```

### **Message Model** (Chat)
```javascript
{
  text: String,
  isBot: Boolean,
  timestamp: Date,
  language: Enum ['en', 'ar']
}
```

## **API Endpoints**

### **Authentication Routes**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (protected)
- `PATCH /api/auth/profile` - Update user profile (protected)

### **Dashboard Routes**
- `GET /api/dashboard/summary` - Get user statistics (protected)

### **Questions Routes**
- `GET /api/questions` - Get practice questions (protected)
- `POST /api/questions/:id/attempt` - Submit question attempt (protected)

### **Chat Routes**
- `GET /api/messages` - Get chat history (protected)
- `POST /api/chat` - Send message to AI tutor (protected)

## **Authentication Flow**
1. **App Load**: Check for existing token, validate with server
2. **Unauthenticated**: Redirect to `/login` page
3. **Login Success**: Redirect to home page (`/`) or originally requested page
4. **Registration Success**: Redirect to home page (`/`)
5. **Route Protection**: All main routes require valid authentication
6. **Token Expiry**: Automatic logout and redirect to login
7. **Logout**: Clear token, redirect to login page

## **Important Implementation Details**

### **Authentication Context (src/contexts/AuthContext.tsx)**
- Provides global auth state using React Context
- Automatically validates JWT token on app load
- Handles login, logout, and user profile updates
- Stores user data and auth status across components
- Key functions: `login()`, `logout()`, `updateUser()`, `isAuthenticated`

### **Route Protection System**
- **ProtectedRoute**: Wraps authenticated pages, redirects to `/login` if not logged in
- **PublicRoute**: Wraps auth pages, redirects to `/` if already logged in  
- **AuthLayout**: Clean layout for login/register (no sidebar)
- **DashboardLayout**: Main app layout with collapsible sidebar

### **Key User Flows**
1. **First Visit**: User sees login page (`/login`)
2. **After Login**: Redirected to home page (`/`) with welcome message
3. **Navigation**: All main routes require authentication
4. **Logout**: Red button in Settings page, clears token and redirects to login

### **API Integration (src/lib/api.ts)**
- Axios client with automatic JWT token headers
- Base URL pointing to backend (`/api` proxy)
- Automatic token refresh and error handling
- Used by all components for backend communication
- **Egyptian Student Focus**: Culturally relevant content and university options
- **Clean, Modern Design**: Professional appearance suitable for education
- **Accessibility**: Proper contrast ratios, keyboard navigation
- **Mobile Responsive**: Touch-friendly interfaces, proper scaling
- **Performance**: Optimized loading, smooth transitions
- **Consistency**: Unified color scheme, typography, spacing

## **Development Configuration**
- **Frontend Port**: 8080 (Vite dev server)
- **Backend Port**: 3001 (Express server)
- **Proxy Setup**: `/api` requests forwarded to backend automatically
- **Environment Variables**: 
  - `JWT_SECRET` - JWT token signing secret
  - `MONGODB_URI` - MongoDB connection string 
  - `CLIENT_ORIGIN` - Frontend URL for CORS (http://localhost:8080)
  - `USE_MEMORY_DB` - Optional flag for in-memory testing database
- **Build Process**: Vite with SWC for fast compilation
- **Development Tools**: ESLint, TypeScript, Nodemon for auto-restart
- **Package Manager**: npm (compatible with yarn/pnpm)

## **Troubleshooting Common Issues**

### **Port Conflicts**
- If port 8080 is busy, Vite will automatically use 8081, 8082, etc.
- Check terminal output for the actual frontend URL
- Update `CLIENT_ORIGIN` in `.env` if backend port changes

### **MongoDB Connection**
- Ensure MongoDB is running locally OR use cloud MongoDB Atlas
- Check connection string format in `.env` file
- Verify database name matches between frontend and backend

### **Authentication Issues**
- Check JWT_SECRET is set in server/.env
- Verify token storage in browser localStorage
- Check browser developer tools for API errors

### **Build/Development Errors**
- Run `npm install` if dependencies are missing
- Clear node_modules and reinstall if persistent issues
- Check that all environment variables are properly set

## **Special Requirements**
1. **Egyptian Context**: Include comprehensive Egyptian university list
2. **Bilingual Support**: Prepare for Arabic interface translation
3. **Educational Focus**: Learning-oriented features and terminology
4. **Modern Stack**: Use latest React patterns and modern JavaScript
5. **Type Safety**: Full TypeScript implementation
6. **Security**: Proper password hashing, JWT validation, CORS configuration
7. **Scalability**: Modular component architecture, reusable utilities

## **Getting Started**

### **Prerequisites**
- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- MongoDB database (local or cloud)
- Git for version control

### **Installation & Setup**

```sh
# Step 1: Clone the repository
git clone https://github.com/OmarShaher/le7ad_ma_ne5tar_esm.git

# Step 2: Navigate to the project directory
cd le7ad_ma_ne5tar_esm

# Step 3: Install the necessary dependencies
npm i

# Step 4: Set up environment variables
# Create server/.env file with:
# JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure
# MONGODB_URI=mongodb://localhost:27017/navitech
# CLIENT_ORIGIN=http://localhost:8080
# 
# For cloud MongoDB, use:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/navitech

# Step 5: Start the development servers
npm run dev:mern
# This runs both frontend (port 8080) and backend (port 3001)

# Alternative: Run servers separately
# Terminal 1: npm run dev (frontend)
# Terminal 2: npm run server (backend)

# For testing with in-memory database:
# npm run dev:local
```

### **Available Scripts**
- `npm run dev` - Start frontend development server (port 8080)
- `npm run server` - Start backend server with auto-reload (port 3001)
- `npm run dev:mern` - Start both frontend and backend concurrently
- `npm run dev:local` - Run with in-memory database for testing
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run lint` - Run ESLint for code quality
- `npm run preview` - Preview production build

## **Project URLs**
- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3001
- **Lovable Project**: https://lovable.dev/projects/8cb88f5a-6ff0-400e-bb12-5cfef46c0502

## **Deployment**
Simply open [Lovable](https://lovable.dev/projects/8cb88f5a-6ff0-400e-bb12-5cfef46c0502) and click on Share → Publish.

## **Custom Domain**
To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.
Read more: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## **Contributing**
This platform provides a comprehensive, modern learning experience specifically tailored for Egyptian computer science students, with robust authentication, engaging UI, and scalable architecture.

## **License**
This project is private and proprietary.
