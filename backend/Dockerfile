# Use an official Python image as the base image
FROM python:3.10-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file and install dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy the source code
COPY . .

# Set environment variables
ENV PYTHONUNBUFFERED 1

# Specify the command to run when the container starts
CMD ["uvicorn", "main:app", "--host", "0.0.0.0"]