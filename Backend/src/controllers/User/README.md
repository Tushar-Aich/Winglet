# User Management API Documentation

This document provides an overview of the user management endpoints available in the Winglet Backend application.

## Authentication Endpoints

### Registration Flow

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/users/sendMail` | POST | Sends verification email with OTP |
| `/api/v1/users/verifyOTP` | POST | Verifies the OTP sent to email |
| `/api/v1/users/signUp` | POST | Creates a new user account |

### Login and Authentication

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/users/login` | POST | Authenticates user and issues tokens |
| `/api/v1/users/refresh-token` | POST | Refreshes the access token |
| `/api/v1/users/logout` | POST | Logs out the user |
| `/api/v1/users/current-user` | GET | Retrieves the current user's profile |

### Password Management

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/users/forgotPassword-Email` | POST | Sends password reset OTP |
| `/api/v1/users/forgotPassword-verify-token` | POST | Verifies password reset OTP |
| `/api/v1/users/change-password` | POST | Changes the user's password |

## Profile Management

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/users/update-avatar` | POST | Updates the user's avatar |
| `/api/v1/users/update-cover-image` | POST | Updates the user's cover image |
| `/api/v1/users/add-bio` | POST | Adds or updates user bio |
| `/api/v1/users/add-birth-date` | POST | Adds or updates user birth date |
| `/api/v1/users/delete` | DELETE | Deletes the user account |

## User Model

The user model includes the following fields:

- `userName`: Unique username (3-20 characters, alphanumeric with underscores)
- `email`: Unique email address
- `password`: Hashed password (min 8 characters)
- `OGName`: Display name
- `bio`: User biography (optional, max 200 characters)
- `avatar`: Profile picture URL
- `coverImage`: Cover image URL (optional)
- `birthDate`: User's birth date (optional)
- `followers`: Array of user IDs following this user
- `following`: Array of user IDs this user follows
- `posts`: Array of post IDs created by the user
- `likedPosts`: Array of post IDs liked by the user
- `bookmarks`: Array of post IDs bookmarked by the user
- `notifications`: Array of notification IDs for the user
- `isVerified`: Boolean indicating if user is verified
- `isPrivate`: Boolean indicating if account is private
- `lastActive`: Date of last activity
- `accountType`: User account type (Free/Premium)
- `refreshToken`: JWT refresh token

## Security Features

- Password hashing with bcrypt
- JWT-based authentication with access and refresh tokens
- Rate limiting for OTP verification
- HTTP-only secure cookies for token storage
- Environment-based security settings