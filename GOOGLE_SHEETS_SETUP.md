# 📊 Google Sheets Setup Guide

This guide will help you set up Google Sheets integration for storing leads and Google Analytics for tracking.

## 📋 Prerequisites

- Google account (mygenaiwork4u@gmail.com)
- Access to Google Cloud Console
- Access to Google Sheets
- Access to Google Analytics

---

## Part 1: Google Sheets Setup (10 minutes)

### Step 1: Create a Google Sheet

1. **Go to Google Sheets**: [sheets.google.com](https://sheets.google.com)
2. **Create a new spreadsheet**
3. **Name it**: "B2B EdTech Leads"
4. **Rename the first sheet to**: "Leads"

### Step 2: Set Up Headers

In the first row (Row 1), add these headers:

| A | B | C | D | E | F | G | H |
|---|---|---|---|---|---|---|---|
| Timestamp | Name | Email | Phone | Company | Course Name | Message | Status |

### Step 3: Get Sheet ID

1. Look at your browser URL: 
   ```
   https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit
   ```
2. Copy the `SHEET_ID_HERE` part (between `/d/` and `/edit`)
3. Save this ID - you'll need it later

---

## Part 2: Google Cloud Console Setup (15 minutes)

### Step 1: Create a Project

1. **Go to**: [console.cloud.google.com](https://console.cloud.google.com)
2. **Sign in** with mygenaiwork4u@gmail.com
3. **Click** "Select a project" → "New Project"
4. **Name**: "B2B EdTech Platform"
5. **Click** "Create"

### Step 2: Enable Google Sheets API

1. **Go to**: "APIs & Services" → "Library"
2. **Search for**: "Google Sheets API"
3. **Click** "Enable"

### Step 3: Create Service Account

1. **Go to**: "APIs & Services" → "Credentials"
2. **Click**: "Create Credentials" → "Service Account"
3. **Name**: "b2b-edtech-sheets"
4. **Click**: "Create and Continue"
5. **Role**: Select "Editor"
6. **Click**: "Done"

### Step 4: Generate Service Account Key

1. **Click** on the service account you just created
2. **Go to**: "Keys" tab
3. **Click**: "Add Key" → "Create new key"
4. **Choose**: JSON format
5. **Click**: "Create"
6. A JSON file will download - **keep this safe!**

### Step 5: Extract Credentials

Open the downloaded JSON file. You'll need:

```json
{
  "client_email": "b2b-edtech-sheets@project-name.iam.gserviceaccount.com",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
}
```

**Save these values:**
- `client_email` → This is your `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `private_key` → This is your `GOOGLE_PRIVATE_KEY`

### Step 6: Share Sheet with Service Account

1. **Open** your Google Sheet
2. **Click** "Share" button
3. **Paste** the `client_email` (service account email)
4. **Set permission**: "Editor"
5. **Uncheck** "Notify people"
6. **Click** "Share"

---

## Part 3: Google Analytics Setup (10 minutes)

### Step 1: Create GA4 Property

1. **Go to**: [analytics.google.com](https://analytics.google.com)
2. **Sign in** with mygenaiwork4u@gmail.com
3. **Click**: "Admin" (bottom left)
4. **Create Account** (if you don't have one):
   - Account name: "B2B EdTech"
   - Click "Next"

### Step 2: Create Property

1. **Property name**: "B2B EdTech Platform"
2. **Time zone**: Asia/Calcutta
3. **Currency**: INR (Indian Rupee)
4. **Click**: "Next"
5. **Business details**: Select your industry and size
6. **Click**: "Create"
7. **Accept** Terms of Service

### Step 3: Set Up Data Stream

1. **Choose platform**: "Web"
2. **Website URL**: Your Vercel URL (or localhost for testing)
3. **Stream name**: "B2B EdTech Website"
4. **Click**: "Create stream"

### Step 4: Get Measurement ID

1. You'll see a **Measurement ID** like: `G-XXXXXXXXXX`
2. **Copy this ID** - you'll need it for `NEXT_PUBLIC_GA_MEASUREMENT_ID`

---

## Part 4: Configure Environment Variables

### For Local Development

Create `.env.local` file in the `b2b-edtech-platform` directory:

```env
# Google Sheets Configuration
GOOGLE_SERVICE_ACCOUNT_EMAIL=b2b-edtech-sheets@project-name.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour actual private key here\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=your-sheet-id-from-url

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=mygenaiwork4u@gmail.com
EMAIL_PASS=your-gmail-app-password
SALES_TEAM_EMAIL=mygenaiwork4u@gmail.com

# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### For Vercel Deployment

Add these in Vercel Dashboard → Project Settings → Environment Variables:

| Variable Name | Value |
|---------------|-------|
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Your service account email |
| `GOOGLE_PRIVATE_KEY` | Your private key (paste entire key with quotes) |
| `GOOGLE_SHEET_ID` | Your sheet ID from URL |
| `EMAIL_HOST` | smtp.gmail.com |
| `EMAIL_PORT` | 587 |
| `EMAIL_USER` | mygenaiwork4u@gmail.com |
| `EMAIL_PASS` | Your Gmail App Password |
| `SALES_TEAM_EMAIL` | mygenaiwork4u@gmail.com |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | G-XXXXXXXXXX |
| `NEXT_PUBLIC_APP_URL` | Your Vercel URL |

**Important Notes:**
- For `GOOGLE_PRIVATE_KEY`, paste the entire key including `"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"`
- The `\n` characters should remain as-is (they represent newlines)
- Keep the entire key in double quotes

---

## Part 5: Generate Gmail App Password

1. **Go to**: [myaccount.google.com/security](https://myaccount.google.com/security)
2. **Enable 2-Step Verification** (if not enabled)
3. **Go to**: [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
4. **Select app**: "Mail"
5. **Select device**: "Other" → Type "B2B EdTech Platform"
6. **Click**: "Generate"
7. **Copy** the 16-character password
8. **Use this** as `EMAIL_PASS` in your environment variables

---

## 🧪 Testing the Integration

### Test Google Sheets

1. **Run** your application locally:
   ```bash
   cd b2b-edtech-platform
   npm install
   npm run dev
   ```

2. **Submit a test lead** through the website
3. **Check your Google Sheet** - a new row should appear with the lead data

### Test Google Analytics

1. **Visit** your website
2. **Go to** Google Analytics → Reports → Realtime
3. **You should see** your visit in real-time
4. **Submit a lead** and check if the event is tracked

### Test Email Notifications

1. **Submit a lead**
2. **Check** mygenaiwork4u@gmail.com inbox
3. **You should receive** an email notification with lead details

---

## 🔍 Troubleshooting

### "Permission denied" error with Google Sheets

**Solution:**
- Verify service account email is shared with the sheet
- Check that permission is set to "Editor"
- Ensure the sheet name is exactly "Leads"

### "Invalid credentials" error

**Solution:**
- Verify `GOOGLE_PRIVATE_KEY` includes the full key with BEGIN/END markers
- Check that `\n` characters are preserved (not converted to actual newlines)
- Ensure the key is wrapped in double quotes

### Google Analytics not tracking

**Solution:**
- Verify `NEXT_PUBLIC_GA_MEASUREMENT_ID` is correct
- Check browser console for any GA errors
- Ensure ad blockers are disabled for testing
- Wait 24-48 hours for data to appear in standard reports (Realtime should work immediately)

### Email not sending

**Solution:**
- Verify 2-Factor Authentication is enabled on Gmail
- Generate a new App Password
- Check that EMAIL_PASS has no spaces
- Verify EMAIL_USER is mygenaiwork4u@gmail.com

---

## 📊 Viewing Your Data

### Google Sheets
- Open your sheet to see all leads in real-time
- Sort by timestamp to see latest leads
- Use filters to analyze by course, company, etc.

### Google Analytics
- **Realtime**: See live visitors and events
- **Reports**: View aggregated data (24-48 hour delay)
- **Events**: Track form submissions, page views, course interest

### Email Notifications
- Check mygenaiwork4u@gmail.com for instant lead alerts
- Set up filters/labels in Gmail to organize leads

---

## 🎉 You're All Set!

Your B2B EdTech Platform now uses:
- ✅ Google Sheets for lead storage
- ✅ Google Analytics for visitor tracking
- ✅ Gmail for email notifications

Ready to deploy? See [DEPLOYMENT.md](DEPLOYMENT.md) for deployment instructions.