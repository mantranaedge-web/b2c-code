# 🚀 Getting Started - Simple Step-by-Step Guide

**For**: Getting your B2B EdTech Platform live with your 172 training courses

---

## 📋 What You Need to Do (Overview)

There are **3 main tasks**:

1. **Setup Google Services** (30 minutes)
   - Google Sheets for storing data
   - Google Cloud for API access
   - Google Analytics for tracking
   - Gmail App Password for emails

2. **Convert Your Word Document to CSV** (15-30 minutes)
   - Option A: Manual (copy-paste to Excel) - EASIEST
   - Option B: Python script (automated) - if you're technical

3. **Deploy to Vercel** (15 minutes)
   - Push code to GitHub
   - Deploy on Vercel
   - Add environment variables

**Total Time: ~60-75 minutes**

---

## 🎯 Task 1: Setup Google Services

### Using Your Current Email vs Company Email

**For Now (Testing):**
✅ Use **mygenaiwork4u@gmail.com** for everything
- Google Sheets ✅
- Google Cloud Console ✅
- Google Analytics ✅
- Email notifications ✅

**Later (Production):**
When you get company email (e.g., admin@yourcompany.com):
- Transfer ownership of Google Sheet
- Change email in environment variables
- Update Google Analytics admin
- Change Gmail App Password

**Good News:** Easy to switch later! Start with your current Gmail.

---

### Step 1.1: Create Google Sheet (5 minutes)

**Using: mygenaiwork4u@gmail.com**

