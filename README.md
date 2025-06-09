
Excel Analytics Backend

Backend API for Excel Analytics Platform built with Node.js, Express, and MongoDB. This backend handles user authentication, file uploads, Excel parsing, and provides data endpoints for frontend visualization.
Features

    User registration and login with JWT authentication

    Role-based access control (admin and user)

    Password reset via email link

    Excel file upload and parsing using Multer and SheetJS (xlsx)

    Secure protected routes with role validation

    CRUD operations on uploaded files and user data

    RESTful API endpoints

Tech Stack

    Node.js

    Express.js

    MongoDB (Mongoose)

    JWT (jsonwebtoken)

    Bcryptjs (password hashing)

    Multer (file uploads)

    SheetJS (xlsx parsing)

    Nodemailer (email service for password reset)

Setup & Installation

    Clone the repo

git clone https://github.com/yourusername/excel-analytics-backend.git
cd excel-analytics-backend

    Install dependencies

npm install

    Create .env file in the root directory with the following variables:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email_address_for_sending_emails
EMAIL_PASS=your_email_password_or_app_password
CLIENT_URL=http://localhost:3000

    Start the server

npm run dev

The backend server will run at http://localhost:5000.
API Endpoints
Auth

    POST /api/auth/register — Register new user

    POST /api/auth/login — Login user

    POST /api/auth/forgot-password — Request password reset link

    POST /api/auth/reset-password/:token — Reset password

Files

    POST /api/files/upload — Upload Excel file (protected route)

    GET /api/files — Get all uploaded files (protected route)

    GET /api/files/:id — Get file details by ID (protected route)

    DELETE /api/files/:id — Delete file by ID (admin only)

Folder Structure

/config        - Database and email config
/controllers   - Request handlers
/middleware    - Auth and error handling middleware
/models        - Mongoose schemas
/routes        - Express routes
/utils         - Utility functions (email, file parsing)
/server.js     - Entry point

Notes

    Make sure MongoDB is running and accessible via the connection string.

    Use tools like Postman to test API endpoints.

    Password reset emails require valid SMTP credentials.

    Protect your .env file and never commit it to version control.
