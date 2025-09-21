# Start from a Python base image
FROM python:3.11

# Set working directory inside the container
WORKDIR /app

# Copy app files into the container
COPY . /app

# Install dependencies
RUN pip install -r requirements.txt

# Run the application
CMD ["python", "app.py"]

