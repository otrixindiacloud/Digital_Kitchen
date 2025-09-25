#!/usr/bin/env node

import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testEndpoint(method, endpoint, data = null, description = '') {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      timeout: 5000
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    log(`✅ ${method.toUpperCase()} ${endpoint} - ${description} (${response.status})`, 'green');
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    const status = error.response?.status || 'ERR';
    const message = error.response?.data?.error || error.message;
    log(`❌ ${method.toUpperCase()} ${endpoint} - ${description} (${status}): ${message}`, 'red');
    return { success: false, error: message, status };
  }
}

async function runTests() {
  log('\n🧪 DIGITAL KITCHEN - COMPREHENSIVE FEATURE TESTING', 'cyan');
  log('='.repeat(60), 'cyan');

  // Test Authentication
  log('\n📋 AUTHENTICATION TESTS', 'blue');
  const loginResult = await testEndpoint('post', '/api/auth/login', {
    username: 'admin',
    password: 'admin123'
  }, 'Admin login');

  if (!loginResult.success) {
    log('❌ Authentication failed - skipping other tests', 'red');
    return;
  }

  // Test POS Core Features
  log('\n🛒 POS CORE FEATURES', 'blue');
  await testEndpoint('get', '/api/categories', null, 'Get categories');
  await testEndpoint('get', '/api/categories/afc43eea-b0c3-43d1-bb44-7c572d6d793f/items', null, 'Get category items');

  // Test Order Management
  log('\n📋 ORDER MANAGEMENT', 'blue');
  const orderResult = await testEndpoint('post', '/api/orders', {
    type: 'dine-in',
    source: 'pos',
    tableNumber: 5,
    subtotal: 25.00,
    total: 25.00
  }, 'Create order');

  if (orderResult.success) {
    const orderId = orderResult.data.id;
    
    await testEndpoint('post', `/api/orders/${orderId}/items`, {
      itemId: 'd08a36de-226d-4d8f-9120-0740cc7bc7bf',
      quantity: 2,
      unitPrice: 12.50,
      totalPrice: 25.00,
      itemName: { en: 'Test Item', ar: 'عنصر اختبار' }
    }, 'Add order item');

    await testEndpoint('post', `/api/orders/${orderId}/payment`, {
      method: 'cash',
      amount: 25.00
    }, 'Process payment');
  }

  // Test Management Features
  log('\n👥 STAFF MANAGEMENT', 'blue');
  await testEndpoint('get', '/api/users', null, 'Get all users');
  
  const newUser = await testEndpoint('post', '/api/users', {
    username: 'testuser',
    password: 'test123',
    role: 'cashier',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com'
  }, 'Create new user');

  if (newUser.success) {
    const userId = newUser.data.id;
    await testEndpoint('put', `/api/users/${userId}`, {
      firstName: 'Updated Test',
      lastName: 'User Updated'
    }, 'Update user');
  }

  // Test Menu Management
  log('\n🍽️ MENU MANAGEMENT', 'blue');
  await testEndpoint('get', '/api/menu/items', null, 'Get all menu items');
  
  const newCategory = await testEndpoint('post', '/api/categories', {
    name: { en: 'Test Category', ar: 'فئة اختبار' },
    icon: 'test-icon'
  }, 'Create category');

  if (newCategory.success) {
    await testEndpoint('post', '/api/menu/items', {
      categoryId: newCategory.data.id,
      name: { en: 'Test Item', ar: 'عنصر اختبار' },
      basePrice: 10.00,
      description: { en: 'Test description', ar: 'وصف اختبار' }
    }, 'Create menu item');
  }

  // Test Inventory Management
  log('\n📦 INVENTORY MANAGEMENT', 'blue');
  await testEndpoint('get', '/api/inventory', null, 'Get inventory');
  await testEndpoint('get', '/api/inventory/movements', null, 'Get inventory movements');
  
  await testEndpoint('post', '/api/inventory', {
    name: 'Test Ingredient',
    unit: 'kg',
    currentStock: 100,
    minimumStock: 10,
    maximumStock: 500,
    costPerUnit: 5.00
  }, 'Create inventory item');

  // Test Table Management
  log('\n🪑 TABLE MANAGEMENT', 'blue');
  await testEndpoint('get', '/api/tables', null, 'Get tables');
  await testEndpoint('get', '/api/tables/orders', null, 'Get table orders');
  
  await testEndpoint('post', '/api/tables', {
    number: 99,
    capacity: 4,
    section: 'test'
  }, 'Create table');

  // Test Shift Management
  log('\n⏰ SHIFT MANAGEMENT', 'blue');
  await testEndpoint('get', '/api/shifts', null, 'Get shifts');
  await testEndpoint('get', '/api/shifts/current', null, 'Get current shift');
  
  const shiftResult = await testEndpoint('post', '/api/shifts', {
    userId: loginResult.data.id,
    startingCash: 100.00
  }, 'Start shift');

  if (shiftResult.success) {
    await testEndpoint('put', `/api/shifts/${shiftResult.data.id}/end`, {
      closingCash: 150.00,
      notes: 'Test shift completed'
    }, 'End shift');
  }

  // Test Settlement & Payments
  log('\n💳 SETTLEMENT & PAYMENTS', 'blue');
  await testEndpoint('get', '/api/settlements', null, 'Get settlements');
  await testEndpoint('get', '/api/delivery/summary', null, 'Get delivery summary');
  
  await testEndpoint('post', '/api/settlements', {
    provider: 'Talabat',
    amount: 500.00,
    period: '2024-01',
    orders: 25
  }, 'Create settlement');

  // Test Settings
  log('\n⚙️ SETTINGS MANAGEMENT', 'blue');
  await testEndpoint('get', '/api/settings', null, 'Get settings');
  await testEndpoint('put', '/api/settings', {
    storeName: 'Updated Test Store',
    currency: 'QAR'
  }, 'Update settings');

  // Test Reports & Analytics
  log('\n📊 REPORTS & ANALYTICS', 'blue');
  const today = new Date().toISOString().split('T')[0];
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  await testEndpoint('get', `/api/reports/sales?from=${weekAgo}&to=${today}&comparison=previous_period`, null, 'Sales report');
  await testEndpoint('get', `/api/reports/time-series?from=${weekAgo}&to=${today}`, null, 'Time series report');
  await testEndpoint('get', `/api/reports/categories?from=${weekAgo}&to=${today}`, null, 'Category performance');
  await testEndpoint('get', `/api/reports/payment-methods?from=${weekAgo}&to=${today}`, null, 'Payment methods report');
  await testEndpoint('get', `/api/reports/top-items?from=${weekAgo}&to=${today}&limit=10`, null, 'Top items report');
  await testEndpoint('get', `/api/reports/hourly?from=${weekAgo}&to=${today}`, null, 'Hourly report');

  log('\n🏁 TEST SUMMARY', 'cyan');
  log('='.repeat(60), 'cyan');
  log('✅ All major restaurant features have been tested!', 'green');
  log('🎯 Features tested: Authentication, POS, Orders, Staff, Menu, Inventory, Tables, Shifts, Settlements, Settings, Reports', 'yellow');
  log('📱 You can now test the UI features in the browser at http://localhost:5000', 'blue');
}

// Run tests
runTests().catch(console.error);
