# Validation Checklist - Phase 1 Authentication

**Purpose:** Verify that all authentication features are working correctly  
**Time Required:** ~10-15 minutes  
**Prerequisites:** Dev server running (`npm run dev`)

---

## ✅ Validation Steps

### 1. **Verify Environment Variables** (1 min)

Check that `.env` file has the required variables:

```bash
# Run this command to verify
cat b2b-edtech-platform/.env | grep -E "NEXTAUTH|ADMIN"
```

**Expected Output:**
```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=change-this-to-a-random-secret-min-32-characters-long
ADMIN_EMAIL=admin@edtech.com
ADMIN_PASSWORD=Admin@123
```

✅ **Pass:** All variables are present  
❌ **Fail:** Missing variables → Check `.env` file

---

### 2. **Test Public Homepage** (2 min)

**Steps:**
1. Open browser: `http://localhost:3000`
2. Verify you see the homepage with courses
3. Scroll to footer
4. Check that there are NO "Admin" or "Vendor" links

**Expected Results:**
- ✅ Homepage loads without errors
- ✅ Courses are displayed (from Google Sheets or sample data)
- ✅ Footer shows: "About Us", "Courses", "For Business", "Contact"
- ✅ NO admin/vendor links visible

**Console Check:**
- Open browser DevTools (F12)
- Look for errors in Console tab
- Should see: No authentication-related errors

---

### 3. **Test Admin Route Protection** (2 min)

**Steps:**
1. In browser, navigate to: `http://localhost:3000/admin`
2. Observe what happens

**Expected Results:**
- ✅ You are **redirected** to `/admin/login`
- ✅ URL changes from `/admin` to `/admin/login?callbackUrl=%2Fadmin`
- ✅ You see a professional login page with:
  - Lock icon
  - "Admin Portal" heading
  - Email and Password fields
  - "Sign In" button
  - "Back to Website" link

**Terminal Check:**
```bash
# In your terminal running the dev server, you should see:
GET /admin 307 (redirect)
GET /admin/login 200
```

❌ **Fail Scenarios:**
- If you see admin dashboard without login → Middleware not working
- If you get 404 error → NextAuth route not created
- If page doesn't load → Check console for errors

---

### 4. **Test Login with Wrong Credentials** (1 min)

**Steps:**
1. On login page, enter:
   - Email: `wrong@email.com`
   - Password: `wrongpassword`
2. Click "Sign In"

**Expected Results:**
- ✅ Error message appears: "Invalid email or password"
- ✅ Error is displayed in a red banner at top of form
- ✅ Form doesn't submit/redirect
- ✅ You remain on login page

---

### 5. **Test Login with Correct Credentials** (2 min)

**Steps:**
1. On login page, enter:
   - Email: `admin@edtech.com`
   - Password: `Admin@123`
2. Click "Sign In"
3. Wait for redirect

**Expected Results:**
- ✅ No error message
- ✅ Button shows "Signing in..." with spinner
- ✅ You are redirected to `/admin` dashboard
- ✅ You see:
  - "Admin Panel" heading
  - Lead statistics (Total, New, Qualified, Converted)
  - Search and filter options
  - Leads table
  - User profile button in header (with "A" avatar)
  - "📤 Upload Courses" button
  - "View Site" button

**Terminal Check:**
```bash
# You should see in terminal:
POST /api/auth/callback/credentials 200
GET /admin 200
GET /api/leads 200
```

---

### 6. **Test Session Persistence** (1 min)

**Steps:**
1. While logged in to `/admin`, refresh the page (F5 or Cmd+R)
2. Observe if you stay logged in

**Expected Results:**
- ✅ Page refreshes
- ✅ You remain logged in (not redirected to login)
- ✅ Admin dashboard loads immediately
- ✅ User profile still shows in header

---

### 7. **Test Navigation While Logged In** (2 min)

**Steps:**
1. While logged in, click "📤 Upload Courses" button
2. Verify you can access `/admin/courses`
3. Click "← Back to Admin"
4. Verify you're back at `/admin`
5. Click "View Site" button
6. Verify you can see public homepage

**Expected Results:**
- ✅ Can access `/admin/courses` without re-login
- ✅ Can navigate back to `/admin`
- ✅ Can view public homepage while logged in
- ✅ No authentication errors in any navigation

---

### 8. **Test Logout Functionality** (2 min)

**Steps:**
1. On `/admin` page, click on your profile button (with "A" avatar) in header
2. A dropdown should appear
3. Verify it shows:
   - Your name: "Admin"
   - Your email: "admin@edtech.com"
   - "Sign Out" button (red text)
