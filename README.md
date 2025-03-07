# Winglet

A full-stack social media platform inspired by X (formerly Twitter), built with modern web technology.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## 🌟 Overview

X Clone is a comprehensive social media platform that replicates the core functionality of X (formerly Twitter). This project was built as a learning exercise to understand fullstack development with modern technologies including Node.js, Express, MongoDB, React, TypeScript, and more.

Users can create accounts, post updates, follow other users, engage with content through likes and comments, and explore trending topics. The platform includes user authentication, profile customization, and a responsive design that works seamlessly across devices.

## ✨ Features

- **User Authentication**
  - Sign up/Sign in using email or OAuth providers
  - JWT-based authentication
  - Password recovery and account verification via Resend email delivery

- **User Profiles**
  - Customizable profile images and banners
  - Bio and personal information
  - Following/Followers lists

- **Content Creation and Interaction**
  - Create, edit, and delete posts
  - Upload images in posts
  - Like, comment, and repost functionality
  - Bookmark posts for later viewing

- **Social Features**
  - Follow/Unfollow users
  - View activity feed with posts from followed users
  - Notifications for interactions

- **Explore & Discovery**
  - Search functionality for users and content
  - Trending topics and hashtags
  - Suggested users to follow

- **User Experience**
  - Responsive design for desktop and mobile
  - Dark/Light mode toggle
  - Infinite scroll for content feeds

## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Static typing
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **Auth.js** - OAuth provider integration
- **Cloudinary** - Image storage and optimization
- **Multer** - File uploads handling
- **Winston** - Logging
- **Resend** - Email delivery

### Frontend
- **React** - UI library
- **TypeScript** - Static typing
- **React Router** - Navigation
- **Redux Toolkit** - State management
- **Shadcn UI** - Component library
- **Axios** - HTTP client
- **TailwindCSS** - Styling

## 🚀 Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local instance or MongoDB Atlas)
- Cloudinary account
- Git

### Backend Setup

1. Clone the repository
```bash
git clone https://github.com/Tushar-Aich/Winglet.git
```

2. Navigate to the server directory
```bash
cd Backend
```

3. Install dependencies
```bash
npm install
# or
yarn install
```

4. Set up environment variables
Create a `.env` file in the server directory and add the variables listed in the [Environment Variables](#environment-variables) section.

5. Start the development server
```bash
npm run dev
# or
yarn dev
```

### Frontend Setup

1. Navigate to the client directory
```bash
cd ../Frontend
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
Create a `.env` file in the client directory and add the necessary variables.

4. Start the development server
```bash
npm run dev
# or
yarn dev
```

## 📝 Usage

After setting up both the backend and frontend, you can access the application at `http://localhost:3000` (or whatever port your React app is running on).

To use the application:

1. Register a new account or log in with existing credentials
2. Customize your profile by uploading a profile picture and banner
3. Create posts with text and/or images
4. Follow other users to see their content in your feed
5. Like, comment, and repost content from other users
6. Explore trending topics and search for users or content

## 📚 API Documentation

The API follows RESTful principles and includes the following main endpoints:

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### Users
- `GET /api/users` - Get all users (with pagination)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user profile
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/:id/followers` - Get user followers
- `GET /api/users/:id/following` - Get users being followed
- `POST /api/users/:id/follow` - Follow a user
- `DELETE /api/users/:id/follow` - Unfollow a user

### Posts
- `GET /api/posts` - Get all posts (with pagination)
- `GET /api/posts/:id` - Get post by ID
- `POST /api/posts` - Create a new post
- `PUT /api/posts/:id` - Update a post
- `DELETE /api/posts/:id` - Delete a post
- `POST /api/posts/:id/like` - Like a post
- `DELETE /api/posts/:id/like` - Unlike a post
- `GET /api/posts/:id/comments` - Get comments for a post
- `POST /api/posts/:id/comments` - Add a comment to a post

### Comments
- `PUT /api/comments/:id` - Update a comment
- `DELETE /api/comments/:id` - Delete a comment
- `POST /api/comments/:id/like` - Like a comment
- `DELETE /api/comments/:id/like` - Unlike a comment

## 📂 Project Structure

```
Winglet/
├──Backend/                  # Backend code
│   ├── src/
│   │   ├── lib/         # Configuration files
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Custom middleware
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Utility functions
│   │   ├── app.ts           # Express app setup
│   │   └── index.ts        # Server entry point
│   ├── .env                 # Environment variables
│   └── package.json         # Backend dependencies
│
├── Frontend/                  # Frontend code
│   ├── public/              # Static files
│   ├── src/
│   │   ├── assets/          # Images, fonts, etc.
│   │   ├── components/      # Reusable components
│   │   ├── features/        # Feature-specific components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── pages/           # Page components
│   │   ├── redux/           # Redux store and slices
│   │   ├── services/        # API service functions
│   │   ├── types/           # TypeScript type definitions
│   │   ├── utils/           # Utility functions
│   │   ├── App.tsx          # Main component
│   │   └── index.tsx        # Entry point
│   ├── .env                 # Environment variables
│   └── package.json         # Frontend dependencies
│
└── README.md                # Project documentation
```

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with ❤️ by [Tushar](https://github.com/Tushar-Aich)
