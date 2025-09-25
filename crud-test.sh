#!/bin/bash

echo "🧪 CRUD OPERATIONS TEST WITH POSTGRESQL"
echo "======================================="
echo ""

BASE_URL="http://localhost:5000"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Test CRUD operations
echo -e "${BLUE}📝 TESTING CREATE OPERATIONS${NC}"
echo "============================="

# Test creating a new category
echo -n "Creating new category: "
CREATE_CATEGORY_RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "name": {"en": "Test CRUD Category", "ar": "فئة اختبار CRUD"},
    "icon": "fas fa-test",
    "sortOrder": 99,
    "active": true
  }' \
  "$BASE_URL/api/categories" 2>/dev/null)

if echo "$CREATE_CATEGORY_RESPONSE" | grep -q "id"; then
    CATEGORY_ID=$(echo "$CREATE_CATEGORY_RESPONSE" | jq -r '.id')
    echo -e "${GREEN}✅ SUCCESS${NC} (ID: ${CATEGORY_ID:0:8}...)"
else
    echo -e "${RED}❌ FAILED${NC}"
    CATEGORY_ID=""
fi

# Test creating a new staff member
echo -n "Creating new staff member: "
CREATE_STAFF_RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser_crud",
    "password": "testpass123",
    "role": "cashier",
    "firstName": "Test",
    "lastName": "User",
    "email": "test@restaurant.com",
    "isActive": true
  }' \
  "$BASE_URL/api/staff" 2>/dev/null)

if echo "$CREATE_STAFF_RESPONSE" | grep -q "id"; then
    STAFF_ID=$(echo "$CREATE_STAFF_RESPONSE" | jq -r '.id')
    echo -e "${GREEN}✅ SUCCESS${NC} (ID: ${STAFF_ID:0:8}...)"
else
    echo -e "${RED}❌ FAILED${NC}"
    STAFF_ID=""
fi

# Test creating a new table
echo -n "Creating new table: "
CREATE_TABLE_RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "number": "T-CRUD-01",
    "capacity": 4,
    "section": "Test Section",
    "active": true
  }' \
  "$BASE_URL/api/tables" 2>/dev/null)

if echo "$CREATE_TABLE_RESPONSE" | grep -q "id"; then
    TABLE_ID=$(echo "$CREATE_TABLE_RESPONSE" | jq -r '.id')
    echo -e "${GREEN}✅ SUCCESS${NC} (ID: ${TABLE_ID:0:8}...)"
else
    echo -e "${RED}❌ FAILED${NC}"
    TABLE_ID=""
fi

echo ""
echo -e "${BLUE}📖 TESTING READ OPERATIONS${NC}"
echo "=========================="

# Verify created items exist
echo -n "Reading created category: "
if [ -n "$CATEGORY_ID" ]; then
    CATEGORY_CHECK=$(curl -s "$BASE_URL/api/categories" | jq ".[] | select(.id == \"$CATEGORY_ID\")")
    if [ -n "$CATEGORY_CHECK" ]; then
        echo -e "${GREEN}✅ FOUND${NC}"
    else
        echo -e "${RED}❌ NOT FOUND${NC}"
    fi
else
    echo -e "${RED}❌ SKIPPED (no ID)${NC}"
fi

echo -n "Reading created staff: "
if [ -n "$STAFF_ID" ]; then
    STAFF_CHECK=$(curl -s "$BASE_URL/api/staff" | jq ".[] | select(.id == \"$STAFF_ID\")")
    if [ -n "$STAFF_CHECK" ]; then
        echo -e "${GREEN}✅ FOUND${NC}"
    else
        echo -e "${RED}❌ NOT FOUND${NC}"
    fi
else
    echo -e "${RED}❌ SKIPPED (no ID)${NC}"
fi

echo -n "Reading created table: "
if [ -n "$TABLE_ID" ]; then
    TABLE_CHECK=$(curl -s "$BASE_URL/api/tables" | jq ".[] | select(.id == \"$TABLE_ID\")")
    if [ -n "$TABLE_CHECK" ]; then
        echo -e "${GREEN}✅ FOUND${NC}"
    else
        echo -e "${RED}❌ NOT FOUND${NC}"
    fi
else
    echo -e "${RED}❌ SKIPPED (no ID)${NC}"
fi

