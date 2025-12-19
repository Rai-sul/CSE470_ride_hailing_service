#!/bin/bash

echo "======================================"
echo "  VERIFYING ALL CODE CHANGES"
echo "======================================"
echo ""

# 1. Check maps.routes.js
echo "1. maps.routes.js - Validation length (should be min: 1)"
grep -n "isLength.*min:" routes/maps.routes.js | head -3

echo ""
echo "2. maps.service.js - Status filter"
grep -n "status: 'active'" services/maps.service.js

echo ""
echo "3. captain.model.js - Geospatial index"
grep -n "captainSchema.index.*2dsphere" models/captain.model.js

echo ""
echo "4. captain.service.js - Location initialization"
grep -n "coordinates: \[0, 0\]" services/captain.service.js

echo ""
echo "5. socket.js - Status update on join"
grep -n "status: 'active'" socket.js

echo ""
echo "6. socket.js - Enhanced logging"
grep -n "User joining - Type:" socket.js
grep -n "📤 Sending to socketId" socket.js

echo ""
echo "7. ride.controller.js - Logging"
grep -n "Found.*active captains" controllers/ride.controller.js

echo ""
echo "8. ride.controller.js - Auth check"
grep -n "if (!req.user)" controllers/ride.controller.js

echo ""
echo "======================================"
