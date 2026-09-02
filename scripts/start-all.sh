#!/usr/bin/env bash
set -e

OMNIROUTE_DIR="/Users/oluwatosinakanle/Code/OmniRoute"
FRONTEND_DIR="/Users/oluwatosinakanle/Code/LexNigerianaAI/frontend"
OMNIROUTE_PORT=20128
FRONTEND_PORT=3005

echo "=========================================================="
echo "    🚀 Starting LexNigeriana AI & OmniRoute Stack"
echo "=========================================================="

# Check if OmniRoute is running
if lsof -i :$OMNIROUTE_PORT > /dev/null 2>&1; then
    echo "✅ OmniRoute is already running on port $OMNIROUTE_PORT."
else
    echo "⏳ Starting OmniRoute superadmin backend on port $OMNIROUTE_PORT..."
    cd "$OMNIROUTE_DIR"
    npm run dev > /tmp/omniroute.log 2>&1 &
    sleep 3
    echo "✅ OmniRoute launched (logs at /tmp/omniroute.log)."
fi

echo ""
echo "⏳ Starting LexNigeriana AI Frontend on port $FRONTEND_PORT..."
cd "$FRONTEND_DIR"
npm run dev

