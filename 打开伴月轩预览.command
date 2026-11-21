#!/bin/zsh
cd "${0:A:h}"
if curl -fsS http://localhost:8793/api/catalog 2>/dev/null | /usr/bin/grep -q 'catalog'; then
  open 'http://localhost:8793/preview/'
else
  node server/index.cjs &
  byx_preview_pid=$!
  trap 'kill "$byx_preview_pid" 2>/dev/null' EXIT
  sleep 1
  open 'http://localhost:8793/preview/'
  wait "$byx_preview_pid"
fi
