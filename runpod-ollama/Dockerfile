# Nala AI - Ollama + DeepSeek R1 for RunPod
FROM nvidia/cuda:12.1-runtime-ubuntu22.04

# Set environment variables
ENV DEBIAN_FRONTEND=noninteractive
ENV OLLAMA_HOST=0.0.0.0:11434
ENV PYTHONUNBUFFERED=1

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    python3 \
    python3-pip \
    python3-venv \
    git \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Ollama
RUN curl -fsSL https://ollama.ai/install.sh | sh

# Create app directory
WORKDIR /app

# Copy Python requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip3 install --no-cache-dir -r requirements.txt

# Copy application files
COPY . .

# Make startup script executable
RUN chmod +x startup.sh

# Expose ports
EXPOSE 11434 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Start services
CMD ["./startup.sh"]