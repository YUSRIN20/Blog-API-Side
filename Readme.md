# Blog  Website Backend

## Overview

This project is the backend for the SimpleBlog application, a blog platform allowing users to register, log in, create, update, delete, and view blog posts. The backend is built using Node.js, Express, and MongoDB with Mongoose for data modeling. It includes authentication using JWT (JSON Web Token), file uploading via Multer, and CORS configuration to communicate with the frontend hosted on Netlify.

## Features

- User registration and authentication (login and logout)
- Create, read, update, and delete blog posts
- Category-based filtering of blog posts
- Secure file upload handling
- JWT-based authentication and authorization
- MongoDB database connection and modeling using Mongoose

## Prerequisites

- Node.js
- MongoDB (local or cloud-based)
- Environment variables setup

## Usage

1. **Start the server:**

    ```bash
    npm start
    ```

    The server will run on port `8800` by default.

## Project Structure

- **models/**
  - `Post.js`: Mongoose schema and model for blog posts.
  - `User.js`: Mongoose schema and model for users.

- **routes/**
  - `auth.js`: Routes for user authentication (register, login, logout).
  - `posts.js`: Routes for managing blog posts (CRUD operations).
  - `users.js`: Placeholder for user-related routes.

- **controllers/**
  - `auth.js`: Controller functions for user authentication.
  - `post.js`: Controller functions for handling blog posts.

- **index.js**: Main application file that sets up the server, connects to MongoDB, and configures middleware and routes.

## Middleware

- **express.json()**: Parses incoming requests with JSON payloads.
- **cookieParser()**: Parses cookies attached to the client request.
- **cors()**: Enables CORS with specific configurations to allow cross-origin requests from the frontend.
- **multer**: Handles file uploads.

## Security and Error Handling

- JWT for securing routes and authenticating users.
- Error handling in controllers to manage and respond to errors appropriately.
- Input validation and sanitization to prevent SQL injection and other attacks.

## Deployment

Ensure that the MongoDB connection string and JWT secret are correctly configured in the `.env` file before deploying the application.

You can deploy this backend to any cloud platform that supports Node.js, such as Heroku, AWS, or Vercel.

### Backend Deployment

The backend is deployed and can be accessed at: [Blog Backend on Render](https://blog-api-side.onrender.com)

### Frontend Repository

The frontend code for this application can be found at: [Blog Frontend Repository](https://github.com/YUSRIN20/Blog-Client-Side.git)

## License

This project is licensed under the MIT License.
