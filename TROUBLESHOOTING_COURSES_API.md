# Troubleshooting: POST /api/courses 500 Error

## Problem
Getting a 500 Internal Server Error when trying to POST courses to `/api/courses` endpoint.

## 🔍 Quick Diagnosis

**NEW: Use the diagnostic endpoint to identify issues automatically:**

```bash
# Check your deployment configuration
curl https://b2b-edtech-platform.vercel.app/api/courses/diagnose
```

This will return a detailed report showing:
- ✅ Environment variables status
- ✅ Google Sheets API connectivity
- ✅ Spreadsheet access permissions
- ✅ Courses sheet existence
- ✅ Specific recommendations for fixing issues

**Example Output:**
```json
{
  "timestamp": "2024-02-12T18:00:00.000Z",
  "overallStatus": "ISSUES_FOUND",
  "checks": {
    "environmentVariables": { "GOOGLE_SHEET_ID": true, ... },
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

---

## Common Causes & Solutions

### 1. Courses Sheet Not Initialized

**Symptom:** Error message: "Courses sheet does not exist"

**Solution:**
1. Visit the initialization endpoint: `https://your-domain.vercel.app/api/courses/init`
2. This will create the Courses sheet with proper headers
3. Verify the sheet was created in your Google Spreadsheet

**Testing locally:**
```bash
curl http://localhost:3000/api/courses/init
```

**Testing on Vercel:**
```bash
curl https://b2b-edtech-platform.vercel.app/api/courses/init
```

---

### 2. Missing Environment Variables

**Symptom:** Error mentions missing environment variables

**Required Variables:**
- `GOOGLE_SHEET_ID` - Your Google Spreadsheet ID
- `GOOGLE_SERVICE_ACCOUNT_EMAIL` - Service account email
- `GOOGLE_PRIVATE_KEY` - Service account private key

**Solution:**

1. **Local Development (.env file):**
   ```env
   GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   GOOGLE_SHEET_ID=your-spreadsheet-id
   ```

2. **Vercel Deployment:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add each variable individually
   - **Important:** For `GOOGLE_PRIVATE_KEY`:
     - Keep the double quotes in the value
     - Make sure `\n` characters are preserved (not converted to actual newlines)
     - Format: `"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"`
   - Redeploy after adding variables

---

### 3. Google Sheets API Permissions

**Symptom:** "Permission denied" or "Insufficient permissions"

**Solution:**
1. Go to your Google Spreadsheet
2. Click "Share" button
3. Add your service account email with "Editor" permissions:
   - Email: `your-service-account@project.iam.gserviceaccount.com`
   - Role: Editor
4. Save

---

### 4. Service Account Configuration

**Symptom:** Authentication errors

**Solution:**
1. Verify service account exists in Google Cloud Console
2. Ensure Google Sheets API is enabled:
   - Go to: https://console.cloud.google.com/apis/library
   - Search for "Google Sheets API"
   - Click "Enable"
3. Download a fresh JSON key file if needed
4. Extract credentials from the JSON:
   - `client_email` → `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `private_key` → `GOOGLE_PRIVATE_KEY`

---

### 5. Vercel Environment Variable Format Issue

**Symptom:** Works locally but fails on Vercel

**Common Issue:** Private key format gets corrupted during deployment

**Solution:**

**Method 1: Use Vercel CLI**
```bash
# Set environment variable using CLI (preserves formatting)
vercel env add GOOGLE_PRIVATE_KEY
# Paste the entire private key including quotes and \n characters
# Press Enter twice to finish
```

**Method 2: Base64 Encoding**

1. Encode the private key:
```bash
echo -n 'your-private-key-content' | base64
```

2. Update code to decode in production (modify `courseManager.js`):
```javascript
const privateKey = process.env.GOOGLE_PRIVATE_KEY_BASE64 
  ? Buffer.from(process.env.GOOGLE_PRIVATE_KEY_BASE64, 'base64').toString('utf-8')
  : process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
```

3. Set `GOOGLE_PRIVATE_KEY_BASE64` in Vercel

---

## Debugging Steps

### Step 1: Check Vercel Logs
```bash
vercel logs --follow
```
Look for detailed error messages in the logs.

### Step 2: Test API Endpoint
```bash
# Test with minimal data
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

### Step 3: Verify Initialization
```bash
# Initialize the sheet first
curl https://b2b-edtech-platform.vercel.app/api/courses/init

# Then try GET to see if it works
curl https://b2b-edtech-platform.vercel.app/api/courses
```

### Step 4: Check Response Details
The enhanced error response now includes:
- `error`: Main error message
- `details`: Specific error details
- `message`: Additional troubleshooting hints

Example error response:
```json
{
  "error": "Failed to add courses. Please try again.",
  "details": "Courses sheet does not exist",
  "message": "Please initialize the Courses sheet first by visiting /api/courses/init"
}
```

---

## Quick Fix Checklist

- [ ] Initialize Courses sheet: Visit `/api/courses/init`
- [ ] Verify all environment variables are set in Vercel
- [ ] Check service account has Editor access to spreadsheet
- [ ] Confirm Google Sheets API is enabled
- [ ] Test with a single course first
- [ ] Check Vercel deployment logs for detailed errors
- [ ] Verify spreadsheet ID is correct
- [ ] Ensure private key format is preserved (with `\n` characters)

---

## Testing Your Fix

After making changes, test with this payload:

```bash
curl -X POST https://b2b-edtech-platform.vercel.app/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "courses": [{
      "title": "Full Stack Web Development",
      "description": "Master modern web development",
      "duration": "12 weeks",
      "level": "Intermediate",
      "price": 49999,
      "category": "Web Development",
      "instructor": "Rajesh Kumar",
      "rating": 4.8,
      "studentsEnrolled": 2500
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

## Still Having Issues?

1. Check Vercel deployment logs: `vercel logs --follow`
2. Verify the spreadsheet structure matches expected format
3. Test the endpoint locally first: `npm run dev`
4. Ensure you're using the latest deployment
5. Try redeploying: `vercel --prod`

---

## Additional Resources

- [Google Sheets API Documentation](https://developers.google.com/sheets/api)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
- [Google Service Account Setup](https://cloud.google.com/iam/docs/service-accounts)