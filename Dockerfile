# Сборка проекта
FROM node:18-alpine AS builder

WORKDIR /app
COPY . .

RUN npm install
RUN npm run generate

# Статический сервер
FROM nginx:stable-alpine AS runner

# копируем сгенерированные файлы в nginx
COPY --from=builder /app/.output/public /usr/share/nginx/html

# копируем конфиг nginx
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 443
EXPOSE 80