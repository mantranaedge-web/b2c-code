# Your Next Steps - Complete Setup Guide

## ✅ COMPLETED
- ✅ Spreadsheet IDs extracted from URLs
- ✅ Local `.env` file updated with new IDs

---

## 📋 STEP 1: Share Google Sheets with Service Account (DO THIS NOW)

### Your Service Account Email:
```
b2b-edtech-service@b2b-edtech-platform.iam.gserviceaccount.com
```

### For LEADS Sheet:
1. Open: https://docs.google.com/spreadsheets/d/1ra0wV4t_Hcrs4BJOBrlZSDnVagegnjLy5rZaOvxCgrE/edit
2. Click the **"Share"** button (top right)
3. In the "Add people and groups" field, paste:
   ```
   b2b-edtech-service@b2b-edtech-platform.iam.gserviceaccount.com
   ```
4. Set permission to **"Editor"**
5. Click **"Send"** (uncheck "Notify people" if you don't want an email)

### For COURSES Sheet:
1. Open: https://docs.google.com/spreadsheets/d/17PDKDm_ZlWeLCQ5tEa7v_mcreZMkdeMqth4Uj5m8Fgs/edit
2. Click the **"Share"** button (top right)
3. In the "Add people and groups" field, paste:
   ```
   b2b-edtech-service@b2b-edtech-platform.iam.gserviceaccount.com
   ```
4. Set permission to **"Editor"**
5. Click **"Send"** (uncheck "Notify people" if you don't want an email)

---

## 📋 STEP 2: Test Locally (After Sharing)

### 2.1 Start Your Local Development Server:
```bash
cd b2b-edtech-platform
npm run dev
```

### 2.2 Initialize the Sheets:
Open your browser and visit:
```
http://localhost:3000/api/courses/init
```

**Expected Response:**
```json
{
  "success": true,
  "courses": "Courses sheet initialized with headers",
  "courseDetails": "CourseDetails sheet initialized with headers"
}
```

This will create two sheets in your Courses spreadsheet:
- `Courses` (for basic course info)
- `CourseDetails` (for detailed course info)

### 2.3 Verify the Sheets Were Created:
1. Go to your Courses spreadsheet: https://docs.google.com/spreadsheets/d/17PDKDm_ZlWeLCQ5tEa7v_mcreZMkdeMqth4Uj5m8Fgs/edit
2. You should see two tabs at the bottom:
   - **Courses** (with headers: Title, Description, Duration, Level, Price, Category, Instructor, Rating, Students Enrolled, Status, Created At)
   - **CourseDetails** (with headers: Course Title, Full Description, Modules (JSON), Learning Outcomes (JSON), Prerequisites (JSON), Instructor Bio, Created At)

### 2.4 Test Adding a Course (Optional but Recommended):
```bash
curl -X POST http://localhost:3000/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "courses": [{
      "title": "Test Course - Local",
      "description": "Testing local setup",
      "duration": "4 weeks",
      "level": "Beginner",
      "price": 999,
      "category": "Testing",
      "instructor": "Test Instructor",
      "rating": 4.5,
      "studentsEnrolled": 0
    }]
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Successfully added 1 courses",
  "count": 1
}
```

Check your Courses spreadsheet - you should see the test course added!

---

## 📋 STEP 3: Update Vercel Environment Variables

### 3.1 Go to Vercel Dashboard:
1. Visit: https://vercel.com/dashboard
2. Find your project: `b2b-edtech-platform`
3. Go to **Settings** → **Environment Variables**

### 3.2 Add These New Variables:

#### Variable 1: GOOGLE_LEADS_SHEET_ID
- **Key**: `GOOGLE_LEADS_SHEET_ID`
- **Value**: `1ra0wV4t_Hcrs4BJOBrlZSDnVagegnjLy5rZaOvxCgrE`
- **Environments**: Select all (Production, Preview, Development)
- Click **"Save"**

#### Variable 2: GOOGLE_COURSES_SHEET_ID
- **Key**: `GOOGLE_COURSES_SHEET_ID`
- **Value**: `17PDKDm_ZlWeLCQ5tEa7v_mcreZMkdeMqth4Uj5m8Fgs`
- **Environments**: Select all (Production, Preview, Development)
- Click **"Save"**

### 3.3 Verify Existing Variables:
Make sure these are already there (they should be from your .env file):
- ✅ `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- ✅ `GOOGLE_PRIVATE_KEY`
- ✅ `GOOGLE_SHEET_ID` (old one, can keep for backward compatibility)

---

## 📋 STEP 4: Deploy to Vercel

### Option A: Using Vercel CLI (Recommended)
```bash
cd b2b-edtech-platform
vercel --prod
```

### Option B: Using Git
```bash
cd b2b-edtech-platform
git add .
git commit -m "Add separate Google Sheets for Leads and Courses"
git push origin main
```
(Vercel will auto-deploy if connected to GitHub)

### Option C: Manual Redeploy
1. Go to Vercel Dashboard
2. Find your project
3. Go to **Deployments**
4. Click **"Redeploy"** on the latest deployment

---

## 📋 STEP 5: Initialize Production Sheets

After deployment completes, visit:
```
https://your-vercel-domain.vercel.app/api/courses/init
```

(Replace `your-vercel-domain` with your actual Vercel URL)

**Expected Response:**
```json
{
  "success": true,
  "courses": "Courses sheet initialized with headers",
  "courseDetails": "CourseDetails sheet initialized with headers"
}
```

---

## 📋 STEP 6: Run Production Diagnostics

Visit this URL to verify everything is configured correctly:
```
https://your-vercel-domain.vercel.app/api/courses/diagnose
```

**What to Look For:**
```json
{
  "overallStatus": "OK",
  "checks": {
    "environmentVariables": {
      "GOOGLE_LEADS_SHEET_ID": true,
      "GOOGLE_COURSES_SHEET_ID": true,
      "GOOGLE_SERVICE_ACCOUNT_EMAIL": true,
      "GOOGLE_PRIVATE_KEY": true
    },
    "googleSheetsClient": { "status": "SUCCESS" },
    "spreadsheetAccess": { "status": "SUCCESS" },
    "coursesSheet": { "status": "SUCCESS" },
    "courseDetailsSheet": { "status": "SUCCESS" }
  }
}
```

---

## 📋 STEP 7: Upload Course Details (Optional)

If you have detailed course information, you can upload it using the template:

1. **Edit the template file**: `COURSE_DETAILS_TEMPLATE.json`
2. **Upload via API**:
```bash
curl -X POST https://your-vercel-domain.vercel.app/api/course-details \
  -H "Content-Type: application/json" \
  -d @COURSE_DETAILS_TEMPLATE.json
```

---

## 🎉 FINAL VERIFICATION

### Check Everything Works:

1. **Leads API**:
   ```
   https://your-vercel-domain.vercel.app/api/leads
   ```

2. **Courses API**:
   ```
   https://your-vercel-domain.vercel.app/api/courses
   ```

3. **Course Details API**:
   ```
   https://your-vercel-domain.vercel.app/api/course-details
   ```

4. **Visit Your Website**:
   - Check if courses display correctly
   - Test the lead form
   - Visit a course detail page

---

## 🆘 TROUBLESHOOTING

### If Something Doesn't Work:

1. **Check Vercel Function Logs**:
   ```bash
   vercel logs --follow
   ```

2. **Run Diagnostics**:
   Visit: `/api/courses/diagnose`

3. **Common Issues**:
   - **"Permission denied"**: Check if service account has Editor access to BOTH sheets
   - **"Sheet not found"**: Run the `/api/courses/init` endpoint again
   - **"Environment variable not found"**: Double-check Vercel environment variables
   - **"Invalid JSON"**: Check if `GOOGLE_PRIVATE_KEY` format is correct in Vercel

---

## 📚 Additional Resources

- Full Implementation Guide: See `IMPLEMENTATION_GUIDE.md`
- Troubleshooting Guide: See `TROUBLESHOOTING_COURSES_API.md`
- Deployment Guide: See `DEPLOY_FIX.md`

---

## ✅ CURRENT STATUS

Your configuration:
- ✅ Leads Sheet: `1ra0wV4t_Hcrs4BJOBrlZSDnVagegnjLy5rZaOvxCgrE`
- ✅ Courses Sheet: `17PDKDm_ZlWeLCQ5tEa7v_mcreZMkdeMqth4Uj5m8Fgs`
- ✅ Service Account: `b2b-edtech-service@b2b-edtech-platform.iam.gserviceaccount.com`
- ✅ Local .env updated

**Next Action**: Share both Google Sheets with the service account (Step 1 above)