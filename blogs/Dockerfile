# Use official Python 3.10 image
FROM python:3.10

# Set environment variables
ENV PYTHONUNBUFFERED=1

# Set the working directory inside the container
WORKDIR /app

# Copy project files
COPY . /app/

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose port 8000 for Django
EXPOSE 8005

# Start Gunicorn with the Django WSGI application
CMD ["gunicorn", "--bind", "0.0.0.0:8005", "blogsProject.wsgi:application"]
