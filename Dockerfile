FROM node:20-bookworm-slim

# Install system dependencies and build tools
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    git \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Set global Git configuration to force HTTPS (Critical for Railway)
RUN git config --global url."https://github.com/".insteadOf git://github.com/ && \
    git config --global url."https://github.com/".insteadOf ssh://git@github.com/

WORKDIR /app

# Copy only package.json first for better caching
COPY package.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy the rest of the application
COPY . .

# Ensure necessary directories exist
RUN mkdir -p sessions data tmp

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Start the application
CMD ["node", "index.js"]
