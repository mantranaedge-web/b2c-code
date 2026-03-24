# Changes Summary - B2B EdTech Platform Updates

## Date: 2026-02-17

## Overview
Implemented three major improvements to address user feedback:
1. Separate Google Spreadsheets for Leads and Courses
2. CourseDetails sheet with bulk upload capability
3. Duplicate validation for courses

---

## 1. Separate Google Spreadsheets ✅

### Problem
Leads and Courses were stored as tabs in a single Google Sheet, making independent management difficult.

### Solution
- Created support for two separate spreadsheets
- Added new environment variables: `GOOGLE_LEADS_SHEET_ID` and `GOOGLE_COURSES_SHEET_ID`
- Maintained backward compatibility with existing `GOOGLE_SHEET_ID`

### Files Modified
- [`src/lib/googleSheets.js`](src/lib/googleSheets.js) - Updated all functions to use `GOOGLE_LEADS_SHEET_ID`
- [`src/lib/courseManager.js`](src/lib/courseManager.js) - Updated all functions to use `GOOGLE_COURSES_SHEET_ID`

### Migration Steps
1. Create two separate Google Spreadsheets
2. Add new environment variables to `.env` and Vercel
3. Share both spreadsheets with service account
4. Initialize sheets using `/api/courses/init`

---

## 2. CourseDetails Sheet & Bulk Upload ✅

### Problem
Course detail pages had hardcoded data including:
- Full descriptions
- Modules (with titles, durations, descriptions)
- Learning outcomes
- Prerequisites
- Instructor biographies

### Solution
- Created new `CourseDetails` sheet in Courses spreadsheet
- Stores extended course information as JSON in Google Sheets
- Built bulk upload API endpoint
- Updated course detail page to fetch from Google Sheets

### New Files Created
- [`src/app/api/course-details/route.js`](src/app/api/course-details/route.js) - API for managing course details
- [`COURSE_DETAILS_TEMPLATE.json`](COURSE_DETAILS_TEMPLATE.json) - Sample format for bulk uploads

### Files Modified
- [`src/lib/courseManager.js`](src/lib/courseManager.js) - Added 4 new functions:
  - `addCourseDetailsToSheet()`
  - `getCourseDetailsFromSheet()`
  - `getCourseDetailsByTitle()`
  - `initializeCourseDetailsSheet()`
- [`src/app/courses/[id]/page.js`](src/app/courses/[id]/page.js) - Now fetches data from API instead of hardcoded
- [`src/app/api/courses/init/route.js`](src/app/api/courses/init/route.js) - Initializes both Courses and CourseDetails sheets

### CourseDetails Sheet Structure
| Column | Type | Description |
|--------|------|-------------|
| Course Title | String | Must match title in Courses sheet |
| Full Description | String | Extended course description |
| Modules (JSON) | JSON Array | Array of module objects |
| Learning Outcomes (JSON) | JSON Array | Array of outcome strings |
| Prerequisites (JSON) | JSON Array | Array of prerequisite strings |
| Instructor Bio | String | Detailed instructor biography |
| Created At | Timestamp | Auto-generated timestamp |

### API Endpoints
- `GET /api/course-details` - Get all course details
- `GET /api/course-details?title=Course+Name` - Get specific course details
- `POST /api/course-details` - Bulk upload course details (JSON format)

### Bulk Upload Format
```json
{
  "courseDetails": [
    {
      "courseTitle": "Course Name",
      "fullDescription": "...",
      "modules": [...],
      "learningOutcomes": [...],
      "prerequisites": [...],
      "instructorBio": "..."
    }
  ]
}
```

---

## 3. Duplicate Validation ✅

### Problem
No mechanism to prevent adding duplicate courses with the same name.

### Solution
- Implemented case-insensitive title matching before adding courses
- Returns 409 Conflict status with list of duplicates
- Works for both basic courses and course details

### Files Modified
- [`src/lib/courseManager.js`](src/lib/courseManager.js):
  - `addCoursesToSheet()` - Checks for duplicates before adding
  - `addCourseDetailsToSheet()` - Checks for duplicate course details

### Validation Logic
- Compares course titles after trimming and converting to lowercase
- Returns error response with duplicate course names
- Prevents accidental data duplication

---

## Environment Variables

### New Variables (Required for separate sheets)
```bash
GOOGLE_LEADS_SHEET_ID=your-leads-spreadsheet-id
GOOGLE_COURSES_SHEET_ID=your-courses-spreadsheet-id
```

