#!/bin/bash

echo "=== VERIFYING ALL CHANGES ==="
echo ""

echo "1. Checking maps.service.js for status filter..."
if grep -q "status: 'active'" services/maps.service.js; then
    echo "   ✓ Status filter present"
else
    echo "   ❌ MISSING: status: 'active' filter"
fi

echo ""
echo "2. Checking captain.model.js for geospatial index..."
if grep -q "captainSchema.index({ location: '2dsphere' })" models/captain.model.js; then
    echo "   ✓ Geospatial index present"
else
    echo "   ❌ MISSING: location 2dsphere index"
fi

echo ""
echo "3. Checking socket.js for status update on join..."
if grep -q "status: 'active'" socket.js; then
    echo "   ✓ Status update on join present"
else
    echo "   ❌ MISSING: status update in join event"
fi

echo ""
echo "4. Checking ride.controller.js for logging..."
if grep -q "Found.*active captains" controllers/ride.controller.js; then
    echo "   ✓ Logging present"
else
    echo "   ❌ MISSING: captain count logging"
fi

echo ""
echo "5. Checking captain.service.js for location initialization..."
if grep -q "coordinates: \[0, 0\]" services/captain.service.js; then
    echo "   ✓ Location initialization present"
else
    echo "   ❌ MISSING: default coordinates"
fi

echo ""
echo "=== CHANGES VERIFICATION COMPLETE ==="
