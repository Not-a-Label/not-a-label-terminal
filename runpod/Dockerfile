# Nala AI - DeepSeek R1 RunPod Container
FROM runpod/pytorch:2.0.1-py3.10-cuda11.8.0-devel

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy handler
COPY handler.py .

# Set environment variables
ENV PYTHONPATH=/app
ENV TRANSFORMERS_CACHE=/app/cache
ENV HF_HOME=/app/cache

# Create cache directory
RUN mkdir -p /app/cache

# Download DeepSeek R1 model (optional - can be done at runtime)
# RUN python -c "from transformers import AutoTokenizer, AutoModelForCausalLM; AutoTokenizer.from_pretrained('deepseek-ai/DeepSeek-R1'); print('Model cached')"

# Expose port (if needed for debugging)
EXPOSE 8000

# Start the handler
CMD ["python", "handler.py"]