# Stage 1: Build
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .

# Build args can be passed here if needed for VITE_ variables
# RUN npm run build
RUN npm run build

# Stage 2: Production
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build artifacts to nginx public folder
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port (internal)
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
