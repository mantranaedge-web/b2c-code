#!/bin/bash

# Script to fix GOOGLE_PRIVATE_KEY format in Vercel
# This script helps you set the private key correctly in Vercel

echo "=================================="
echo "Fix Vercel Environment Variables"
echo "=================================="
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Error: .env file not found!"
    echo "Please create a .env file with your credentials first."
    exit 1
fi

# Extract the private key from .env
PRIVATE_KEY=$(grep GOOGLE_PRIVATE_KEY .env | cut -d '=' -f2-)

if [ -z "$PRIVATE_KEY" ]; then
    echo "Error: GOOGLE_PRIVATE_KEY not found in .env file"
    exit 1
fi

echo "Found GOOGLE_PRIVATE_KEY in .env file"
echo ""

# Option 1: Base64 encode the key
echo "Option 1: Base64 Encoding (Recommended)"
echo "========================================="
echo ""
echo "This method encodes the private key to avoid formatting issues."
echo ""

# Remove quotes if present and encode
CLEAN_KEY=$(echo "$PRIVATE_KEY" | sed 's/^"//;s/"$//')
BASE64_KEY=$(echo -n "$CLEAN_KEY" | base64)

echo "Run this command to set the base64 encoded key in Vercel:"
echo ""
echo "vercel env add GOOGLE_PRIVATE_KEY_BASE64 production"
echo ""
echo "When prompted, paste this value:"
echo "-----------------------------------"
echo "$BASE64_KEY"
echo "-----------------------------------"
echo ""
echo "Press Enter twice to finish."
echo ""
echo ""

# Option 2: Direct copy
echo "Option 2: Direct Copy (Alternative)"
echo "====================================="
echo ""
echo "If Option 1 doesn't work, try setting GOOGLE_PRIVATE_KEY directly:"
echo ""
echo "vercel env add GOOGLE_PRIVATE_KEY production"
echo ""
echo "When prompted, paste this EXACT value (including quotes and \\n):"
echo "-----------------------------------"
echo "$PRIVATE_KEY"
echo "-----------------------------------"
echo ""
echo "IMPORTANT: Make sure to copy it EXACTLY as shown above."
echo ""
echo ""

# Check other required env vars
echo "Other Required Environment Variables:"
echo "======================================"
echo ""

SERVICE_ACCOUNT=$(grep GOOGLE_SERVICE_ACCOUNT_EMAIL .env | cut -d '=' -f2-)
SHEET_ID=$(grep GOOGLE_SHEET_ID .env | cut -d '=' -f2-)

if [ -n "$SERVICE_ACCOUNT" ]; then
    echo "✓ GOOGLE_SERVICE_ACCOUNT_EMAIL: $SERVICE_ACCOUNT"
else
    echo "✗ GOOGLE_SERVICE_ACCOUNT_EMAIL: NOT FOUND"
fi

if [ -n "$SHEET_ID" ]; then
    echo "✓ GOOGLE_SHEET_ID: $SHEET_ID"
else
    echo "✗ GOOGLE_SHEET_ID: NOT FOUND"
fi

echo ""
echo "To set these in Vercel, run:"
echo "vercel env add GOOGLE_SERVICE_ACCOUNT_EMAIL production"
echo "vercel env add GOOGLE_SHEET_ID production"
echo ""
echo ""

echo "After setting all environment variables:"
echo "1. Redeploy: vercel --prod"
echo "2. Test: curl -X POST https://your-domain.vercel.app/api/courses -H 'Content-Type: application/json' -d '{\"courses\":[...]}'"
echo ""