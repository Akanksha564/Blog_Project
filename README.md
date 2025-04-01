# Blog Project

## Introduction
This is a full-stack Blog Application built using Django, Django REST Framework (DRF), MySQL for the backend, and React with Bootstrap for the frontend. It includes user authentication, blog creation, comments, and other essential features.

## Features

### Backend (Django & DRF)
- Set up the blog project and create the main app
- Use MySQL as the database
- Create models for User, Blog Posts, and Comments
- Set up the Django Admin interface
- Implement REST API for:
  - Login
  - Logout
  - User Registration
- User Authentication and Registration
- **Email verification at the time of signup**
  - If a user does not verify their email at signup and later tries to log in with the same credentials, a new verification email will be sent.
  - The verification link will have an expiration time, after which it becomes invalid.
- **Forgot Password functionality** with password reset email
- **Blog post functionalities:**
  - Only logged-in users can create new blog posts
  - Each blog post includes Title, Description, and an Image
  - Implement validation on blog creation
  - Handle form submissions and display success messages
- **Pagination & Search**
  - Show all blog posts with pagination
  - Implement search functionality
- **Commenting system:**
  - Only logged-in users can add comments
  - Display all comments publicly
  - Set up database relationships for comments and blog posts

### Frontend (React & Bootstrap)
- Basic layout and navigation
- User authentication components for:
  - Login
  - Logout
  - User Registration
- **Create Blog functionality:**
  - Form for creating new blog posts
  - Implement frontend validation
- **Display Blog Posts:**
  - Show all blogs with pagination
  - Implement search functionality
- **Comments section:**
  - Allow logged-in users to comment on any blog post
  - Display comments under each post
- **Styling & Responsiveness:**
  - Apply CSS and Bootstrap for a modern UI
  - Enhance styling for better user experience

## Installation & Setup

### Prerequisites
Ensure you have the following installed:
- Python (>=3.8)
- Django
- Django REST Framework
- MySQL Server
- Node.js & npm
- React

### Backend Setup
```sh
# Clone the repository
git clone https://github.com/your-repo/blog-project.git
cd blog-project

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`

# Install dependencies
pip install -r requirements.txt

# Configure MySQL database in settings.py

# Run migrations
python manage.py migrate

# Create a superuser
python manage.py createsuperuser

# Start the backend server
python manage.py runserver
