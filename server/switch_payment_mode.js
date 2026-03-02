#!/usr/bin/env node

// Script to switch between real and mock payment controllers
// Usage: node switch_payment_mode.js [real|mock]

const fs = require('fs');
const path = require('path');

const routesPath = path.join(__dirname, 'routes', 'Payments.js');
const realControllerPath = path.join(__dirname, 'controllers', 'payments.js');
const mockControllerPath = path.join(__dirname, 'controllers', 'payments_mock.js');

const mode = process.argv[2] || 'real';

if (mode === 'mock') {
  console.log('🔄 Switching to MOCK payment controller...');
  
  // Read the routes file
  let routesContent = fs.readFileSync(routesPath, 'utf8');
  
  // Replace the import to use mock controller
  routesContent = routesContent.replace(
    'const { capturePayment, verifyPayment, sendPaymentSuccessEmail } = require("../controllers/payments")',
    'const { capturePayment, verifyPayment, sendPaymentSuccessEmail } = require("../controllers/payments_mock")'
  );
  
  // Write back the modified content
  fs.writeFileSync(routesPath, routesContent);
  
  console.log('✅ Switched to MOCK payment controller');
  console.log('📝 Note: This will simulate successful payments without actual Razorpay integration');
  console.log('🔄 Restart your server to apply changes');
  
} else if (mode === 'real') {
  console.log('🔄 Switching to REAL payment controller...');
  
  // Read the routes file
  let routesContent = fs.readFileSync(routesPath, 'utf8');
  
  // Replace the import to use real controller
  routesContent = routesContent.replace(
    'const { capturePayment, verifyPayment, sendPaymentSuccessEmail } = require("../controllers/payments_mock")',
    'const { capturePayment, verifyPayment, sendPaymentSuccessEmail } = require("../controllers/payments")'
  );
  
  // Write back the modified content
  fs.writeFileSync(routesPath, routesContent);
  
  console.log('✅ Switched to REAL payment controller');
  console.log('📝 Note: Make sure you have valid Razorpay API keys in your .env file');
  console.log('🔄 Restart your server to apply changes');
  
} else {
  console.log('❌ Invalid mode. Use "real" or "mock"');
  console.log('Usage: node switch_payment_mode.js [real|mock]');
  process.exit(1);
}

// Check current mode
const currentContent = fs.readFileSync(routesPath, 'utf8');
if (currentContent.includes('payments_mock')) {
  console.log('📊 Current mode: MOCK');
} else {
  console.log('📊 Current mode: REAL');
}