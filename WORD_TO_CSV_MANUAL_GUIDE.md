# 📝 Manual Guide: Converting Your Word Document to CSV

Simple step-by-step guide to convert your training courses Word document to CSV format for upload.

---

## 🎯 Your Document Structure

Your document has **~172 training courses** organized by categories:
- Scrum and Agile (8 courses)
- Project Management (10 courses)  
- Governance (3 courses)
- Six Sigma and Quality (3 courses)
- IT Service Management - ITIL (50+ courses)
- Service Desk Institute - SDI (2 courses)
- SIAM (2 courses)
- ISO Trainings (6 courses)
- DevOps Institute - DOI (9 courses)

---

## 📊 Method 1: Copy-Paste to Excel (Easiest - Recommended!)

### Step 1: Open Excel or Google Sheets

Create a new spreadsheet with these column headers in Row 1:

```
| title | description | duration | level | price | category | instructor | rating | studentsEnrolled |
```

### Step 2: Extract Data from Word

For each course in your Word document, fill in the rows:

**Example - ITIL 4 Foundation:**

| Field | Value | Where to Find |
|-------|-------|---------------|
| **title** | ITIL ® 4 Foundation | Copy the course heading |
| **description** | ITIL 4 Foundation is the latest evolution of the most widely adopted guidance for ITSM... | Copy from "Course Overview" section (first 150-200 words) |
| **duration** | 3 days | Standard for Foundation courses |
| **level** | Beginner | Foundation = Beginner, Practitioner = Intermediate, Lead = Advanced |
| **price** | 0 | Set to 0 for "Free" or actual price |
| **category** | IT Service Management | Based on course type |
| **instructor** | Training Provider | Use generic name |
| **rating** | 4.5 | Default rating |
| **studentsEnrolled** | 0 | Start with 0 |

### Step 3: Quick Reference Table

**Course Level Guide:**
- "Foundation" or "Awareness" → **Beginner**
- "Practitioner" or "Professional" → **Intermediate**  
- "Lead" or "Expert" or "Manager" → **Advanced**

**Duration Guide:**
- Foundation courses → **2-3 days**
- Practitioner courses → **3-5 days**
- Lead/Manager courses → **3-5 days**

**Category Guide:**
| Course Name Contains | Category |
|---------------------|----------|
| Scrum, Agile, Prince2 Agile | Scrum and Agile |
| Prince2, MSP, P3O, MoP, MoV | Project Management |
| COBIT | Governance |
| Six Sigma | Quality Management |
| ITIL, Service Desk, SDI | IT Service Management |
| SIAM | Service Integration |
| ISO, GDPR | ISO Standards |
| DevOps, DOI, SRE, DevSecOps | DevOps |

### Step 4: Save as CSV

1. Go to **File → Save As**
2. Choose **CSV (Comma delimited)** format
3. Save as `courses_to_upload.csv`

---

## 📋 Method 2: Simple Template (For Quick Start)

I've created a template. Just fill in this pattern for each course:

```csv
title,description,duration,level,price,category,instructor,rating,studentsEnrolled
ITIL 4 Foundation,"Comprehensive ITIL 4 training course covering service management fundamentals",3 days,Beginner,0,IT Service Management,Training Provider,4.5,0
Agile Scrum Workshop,"Learn Agile methodologies and Scrum framework for effective project delivery",2 days,Beginner,0,Scrum and Agile,Training Provider,4.5,0
```

**Copy this format and replace with your course data!**

---

## 🚀 Quick Start: Top 20 Popular Courses

Start with these most-requested courses:

### ITIL Courses (Top Priority):
1. ITIL 4 Foundation
2. ITIL 4 Specialist - Create Deliver Support
3. ITIL 4 Specialist - Direct Plan Improve
4. ITIL 4 Specialist - High Velocity IT
5. ITIL 4 Specialist - Drive Stakeholder Value

### DevOps Courses:
6. DOI - DevOps Foundation
7. DOI - DevOps Leader
8. DOI - SRE Foundation
9. DOI - DevSecOps Foundation

### Project Management:
10. Prince2 7 Foundation
11. Prince2 7 Practitioner
12. Agile Scrum Workshop
13. Peoplecert SCRUM Master 1

### Quality & Standards:
14. Six Sigma Green Belt IASSC
15. ISO27001 Lead Auditor
16. ISO9001 Lead Auditor

### Governance:
17. Cobit 5 Foundation
18. SIAM Foundation
19. Service Desk Analyst (SDI)
20. P3O Foundation

**Upload these first, then add the rest later!**

---

## 💡 Smart Tips

