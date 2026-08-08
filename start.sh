#!/usr/bin/env bash

set -euo pipefail

project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
backend_dir="$project_root/backend"
frontend_dir="$project_root/frontend"

if [[ ! -x "$backend_dir/.venv/bin/uvicorn" ]]; then
  echo "Backend dependencies are missing. Run the setup commands in README.md first." >&2
  exit 1
fi

if [[ ! -x "$frontend_dir/node_modules/.bin/vite" ]]; then
  echo "Frontend dependencies are missing. Run 'npm install' in frontend/ first." >&2
  exit 1
fi

# Keep the one-command local launch independent of Docker. An explicitly supplied
# DATABASE_URL still takes precedence when PostgreSQL or another database is wanted.
export DATABASE_URL="${DATABASE_URL:-sqlite:///$backend_dir/surgimap.db}"

cleanup() {
  trap - INT TERM EXIT
  kill "${backend_pid:-}" "${frontend_pid:-}" 2>/dev/null || true
  wait "${backend_pid:-}" "${frontend_pid:-}" 2>/dev/null || true
}
trap cleanup INT TERM EXIT

(
  cd "$backend_dir"
  exec .venv/bin/uvicorn app.main:app --reload
) &
backend_pid=$!

(
  cd "$frontend_dir"
  exec npm run dev
) &
frontend_pid=$!

echo "SurgiMap backend:  http://127.0.0.1:8000"
echo "SurgiMap frontend: http://localhost:5173"
echo "Press Ctrl+C to stop both servers."

wait "$backend_pid" "$frontend_pid"
