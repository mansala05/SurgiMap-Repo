#!/usr/bin/env bash

set -euo pipefail

project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
backend_dir="$project_root/backend"
frontend_dir="$project_root/frontend"

"$project_root/scripts/setup-backend.sh"

if [[ ! -x "$frontend_dir/node_modules/.bin/vite" ]]; then
  echo "Frontend dependencies are missing. Run 'npm install' in frontend/ first." >&2
  exit 1
fi

# Keep the one-command local launch independent of Docker. An explicitly supplied
# DATABASE_URL still takes precedence when PostgreSQL or another database is wanted.
export DATABASE_URL="${DATABASE_URL:-sqlite:///$backend_dir/surgimap.db}"

cleanup() {
  trap - INT TERM EXIT
  kill "${backend_pid:-}" "${frontend_pid:-}" "${sync_pid:-}" 2>/dev/null || true
  wait "${backend_pid:-}" "${frontend_pid:-}" "${sync_pid:-}" 2>/dev/null || true
}
trap cleanup INT TERM EXIT

# Fail clearly if another checkout is already using either port.
"$backend_dir/.venv/bin/python" - <<'PYTHON'
import socket
for port in (8000, 5173):
    with socket.socket() as listener:
        listener.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        try:
            listener.bind(("localhost", port))
        except OSError as error:
            raise SystemExit(f"Port {port} is unavailable: {error}. Stop the existing service, then run ./start.sh again.")
PYTHON

(
  cd "$backend_dir"
  exec .venv/bin/python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
) &
backend_pid=$!

# Do not announce a working app or start sync until the API is healthy.
ready=false
for attempt in {1..60}; do
  if ! kill -0 "$backend_pid" 2>/dev/null; then
    echo "Backend exited during startup. See the error above." >&2
    exit 1
  fi
  if curl --fail --silent http://127.0.0.1:8000/health >/dev/null; then
    ready=true
    break
  fi
  sleep 1
done
if [[ "$ready" != true ]]; then
  echo "Backend did not become healthy on port 8000." >&2
  exit 1
fi

(
  cd "$frontend_dir"
  exec ./node_modules/.bin/vite --port 5173 --strictPort
) &
frontend_pid=$!

(
  cd "$backend_dir"
  exec .venv/bin/python -m scripts.sync_agent --watch
) &
sync_pid=$!

echo "SurgiMap backend:  http://127.0.0.1:8000"
echo "SurgiMap frontend: http://localhost:5173"
echo "Inventory sync:    automatic every ${SURGIMAP_SYNC_INTERVAL_SECONDS:-30} seconds"
echo "Press Ctrl+C to stop all services."

# If any service fails, stop the others instead of leaving a partial app running.
while kill -0 "$backend_pid" 2>/dev/null && kill -0 "$frontend_pid" 2>/dev/null && kill -0 "$sync_pid" 2>/dev/null; do
  sleep 1
done
echo "A SurgiMap service stopped. Shutting down the remaining services." >&2
exit 1
