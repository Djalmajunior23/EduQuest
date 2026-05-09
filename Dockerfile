# Dockerfile for EduQuest Enterprise AI (Full-stack Express + Vite)
FROM node:20-slim AS base

WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install

# Build
COPY . .
RUN npx prisma generate
RUN npm run build

# Stage for production
FROM node:20-slim AS runner
WORKDIR /app
COPY --from=base /app /app

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["npm", "run", "dev"]
