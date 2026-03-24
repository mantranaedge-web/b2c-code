# B2B EdTech Platform - Implementation Guide

## Overview
This guide covers the implementation of separate Google Sheets for Leads and Courses, Course Details management, and duplicate validation.

## Changes Implemented

### 1. Separate Google Sheets Architecture

**Previous Setup:**
- Single Google Sheet with multiple tabs (Leads, Courses)
- Environment variable: `GOOGLE_SHEET_ID`

**New Setup:**
- **Two separate Google Spreadsheets:**
  - Leads Spreadsheet: `GOOGLE_LEADS_SHEET_ID`
  - Courses Spreadsheet: `GOOGLE_COURSES_SHEET_ID`
- **Backward compatibility:** Falls back to `GOOGLE_SHEET_ID` if new variables not set

### 2. Environment Variables

Add these to your `.env` file and Vercel environment variables:

```bash
# Existing variables (keep these)
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# NEW: Separate Sheet IDs
GOOGLE_LEADS_SHEET_ID=your-leads-spreadsheet-id
GOOGLE_COURSES_SHEET_ID=your-courses-spreadsheet-id

# DEPRECATED: Old single sheet ID (kept for backward compatibility)
# GOOGLE_SHEET_ID=your-spreadsheet-id
```

### 3. Google Sheets Structure

#### Leads Spreadsheet
**Sheet Name:** `Leads`
**Columns:**
- Timestamp
- Name
- Email
- Phone
- Company
- Course Name
- Message
- Status

#### Courses Spreadsheet
**Sheet Name:** `Courses`
**Columns:**
- Title
- Description
- Duration
- Level
- Price
- Category
- Instructor
- Rating
- Students Enrolled
- Status
- Created At

**Sheet Name:** `CourseDetails` (NEW)
**Columns:**
- Course Title
- Full Description
- Modules (JSON)
- Learning Outcomes (JSON)
- Prerequisites (JSON)
- Instructor Bio
- Created At

## Setup Instructions

### Step 1: Create Separate Google Spreadsheets

1. **Create Leads Spreadsheet:**
   ```
   - Go to Google Sheets
   - Create new spreadsheet named "B2B Leads"
   - Copy the spreadsheet ID from URL
   - Share with service account email (Editor access)
   ```

2. **Create Courses Spreadsheet:**
   ```
   - Create new spreadsheet named "B2B Courses"
   - Copy the spreadsheet ID from URL
   - Share with service account email (Editor access)
   ```

### Step 2: Initialize Sheets

**Option A: Via API**
```bash
# Initialize both Courses and CourseDetails sheets
curl -X POST https://your-domain.vercel.app/api/courses/init
```

**Option B: Via Browser**
```
Navigate to: https://your-domain.vercel.app/api/courses/init
```

Expected Response:
```json
{
  "success": true,
  "courses": "Courses sheet initialized with headers",
  "courseDetails": "CourseDetails sheet initialized with headers"
}
```

### Step 3: Add Course Details

#### Format for Course Details (JSON):
```json
{
  "courseDetails": [
    {
      "courseTitle": "Full Stack Web Development",
      "fullDescription": "Comprehensive course description...",
      "modules": [
        {
          "title": "Module 1 Title",
          "duration": "2 weeks",
          "description": "Module description"
        }
      ],
      "learningOutcomes": [
        "Outcome 1",
        "Outcome 2"
      ],
      "prerequisites": [
        "Prerequisite 1",
        "Prerequisite 2"
      ],
      "instructorBio": "Instructor biography..."
    }
  ]
}
```

#### Upload via API:
```bash
curl -X POST https://your-domain.vercel.app/api/course-details \
  -H "Content-Type: application/json" \
  -d @course-details.json
```

## API Endpoints

### Courses API

**GET /api/courses**
- Returns all active courses from Google Sheets
- Uses: `GOOGLE_COURSES_SHEET_ID` or `GOOGLE_SHEET_ID`

