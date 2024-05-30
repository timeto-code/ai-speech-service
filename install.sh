#!/bin/bash
# 进入脚本所在目录
cd "$(dirname "$0")"

echo "Installing dependencies..."
npm install --omit=dev

echo "Initializing sqlite3..."
sleep 3
npx prisma generate

echo "Starting the app..."
sleep 3
./run.sh

read -p "Press any key to exit..." -n1 -s
echo
