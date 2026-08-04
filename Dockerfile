FROM node:20

# Install build dependencies
RUN apt-get update && apt-get install -y \
    git \
    python3 \
    make \
    g++ \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Force Git to use HTTPS for all GitHub requests
# This is the most critical fix for the "Could not read from remote repository" error
RUN git config --global url."https://github.com/".insteadOf git://github.com/ && \
    git config --global url."https://github.com/".insteadOf ssh://git@github.com/

WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies without using the local lockfile to avoid protocol conflicts
RUN npm install --no-package-lock

# Copy the rest of the bot code
COPY . .

# Ensure necessary directories exist for persistent data
RUN mkdir -p sessions data tmp

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "index.js"]
