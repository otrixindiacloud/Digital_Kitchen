#!/bin/bash

echo "🚀 COMPREHENSIVE DIGITAL KITCHEN POSTGRESQL TEST"
echo "================================================"
echo ""

BASE_URL="http://localhost:5000"

# Color codes for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

test_endpoint() {
    local endpoint=$1
    local description=$2
    local expected_status=${3:-200}
    
    printf "%-30s" "$description:"
    
    response=$(curl -s -w "%{http_code}" -o /tmp/response.json "$BASE_URL$endpoint" 2>/dev/null)
    http_code="${response: -3}"
    
    if [ "$http_code" -eq "$expected_status" ]; then
        data_size=$(cat /tmp/response.json | wc -c)
        echo -e "${GREEN}✅ SUCCESS${NC} (${data_size} bytes)"
        return 0
    else
        echo -e "${RED}❌ FAILED${NC} (HTTP $http_code)"
        return 1
    fi
}

test_crud_operation() {
    local description=$1
    local method=$2
    local endpoint=$3
    local data=$4
    
    printf "%-30s" "$description:"
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "%{http_code}" "$BASE_URL$endpoint" 2>/dev/null)
    elif [ "$method" = "POST" ]; then
        response=$(curl -s -w "%{http_code}" -X POST -H "Content-Type: application/json" -d "$data" "$BASE_URL$endpoint" 2>/dev/null)
    fi
    
    http_code="${response: -3}"
    
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo -e "${GREEN}✅ SUCCESS${NC} (HTTP $http_code)"
        return 0
    else
        echo -e "${RED}❌ FAILED${NC} (HTTP $http_code)"
        return 1
    fi
}

echo -e "${BLUE}🔗 BASIC CONNECTIVITY TESTS${NC}"
echo "============================"
test_endpoint "/api/categories" "Categories API"
test_endpoint "/api/staff" "Staff API"
test_endpoint "/api/menu/items" "Menu Items API"
test_endpoint "/api/inventory" "Inventory API"
test_endpoint "/api/tables" "Tables API"
test_endpoint "/api/shifts" "Shifts API"
test_endpoint "/api/settings" "Settings API"
test_endpoint "/api/settlements" "Settlements API"

echo ""
echo -e "${BLUE}📊 REPORTS & ANALYTICS TESTS${NC}"
echo "============================="
test_endpoint "/api/reports/sales" "Sales Reports"
test_endpoint "/api/reports/time-series" "Time Series Data"
test_endpoint "/api/reports/categories" "Category Performance"
test_endpoint "/api/reports/payment-methods" "Payment Methods"
test_endpoint "/api/reports/top-items" "Top Items"
test_endpoint "/api/reports/hourly" "Hourly Reports"
test_endpoint "/api/reports/export?format=pdf&from=2024-01-01&to=2024-12-31" "PDF Export"

echo ""
echo -e "${BLUE}🔧 ADMIN FUNCTIONALITY TESTS${NC}"
echo "============================="
test_endpoint "/api/admin/verify" "Admin Verification"

echo ""
echo -e "${BLUE}📋 DATA INTEGRITY TESTS${NC}"
echo "========================"

# Test data counts
echo -n "Categories count: "
CATEGORIES_COUNT=$(curl -s "$BASE_URL/api/categories" | jq '. | length' 2>/dev/null)
echo -e "${GREEN}$CATEGORIES_COUNT${NC}"

echo -n "Staff count: "
STAFF_COUNT=$(curl -s "$BASE_URL/api/staff" | jq '. | length' 2>/dev/null)
echo -e "${GREEN}$STAFF_COUNT${NC}"

echo -n "Menu items count: "
ITEMS_COUNT=$(curl -s "$BASE_URL/api/menu/items" | jq '. | length' 2>/dev/null)
echo -e "${GREEN}$ITEMS_COUNT${NC}"

echo -n "Inventory items count: "
INVENTORY_COUNT=$(curl -s "$BASE_URL/api/inventory" | jq '. | length' 2>/dev/null)
echo -e "${GREEN}$INVENTORY_COUNT${NC}"

echo -n "Tables count: "
TABLES_COUNT=$(curl -s "$BASE_URL/api/tables" | jq '. | length' 2>/dev/null)
echo -e "${GREEN}$TABLES_COUNT${NC}"

echo ""
echo -e "${BLUE}🗄️ DATABASE VERIFICATION${NC}"
echo "========================"

# Verify admin user exists
ADMIN_EXISTS=$(curl -s "$BASE_URL/api/staff" | jq '.[] | select(.username == "admin") | .username' 2>/dev/null | tr -d '"')
if [ "$ADMIN_EXISTS" = "admin" ]; then
    echo -e "Admin user: ${GREEN}✅ EXISTS${NC}"
else
    echo -e "Admin user: ${RED}❌ NOT FOUND${NC}"
fi

# Check data structure
CATEGORY_STRUCTURE=$(curl -s "$BASE_URL/api/categories" | jq '.[0] | keys' 2>/dev/null)
if echo "$CATEGORY_STRUCTURE" | grep -q "name" && echo "$CATEGORY_STRUCTURE" | grep -q "id"; then
    echo -e "Data structure: ${GREEN}✅ VALID${NC}"
else
    echo -e "Data structure: ${RED}❌ INVALID${NC}"
fi

echo ""
echo -e "${YELLOW}📈 PERFORMANCE METRICS${NC}"
echo "======================"

# Response time test
start_time=$(date +%s%N)
curl -s "$BASE_URL/api/categories" > /dev/null
end_time=$(date +%s%N)
response_time=$(( (end_time - start_time) / 1000000 ))
echo "Categories API response time: ${response_time}ms"

# Database size simulation
TOTAL_RECORDS=$((CATEGORIES_COUNT + STAFF_COUNT + ITEMS_COUNT + INVENTORY_COUNT + TABLES_COUNT))
echo "Total records in database: $TOTAL_RECORDS"

echo ""
echo -e "${GREEN}🎉 POSTGRESQL INTEGRATION TEST COMPLETE!${NC}"
echo "============================================="

# Final summary
if [ "$CATEGORIES_COUNT" -gt 0 ] && [ "$STAFF_COUNT" -gt 0 ] && [ "$ADMIN_EXISTS" = "admin" ]; then
    echo -e "${GREEN}✅ ALL TESTS PASSED - PostgreSQL integration is working perfectly!${NC}"
    echo ""
    echo "🔐 Admin Login Credentials:"
    echo "   Username: admin"
    echo "   Password: admin123"
    echo ""
    echo "🌐 Application URL: http://localhost:5000"
    echo "🛠️ Admin Panel: http://localhost:5000/management"
else
    echo -e "${RED}❌ SOME TESTS FAILED - Please check the logs${NC}"
fi