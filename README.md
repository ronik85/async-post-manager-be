# Backend

## Project Overview

This project is the backend for a post management application, built with Node.js and TypeScript. It provides a REST API for user authentication, post management, and queue management using RabbitMQ. The application includes functionalities for creating and searching posts, uses JWT for secure authentication, and implements caching for optimized performance.

## Features

- **User Authentication**: Secure login with JWT tokens for user sessions.
- **Post Management**: Create and manage posts with REST API endpoints.
- **Queue Management**: Use RabbitMQ for handling asynchronous tasks.
- **Error Handling**: Proper error responses for failed operations.
- **Caching**: Caching of responses for optimization.

## Technologies Used

- **Node.js**: JavaScript runtime for building server-side applications.
- **TypeScript**: For static typing and improved development experience.
- **Express**: Web framework for building the REST API.
- **Axios**: For making HTTP requests.
- **JWT (JSON Web Token)**: For secure authentication.
- **RabbitMQ**: Message broker for queue management.
- **Node Cache**: For caching.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ronik85/async-post-manager-be.git

   ```

2. Navigate to the project directory
3. npm install
4. Create a .env file in the root directory. This file should contain the following environment variables:  
   PORT = 3000  
   MONGO_URI = mongodb+srv://ronikabrainerhub:5rOt4trkBvA4F50L@cluster0.w8zwk.mongodb.net/
   JWT_SECRET= Ronik@123$

5. npm run dev
