# Use an official lightweight Python image
FROM python:3.10-slim

# Set the working directory inside the container
WORKDIR /app

# Copy your requirements file and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all your Python code into the container
COPY . .

# Hugging Face strictly requires APIs to run on port 7860
EXPOSE 7860


CMD ["uvicorn", "ingestion_api:app", "--host", "0.0.0.0", "--port", "7860"]