FROM node:20-bookworm-slim

# Native build tools for any packages that need to compile from source
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev

COPY . .

# Sessions and bot data should be mounted as a persistent volume/disk
# on whichever platform you deploy to, so pairing survives restarts.
RUN mkdir -p sessions data

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "index.js"]
