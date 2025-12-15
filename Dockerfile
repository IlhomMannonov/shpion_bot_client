# Stage 1: Build the React app
FROM node:18 AS builder
WORKDIR /app

# Faqat kerakli fayllarni yuklash
COPY package*.json ./
RUN npm install

# Endi qolgan kodlarni yuklash
COPY . .

# React build
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
