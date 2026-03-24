# 🚀 Vercel Deployment Guide (Google Sheets Version)

This guide will walk you through deploying your B2B EdTech Platform from GitHub to Vercel using Google Sheets for data storage.

## 📋 Prerequisites

Before deploying, ensure you have:

- ✅ GitHub account with your code pushed to a repository
- ✅ Vercel account (sign up at [vercel.com](https://vercel.com))
- ✅ Google Sheets set up with service account (see [GOOGLE_SHEETS_SETUP.md](GOOGLE_SHEETS_SETUP.md))
- ✅ Google Analytics property created
- ✅ Gmail account: mygenaiwork4u@gmail.com with App Password

## 🎯 Quick Setup Checklist

### ✅ Step 1: Complete Google Setup

Follow [GOOGLE_SHEETS_SETUP.md](GOOGLE_SHEETS_SETUP.md) to set up:
1. Google Sheet with proper headers
2. Service Account with credentials
3. Google Analytics GA4 property
4. Gmail App Password

You should have these values ready:
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_PRIVATE_KEY`
- `GOOGLE_SHEET_ID`
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- Gmail App Password

### ✅ Step 2: Push Code to GitHub

```bash
cd b2b-edtech-platform
git add .
git commit -m "Updated with Google Sheets integration"
git push origin main
```

### ✅ Step 3: Deploy to Vercel

#### Option A: Using Vercel Dashboard (Recommended)

1. **Login to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub

2. **Import Project**
   - Click "Add New" → "Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Next.js (should auto-detect)
   - **Root Directory**: `b2b-edtech-platform`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

4. **Add Environment Variables**

   Click "Environment Variables" and add:

   ```
   GOOGLE_SERVICE_ACCOUNT_EMAIL
   b2b-edtech-sheets@your-project.iam.gserviceaccount.com

   GOOGLE_PRIVATE_KEY
   "-----BEGIN PRIVATE KEY-----\nYour full private key here\n-----END PRIVATE KEY-----\n"

   GOOGLE_SHEET_ID
   your-google-sheet-id

   EMAIL_HOST
   smtp.gmail.com

   EMAIL_PORT
   587

   EMAIL_USER
   mygenaiwork4u@gmail.com

   EMAIL_PASS
   your-16-char-app-password

   SALES_TEAM_EMAIL
   mygenaiwork4u@gmail.com

   NEXT_PUBLIC_GA_MEASUREMENT_ID
   G-XXXXXXXXXX

   NEXT_PUBLIC_APP_URL
   (Leave empty initially - add after deployment)
   ```

   **⚠️ Important Notes:**
   - For `GOOGLE_PRIVATE_KEY`: Paste the entire key including quotes and `\n` characters
   - Don't convert `\n` to actual line breaks
   - Keep the key exactly as shown in your JSON file

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for deployment
   - Vercel will provide your URL (e.g., `https://your-project.vercel.app`)

6. **Update App URL**
   - Go to Project Settings → Environment Variables
   - Edit `NEXT_PUBLIC_APP_URL`
   - Set it to your Vercel URL
   - Redeploy

#### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Navigate to project
cd b2b-edtech-platform

# Deploy
vercel

# Add environment variables
vercel env add GOOGLE_SERVICE_ACCOUNT_EMAIL
vercel env add GOOGLE_PRIVATE_KEY
vercel env add GOOGLE_SHEET_ID
vercel env add EMAIL_HOST
vercel env add EMAIL_PORT
vercel env add EMAIL_USER
vercel env add EMAIL_PASS
vercel env add SALES_TEAM_EMAIL
vercel env add NEXT_PUBLIC_GA_MEASUREMENT_ID
vercel env add NEXT_PUBLIC_APP_URL

# Deploy to production
vercel --prod
```

---

## 🧪 Verify Deployment

### 1. Test Website Loading
- Visit your Vercel URL
- Verify home page loads correctly
- Check that courses are displayed

### 2. Test Lead Submission
- Click "Enquire Now" on any course
- Fill in and submit the form
- **Check Google Sheet** - new row should appear
- **Check Email** - mygenaiwork4u@gmail.com should receive notification

### 3. Test Google Analytics
- Go to [Google Analytics](https://analytics.google.com)
- Navigate to Realtime report
- Visit your site - you should see yourself in real-time
- Submit a form - check if event is tracked

### 4. Test Admin Panel
- Visit `/admin` on your Vercel URL
- Verify leads from Google Sheet are displayed

---

## 🔄 Continuous Deployment

Vercel automatically deploys when you push to GitHub:
- **Production**: Pushes to `main` branch
- **Preview**: Pull requests get preview URLs

Every commit triggers a new deployment.

---

## 🛠️ Common Issues & Solutions

### Issue: "Permission denied" - Google Sheets

**Solution:**
1. Verify service account email is shared with your sheet
2. Check permission is set to "Editor"
3. Ensure sheet name is exactly "Leads"
4. Verify `GOOGLE_SHEET_ID` is correct

### Issue: "Invalid credentials" - Google Sheets

**Solution:**
1. Check `GOOGLE_PRIVATE_KEY` format:
   - Must include `"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"`
   - Keep `\n` as-is (don't convert to newlines)
   - Wrap entire key in double quotes
2. Regenerate service account key if needed

### Issue: Email not sending

**Solution:**
1. Generate new App Password for Gmail
2. Verify 2-Factor Auth is enabled
3. Check `EMAIL_PASS` has no spaces
4. Ensure `EMAIL_USER` is mygenaiwork4u@gmail.com

### Issue: Google Analytics not tracking

**Solution:**
1. Verify `NEXT_PUBLIC_GA_MEASUREMENT_ID` is correct (starts with G-)
2. Check browser console for errors
3. Disable ad blockers for testing
4. Wait 24-48 hours for standard reports (Realtime works immediately)

### Issue: Build failed on Vercel

**Solution:**
1. Check all environment variables are set
2. Verify Node.js version compatibility
3. Review build logs in Vercel dashboard
4. Ensure `package.json` has correct dependencies

### Issue: API routes return 500 error

**Solution:**
1. Check Vercel function logs
2. Verify all environment variables are set
3. Test Google Sheets API access
4. Check service account permissions

---

## 📊 Monitoring Your Deployment

### Vercel Dashboard
- View deployment status and logs
- Monitor function execution times
- Check for errors and warnings

### Google Sheets
- Real-time lead data
- Export to CSV for analysis
- Share with team members

### Google Analytics
- **Realtime**: Live visitor tracking
- **Acquisition**: Traffic sources
- **Engagement**: Page views, events
- **Conversions**: Form submissions

### Email Notifications
- Instant lead alerts to mygenaiwork4u@gmail.com
- Set up Gmail filters to organize

---

## 🔒 Security Best Practices

- ✅ Never commit `.env.local` or credentials to Git
- ✅ Use environment variables for all secrets
- ✅ Regularly rotate service account keys
- ✅ Monitor Vercel function logs for suspicious activity
- ✅ Keep dependencies updated: `npm audit`
- ✅ Limit Google Sheet sharing to necessary people
- ✅ Use read-only access when possible

---

## 📈 Performance Optimization

### Enable Vercel Analytics

```bash
npm install @vercel/analytics
```

Add to `layout.js`:
```javascript
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### Optimize Google Sheets Performance

1. **Index your data**: Use filters and sorting in Google Sheets
2. **Limit data retrieval**: Only fetch recent leads if needed
3. **Consider archiving**: Move old leads to separate sheet monthly
4. **Use batch operations**: If adding multiple leads, batch them

---

## 🎨 Custom Domain Setup (Optional)

1. **Go to Vercel Project Settings**
   - Navigate to "Domains"
   - Click "Add Domain"

2. **Add Your Domain**
   - Enter your domain name
   - Follow DNS configuration instructions

3. **Update Environment Variables**
   - Change `NEXT_PUBLIC_APP_URL` to your custom domain
   - Update Google Analytics allowed domains
   - Redeploy

---

## 🆘 Getting Help

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Google Sheets API**: [developers.google.com/sheets](https://developers.google.com/sheets)
- **Google Analytics**: [support.google.com/analytics](https://support.google.com/analytics)
- **Project Setup**: [GOOGLE_SHEETS_SETUP.md](GOOGLE_SHEETS_SETUP.md)
- **GitHub Issues**: Report bugs on your repository

---

## 🎉 Next Steps

After successful deployment:

1. ✅ Test all functionality thoroughly
2. ✅ Share your live URL with stakeholders
3. ✅ Set up monitoring and alerts
4. ✅ Configure custom domain (optional)
5. ✅ Train team on admin panel
6. ✅ Set up Google Sheet notifications
7. ✅ Create Google Analytics dashboards
8. ✅ Gather user feedback

---

## 📊 Data Management

### Backing Up Your Data

**Google Sheets** (automatic):
- File → "Version history" for changes
- File → "Make a copy" for backups
- Download as CSV/Excel periodically

### Exporting Leads

1. Open your Google Sheet
2. File → Download → CSV or Excel
3. Save locally or to Google Drive

### Analyzing Leads

Use Google Sheets features:
- **Pivot Tables**: Analyze by course, company, date
- **Charts**: Visualize trends
- **Filters**: Find specific leads
- **Formulas**: Calculate conversion rates

---

**Congratulations! Your B2B EdTech Platform is now live with Google Sheets and Analytics! 🚀**

For detailed setup instructions, see [GOOGLE_SHEETS_SETUP.md](GOOGLE_SHEETS_SETUP.md)