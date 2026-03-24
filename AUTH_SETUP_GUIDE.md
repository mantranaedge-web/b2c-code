# Authentication Setup Guide

This guide will help you set up authentication for your B2B EdTech platform admin panel.

## 📋 Overview

The platform uses **NextAuth.js** with credentials-based authentication for secure admin access. All admin routes (`/admin/*`) are protected and require login.

## 🔐 Environment Variables

Add the following variables to your `.env` file (or Vercel environment variables):

```bash
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000  # Change to your production URL in Vercel
NEXTAUTH_SECRET=your-super-secret-key-min-32-chars-long

# Admin Credentials
ADMIN_EMAIL=admin@edtech.com
ADMIN_PASSWORD=YourSecurePassword123!
# OR use hashed password (recommended for production)
ADMIN_PASSWORD_HASH=$2a$10$...hashhere...

# Existing Google Sheets variables
GOOGLE_SHEET_ID=your_sheet_id
GOOGLE_COURSES_SHEET_ID=your_courses_sheet_id
GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Email Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password
```

## 🔑 Generating Secure Credentials

### 1. Generate NEXTAUTH_SECRET

Run this command in your terminal:

```bash
openssl rand -base64 32
```

Or use Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 2. Generate Password Hash (Recommended for Production)

We've created a utility script for you. Run:

```bash
node b2b-edtech-platform/scripts/generate-password-hash.js
```

Follow the prompts to enter your desired admin password. The script will output:
- Plain password (for development)
- Bcrypt hash (for production)

**Important:** Use `ADMIN_PASSWORD_HASH` in production for better security!

## 🚀 Quick Setup Steps

### Development (Local)

1. **Copy environment variables:**
   ```bash
   cd b2b-edtech-platform
   cp .env.example .env
   ```

2. **Set admin credentials in `.env`:**
   ```bash
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=generate-using-command-above
   ADMIN_EMAIL=admin@edtech.com
   ADMIN_PASSWORD=your-password  # Plain text OK for dev
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Access admin panel:**
   - Go to: `http://localhost:3000/admin`
   - You'll be redirected to login page
   - Enter your credentials
   - After login, you'll be redirected to admin dashboard

### Production (Vercel)

1. **Go to your Vercel project settings → Environment Variables**

2. **Add these variables:**
   ```
   NEXTAUTH_URL → https://your-domain.vercel.app
   NEXTAUTH_SECRET → (generated secret)
   ADMIN_EMAIL → admin@yourdomain.com
   ADMIN_PASSWORD_HASH → (generated hash from script)
   ```

3. **Redeploy your application** after adding variables

4. **Test login at:** `https://your-domain.vercel.app/admin`

## 👥 Adding Multiple Admin Users

To add more admin users, edit [`src/app/api/auth/[...nextauth]/route.js`](src/app/api/auth/[...nextauth]/route.js):

```javascript
const ADMIN_USERS = [
  {
    id: '1',
    name: 'Admin',
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD_HASH,
    role: 'admin',
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'john@edtech.com',
    password: '$2a$10$...',  // Generate using script
    role: 'admin',
  },
];
```

## 🔒 Security Best Practices

### ✅ DO:
- Use `ADMIN_PASSWORD_HASH` in production (never plain password)
- Use strong passwords (min 12 characters, mixed case, numbers, symbols)
- Keep `NEXTAUTH_SECRET` secure and unique
- Use HTTPS in production (Vercel handles this automatically)
- Rotate passwords periodically
- Use different passwords for different environments

### ❌ DON'T:
- Commit `.env` file to Git (it's in `.gitignore`)
- Share admin credentials via email/slack
- Use same password across environments
- Use simple passwords like "admin123"

## 🛠️ Troubleshooting

### Issue: "Invalid email or password"
**Solution:** Check that:
- `ADMIN_EMAIL` matches what you're entering
- `ADMIN_PASSWORD` or `ADMIN_PASSWORD_HASH` is correctly set
- No extra spaces in environment variables

### Issue: Redirected to login after signing in
**Solution:** 
- Verify `NEXTAUTH_URL` matches your domain exactly
- Check `NEXTAUTH_SECRET` is set and at least 32 characters
- Clear browser cookies and try again

### Issue: "Configuration error" in console
**Solution:**
- Check all required env variables are set
- Restart dev server after changing `.env`
- In Vercel, redeploy after adding env variables

### Issue: Can't access admin pages
**Solution:**
- Middleware is protecting these routes
- Login at `/admin/login` first
- Check browser console for error messages

## 📝 Protected Routes

These routes require authentication:

- `/admin` - Admin dashboard (leads management)
- `/admin/courses` - Course upload/management
- `/admin/*` - All admin pages
- `/api/courses/*` - Course APIs (except GET for public)
- `/api/course-details/*` - Course details APIs
- `/api/leads/*` - Leads APIs

## 🔄 Session Management

- **Session Duration:** 24 hours
- **Strategy:** JWT (no database needed)
- **Storage:** Secure HTTP-only cookies
- **Logout:** Click user menu → Sign Out

## 📞 Support

If you need help:
1. Check this guide first
2. Review error messages in browser console
3. Check server logs in Vercel/terminal
4. Verify all environment variables are set correctly

## 🎯 Testing Checklist

Before going to production, test:

- [ ] Can login with correct credentials
- [ ] Cannot login with wrong credentials
- [ ] Redirected to login when accessing `/admin` without auth
- [ ] Can logout successfully
- [ ] Session persists across page refreshes
- [ ] Public pages (homepage, courses) still accessible
- [ ] All environment variables set in Vercel

---

**Last Updated:** 2026-03-22
**Version:** 1.0.0
**Status:** Production Ready ✅