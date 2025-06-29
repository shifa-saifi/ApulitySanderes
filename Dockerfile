# 1) Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Install deps
COPY package*.json tsconfig.json ./
RUN npm ci

# Copy source & compile
COPY src ./src
RUN npm run build

# 2) Run stage
FROM node:20-alpine
WORKDIR /app

# Only production deps
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built files & env
COPY --from=builder /app/dist ./dist
# COPY .env ./

# Expose port and launch
EXPOSE 3000
CMD ["node", "dist/main.js"]
