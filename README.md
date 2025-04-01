<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blog Project Readme</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
</head>
<body>
    <div class="container mt-5">
        <h1 class="text-center">Blog Project</h1>
        
        <h2>Introduction</h2>
        <p>This is a full-stack Blog Application built using Django, Django REST Framework (DRF), MySQL for the backend, and React with Bootstrap for the frontend. It includes user authentication, blog creation, comments, and other essential features.</p>

        <h2>Features</h2>
        <h3>Backend (Django & DRF)</h3>
        <ul>
            <li>Set up the blog project and create the main app</li>
            <li>Use MySQL as the database</li>
            <li>Create models for User, Blog Posts, and Comments</li>
            <li>Set up the Django Admin interface</li>
            <li>Implement REST API for Login, Logout, User Registration</li>
            <li>User Authentication and Registration</li>
            <li>Email verification at the time of signup</li>
            <li>Forgot Password functionality with password reset email</li>
            <li>Only logged-in users can create new blog posts</li>
            <li>Pagination & Search</li>
            <li>Commenting system for logged-in users</li>
        </ul>

        <h3>Frontend (React & Bootstrap)</h3>
        <ul>
            <li>Basic layout and navigation</li>
            <li>User authentication components (Login, Logout, Registration)</li>
            <li>Create Blog functionality with validation</li>
            <li>Display blogs with pagination and search</li>
            <li>Commenting system for logged-in users</li>
            <li>Styling & Responsiveness using Bootstrap</li>
        </ul>

        <h2>Installation & Setup</h2>
        <h3>Prerequisites</h3>
        <p>Ensure you have the following installed:</p>
        <ul>
            <li>Python (>=3.8)</li>
            <li>Django</li>
            <li>Django REST Framework</li>
            <li>MySQL Server</li>
            <li>Node.js & npm</li>
            <li>React</li>
        </ul>

        <h3>Backend Setup</h3>
        <pre>
1. Clone the repository:
   git clone https://github.com/your-repo/blog-project.git
   cd blog-project

2. Create and activate a virtual environment:
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`

3. Install dependencies:
   pip install -r requirements.txt

4. Configure MySQL database in settings.py

5. Run migrations:
   python manage.py migrate

6. Create a superuser:
   python manage.py createsuperuser

7. Start the backend server:
   python manage.py runserver
        </pre>

        <h3>Frontend Setup</h3>
        <pre>
1. Navigate to the frontend directory:
   cd frontend

2. Install dependencies:
   npm install

3. Start the frontend server:
   npm start
        </pre>

        <h2>Usage</h2>
        <ul>
            <li>Open the frontend in your browser at <code>http://localhost:3000</code></li>
            <li>Register a new account and verify your email</li>
            <li>If you don't verify your email and try to log in, a new verification email will be sent</li>
            <li>Login to create blog posts and comments</li>
            <li>Browse and search blog posts</li>
        </ul>

        <h2>Contributing</h2>
        <p>Feel free to fork this repository and contribute by submitting pull requests.</p>

        <h2>License</h2>
        <p>This project is licensed under the MIT License.</p>
    </div>
</body>
</html>
