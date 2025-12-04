FROM caddy:2-alpine

# Copy React đã build
COPY frontend/build /usr/share/caddy

# Copy toàn bộ backend vào /app/backend
COPY backend /app/backend
WORKDIR /app/backend

# Cài Python + các package
RUN apk add --no-cache python3 py3-pip && \
    pip3 install --no-cache-dir fastapi uvicorn sqlalchemy aiosqlite

# Caddyfile để chạy cả frontend + backend
RUN echo ':80 {\
    root * /usr/share/caddy\
    file_server\
    reverse_proxy /api/* localhost:8000\
}' > /etc/caddy/Caddyfile

EXPOSE 80 8000

# CHẠY ĐÚNG NHƯ LOCAL: fix → init → server
CMD cd /app/backend && \
    python fix_database.py && \
    python init_db.py && \
    caddy run --config /etc/caddy/Caddyfile & \
    uvicorn main:app --host 0.0.0.0 --port 8000