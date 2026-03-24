# ⚡ Quick Deploy to Vercel

Follow these steps to deploy your B2B EdTech Platform from GitHub to Vercel in under 10 minutes!

## ✅ Checklist

Before you start, make sure you have:
- [ ] Code pushed to GitHub
- [ ] Vercel account ([Sign up free](https://vercel.com))
- [ ] MongoDB Atlas account ([Sign up free](https://www.mongodb.com/cloud/atlas))
- [ ] Gmail with App Password ready

---

## 🚀 5-Minute Deployment

### Step 1: MongoDB Atlas (2 minutes)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster (M0 Sandbox)
3. Add database user: `Database Access` → `Add User` → Save username/password
4. Allow all IPs: `Network Access` → `Add IP` → `0.0.0.0/0`
5. Get connection string: `Connect` → `Connect your application` → Copy string
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/b2b-edtech-platform`

### Step 2: Gmail App Password (1 minute)

1. Enable [2-Factor Auth](https://myaccount.google.com/security)
2. Generate [App Password](https://myaccount.google.com/apppasswords)
3. Select "Mail" → "Other" → Name it → Copy 16-char password

### Step 3: Deploy to Vercel (2 minutes)

1. **Go to [vercel.com](https://vercel.com)** → Sign in with GitHub
2. **Import Project** → Select your GitHub repository
3. **Configure**:
   - Root Directory: `b2b-edtech-platform`
   - Framework: Next.js (auto-detected)
4. **Add Environment Variables**:

```env
MONGODB_URI=mongodb+srv://your-username:password@cluster.mongodb.net/b2b-edtech-platform
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-char-app-password
SALES_TEAM_EMAIL=sales@yourcompany.com
NEXT_PUBLIC_APP_URL=(leave empty for now)
```

5. **Click Deploy** → Wait 2-3 minutes

### Step 4: Update App URL (30 seconds)

1. Copy your Vercel URL (e.g., `https://your-project.vercel.app`)
2. Go to `Settings` → `Environment Variables`
3. Edit `NEXT_PUBLIC_APP_URL` → Paste your Vercel URL
4. Redeploy (click "Redeploy" button)

---

## ✅ Verify Deployment

1. **Open your Vercel URL**
2. **Test a course enquiry**:
   - Click "Enquire Now" on any course
   - Fill the form and submit
   - Check your email for notification
3. **Visit `/admin` to see leads**

---

## 🎉 Done!

Your platform is now live! 

**Next Steps:**
- Share your URL with team
- Add custom domain (optional)
- Monitor in Vercel dashboard

**Need more details?** See [DEPLOYMENT.md](DEPLOYMENT.md) for comprehensive guide.

---

## ⚠️ Common Issues

| Issue | Solution |
|-------|----------|
| "MongoDB connection failed" | Check connection string & IP whitelist (0.0.0.0/0) |
| "Email not sending" | Verify App Password (16 chars, no spaces) |
| "Build failed" | Check all environment variables are set |
| "404 on routes" | Set Root Directory to `b2b-edtech-platform` |

**Need help?** Check [DEPLOYMENT.md](DEPLOYMENT.md) for detailed troubleshooting.

---

**🚀 Happy Deploying!**