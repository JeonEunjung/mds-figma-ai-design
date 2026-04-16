#!/bin/bash
# MOIN AI Design 서버 — 자동 업데이트 & 재시작
cd "$(dirname "$0")"
while true; do
  echo "[$(date)] 서버 시작..."
  node server.js
  echo "[$(date)] 서버 종료됨. 2초 후 재시작..."
  sleep 2
done