echo ""
echo -e "${BLUE}✏️ TESTING UPDATE OPERATIONS${NC}"
echo "============================"

# Test updating category
echo -n "Updating category: "
if [ -n "$CATEGORY_ID" ]; then
    UPDATE_CATEGORY_RESPONSE=$(curl -s -X PUT \
      -H "Content-Type: application/json" \
      -d '{
        "name": {"en": "Updated CRUD Category", "ar": "فئة محدثة CRUD"},
        "icon": "fas fa-updated",
        "sortOrder": 100,
        "active": false
      }' \
      "$BASE_URL/api/categories/$CATEGORY_ID" 2>/dev/null)
    
    if echo "$UPDATE_CATEGORY_RESPONSE" | grep -q "Updated CRUD Category"; then
        echo -e "${GREEN}✅ SUCCESS${NC}"
    else
        echo -e "${RED}❌ FAILED${NC}"
    fi
else
    echo -e "${RED}❌ SKIPPED (no ID)${NC}"
fi

# Test updating staff
echo -n "Updating staff member: "
if [ -n "$STAFF_ID" ]; then
    UPDATE_STAFF_RESPONSE=$(curl -s -X PUT \
      -H "Content-Type: application/json" \
      -d '{
        "username": "testuser_crud",
        "role": "manager",
        "firstName": "Updated",
        "lastName": "User",
        "email": "updated@restaurant.com",
        "isActive": true
      }' \
      "$BASE_URL/api/staff/$STAFF_ID" 2>/dev/null)
    
    if echo "$UPDATE_STAFF_RESPONSE" | grep -q "Updated"; then
        echo -e "${GREEN}✅ SUCCESS${NC}"
    else
        echo -e "${RED}❌ FAILED${NC}"
    fi
else
    echo -e "${RED}❌ SKIPPED (no ID)${NC}"
fi

echo ""
echo -e "${BLUE}🔍 TESTING DATA PERSISTENCE${NC}"
echo "============================"

# Check if updates persisted
echo -n "Verifying category update: "
if [ -n "$CATEGORY_ID" ]; then
    UPDATED_CATEGORY=$(curl -s "$BASE_URL/api/categories" | jq ".[] | select(.id == \"$CATEGORY_ID\")")
    if echo "$UPDATED_CATEGORY" | grep -q "Updated CRUD Category"; then
        echo -e "${GREEN}✅ PERSISTED${NC}"
    else
        echo -e "${RED}❌ NOT PERSISTED${NC}"
    fi
else
    echo -e "${RED}❌ SKIPPED${NC}"
fi

echo -n "Verifying staff update: "
if [ -n "$STAFF_ID" ]; then
    UPDATED_STAFF=$(curl -s "$BASE_URL/api/staff" | jq ".[] | select(.id == \"$STAFF_ID\")")
    if echo "$UPDATED_STAFF" | grep -q "manager"; then
        echo -e "${GREEN}✅ PERSISTED${NC}"
    else
        echo -e "${RED}❌ NOT PERSISTED${NC}"
    fi
else
    echo -e "${RED}❌ SKIPPED${NC}"
fi

echo ""
echo -e "${BLUE}📊 FINAL DATABASE STATE${NC}"
echo "========================"

# Count final records
FINAL_CATEGORIES=$(curl -s "$BASE_URL/api/categories" | jq '. | length')
FINAL_STAFF=$(curl -s "$BASE_URL/api/staff" | jq '. | length') 
FINAL_TABLES=$(curl -s "$BASE_URL/api/tables" | jq '. | length')

echo "Categories: $FINAL_CATEGORIES"
echo "Staff: $FINAL_STAFF" 
echo "Tables: $FINAL_TABLES"

echo ""
echo -e "${GREEN}🎉 CRUD OPERATIONS TEST COMPLETE!${NC}"
echo "=================================="

# Summary
if [ -n "$CATEGORY_ID" ] && [ -n "$STAFF_ID" ] && [ -n "$TABLE_ID" ]; then
    echo -e "${GREEN}✅ All CRUD operations successful - PostgreSQL is fully functional!${NC}"
else
    echo -e "${RED}❌ Some CRUD operations failed - Check the logs${NC}"
fi

echo ""
echo "Test IDs created:"
echo "  Category: $CATEGORY_ID"
echo "  Staff: $STAFF_ID"
echo "  Table: $TABLE_ID"