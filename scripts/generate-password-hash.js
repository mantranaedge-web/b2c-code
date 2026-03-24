#!/usr/bin/env node

/**
 * Password Hash Generator for Admin Authentication
 * 
 * This script generates bcrypt password hashes for admin users.
 * Use this to create secure password hashes for production deployment.
 * 
 * Usage:
 *   node scripts/generate-password-hash.js
 */

const bcrypt = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n🔐 Admin Password Hash Generator');
console.log('================================\n');
console.log('This tool will help you generate a secure bcrypt hash for your admin password.\n');

rl.question('Enter the password you want to hash: ', async (password) => {
  if (!password || password.length < 8) {
    console.log('\n❌ Error: Password must be at least 8 characters long.');
    rl.close();
    return;
  }

  console.log('\n⏳ Generating hash (this may take a moment)...\n');

  try {
    // Generate salt and hash
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);

    console.log('✅ Password hash generated successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log('📋 Add these to your environment variables:\n');
    console.log('For Development (.env file):');
    console.log('─'.repeat(60));
    console.log(`ADMIN_PASSWORD=${password}`);
    console.log('\nFor Production (Vercel/Environment Variables):');
    console.log('─'.repeat(60));
    console.log(`ADMIN_PASSWORD_HASH=${hash}`);
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log('⚠️  IMPORTANT SECURITY NOTES:');
    console.log('  • Use ADMIN_PASSWORD_HASH in production (more secure)');
    console.log('  • Never commit passwords to Git');
    console.log('  • Store the plain password securely (password manager)');
    console.log('  • Consider using different passwords for dev/prod\n');
    
    console.log('🔍 Verification:');
    console.log('  You can verify this hash works by:');
    console.log('  1. Adding it to your .env file');
    console.log('  2. Restarting your dev server');
    console.log('  3. Logging in at /admin/login\n');

  } catch (error) {
    console.error('\n❌ Error generating hash:', error.message);
  }

  rl.close();
});

rl.on('close', () => {
  console.log('👋 Thank you for using the password hash generator!\n');
  process.exit(0);
});