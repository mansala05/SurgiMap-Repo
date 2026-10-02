#!/usr/bin/env bash
set -euo pipefail
project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
backend_dir="$project_root/backend"
supported() {
  "$1" -c 'import sys; raise SystemExit(not ((3, 11) <= sys.version_info < (3, 14)))' >/dev/null 2>&1
}
python_bin="${SURGIMAP_PYTHON:-}"
if [[ -n "$python_bin" ]] && ! supported "$python_bin"; then
  echo "SURGIMAP_PYTHON must point to Python 3.11–3.13." >&2
  exit 1
fi
if [[ -z "$python_bin" ]]; then
  for candidate in "$backend_dir/.venv/bin/python" python3.12 python3.13 python3.11 python3 "$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3"; do
    if supported "$candidate"; then
      python_bin="$candidate"
      break
    fi
  done
fi
if [[ -z "$python_bin" ]]; then
  echo "Python 3.11–3.13 is required. Install Python 3.12, then rerun ./start.sh (or set SURGIMAP_PYTHON to its executable)." >&2
  exit 1
fi
if ! supported "$backend_dir/.venv/bin/python"; then
  if [[ -e "$backend_dir/.venv" ]]; then
    backup="$backend_dir/.venv.backup.$(date +%s).$$"
    echo "Preserving incompatible virtual environment at $backup"
    mv "$backend_dir/.venv" "$backup"
  fi
  "$python_bin" -m venv "$backend_dir/.venv"
fi
if ! cmp -s "$backend_dir/requirements.txt" "$backend_dir/.venv/.installed-requirements" || ! (cd "$backend_dir" && .venv/bin/python -c 'import app.main') >/dev/null 2>&1; then
  "$backend_dir/.venv/bin/python" -m pip install -r "$backend_dir/requirements.txt"
  (cd "$backend_dir" && .venv/bin/python -c 'import app.main')
  cp "$backend_dir/requirements.txt" "$backend_dir/.venv/.installed-requirements"
fi
