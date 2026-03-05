#!/bin/bash
clear;

echo "🔍 Installing project dependencies..."
bun i
echo

echo "🔍 Linting and formatting code..."
bun check
echo

echo "🔍 Building project..."
bun run build
echo

echo "⚡ Spinning up production server..."
bun start
echo

echo "✅ Deployment completed successfully!"