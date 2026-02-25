#!/bin/bash
clear;

echo "🔍 Installing project dependencies..."
bun install
echo

echo "🔍 Linting and formatting code..."
bun run check
echo

echo "🔍 Building project..."
bun run build
echo

echo "⚡ Spinning up production server..."
bun run start
echo

echo "✅ Deployment completed successfully!"