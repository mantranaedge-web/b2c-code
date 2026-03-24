# 📚 Course Bulk Upload Guide

This guide explains how to upload your course data from Word document to your B2B EdTech Platform.

## 🎯 Overview

You have **3 easy methods** to upload courses:
1. **CSV Upload** (Recommended - Easiest from Word)
2. **JSON Upload** (For developers)
3. **Direct Google Sheets** (Manual entry)

---

## Method 1: CSV Upload from Word Document (⭐ Recommended)

### Step 1: Organize Your Word Document Data

Your Word document should have course information. Organize it into these fields:

| Field | Description | Example |
|-------|-------------|---------|
| **title** | Course name | "Full Stack Web Development" |
| **description** | Course description | "Master modern web development..." |
| **duration** | Course length | "12 weeks" |
| **level** | Beginner/Intermediate/Advanced | "Intermediate" |
| **price** | Price in rupees | 49999 |
| **category** | Course category | "Web Development" |
| **instructor** | Instructor name | "Rajesh Kumar" |
| **rating** | Rating 0-5 (optional) | 4.8 |
| **studentsEnrolled** | Number of students (optional) | 2500 |

### Step 2: Convert to Excel/Google Sheets

1. **Open Excel or Google Sheets**
2. **Create columns** with these headers (first row):
   ```
   title | description | duration | level | price | category | instructor | rating | studentsEnrolled
   ```
3. **Copy data from Word** and paste into rows below headers
4. **Fill in each column** with your course data

### Step 3: Export as CSV

**In Excel:**
- File → Save As → Choose "CSV (Comma delimited)"

**In Google Sheets:**
- File → Download → Comma Separated Values (.csv)

### Step 4: Upload to Platform

1. **Go to**: `http://your-site.com/admin/courses`
2. **Click**: "Initialize Courses Sheet" (first time only)
3. **Choose**: "CSV Format" tab
4. **Upload CSV file** or paste CSV content
5. **Click**: "Upload Courses"

✅ Done! Your courses are now live!

---

## Method 2: Direct Copy-Paste from Word

If you don't want to use Excel:

### Step 1: Format Your Word Data

In your Word document, format data like this:

```
Course 1:
Title: Full Stack Web Development
Description: Master modern web development with React, Node.js, and MongoDB
Duration: 12 weeks
Level: Intermediate
Price: 49999
Category: Web Development
Instructor: Rajesh Kumar
Rating: 4.8
Students: 2500

Course 2:
Title: Data Science & Machine Learning
...
```

### Step 2: Convert to CSV Format

Create a text file with this format:

```csv
title,description,duration,level,price,category,instructor,rating,studentsEnrolled
Full Stack Web Development,"Master modern web development with React, Node.js, and MongoDB",12 weeks,Intermediate,49999,Web Development,Rajesh Kumar,4.8,2500
Data Science & Machine Learning,"Learn Python, data analysis, and machine learning algorithms",16 weeks,Advanced,59999,Data Science,Priya Sharma,4.9,1800
```