### Existing Variables (Keep these)
```bash
GOOGLE_SERVICE_ACCOUNT_EMAIL=service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### Deprecated (Backward compatible)
```bash
GOOGLE_SHEET_ID=your-old-spreadsheet-id  # Falls back to this if new IDs not set
```

---

## Testing Checklist

### Local Testing
- [ ] Create two separate Google Spreadsheets
- [ ] Add new environment variables to `.env`
- [ ] Run initialization: `POST /api/courses/init`
- [ ] Test uploading courses: `POST /api/courses`
- [ ] Test uploading course details: `POST /api/course-details`
- [ ] Test duplicate detection
- [ ] Visit course detail page and verify data loads from Google Sheets

### Production Deployment
- [ ] Add `GOOGLE_LEADS_SHEET_ID` to Vercel environment variables
- [ ] Add `GOOGLE_COURSES_SHEET_ID` to Vercel environment variables
- [ ] Deploy to Vercel
- [ ] Run initialization endpoint
- [ ] Migrate existing course data
- [ ] Upload course details using template
- [ ] Test course detail pages
- [ ] Verify leads are saving to separate sheet

---

## Migration Guide

### Step 1: Prepare Google Sheets
```bash
1. Create "B2B Leads" spreadsheet → Copy ID
2. Create "B2B Courses" spreadsheet → Copy ID
3. Share both with service account (Editor access)
```

### Step 2: Update Environment Variables
```bash
# Local (.env file)
GOOGLE_LEADS_SHEET_ID=xxx
GOOGLE_COURSES_SHEET_ID=yyy

# Vercel (Settings → Environment Variables)
Add both variables for Production, Preview, and Development
```

### Step 3: Initialize Sheets
```bash
curl -X POST https://your-domain.vercel.app/api/courses/init
```

### Step 4: Upload Course Details
```bash
# Edit COURSE_DETAILS_TEMPLATE.json with your data
curl -X POST https://your-domain.vercel.app/api/course-details \
  -H "Content-Type: application/json" \
  -d @COURSE_DETAILS_TEMPLATE.json
```

### Step 5: Verify
```bash
# Check courses
curl https://your-domain.vercel.app/api/courses

# Check course details
curl https://your-domain.vercel.app/api/course-details

# Visit course detail page
https://your-domain.vercel.app/courses/1
```

---

## Files Changed

### Modified Files (7)
1. `src/lib/googleSheets.js` - Separate Leads sheet support
2. `src/lib/courseManager.js` - Separate Courses sheet + CourseDetails functions
3. `src/app/api/courses/route.js` - (No changes, but uses updated functions)
4. `src/app/api/courses/init/route.js` - Initialize both sheets
5. `src/app/courses/[id]/page.js` - Fetch from Google Sheets
6. `src/app/api/leads/route.js` - (No changes, but uses updated functions)
7. `src/models/Course.js` - (No changes needed)

### New Files (4)
1. `src/app/api/course-details/route.js` - Course details API
2. `IMPLEMENTATION_GUIDE.md` - Complete implementation guide
3. `COURSE_DETAILS_TEMPLATE.json` - Sample data format
4. `CHANGES_SUMMARY.md` - This file

---

## Backward Compatibility

All changes are **backward compatible**:
- Existing deployments continue working with `GOOGLE_SHEET_ID`
- New functionality activated when new environment variables added
- No breaking changes to existing APIs
- Graceful fallbacks for missing data

---

## Next Steps

1. **Immediate:**
   - Set up separate spreadsheets
   - Add environment variables
   - Initialize sheets
   - Upload course details

2. **Optional:**
   - Add authentication to POST endpoints
   - Implement rate limiting
   - Add admin UI for managing course details
   - Create CSV import functionality

3. **Future Enhancements:**
   - Auto-sync course updates
   - Version control for course content
   - Multi-language support
   - Rich text editor for course details

---

## Support

For questions or issues:
- Check [`IMPLEMENTATION_GUIDE.md`](IMPLEMENTATION_GUIDE.md) for detailed instructions
- Review server logs in Vercel dashboard
- Verify Google Sheets permissions
- Test API endpoints directly

---

## Summary

✅ **Requirement 1:** Separate sheets for Leads and Courses - IMPLEMENTED
✅ **Requirement 2:** CourseDetails sheet with bulk upload - IMPLEMENTED  
✅ **Requirement 3:** Duplicate validation by course name - IMPLEMENTED

All three requirements have been successfully implemented with full backward compatibility.