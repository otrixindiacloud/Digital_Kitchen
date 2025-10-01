#!/bin/bash

echo "Testing Inventory Creation Fix"
echo "=============================="

# Test the fixed inventory creation
echo "Testing inventory creation with correct string values..."
RESPONSE=$(curl -s -X POST http://localhost:5000/api/inventory \
  -H "Content-Type: application/json" \
  -d '{
    "name": {"en": "Test Fix Item", "ar": "عنصر إصلاح اختبار"},
    "unit": "kilogram", 
    "currentStock": "100",
    "minStock": "20",
    "cost": "15.75",
    "isActive": true
  }')

if echo "$RESPONSE" | grep -q '"id"'; then
  echo "✅ SUCCESS: Inventory item created successfully"
  echo "Response: $RESPONSE"
else
  echo "❌ FAILED: $RESPONSE"
fi

echo ""
echo "Testing inventory list retrieval..."
curl -s http://localhost:5000/api/inventory | jq '.[0:2]' 2>/dev/null || echo "No jq installed, showing raw response:"
curl -s http://localhost:5000/api/inventory 2>/dev/null

echo ""
echo "Fix verification complete!"