4. Click "Sign Out"

**Expected Results:**
- ✅ Dropdown opens when clicking profile
- ✅ Shows correct user information
- ✅ After clicking "Sign Out":
  - You are redirected to `/admin/login`
  - You are logged out
  - Session is cleared

**Verification:**
1. After logout, try to go to `http://localhost:3000/admin`
2. You should be redirected to login page again

---

### 9. **Test API Route Protection** (2 min)

**Steps:**
1. Logout if logged in
2. Open browser DevTools → Network tab
3. In browser console, run:
   ```javascript
   fetch('/api/leads').then(r => r.json()).then(console.log)
   ```

**Expected Results:**
- ❌ Request should fail or redirect (API is protected)

**Then login and run again:**
```javascript
fetch('/api/leads').then(r => r.json()).then(console.log)
```

**Expected Results:**
- ✅ Request succeeds
- ✅ Returns lead data
- ✅ Console shows: `{success: true, leads: [...]}`

---

### 10. **Test Course Detail Pages** (1 min)

**Steps:**
1. Go to homepage: `http://localhost:3000`
2. Click on any course card
3. Verify you can see course details

**Expected Results:**
- ✅ Course detail page loads
- ✅ Shows course information
- ✅ "Enquire Now" button works
- ✅ NO authentication required for public course pages

---

## 📊 Validation Summary

After completing all steps, fill this out:

| Test | Status | Notes |
|------|--------|-------|
| 1. Environment Variables | ⬜ Pass ⬜ Fail | |
| 2. Public Homepage | ⬜ Pass ⬜ Fail | |
| 3. Admin Route Protection | ⬜ Pass ⬜ Fail | |
| 4. Wrong Credentials | ⬜ Pass ⬜ Fail | |
| 5. Correct Login | ⬜ Pass ⬜ Fail | |
| 6. Session Persistence | ⬜ Pass ⬜ Fail | |
| 7. Navigation | ⬜ Pass ⬜ Fail | |
| 8. Logout | ⬜ Pass ⬜ Fail | |
| 9. API Protection | ⬜ Pass ⬜ Fail | |
| 10. Public Pages | ⬜ Pass ⬜ Fail | |

**Overall Status:** ⬜ All Pass ⬜ Some Failures

---

## 🐛 Common Issues & Fixes

### Issue: "Configuration error" on login page
**Cause:** Missing or invalid environment variables  
**Fix:**
```bash
# Check .env file has:
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here  # Must be 32+ characters

# Restart dev server after changing .env
```

### Issue: Not redirected to login when accessing /admin
**Cause:** Middleware not working  
**Fix:**
1. Verify `middleware.js` exists in project root
2. Check file has correct export: `export const config = { matcher: [...] }`
3. Restart dev server

### Issue: Login succeeds but immediately redirected back to login
**Cause:** Session not being saved  
**Fix:**
1. Check `NEXTAUTH_SECRET` is set
2. Verify `NEXTAUTH_URL` matches your localhost URL exactly
3. Clear browser cookies and try again

### Issue: "Invalid email or password" with correct credentials
**Cause:** Environment variables not matching  
**Fix:**
1. Verify `.env` has: `ADMIN_EMAIL=admin@edtech.com`
2. Verify `.env` has: `ADMIN_PASSWORD=Admin@123`
3. Restart dev server (environment changes require restart)

### Issue: Can access /admin without login
**Cause:** Middleware not protecting routes  
**Fix:**
1. Check `middleware.js` exists
2. Verify `next-auth` package is installed: `npm list next-auth`
3. Check terminal for middleware errors
4. Restart dev server

---

## ✅ What Success Looks Like

If all tests pass, you should have:

1. ✅ **Public pages accessible** without authentication
2. ✅ **Admin pages protected** - redirect to login
3. ✅ **Login works** with correct credentials
4. ✅ **Login fails** with wrong credentials  
5. ✅ **Session persists** across page refreshes
6. ✅ **Logout works** and clears session
7. ✅ **Navigation works** while authenticated
8. ✅ **APIs protected** from unauthorized access
9. ✅ **No admin links** visible on public pages
10. ✅ **No console errors** related to authentication

---

## 🎯 Next Steps After Validation

Once all tests pass:

1. ✅ Mark Phase 1 as validated
2. 📝 Document any issues found
3. 🚀 Proceed to Phase 2 implementation
4. 📦 Or prepare for Vercel deployment

---

**Date Validated:** ________________  
**Validated By:** ________________  
**Result:** ⬜ Pass ⬜ Fail (with notes)  
**Ready for Phase 2:** ⬜ Yes ⬜ No