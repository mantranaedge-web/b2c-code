# Deploy the Fix to Vercel

## Current Situation

The 500 error fix has been implemented locally but needs to be deployed to Vercel for it to take effect on your production site.

## Files Changed

1. [`src/app/api/courses/route.js`](src/app/api/courses/route.js) - Enhanced error reporting
2. [`src/lib/courseManager.js`](src/lib/courseManager.js) - Added validation and better error handling
3. [`src/app/api/courses/diagnose/route.js`](src/app/api/courses/diagnose/route.js) - New diagnostic endpoint (NEW)
4. [`TROUBLESHOOTING_COURSES_API.md`](TROUBLESHOOTING_COURSES_API.md) - Documentation (NEW)
5. [`FIX_SUMMARY.md`](FIX_SUMMARY.md) - Summary (NEW)

## Deployment Options

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI** (if not already installed):
```bash
npm i -g vercel
```

2. **Login to Vercel**:
```bash
vercel login
```

3. **Deploy from the project directory**:
```bash
cd b2b-edtech-platform
vercel --prod
```

4. **Wait for deployment to complete** - You'll get a URL when done

### Option 2: Deploy via Git Push

If your project is connected to GitHub/GitLab:

1. **Commit the changes**:
```bash
cd b2b-edtech-platform
git add .
git commit -m "Fix: Enhanced error handling for POST /api/courses endpoint"
git push origin main
```

2. **Vercel will automatically deploy** - Check your Vercel dashboard

### Option 3: Deploy via Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Find your project: `b2b-edtech-platform`
3. Click "Deployments" → "Redeploy"
4. Select the latest commit

## After Deployment

Once deployed, the new endpoints will be available:

### 1. Test Diagnostic Endpoint
```bash
curl https://b2b-edtech-platform.vercel.app/api/courses/diagnose
```

This will show you exactly what's wrong with your configuration.

### 2. Initialize Courses Sheet (if needed)
```bash
curl https://b2b-edtech-platform.vercel.app/api/courses/init
```

### 3. Try Your POST Request Again
```bash
curl -X POST https://b2b-edtech-platform.vercel.app/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "courses": [{
      "title": "Full Stack Web Development-Testing-NP",
      "description": "Master modern web development with React Node.js and MongoDB",
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

## Expected Results After Fix

### If Courses Sheet Doesn't Exist:
```json
{
  "error": "Failed to add courses. Please try again.",
  "details": "Courses sheet does not exist",
  "message": "Please initialize the Courses sheet first by visiting /api/courses/init"
}
```

**Action:** Visit `/api/courses/init` to create the sheet

### If Environment Variables Missing:
```json
{
  "error": "Failed to add courses. Please try again.",
  "details": "GOOGLE_SHEET_ID is not defined in environment variables",
  "message": "Check if: 1) Google Sheet exists..."
}
```

**Action:** Add missing environment variables in Vercel Dashboard

### On Success:
```json
{
  "success": true,
  "message": "Successfully added 2 courses",
  "count": 2
}
```

## Verifying Environment Variables

Before deploying, verify your Vercel environment variables:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to Settings → Environment Variables
4. Verify these exist:
   - `GOOGLE_SHEET_ID`
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `GOOGLE_PRIVATE_KEY`

**Important for `GOOGLE_PRIVATE_KEY`:**
- Must include quotes: `"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"`
- Keep `\n` as literal characters (not actual newlines)

## Quick Deployment Commands

```bash
# Navigate to project
cd b2b-edtech-platform

# Deploy to production
vercel --prod

# Or if using git
git add .
git commit -m "Fix: POST /api/courses error handling"
git push origin main
```

## Troubleshooting Deployment

### If deployment fails:
1. Check build logs in Vercel dashboard
2. Verify all dependencies in `package.json`
3. Ensure no syntax errors: `npm run build`

### If deployed but still getting 500:
1. Check Vercel function logs
2. Run diagnostic: `/api/courses/diagnose`
3. Follow recommendations in the diagnostic output

## Next Steps After Successful Deployment

1. ✅ Visit `/api/courses/diagnose` to check configuration
2. ✅ Visit `/api/courses/init` if Courses sheet doesn't exist
3. ✅ Test POST endpoint with your course data
4. ✅ Check Vercel logs if issues persist: `vercel logs`

---

**Need Help?** Check [`TROUBLESHOOTING_COURSES_API.md`](TROUBLESHOOTING_COURSES_API.md) for detailed troubleshooting steps.