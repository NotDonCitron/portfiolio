# Stage 1: Build
FROM node:20-alpine AS build

WORKDIR /app

# Set API URL to relative path for production
ENV VITE_API_URL=""

# Install dependencies first for better caching
COPY package*.json ./
RUN npm ci --prefer-offline

# Copy source and build
COPY . .
RUN npm run build

# Stage 2: Production
FROM nginx:stable-alpine

# Copy the build output from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Add a custom Nginx config to handle React SPA routing
RUN printf 'server {\n    listen 80;\n    location / {\n        root /usr/share/nginx/html;\n        index index.html index.htm;\n        try_files $uri $uri/ /index.html;\n    }\n    location /api {\n        proxy_pass http://backend-service:5000;\n    }\n}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
