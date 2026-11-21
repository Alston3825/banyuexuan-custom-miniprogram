#!/bin/zsh
cd "${0:A:h}"
if curl -fsS http://localhost:8793/api/catalog 2>/dev/null | /usr/bin/grep -q 'catalog'; then
  open 'http://localhost:8793/admin/'
  open -t 'server/data/管理员登录.txt'
else
  node server/index.cjs &
  byx_backend_pid=$!
  trap 'kill "$byx_backend_pid" 2>/dev/null' EXIT
  sleep 1
  open 'http://localhost:8793/admin/'
  open -t 'server/data/管理员登录.txt'
  wait "$byx_backend_pid"
fi
