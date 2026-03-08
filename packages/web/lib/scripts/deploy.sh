#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
ROOT_DIR="$(cd "$DIR/../.." && pwd)"
cd "$ROOT_DIR"
set -e

source ~/.profile || true
source ~/.bashrc || true
export PATH="/root/.bun/bin:$PATH"

echo "[1] Loading environment..."

echo "[2] Pulling latest code..."
git pull origin main

echo "[3] Installing dependencies..."
bun install

echo "[5] Building project... (optionally for static builds)"
bun run build

echo "[6] Starting PM2 process..."
pm2 restart verity-web || pm2 start bun --name verity-web -- run start

echo "Saving PM2 process list..."
pm2 save

echo "🚀 Server deployed successfully!"