### Pricing Strategy (All Free Option):
Set **price = 0** for all courses, then on website show:
- "Free Consultation"
- "Contact for Pricing"  
- "Request Quote"

This encourages leads without showing prices!

### Description Tips:
- Keep descriptions 150-200 characters
- Include main benefits
- Mention certification included
- Add target audience

**Good Example:**
```
"Master ITIL 4 service management fundamentals. Learn ITIL practices, principles, and processes. Includes certification exam. Perfect for IT professionals and service desk teams."
```

### No Instructor Needed:
Just use one of these:
- "Training Provider"
- "Expert Instructor"
- "Certified Trainer"
- Leave blank (system will show generic)

---

## 📥 Sample CSV for Your First 10 Courses

Copy this and modify:

```csv
title,description,duration,level,price,category,instructor,rating,studentsEnrolled
ITIL 4 Foundation,"Master ITIL 4 service management fundamentals. Learn practices and principles. Certification included. Perfect for IT professionals.",3 days,Beginner,0,IT Service Management,Training Provider,4.5,0
DevOps Foundation,"Learn DevOps principles and practices. Understand CI/CD and automation. Great for development teams.",2 days,Beginner,0,DevOps,Training Provider,4.5,0
Prince2 7 Foundation,"Project management fundamentals with Prince2 methodology. Covers principles themes and processes.",3 days,Beginner,0,Project Management,Training Provider,4.5,0
Agile Scrum Workshop,"Hands-on Agile and Scrum training. Learn sprint planning ceremonies and roles. Includes PSM exam prep.",2 days,Beginner,0,Scrum and Agile,Training Provider,4.8,0
Six Sigma Green Belt,"Quality management with Six Sigma DMAIC methodology. Includes tools and techniques for process improvement.",5 days,Intermediate,0,Quality Management,Training Provider,4.6,0
ISO27001 Lead Auditor,"Information security management system auditing. Learn to conduct ISO 27001 audits effectively.",5 days,Advanced,0,ISO Standards,Training Provider,4.7,0
COBIT 5 Foundation,"IT governance framework fundamentals. Understand COBIT processes and practices.",2 days,Beginner,0,Governance,Training Provider,4.5,0
Service Desk Analyst,"Essential skills for service desk professionals. Cover incident management and customer service.",3 days,Beginner,0,IT Service Management,Training Provider,4.6,0
SIAM Foundation,"Service integration and management basics. Learn multi-vendor service delivery.",2 days,Beginner,0,Service Integration,Training Provider,4.5,0
DevSecOps Foundation,"Security in DevOps workflows. Learn secure development and deployment practices.",2 days,Intermediate,0,DevOps,Training Provider,4.6,0
```

**Just copy this, save as .csv, and upload to test the system!**

---

## 🎯 Recommended Workflow

### Week 1: Core Courses (20 courses)
Upload the 20 most popular courses listed above

### Week 2: ITIL Suite (30 courses)
Add all ITIL specialist and practice modules

### Week 3: DevOps & Agile (20 courses)
Add all DevOps Institute and Scrum courses

### Week 4: Complete Collection (Rest)
Add remaining ISO, Governance, and PM courses

**This way you launch quickly and add courses gradually!**

---

## ✅ Final Checklist

Before uploading:

- [ ] Column headers match exactly (title, description, duration, level, price, category, instructor, rating, studentsEnrolled)
- [ ] No empty required fields (title, description, duration, level, price, category, instructor)
- [ ] Descriptions have no line breaks (keep them on one line)
- [ ] Descriptions with commas are in quotes
- [ ] Duration format is consistent (e.g., "3 days" or "2-3 days")
- [ ] Level is one of: Beginner, Intermediate, Advanced
- [ ] Price is numeric (0 for free)
- [ ] Rating is between 0-5
- [ ] File saved as .csv format

---

## 🆘 Troubleshooting

### "Upload failed - Invalid format"
**Fix:** Check that column headers match exactly

### "Missing required fields"
**Fix:** Ensure title, description, duration, level, price, category, instructor are filled

### "Commas breaking CSV"
**Fix:** Put descriptions with commas in quotes: "Training course, covering basics"

### "Excel changed my format"
**Fix:** Save as "CSV UTF-8 (Comma delimited)" not regular CSV

---

## 🎉 You're Ready!

1. Create your CSV file using Method 1 or 2
2. Go to your website: `/admin/courses`
3. Click "Initialize Courses Sheet" (first time only)
4. Upload your CSV file
5. Done! Courses appear on homepage

**Start with 10-20 courses to test, then add the rest!**

---

**Need help? Check [COURSE_UPLOAD_GUIDE.md](COURSE_UPLOAD_GUIDE.md) for more details!**