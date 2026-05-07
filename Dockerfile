# Use Node 20 as base image
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Build the frontend and backend (Vite)
RUN npm run build

# Production image
FROM node:20-alpine AS runner
WORKDIR /app

# Only copy required files to run server.ts with Node
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
# Actually server.ts requires compilation if it uses TypeScript, but we can run it with tsx or compile it.
# Assuming package.json runs it via `tsx server.ts` or we compile it during build.
COPY --from=builder /app/server.ts ./
COPY --from=builder /app/src/server ./src/server

# Expose port (Internal port the backend runs on)
EXPOSE 3000

# Start command
CMD ["npm", "start"]
