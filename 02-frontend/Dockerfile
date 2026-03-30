# Bước 1: Build mã nguồn React với Node.js
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
# Sử dụng cờ legacy-peer-deps để tránh xung đột Vite 8 như đã gặp ở CI
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# Bước 2: Chạy ứng dụng bằng Nginx để tối ưu hiệu suất
FROM nginx:stable-alpine
# Copy tệp đã build từ bước 1 vào thư mục phục vụ web của Nginx
COPY --from=build /app/dist /usr/share/nginx/html
# Cấu hình cổng mặc định
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]