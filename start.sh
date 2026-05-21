#!/usr/bin/env bash
set -e

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
DB_NAME="${DB_NAME:-innovationlab}"
export PGPASSWORD="${PGPASSWORD:-postgres}"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

cleanup() {
  echo -e "\n${YELLOW}Shutting down...${NC}"
  kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
  wait $BACKEND_PID $FRONTEND_PID 2>/dev/null
  echo -e "${GREEN}Done.${NC}"
}
trap cleanup EXIT INT TERM

# Kill any existing processes on our ports
sudo fuser -k 8181/tcp 2>/dev/null || true
sudo fuser -k 3000/tcp 2>/dev/null || true

# --- Database ---
echo -e "${YELLOW}[1/3] Database${NC}"

if ! pg_isready -q 2>/dev/null; then
  echo "Starting PostgreSQL..."
  sudo systemctl start postgresql 2>/dev/null || {
    echo -e "${RED}PostgreSQL not found. Install it or use Docker:${NC}"
    echo "  docker run -d --name pg -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres:16"
    exit 1
  }
fi

if ! psql -U postgres -lqt 2>/dev/null | cut -d \| -f 1 | grep -qw "$DB_NAME"; then
  echo "Creating database '$DB_NAME'..."
  psql -U postgres -c "CREATE DATABASE $DB_NAME;" 2>/dev/null || true
fi

echo -e "${GREEN}  PostgreSQL ready ($DB_NAME)${NC}"

# --- Backend ---
echo -e "${YELLOW}[2/3] Backend (Spring Boot :8181)${NC}"
cd "$ROOT_DIR/backend"

[ -f .env ] || cp .env.example .env

mvn spring-boot:run -q &
BACKEND_PID=$!

echo -n "  Waiting for backend"
for i in $(seq 1 30); do
  if curl -sf http://localhost:8181/api/health >/dev/null 2>&1; then
    echo -e " ${GREEN}ready${NC}"
    break
  fi
  sleep 2
  echo -n "."
done

if ! kill -0 $BACKEND_PID 2>/dev/null; then
  echo -e "\n${RED}Backend failed to start. Check logs above.${NC}"
  exit 1
fi

# Seed database
echo -e "  Seeding data..."
curl -sf -X POST http://localhost:8181/api/seed >/dev/null 2>&1 && echo -e "  ${GREEN}42 projects seeded${NC}" || echo -e "  ${YELLOW}Seed skipped (data may already exist)${NC}"

# --- Frontend ---
echo -e "${YELLOW}[3/3] Frontend (React :3000)${NC}"
cd "$ROOT_DIR/frontend"

[ -f .env ] || cp .env.example .env

BROWSER=none npm start &
FRONTEND_PID=$!

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}  All services running:${NC}"
echo -e "  Frontend : ${GREEN}http://localhost:3000${NC}"
echo -e "  Backend  : ${GREEN}http://localhost:8181${NC}"
echo -e "  Database : ${GREEN}postgresql://localhost:5432/$DB_NAME${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "\n${YELLOW}Press Ctrl+C to stop all services.${NC}\n"

wait
