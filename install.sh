#!/bin/bash
# 进入脚本所在目录
cd "$(dirname "$0")"

echo "Installing dependencies..."
npm install --omit=dev

echo "Starting the app..."
./run.sh

read -p "Press any key to exit..." -n1 -s
echo