1. **Go to**: [sheets.google.com](https://sheets.google.com)
2. **Sign in** with mygenaiwork4u@gmail.com
3. **Click**: ➕ Blank spreadsheet
4. **Name it**: "B2B EdTech Platform"
5. **Create TWO sheets** (tabs at bottom):
   - Rename "Sheet1" to **"Leads"**
   - Click ➕ to add sheet, name it **"Courses"**

6. **In "Leads" tab**, add these headers in Row 1:
   ```
   Timestamp | Name | Email | Phone | Company | Course Name | Message | Status
   ```

7. **In "Courses" tab**, add these headers in Row 1:
   ```
   Title | Description | Duration | Level | Price | Category | Instructor | Rating | Students Enrolled | Status | Created At
   ```

8. **Get Sheet ID** from URL:
   ```
   https://docs.google.com/spreadsheets/d/https://docs.google.com/spreadsheets/d/1F6oB6aBGBP0smyrYfJggbpfFwFx2z05Z6Bl-GOj4Q4c/edit
   ```
   Copy the `YOUR_SHEET_ID_HERE` -> 'https://docs.google.com/spreadsheets/d/1F6oB6aBGBP0smyrYfJggbpfFwFx2z05Z6Bl-GOj4Q4c' part - you'll need this later!

**✅ Done! Your Google Sheet is ready.**

---

### Step 1.2: Setup Google Cloud Console (15 minutes)

**Using: mygenaiwork4u@gmail.com**

#### Create Project:

1. **Go to**: [console.cloud.google.com](https://console.cloud.google.com)
2. **Sign in** with mygenaiwork4u@gmail.com
3. **Click** "Select a project" (top bar) → "New Project"
4. **Project name**: "B2B EdTech Platform"
5. **Click** "Create" (wait 30 seconds)

#### Enable Google Sheets API:

6. **Click** "☰" menu (top left) → "APIs & Services" → "Library"
7. **Search for**: "Google Sheets API"
8. **Click** on it → Click "Enable" (wait 10 seconds)

#### Create Service Account:

9. **Click** "☰" menu → "APIs & Services" → "Credentials"
10. **Click** "Create Credentials" → "Service Account"
11. **Service account name**: "b2b-edtech-service"
12. **Click** "Create and Continue"
13. **Role**: Select "Editor"
14. **Click** "Continue" → "Done"

#### Download Credentials:

15. **Find** your service account in the list
16. **Click** on "b2b-edtech-service@..." email
17. **Go to** "Keys" tab
18. **Click** "Add Key" → "Create new key"
19. **Choose** "JSON"
20. **Click** "Create"
21. A JSON file downloads - **SAVE THIS FILE SAFELY!**

#### Share Google Sheet with Service Account:

22. **Open** the JSON file you just downloaded
23. **Find** and copy the `client_email` value (looks like: b2b-edtech-service@your-project.iam.gserviceaccount.com)
24. **Go back** to your Google Sheet
25. **Click** "Share" button (top right)
26. **Paste** the service account email
27. **Choose** "Editor"
28. **Uncheck** "Notify people"
29. **Click** "Share"

**✅ Done! Google Cloud is configured.**

---

### Step 1.3: Setup Google Analytics (5 minutes)

**Using: mygenaiwork4u@gmail.com**

1. **Go to**: [analytics.google.com](https://analytics.google.com)
2. **Sign in** with mygenaiwork4u@gmail.com
3. **Click** "Start measuring" (or "Admin" if you have account)
4. **Account name**: "B2B EdTech"
5. **Click** "Next"
6. **Property name**: "B2B Training Platform"
7. **Time zone**: Asia/Calcutta (UTC+5:30)
8. **Currency**: INR - Indian Rupee
9. **Click** "Next"
10. **Business details**: Select your options
11. **Click** "Create" → Accept terms
12. **Choose platform**: "Web"
13. **Website URL**: http://localhost:3000 (for now, change after deployment)
14. **Stream name**: "B2B EdTech Website"
15. **Click** "Create stream"

16. **IMPORTANT**: Copy the **Measurement ID** (looks like: `G-XXXXXXXXXX`) -> G-375T0FBV7W
    You'll need this later!

**✅ Done! Google Analytics is ready.**

---

### Step 1.4: Generate Gmail App Password (5 minutes)

**Using: mygenaiwork4u@gmail.com
Password: Gen@iwork4u**

1. **Go to**: [myaccount.google.com/security](https://myaccount.google.com/security)
2. **Sign in** with mygenaiwork4u@gmail.com / Gen@iwork4u
3. **Find** "2-Step Verification" → Turn it ON if not already
4. **Go to**: [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
5. **App name**: Type "B2B EdTech Platform"
6. **Click** "Create"
7. **COPY** the 16-character password (looks like: `abcd efgh ijkl mnop`) -> 'kdsf cirk djnw dusj'
8. **SAVE THIS PASSWORD** - you'll need it for email!

**✅ Done! Gmail App Password created.**

---

### Step 1.5: Collect Your Credentials

**You now have 5 important values:**

1. **GOOGLE_SHEET_ID**: From Step 1.1 (from Google Sheet URL)
2. **GOOGLE_SERVICE_ACCOUNT_EMAIL**: From JSON file (client_email field)
3. **GOOGLE_PRIVATE_KEY**: From JSON file (private_key field - entire key!)
4. **GOOGLE_ANALYTICS_ID**: From Step 1.3 (Measurement ID: G-XXXXXXXXXX)
5. **GMAIL_APP_PASSWORD**: From Step 1.4 (16-character password)

**Keep these safe - you'll use them in deployment!**

---

## 🎯 Task 2: Convert Your Word Document to CSV

You have **2 options**:

---

### Option A: Manual Method (RECOMMENDED - No coding needed!)

**Time: 15-30 minutes**

This is the EASIEST way! Follow the guide: [`WORD_TO_CSV_MANUAL_GUIDE.md`](WORD_TO_CSV_MANUAL_GUIDE.md)

**Quick Steps:**

1. **Open Excel or Google Sheets**
2. **Create columns**: title, description, duration, level, price, category, instructor, rating, studentsEnrolled
3. **From your Word doc**, for each course:
   - Copy course name → title column
   - Copy description → description column
   - Add duration (e.g., "3 days")
   - Add level (Beginner/Intermediate/Advanced)
   - Set price to `0` (for "Contact for Pricing")
   - Add category (e.g., "IT Service Management")
   - Instructor: "Training Provider"
   - Rating: 4.5
   - Students: 0

4. **Start with 10-20 courses** to test
5. **Save as CSV**

**Sample CSV included in the manual guide - just copy and modify!**

---

### Option B: Python Script (For Technical Users)

**Time: 10 minutes (after Python setup)**

**Requirements:**
- Python 3 installed on your computer
- Basic command line knowledge

**Steps:**

1. **Open** your Word document
2. **Select All** (Ctrl+A) and **Copy** (Ctrl+C)
3. **Create** a text file named `course_data.txt` in the `b2b-edtech-platform/tools/` folder
4. **Paste** the content into `course_data.txt`
5. **Open terminal** in the `tools` folder
6. **Run**: 
   ```bash
   python word_to_csv_converter.py
   ```
7. **Script creates**: `courses_ready_to_upload.csv`
8. **Review** the CSV in Excel/Google Sheets
9. **Adjust** any data as needed

---

### Which Method Should You Use?

**Use Manual Method if:**
- ✅ You're not familiar with Python
- ✅ You want full control over each course
- ✅ You prefer working in Excel/Google Sheets
- ✅ You want to start with just 10-20 courses

**Use Python Script if:**
- ✅ You have Python installed
- ✅ You want to convert all 172 courses quickly
- ✅ You're comfortable with command line
- ✅ You can review and adjust afterwards

**My Recommendation: Start with Manual Method for first 20 courses, then decide!**

---

## 🎯 Task 3: Deploy to Vercel

Follow the complete guide: [`DEPLOYMENT_UPDATED.md`](DEPLOYMENT_UPDATED.md)

**Quick Steps:**

1. **Install dependencies**:
   ```bash
   cd b2b-edtech-platform
   npm install
   ```

2. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Updated with Google Sheets integration"
   git push origin main
   ```

3. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Import your repository
   - Add environment variables (from Task 1.5)
   - Deploy!

4. **Add Environment Variables** in Vercel:
   ```
   GOOGLE_SHEET_ID=your-sheet-id
   GOOGLE_SERVICE_ACCOUNT_EMAIL=service-account@project.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=mygenaiwork4u@gmail.com
   EMAIL_PASS=your-16-char-app-password
   SALES_TEAM_EMAIL=mygenaiwork4u@gmail.com
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   NEXT_PUBLIC_APP_URL=(your Vercel URL after first deployment)
   ```

---

## 🎉 After Deployment

1. **Visit** your Vercel URL
2. **Go to** `/admin/courses`
3. **Click** "Initialize Courses Sheet" (one time only)
4. **Upload** your CSV file
5. **Check** homepage - courses should appear!
6. **Test** lead form submission
7. **Check** Google Sheet - lead should appear!
8. **Check** Google Analytics - visit should be tracked!

---

## 📧 Switching to Company Email Later

When you get company email (e.g., admin@yourcompany.com):

1. **Google Sheet**: Share with new email, transfer ownership
2. **Google Cloud**: Add new email as owner
3. **Google Analytics**: Add as administrator
4. **Environment Variables**: Update EMAIL_USER and SALES_TEAM_EMAIL in Vercel
5. **Gmail**: Generate new App Password for company email

**Everything else stays the same!**

---

## ❓ FAQ

**Q: Can I use different emails for different services?**
A: Yes! But easier to use one email for now, switch later.

**Q: Will data be lost when switching emails?**
A: No! Just transfer ownership/add as admin.

**Q: Can non-technical people manage courses?**
A: Yes! Just edit the Google Sheet directly - changes reflect immediately.

**Q: How do I add more courses later?**
A: Either upload new CSV or add directly to Google Sheet.

**Q: What if I need help?**
A: Check the detailed guides:
- [`GOOGLE_SHEETS_SETUP.md`](GOOGLE_SHEETS_SETUP.md)
- [`DEPLOYMENT_UPDATED.md`](DEPLOYMENT_UPDATED.md)
- [`WORD_TO_CSV_MANUAL_GUIDE.md`](WORD_TO_CSV_MANUAL_GUIDE.md)

---

## ✅ Checklist

### Task 1: Google Services
- [ ] Created Google Sheet with "Leads" and "Courses" tabs
- [ ] Saved Google Sheet ID
- [ ] Created Google Cloud project
- [ ] Enabled Google Sheets API
- [ ] Created Service Account and downloaded JSON
- [ ] Shared Google Sheet with Service Account
- [ ] Set up Google Analytics and got Measurement ID
- [ ] Generated Gmail App Password
- [ ] Saved all 5 credentials safely

### Task 2: Convert Courses
- [ ] Chose Manual or Python method
- [ ] Created CSV file with courses
- [ ] Started with 10-20 courses for testing
- [ ] Verified CSV format is correct

### Task 3: Deploy
- [ ] Pushed code to GitHub
- [ ] Deployed to Vercel
- [ ] Added all environment variables
- [ ] Initialized Courses sheet
- [ ] Uploaded CSV
- [ ] Tested website functionality

---

**You're ready to launch! 🚀**

**Current email**: mygenaiwork4u@gmail.com
**Later switch to**: company@domain.com (when ready)

All services work the same way!


## Environment Variables in vercel
Click "Add" multiple times to add these environment variables:

(Get these values from your Google setup in GETTING_STARTED_SIMPLE.md)

Add these 9 environment variables:
.....
1. GOOGLE_SHEET_ID
   Value: [Your Sheet ID from Google Sheets URL]
   Example: 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms

2. GOOGLE_SERVICE_ACCOUNT_EMAIL
   Value: [From your JSON file - client_email]
   Example: b2b-edtech-service@your-project.iam.gserviceaccount.com

3. GOOGLE_PRIVATE_KEY
   Value: [From your JSON file - private_key - ENTIRE KEY with quotes and \n]
   Example: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBg...\n-----END PRIVATE KEY-----\n"
   ⚠️ Keep the quotes and \n exactly as in JSON file!

4. EMAIL_HOST
   Value: smtp.gmail.com

5. EMAIL_PORT
   Value: 587

6. EMAIL_USER
   Value: mygenaiwork4u@gmail.com

7. EMAIL_PASS
   Value: [Your 16-character Gmail App Password]
   Example: abcd efgh ijkl mnop (without spaces: abcdefghijklmnop)

8. SALES_TEAM_EMAIL
   Value: mygenaiwork4u@gmail.com

9. NEXT_PUBLIC_GA_MEASUREMENT_ID
   Value: [Your Google Analytics Measurement ID]
   Example: G-XXXXXXXXXX
