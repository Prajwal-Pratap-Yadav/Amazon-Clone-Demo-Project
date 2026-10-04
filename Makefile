.PHONY: setup setup-ci setup-dev lint format typecheck test test-e2e run build reproduce docs security clean
OUTPUT ?= reports/local/reproduced
setup:
	npm ci --omit=dev --ignore-scripts
setup-ci:
	npm ci --ignore-scripts
setup-dev: setup-ci
	npx playwright install --with-deps chromium --no-shell
	python scripts/install_gitleaks.py
	python scripts/install_hooks.py
lint:
	npm run lint
format:
	npm run format
typecheck:
	npm run typecheck
test:
	npm test
test-e2e: build
	npm run test:e2e
run:
	npm run dev
build:
	npm run build
reproduce: build
	node scripts/reproduce.mjs $(OUTPUT)
docs:
	python scripts/check_docs.py
security:
	python scripts/install_gitleaks.py
	.tools/gitleaks git --log-opts=--all --redact
	npm audit --audit-level=high
clean:
	python scripts/clean.py