**Important CSV Rules:**
- First line = headers (don't change these)
- Separate values with commas
- Put descriptions with commas inside quotes: `"description text, here"`
- No spaces after commas (except in descriptions)

### Step 3: Upload

1. Go to `/admin/courses`
2. Paste your CSV content
3. Click "Upload Courses"

---

## Method 3: JSON Format (For Technical Users)

### Step 1: Format as JSON

```json
[
  {
    "title": "Full Stack Web Development",
    "description": "Master modern web development with React, Node.js, and MongoDB",
    "duration": "12 weeks",
    "level": "Intermediate",
    "price": 49999,
    "category": "Web Development",
    "instructor": "Rajesh Kumar",
    "rating": 4.8,
    "studentsEnrolled": 2500
  },
  {
    "title": "Data Science & Machine Learning",
    "description": "Learn Python, data analysis, and machine learning algorithms",
    "duration": "16 weeks",
    "level": "Advanced",
    "price": 59999,
    "category": "Data Science",
    "instructor": "Priya Sharma",
    "rating": 4.9,
    "studentsEnrolled": 1800
  }
]
```

### Step 2: Upload

1. Go to `/admin/courses`
2. Click "JSON Format" tab
3. Paste your JSON
4. Click "Upload Courses"

---

## 🎨 Using the Template

We've provided a template file: [`courses-template.csv`](courses-template.csv)

### How to Use:

1. **Download** the template file
2. **Open** in Excel or Google Sheets
3. **Replace** sample data with your courses
4. **Save** as CSV
5. **Upload** to platform

---

## 📝 Quick Example: Converting Word to CSV

**Your Word Document:**
```
Course Name: Python Programming
About: Learn Python from basics to advanced
How long: 10 weeks
Difficulty: Beginner
Cost: 29999
Subject: Programming
Teacher: Amit Kumar
Stars: 4.5
Enrolled: 1500
```

**Convert to CSV Row:**
```csv
Python Programming,"Learn Python from basics to advanced",10 weeks,Beginner,29999,Programming,Amit Kumar,4.5,1500
```

---

## 🔍 Field Validation

### Required Fields:
- ✅ title
- ✅ description
- ✅ duration
- ✅ level (must be: Beginner, Intermediate, or Advanced)
- ✅ price (number only)
- ✅ category
- ✅ instructor

### Optional Fields:
- rating (default: 0)
- studentsEnrolled (default: 0)

### Common Mistakes:

❌ **Wrong:**
```csv
title,description,duration,level,price
My Course,This is good,10 weeks,Expert,49,999
```

✅ **Correct:**
```csv
title,description,duration,level,price,category,instructor,rating,studentsEnrolled
My Course,This is good,10 weeks,Intermediate,49999,Technology,John Doe,4.5,100
```

**Issues Fixed:**
- Level changed from "Expert" to "Intermediate" (valid option)
- Price changed from "49,999" to "49999" (no commas in numbers)
- Added required fields: category, instructor
- Added optional fields: rating, studentsEnrolled

---

## 🚀 Step-by-Step Upload Process

### Step 1: Access Admin Panel

1. Go to your website
2. Navigate to `/admin`
3. Click "📤 Upload Courses" button

### Step 2: Initialize (First Time Only)

1. Click "Initialize Courses Sheet"
2. Wait for success message
3. This creates a "Courses" sheet in your Google Sheet

### Step 3: Prepare Your Data

Choose your method:
- **CSV**: Follow Method 1 above
- **JSON**: Follow Method 3 above

### Step 4: Upload

1. Select upload method (CSV or JSON)
2. Either:
   - Upload CSV file, OR
   - Paste CSV/JSON content
3. Click "Upload Courses"
4. Wait for success message

### Step 5: Verify

1. Go back to home page
2. Your courses should appear!
3. Check Google Sheet to see stored data

---

## 💾 Where Data is Stored

Your courses are stored in:
- **Google Sheet**: In "Courses" tab
- **Visible**: Anyone with sheet access can view/edit
- **Columns**: Title, Description, Duration, Level, Price, Category, Instructor, Rating, Students, Status, Created At

---

## 🔧 Troubleshooting

### "Failed to upload courses"
**Solutions:**
- Check all required fields are present
- Verify level is: Beginner, Intermediate, or Advanced
- Ensure price is a number (no commas)
- Check CSV format (commas in right places)

### "Invalid CSV format"
**Solutions:**
- First line must be headers
- Use commas to separate values
- Put descriptions with commas in quotes
- No extra spaces

### "Invalid JSON format"
**Solutions:**
- Validate JSON at jsonlint.com
- Check all brackets and braces match
- Ensure quotes around strings
- No trailing commas

### Courses not appearing on homepage
**Solutions:**
- Refresh the page
- Check browser console for errors
- Verify courses have status "active" in Google Sheet
- Check environment variables are set

---

## 📊 Managing Courses After Upload

### View All Courses
- Check your Google Sheet "Courses" tab
- Each row = one course

### Edit Course
- Open Google Sheet
- Find the course row
- Edit any field
- Changes appear immediately on website

### Delete Course
- In Google Sheet, change Status column to "inactive"
- Course will be hidden from website

### Update Course
- Edit the row in Google Sheet
- Save changes
- Refresh website to see updates

---

## 🎓 Tips for Best Results

1. **Prepare in Excel First**: Easier to organize and validate
2. **Use Template**: Ensures correct format
3. **Test with 1-2 Courses**: Upload small batch first
4. **Check Google Sheet**: Verify data after upload
5. **Price in Rupees**: Enter as whole number (49999, not 49,999)
6. **Consistent Categories**: Use same category names for grouping
7. **Good Descriptions**: Clear, compelling text sells courses

---

## 📱 Access Points

- **Upload Page**: `/admin/courses`
- **Admin Panel**: `/admin`
- **Home Page**: `/`
- **Google Sheet**: Your configured spreadsheet

---

## 🆘 Need Help?

1. Check the upload page for sample formats
2. Download and use the template file
3. Verify Google Sheets setup in [GOOGLE_SHEETS_SETUP.md](GOOGLE_SHEETS_SETUP.md)
4. Check environment variables are configured

---

**Happy Uploading! 🚀**