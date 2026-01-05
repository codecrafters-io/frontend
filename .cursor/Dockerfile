FROM oven/bun:1.3.5

WORKDIR /app

# Install dependencies
COPY package.json bun.lock ./
RUN bun install

# Add the rest of the application
COPY . .
