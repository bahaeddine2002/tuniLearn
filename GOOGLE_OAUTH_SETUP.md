# TuniLearn Google OAuth Setup Instructions

## 🚀 Backend Setup

### 1. Environment Variables
Copy `.env.example` to `.env` in the backend directory and fill in the values:

```bash
cd tunilearn-backend
cp .env.example .env
```

Edit `.env` file with your actual values:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/tunilearn_db"

# JWT Secret (generate a strong secret)
JWT_SECRET="your-super-secret-jwt-key-here"

# Google OAuth (get from Google Cloud Console)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:5000/api/auth/google/callback"

# Session Secret (generate a strong secret)
SESSION_SECRET="your-session-secret-key-here"

# CORS
CORS_ORIGIN="http://localhost:3000"

# Server
PORT=5000
NODE_ENV="development"

# Frontend URL
FRONTEND_URL="http://localhost:3000"
```

### 2. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Configure OAuth consent screen:
   - Application name: "TuniLearn"
   - Authorized domains: `localhost` (for development)
6. Create OAuth 2.0 Client ID:
   - Application type: Web application
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs: `http://localhost:5000/api/auth/google/callback`
7. Copy Client ID and Client Secret to your `.env` file

### 3. Database Setup

Make sure PostgreSQL is running and create a database:
```sql
CREATE DATABASE tunilearn_db;
```

### 4. Install Dependencies & Run Migrations
```bash
cd tunilearn-backend
npm install
npx prisma generate
npx prisma migrate dev
```

### 5. Start Backend Server
```bash
npm run dev
```

## 🎨 Frontend Setup

### 1. Environment Variables
Create `.env.local` in the frontend directory:

```bash
cd tunilearn-frontend
```

The `.env.local` file should contain:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_AUTH_URL=http://localhost:5000/api/auth/google
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Frontend Server
```bash
npm run dev
```

## 🔐 Security Features Implemented

- **Secure Cookies**: HTTP-only, secure, SameSite cookies for authentication
- **CSRF Protection**: Built-in CSRF protection with SameSite cookies
- **Rate Limiting**: Request rate limiting on auth endpoints
- **Input Validation**: Server-side validation for all inputs
- **JWT Tokens**: Secure JWT tokens with expiration
- **Session Management**: Secure session handling with Passport.js
- **OAuth 2.0**: Google OAuth 2.0 implementation following best practices

## 🚦 How It Works

### First Time Login Flow:
1. User clicks "Continue with Google" on login page
2. Redirected to Google OAuth consent screen
3. After approval, redirected back to backend callback
4. Backend creates user account automatically
5. User redirected to profile completion page
6. User selects role (STUDENT/TEACHER) and bio
7. Redirected to appropriate dashboard

### Subsequent Logins:
1. User clicks "Continue with Google"
2. Recognized by Google ID in database
3. Automatically redirected to dashboard based on role

### Auto-Login:
- Users stay logged in across browser sessions via secure cookies
- Authentication state checked on page load
- Automatic redirection to appropriate pages based on auth status

## 🛡️ Production Deployment Notes

### Backend:
- Set `NODE_ENV=production`
- Use HTTPS URLs for OAuth redirect URIs
- Set secure database connection strings
- Use strong, unique secrets for JWT and sessions
- Configure CORS for production domain

### Frontend:
- Update environment variables for production URLs
- Configure proper domain for cookies
- Set up HTTPS

### Google OAuth:
- Add production domains to authorized origins
- Update redirect URIs for production backend
- Configure OAuth consent screen for production

## 🔧 Troubleshooting

### Common Issues:

1. **OAuth Redirect URI Mismatch**
   - Ensure callback URL in Google Console matches backend URL exactly
   - Check for HTTP vs HTTPS

2. **CORS Errors**
   - Verify CORS_ORIGIN in backend .env matches frontend URL
   - Ensure withCredentials is set to true in frontend

3. **Database Connection**
   - Verify PostgreSQL is running
   - Check DATABASE_URL format in .env

4. **Session/Cookie Issues**
   - Clear browser cookies
   - Check that SESSION_SECRET is set
   - Verify cookie settings for your environment

## 📚 API Endpoints

### Authentication:
- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/google/callback` - Google OAuth callback
- `POST /api/auth/complete-profile` - Complete user profile
- `GET /api/auth/me` - Get current user
- `GET /api/auth/check` - Check auth status
- `POST /api/auth/logout` - Logout user

All other existing API endpoints remain unchanged and work with the new authentication system.