**POST /api/courses**
- Add courses in bulk
- Validates for duplicates by course title
- Request body:
```json
{
  "courses": [
    {
      "title": "Course Title",
      "description": "Description",
      "duration": "12 weeks",
      "level": "Intermediate",
      "price": 49999,
      "category": "Web Development",
      "instructor": "Instructor Name",
      "rating": 4.8,
      "studentsEnrolled": 2500
    }
  ]
}
```

### Course Details API

**GET /api/course-details**
- Get all course details
- Optional query param: `?title=Course+Title` to get specific course

**POST /api/course-details**
- Add course details in bulk
- Validates for duplicates by course title
- Request body: See format above

### Leads API

**GET /api/leads**
- Returns all leads from Google Sheets
- Uses: `GOOGLE_LEADS_SHEET_ID` or `GOOGLE_SHEET_ID`

**POST /api/leads**
- Add new lead
- Automatically saves to separate Leads spreadsheet

## Features Implemented

### 1. Duplicate Validation
- **Course Upload:** Checks for existing courses with same title (case-insensitive)
- **Course Details Upload:** Checks for existing details with same course title
- **Returns 409 Conflict** with list of duplicates if found

### 2. Dynamic Course Details Page
- Fetches basic course info from `/api/courses`
- Fetches extended details from `/api/course-details`
- Gracefully handles missing data
- Shows loading state during fetch

### 3. Backward Compatibility
- All functions check for new environment variables first
- Falls back to `GOOGLE_SHEET_ID` if new vars not set
- No breaking changes for existing deployments

## Migration Path

### For Existing Deployments:

1. **Keep Current Setup Working:**
   - Your current `GOOGLE_SHEET_ID` continues to work
   - No immediate action required

2. **Migrate to Separate Sheets:**
   ```bash
   # 1. Create two new Google Spreadsheets
   # 2. Add new environment variables
   # 3. Initialize the sheets
   # 4. Migrate existing data (manual or script)
   # 5. Remove old GOOGLE_SHEET_ID once confirmed working
   ```

3. **Test in Stages:**
   - Test Leads functionality first
   - Test Courses functionality
   - Test Course Details
   - Deploy to production

## Troubleshooting

### Issue: Duplicate Detection Not Working
**Solution:** Ensure course titles match exactly (case-insensitive comparison is used)

### Issue: Course Details Not Showing
**Check:**
1. CourseDetails sheet exists and is initialized
2. Course title in CourseDetails matches exactly with Courses sheet
3. JSON format in Google Sheets is valid

### Issue: 404 on Course Detail Page
**Check:**
1. Course exists in Courses sheet
2. Course ID matches the array index + 1
3. API `/api/courses` returns data successfully

## Data Format Examples

### Course Modules JSON:
```json
[
  {
    "title": "HTML & CSS Fundamentals",
    "duration": "1 week",
    "description": "Learn the building blocks"
  }
]
```

### Learning Outcomes JSON:
```json
[
  "Build full-stack applications",
  "Master React.js",
  "Deploy to production"
]
```

### Prerequisites JSON:
```json
[
  "Basic computer skills",
  "Understanding of programming concepts"
]
```

## Security Notes

1. **Service Account Permissions:**
   - Grant only Editor access (not Owner)
   - Use separate service accounts for prod/dev if needed

2. **Environment Variables:**
   - Never commit `.env` files
   - Use Vercel's encrypted environment variables
   - Rotate service account keys periodically

3. **API Security:**
   - Consider adding authentication for POST endpoints
   - Implement rate limiting for production
   - Validate all input data

## Support

For issues or questions:
1. Check server logs in Vercel dashboard
2. Test API endpoints directly
3. Verify Google Sheets permissions
4. Review environment variables configuration

---

## Quick Reference

### Environment Setup
```bash
GOOGLE_LEADS_SHEET_ID=xxx
GOOGLE_COURSES_SHEET_ID=yyy
GOOGLE_SERVICE_ACCOUNT_EMAIL=service@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----..."
```

### Initialize Sheets
```bash
POST /api/courses/init
```

### Upload Course Details
```bash
POST /api/course-details
Content-Type: application/json
Body: { "courseDetails": [...] }
```

### Check Courses
```bash
GET /api/courses
GET /api/course-details?title=Course+Name