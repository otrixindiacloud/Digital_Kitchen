#!/bin/bash

echo "Testing Digital Kitchen Admin Panel Functionality"
echo "================================================"

# Test basic endpoint availability
echo "1. Testing basic endpoints..."

ENDPOINTS=(
  "/api/staff"
  "/api/categories" 
  "/api/menu/items"
  "/api/inventory"
  "/api/tables"
  "/api/shifts"
  "/api/settings"
  "/api/settlements"
  "/api/reports/sales"
  "/api/admin/verify"
)

for endpoint in "${ENDPOINTS[@]}"; do
  echo -n "  Testing $endpoint... "
  if curl -s -f "http://localhost:5000$endpoint" > /dev/null; then
    echo "✅ OK"
  else
    echo "❌ FAILED"
  fi
done

echo ""
echo "2. Testing admin verification endpoint..."
curl -s "http://localhost:5000/api/admin/verify" | head -10

echo ""
echo "Admin panel functionality verification complete!"