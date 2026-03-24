# 🚀 Vercel Deployment Guide

This guide will walk you through deploying your B2B EdTech Platform from GitHub to Vercel.

## 📋 Prerequisites

Before deploying, ensure you have:

- ✅ GitHub account with your code pushed to a repository
- ✅ Vercel account (sign up at [vercel.com](https://vercel.com))
- ✅ MongoDB Atlas account for production database
- ✅ Gmail account with App Password for email notifications

## 🎯 Step-by-Step Deployment

### Step 1: Prepare MongoDB Atlas (Production Database)

1. **Create MongoDB Atlas Account**
   - Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for a free account

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose "M0 Sandbox" (Free tier)
   - Select a cloud provider and region closest to your users
   - Click "Create Cluster"

3. **Set Up Database Access**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Create a username and password (save these securely!)
   - Set user privileges to "Read and write to any database"

4. **Configure Network Access**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Confirm

5. **Get Connection String**
   - Go to "Database" in the left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://username:<password>@cluster.mongodb.net/`)
   - Replace `<password>` with your actual password
   - Add your database name at the end: `mongodb+srv://username:password@cluster.mongodb.net/b2b-edtech-platform`

### Step 2: Prepare Gmail App Password

1. **Enable 2-Factor Authentication**
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Enable 2-Step Verification

2. **Generate App Password**
   - Go to [App Passwords](https://myaccount.google.com/apppasswords)
   - Select "Mail" and "Other (Custom name)"
   - Name it "B2B EdTech Platform"
   - Copy the 16-character password (save this securely!)

### Step 3: Deploy to Vercel

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
   Click "Environment Variables" and add the following:

   ```
   MONGODB_URI
   mongodb+srv://your-username:your-password@cluster.mongodb.net/b2b-edtech-platform

   EMAIL_HOST
   smtp.gmail.com

   EMAIL_PORT
   587

   EMAIL_USER
   your-email@gmail.com

   EMAIL_PASS
   your-16-char-app-password

   SALES_TEAM_EMAIL
   sales@yourcompany.com

   NEXT_PUBLIC_APP_URL
   (Leave empty for now - Vercel will provide this)
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for deployment to complete
   - Vercel will provide your deployment URL (e.g., `https://your-project.vercel.app`)

6. **Update App URL**
   - Go to Project Settings → Environment Variables
   - Edit `NEXT_PUBLIC_APP_URL` and set it to your Vercel URL
   - Redeploy the project

#### Option B: Using Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Navigate to Project Directory**
   ```bash
   cd b2b-edtech-platform
   ```

4. **Deploy**
   ```bash
   vercel
   ```

5. **Follow Prompts**
   - Set up and deploy: Yes
   - Which scope: Select your account
   - Link to existing project: No
   - Project name: Accept default or customize
   - Directory: Accept default (.)
   - Override settings: No

6. **Add Environment Variables**
   ```bash
   vercel env add MONGODB_URI
   vercel env add EMAIL_HOST
   vercel env add EMAIL_PORT
   vercel env add EMAIL_USER
   vercel env add EMAIL_PASS
   vercel env add SALES_TEAM_EMAIL
   vercel env add NEXT_PUBLIC_APP_URL
   ```

7. **Deploy to Production**
   ```bash
   vercel --prod
   ```

### Step 4: Verify Deployment

1. **Visit Your Site**
   - Open the Vercel URL in your browser
   - Check that the home page loads correctly

2. **Test Lead Submission**
   - Click "Enquire Now" on a course
   - Fill in the form and submit
   - Check that you receive an email notification

3. **Test Admin Panel**
   - Visit `/admin` route
   - Verify that leads are displayed

### Step 5: Set Up Custom Domain (Optional)

1. **Go to Project Settings**
   - Navigate to your project in Vercel dashboard
   - Click "Settings" → "Domains"

2. **Add Domain**
   - Enter your domain name
   - Follow Vercel's instructions to update DNS records

3. **Update Environment Variables**
   - Update `NEXT_PUBLIC_APP_URL` with your custom domain
   - Redeploy

## 🔄 Continuous Deployment

Vercel automatically deploys:
- **Production**: When you push to `main` branch
- **Preview**: When you open a pull request

Every commit triggers a new deployment with a unique URL.

## 🛠️ Common Issues & Solutions

### Issue: "MongoDB connection failed"
**Solution**: 
- Verify MongoDB connection string is correct
- Ensure IP address 0.0.0.0/0 is whitelisted in MongoDB Atlas
- Check username and password are correct

### Issue: "Email not sending"
**Solution**:
- Verify Gmail App Password is correct (16 characters, no spaces)
- Check that 2-Factor Authentication is enabled
- Ensure EMAIL_USER and EMAIL_PASS are set correctly

### Issue: "Build failed"
**Solution**:
- Check that all environment variables are set
- Verify Node.js version is compatible (use Node 18+)
- Check build logs in Vercel dashboard

### Issue: "API routes not working"
**Solution**:
- Ensure root directory is set to `b2b-edtech-platform`
- Verify Next.js version is 14+
- Check that API routes are in `src/app/api/` directory

## 📊 Monitoring Your Deployment

1. **Vercel Analytics**
   - Enable in Project Settings → Analytics
   - Monitor page views, performance, and errors

2. **MongoDB Atlas Monitoring**
   - Check database metrics in Atlas dashboard
   - Monitor connection counts and query performance

3. **Email Logs**
   - Check Gmail sent folder for email notifications
   - Monitor Nodemailer logs in Vercel function logs

## 🔒 Security Best Practices

- ✅ Never commit `.env.local` or secrets to Git
- ✅ Use environment variables for all sensitive data
- ✅ Regularly rotate MongoDB and email passwords
- ✅ Monitor Vercel function logs for suspicious activity
- ✅ Keep dependencies updated with `npm audit`

## 📈 Performance Optimization

1. **Enable Vercel Speed Insights**
   ```bash
   npm install @vercel/speed-insights
   ```

2. **Add to layout.js**
   ```javascript
   import { SpeedInsights } from '@vercel/speed-insights/next'
   
   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           {children}
           <SpeedInsights />
         </body>
       </html>
     )
   }
   ```

3. **Enable Image Optimization**
   - Use Next.js Image component
   - Configure domains in next.config.js

## 🆘 Getting Help

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Vercel Support**: support@vercel.com
- **MongoDB Atlas Support**: [docs.mongodb.com](https://docs.mongodb.com)
- **Project Issues**: GitHub Issues page

## 🎉 Next Steps

After successful deployment:

1. ✅ Test all functionality thoroughly
2. ✅ Set up custom domain
3. ✅ Configure monitoring and alerts
4. ✅ Share your live site URL
5. ✅ Gather user feedback

---

**Congratulations! Your B2B EdTech Platform is now live on Vercel! 🚀**