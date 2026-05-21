.PHONY: start db backend frontend seed clean

# Start everything (database + backend + frontend)
start:
	./start.sh

# Start only PostgreSQL (if using Docker, otherwise ensure system service)
db:
	@pg_isready -q 2>/dev/null && echo "PostgreSQL is running" || sudo systemctl start postgresql

# Start only the Spring Boot backend
backend:
	cd backend && [ -f .env ] || cp .env.example .env && mvn spring-boot:run

# Start only the React frontend
frontend:
	cd frontend && [ -f .env ] || cp .env.example .env && BROWSER=none npm start

# Seed the database with initial data
seed:
	curl -X POST http://localhost:8181/api/seed

# Clean build artifacts
clean:
	mvn -f backend/pom.xml clean
	rm -rf frontend/build frontend/node_modules/.cache
