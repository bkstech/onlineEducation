# JWT Authentication Implementation

This document describes the JWT-based authentication system implemented for the Online Education platform.

## Architecture

```
Next.js (Frontend)
     ↓ REST API
.NET 8 Web API  ←→  MySQL Database
     ↑ JWT Token
```

## Features Implemented

### Backend (.NET API)

1. **Authentication Endpoints** (`/api/Auth`)
   - `POST /api/Auth/Login` - Authenticate user with email/password
   - `POST /api/Auth/Register` - Register new candidate with BCrypt hashed password

2. **Security Features**
   - BCrypt password hashing (replaced SHA256)
   - JWT token generation with configurable expiry
   - JWT Bearer authentication middleware
   - CORS support for Next.js frontend

3. **Database Integration**
   - Validates credentials against `candidate` table
   - Email used as username
   - Password validated against `Userpassword` column
   - Prevents duplicate email/phone registration

### Frontend (Next.js)

1. **Authentication Pages**
   - `/signin` - Login page with API integration
   - `/register-student` - Student registration with API integration

2. **Authentication Utilities** (`/lib/auth.ts`)
   - `login()` - Authenticate user
   - `register()` - Register new user
   - `logout()` - Clear session
   - `isAuthenticated()` - Check auth status
   - `fetchWithAuth()` - Make authenticated API requests
   - Token storage in localStorage
   - User info persistence

## Configuration

### Backend (appsettings.json)

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "server=localhost;Port=3306;Database=estudydb;Username=root;Password=admin"
  },
  "Jwt": {
    "Key": "ThisIsASecretKeyForJWTTokenGenerationWithAtLeast32Characters",
    "Issuer": "OnlineEducationAPI",
    "Audience": "OnlineEducationClient",
    "ExpiryInMinutes": 60
  }
}
```

### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=https://localhost:5000
```

## Prerequisites

1. **MySQL Database**
   - Version: 8.0+
   - Database: `estudydb`
   - Table: `candidate` with columns:
     - `id` (INT, Primary Key)
     - `email` (VARCHAR, Unique)
     - `Userpassword` (VARCHAR)
     - `firstname`, `lastname`, etc.

2. **.NET Runtime**
   - .NET 8.0 SDK

3. **Node.js**
   - Node.js 18+ for Next.js

## Running the Application

### Start Backend API

```bash
cd api/API
dotnet run --urls "https://localhost:5000"
```

### Start Frontend

```bash
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`

## API Endpoints

### Login
```
POST /api/Auth/Login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "email": "user@example.com",
  "firstname": "John",
  "lastname": "Doe",
  "id": 1
}
```

### Register
```
POST /api/Auth/Register
Content-Type: application/json

{
  "firstname": "John",
  "lastname": "Doe",
  "email": "user@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "country": "United States",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zip": "10001",
  "dob": "2000-01-01T00:00:00Z"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "email": "user@example.com",
  "firstname": "John",
  "lastname": "Doe",
  "id": 1
}
```

## Security Considerations

1. **JWT Secret Key**: Change the default JWT key in production to a secure random string
2. **HTTPS**: Always use HTTPS in production
3. **CORS**: Configure CORS origins for production domains
4. **Password Policy**: Consider implementing password strength requirements
5. **Rate Limiting**: Add rate limiting to prevent brute force attacks
6. **Token Storage**: Consider using httpOnly cookies instead of localStorage for enhanced security

## Testing

### Manual Testing

1. **Register a New User**
   - Navigate to `/register-student`
   - Fill in the form
   - Click "Register"
   - Should redirect to home page on success

2. **Login**
   - Navigate to `/signin`
   - Enter registered email and password
   - Click "Sign In"
   - Should redirect to home page on success

3. **Token Verification**
   - Check browser localStorage for `auth_token`
   - Decode JWT token at jwt.io to verify claims

### API Testing with cURL

```bash
# Register
curl -X POST https://localhost:5000/api/Auth/Register \
  -H "Content-Type: application/json" \
  -d '{
    "firstname": "John",
    "lastname": "Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "1234567890",
    "country": "United States",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zip": "10001",
    "dob": "2000-01-01T00:00:00Z"
  }'

# Login
curl -X POST https://localhost:5000/api/Auth/Login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

## NuGet Packages Added

- `BCrypt.Net-Next` (4.0.3) - Password hashing
- `Microsoft.AspNetCore.Authentication.JwtBearer` (8.0.11) - JWT authentication

## Changes Made to Existing Code

1. **CandidateController.cs**
   - Replaced SHA256 password hashing with BCrypt
   - Added null checks for password hashing

2. **Program.cs**
   - Added JWT authentication configuration
   - Added CORS policy for Next.js frontend
   - Added authentication middleware

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure API CORS policy includes your frontend URL
   - Check browser console for specific CORS errors

2. **401 Unauthorized**
   - Verify token is being sent in Authorization header
   - Check token expiry
   - Verify JWT configuration matches on frontend/backend

3. **Database Connection**
   - Ensure MySQL is running
   - Verify connection string in appsettings.json
   - Check database credentials

4. **Invalid Token**
   - Ensure JWT Key is the same in appsettings.json
   - Check token format (Bearer prefix)
   - Verify token hasn't expired
