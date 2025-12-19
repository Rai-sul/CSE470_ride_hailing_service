#!/bin/bash

echo "========================================="
echo "  FRONTEND CODE VERIFICATION"
echo "========================================="
echo ""

# 1. Check CaptainHome.jsx - Socket listener
echo "1. CaptainHome.jsx - Socket Listener Setup:"
echo "   Looking for socket.on('new-ride') inside useEffect..."
if grep -A3 "socket.on('new-ride'" src/pages/CaptainHome.jsx | grep -q "useEffect"; then
    echo "   ❌ Socket listener OUTSIDE useEffect (BAD)"
else
    # Check if it's inside useEffect
    if grep -B10 "socket.on('new-ride'" src/pages/CaptainHome.jsx | grep -q "useEffect"; then
        echo "   ✅ Socket listener INSIDE useEffect (GOOD)"
    else
        echo "   ⚠️  Cannot determine location"
    fi
fi

echo ""
echo "2. CaptainHome.jsx - Cleanup Function:"
if grep -q "socket.off('new-ride')" src/pages/CaptainHome.jsx; then
    echo "   ✅ Cleanup present (socket.off)"
else
    echo "   ❌ Missing cleanup"
fi

echo ""
echo "3. CaptainHome.jsx - Console Logging:"
if grep -q "console.log('New ride received" src/pages/CaptainHome.jsx; then
    echo "   ✅ Debug logging present"
else
    echo "   ❌ Missing debug logging"
fi

echo ""
echo "4. SocketContext.jsx - Socket Connection:"
SOCKET_URL=$(grep "VITE_BASE_URL" src/context/SocketContext.jsx 2>/dev/null || grep "io(" src/context/SocketContext.jsx)
echo "   Socket URL: $SOCKET_URL"

echo ""
echo "5. Environment Variables:"
if [ -f .env ]; then
    echo "   ✅ .env file exists"
    echo "   VITE_BASE_URL: $(grep VITE_BASE_URL .env)"
else
    echo "   ❌ .env file missing!"
fi

echo ""
echo "========================================="
