#!/bin/bash

echo "🔄 RESTARTING BACKEND..."
echo ""

# Kill all node server.js processes
echo "1. Killing old backend instances..."
pids=$(ps aux | grep "node server.js" | grep -v grep | awk '{print $2}')
if [ -n "$pids" ]; then
    for pid in $pids; do
        kill $pid 2>/dev/null && echo "   ✓ Killed process $pid"
    done
    sleep 2
else
    echo "   No running instances found"
fi

echo ""
echo "2. Starting fresh backend..."
echo "   Run this command manually:"
echo ""
echo "   node server.js"
echo ""
echo "3. After backend starts, open browser and:"
echo "   - Press Ctrl+Shift+R on captain page (hard refresh)"
echo "   - Login again as captain"
echo "   - Create a ride from user side"
echo ""
