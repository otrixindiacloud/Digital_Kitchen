#!/bin/bash

echo "🚀 Digital Kitchen PostgreSQL Integration Test"
echo "=============================================="
echo ""

BASE_URL="http://localhost:5000"
TIMEOUT=5

# Function to test an endpoint
test_endpoint() {
    local endpoint=$1
    local description=$2
    echo -n "Testing $description... "
    
    if timeout $TIMEOUT curl -s -f "$BASE_URL$endpoint" > /dev/null 2>&1; then
        echo "✅ SUCCESS"
        return 0
    else
        echo "❌ FAILED"
        return 1
    fi
}

# Test basic connectivity
echo "🔗 Testing Basic Connectivity"
echo "-----------------------------"
test_endpoint "/api/categories" "Categories API"
test_endpoint "/api/staff" "Staff API"
test_endpoint "/api/menu/items" "Menu Items API"
test_endpoint "/api/inventory" "Inventory API"
test_endpoint "/api/tables" "Tables API"
test_endpoint "/api/shifts" "Shifts API"
test_endpoint "/api/settings" "Settings API"
test_endpoint "/api/settlements" "Settlements API"

echo ""
echo "📊 Testing Reports Endpoints"
echo "----------------------------"
test_endpoint "/api/reports/sales" "Sales Reports"
test_endpoint "/api/reports/time-series" "Time Series Reports"
test_endpoint "/api/reports/categories" "Category Reports"

echo ""
echo "🔧 Testing Admin Features"
echo "-------------------------"
test_endpoint "/api/admin/verify" "Admin Verification"

echo ""
echo "📋 Testing Data Retrieval"
echo "-------------------------"

# Test data retrieval with actual content
echo -n "Categories data: "
CATEGORIES=$(timeout $TIMEOUT curl -s "$BASE_URL/api/categories" 2>/dev/null)
if [ -n "$CATEGORIES" ] && [ "$CATEGORIES" != "null" ]; then
    echo "✅ Data retrieved ($(echo "$CATEGORIES" | wc -c) bytes)"
else
    echo "❌ No data or failed"
fi

echo -n "Staff data: "
STAFF=$(timeout $TIMEOUT curl -s "$BASE_URL/api/staff" 2>/dev/null)
if [ -n "$STAFF" ] && [ "$STAFF" != "null" ]; then
    echo "✅ Data retrieved ($(echo "$STAFF" | wc -c) bytes)"
else
    echo "❌ No data or failed"
fi

echo ""
echo "🗄️ Database Connection Test Complete!"
echo "======================================"

# Show server status
echo ""
echo "📡 Server Status:"
if pgrep -f "tsx server/index.ts" > /dev/null; then
    echo "✅ Server is running (PID: $(pgrep -f 'tsx server/index.ts'))"
else
    echo "❌ Server not found"
fi

# Test if we can connect to the server at all
echo ""
echo "🌐 Network Connectivity:"
if timeout 2 nc -z localhost 5000 2>/dev/null; then
    echo "✅ Port 5000 is accessible"
else
    echo "❌ Cannot connect to port 5000"
fi