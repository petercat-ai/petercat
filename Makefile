test:
	pytest backend/tests

dev:
	docker compose -f docker/docker-compose.dev.yml build backend-core
	docker compose -f docker/docker-compose.dev.yml up --build -d

dev-ps:
	docker compose -f docker/docker-compose.dev.yml ps

dev-init:
	rm -rf docker/volumes/db/data 
	docker compose -f docker/docker-compose.dev.yml build backend-core
	docker compose -f docker/docker-compose.dev.yml up --build

prod:
	docker compose build backend-core
	docker compose -f docker-compose.yml up --build

test-type:
	@if command -v python3 &>/dev/null; then \
		python3 -m pyright; \
	else \
		python -m pyright; \
	fi
