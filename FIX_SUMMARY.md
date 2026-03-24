# Fix Summary: POST /api/courses 500 Error

## Changes Made

### 1. Enhanced Error Reporting in API Route
**File:** [`src/app/api/courses/route.js`](src/app/api/courses/route.js)

**Changes:**
- Added detailed error logging to console with error stack traces
- Enhanced error response to include:
  - `error`: Main error message
  - `details`: Specific error details from Google Sheets API
  - `message`: Additional troubleshooting hints
- Added `errorDetails` field to the response for better debugging

**Before:**
```javascript
return NextResponse.json(
  { error: 'Failed to add courses. Please try again.' },
  { status: 500 }
);
```

**After:**
```javascript
return NextResponse.json(
  { 
    error: 'Failed to add courses. Please try again.',
    details: result.error,
    message: result.errorDetails || 'Check server logs for more details'
  },
  { status: 500 }
);
```

### 2. Improved Course Manager with Validation
**File:** [`src/lib/courseManager.js`](src/lib/courseManager.js)

**Changes:**
- Added environment variable validation before any API calls
- Added spreadsheet and sheet existence checks
- Enhanced error messages with specific troubleshooting hints
- Added detailed error logging with stack traces

**New validations:**
```javascript
// Validate environment variables
if (!process.env.GOOGLE_SHEET_ID) {
  throw new Error('GOOGLE_SHEET_ID is not defined');
}

// Check if Courses sheet exists
const courseSheet = spreadsheet.data.sheets?.find(
  sheet => sheet.properties?.title === 'Courses'
);

if (!courseSheet) {
  return {
    success: false,
    error: 'Courses sheet does not exist',
    errorDetails: 'Please initialize the Courses sheet first by visiting /api/courses/init',
  };
}
```

### 3. New Diagnostic Endpoint
**File:** [`src/app/api/courses/diagnose/route.js`](src/app/api/courses/diagnose/route.js) (NEW)

**Purpose:** Automated diagnosis of configuration issues

**Features:**
- ✅ Validates all environment variables
- ✅ Tests Google Sheets API connectivity
- ✅ Checks spreadsheet access permissions
- ✅ Verifies Courses sheet existence
- ✅ Validates sheet headers
- ✅ Provides specific recommendations

**Usage:**
```bash
curl https://b2b-edtech-platform.vercel.app/api/courses/diagnose
```

**Sample Response:**
```json
{
  "timestamp": "2024-02-12T18:00:00.000Z",
  "environment": "production",
  "overallStatus": "ISSUES_FOUND",
  "checks": {
    "environmentVariables": {
      "GOOGLE_SHEET_ID": true,
      "GOOGLE_SERVICE_ACCOUNT_EMAIL": true,
      "GOOGLE_PRIVATE_KEY": true
    },
    "googleSheetsClient": {
      "status": "SUCCESS"
    },
    "spreadsheetAccess": {
      "status": "SUCCESS",
      "spreadsheetTitle": "B2B EdTech Leads"
    },
    "coursesSheet": {
      "status": "ERROR",
      "message": "Courses sheet does not exist"
    }
  },
  "recommendations": [
    "Initialize Courses sheet by visiting /api/courses/init"
  ]
}
```

### 4. Comprehensive Troubleshooting Guide
**File:** [`TROUBLESHOOTING_COURSES_API.md`](TROUBLESHOOTING_COURSES_API.md) (NEW)

**Includes:**
- Common causes and solutions
- Step-by-step debugging guide
- Environment variable setup instructions
- Google Sheets permissions configuration
- Vercel deployment tips
- Testing procedures
- Quick fix checklist

---

## Most Likely Root Causes

Based on the 500 error, the most probable issues are:

### 1. ⚠️ Courses Sheet Not Initialized (Most Likely)
**Symptom:** The "Courses" sheet doesn't exist in your Google Spreadsheet

**Solution:**
```bash
# Visit this URL to initialize
https://b2b-edtech-platform.vercel.app/api/courses/init
```

### 2. ⚠️ Environment Variables in Vercel
**Symptom:** Variables work locally but fail on Vercel

**Common Issue:** `GOOGLE_PRIVATE_KEY` format gets corrupted

**Solution:**
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Ensure `GOOGLE_PRIVATE_KEY` is set with proper format:
   ```
   "-----BEGIN PRIVATE KEY-----\nYourKeyHere\n-----END PRIVATE KEY-----\n"
   ```
3. Keep the quotes and `\n` characters (don't convert to actual newlines)

### 3. ⚠️ Google Sheets Permissions
**Symptom:** "Permission denied" errors

**Solution:**
1. Open your Google Spreadsheet
2. Click "Share"
3. Add: `b2b-edtech-service@b2b-edtech-platform.iam.gserviceaccount.com`
4. Set role: "Editor"

---

## Next Steps to Fix

### Step 1: Run Diagnostics
```bash
curl https://b2b-edtech-platform.vercel.app/api/courses/diagnose
```

This will tell you exactly what's wrong.

### Step 2: Initialize Courses Sheet
```bash
curl https://b2b-edtech-platform.vercel.app/api/courses/init
```

### Step 3: Verify Fix
```bash
curl -X POST https://b2b-edtech-platform.vercel.app/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "courses": [{
      "title": "Test Course",
      "description": "Test Description",
      "duration": "4 weeks",
      "level": "Beginner",
      "price": 1000,
      "category": "Testing",
      "instructor": "Test Instructor"
    }]
  }'
```

Expected success response:
```json
{
  "success": true,
  "message": "Successfully added 1 courses",
  "count": 1
}
```

---

## Testing Locally

If you want to test locally before deploying:

1. Ensure your local `.env` has all variables
2. Run the diagnostic:
   ```bash
   curl http://localhost:3000/api/courses/diagnose
   ```
3. Initialize if needed:
   ```bash
   curl http://localhost:3000/api/courses/init
   ```
4. Test POST:
   ```bash
   curl -X POST http://localhost:3000/api/courses \
     -H "Content-Type: application/json" \
     -d '{"courses":[...]}'
   ```

---

## Deployment Checklist

Before redeploying to Vercel:

- [ ] All environment variables are set in Vercel Dashboard
- [ ] `GOOGLE_PRIVATE_KEY` format is correct (with `\n` and quotes)
- [ ] Service account has Editor access to spreadsheet
- [ ] Google Sheets API is enabled in Google Cloud Console
- [ ] Spreadsheet ID is correct
- [ ] Courses sheet will be initialized after deployment

---

## Error Response Format (After Fix)

Your API now returns more helpful error messages:

**Example Error Response:**
```json
{
  "error": "Failed to add courses. Please try again.",
  "details": "Courses sheet does not exist",
  "message": "Please initialize the Courses sheet first by visiting /api/courses/init"
}
```

This tells you exactly:
1. What failed (couldn't add courses)
2. Why it failed (sheet doesn't exist)
3. How to fix it (visit the init endpoint)

---

## Additional Resources

- See [`TROUBLESHOOTING_COURSES_API.md`](TROUBLESHOOTING_COURSES_API.md) for detailed troubleshooting
- Use `/api/courses/diagnose` endpoint for automated diagnostics
- Check Vercel logs: `vercel logs --follow`

---

## Summary

The fixes provide:
1. ✅ Better error messages with specific details
2. ✅ Automated diagnostics endpoint
3. ✅ Comprehensive troubleshooting guide
4. ✅ Environment variable validation
5. ✅ Sheet existence checks
6. ✅ Clear recommendations for fixing issues

The most likely fix: **Visit `/api/courses/init` to initialize the Courses sheet**, then try your POST request again.