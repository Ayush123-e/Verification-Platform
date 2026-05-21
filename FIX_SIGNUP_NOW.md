# 🔧 Fix Signup Issue - RESTART FRONTEND

## The Problem

The frontend `.env` file was created AFTER the frontend server started. **Vite does NOT hot-reload environment variables** - you must restart the server.

## ✅ Solution (Do This Now)

### Step 1: Stop the Frontend Server

In the terminal where the frontend is running, press:
```
Ctrl + C
```

### Step 2: Restart the Frontend Server

```bash
cd frontend
npm run dev
```

### Step 3: Clear Browser Cache (Important!)

1. Open your browser
2. Press `Cmd + Shift + R` (Mac) or `Ctrl + Shift + R` (Windows/Linux) to hard refresh
3. Or open DevTools (F12) → Right-click the refresh button → "Empty Cache and Hard Reload"

### Step 4: Test Signup Again

1. Go to `http://localhost:5173/signup` (or whatever port Vite shows)
2. Fill in the signup form
3. Click "Create Account"

## 🧪 Verify the Fix

Open browser DevTools (F12) → Network tab → Try signup → Check the request:

**Before Fix:**
- Request URL: `http://localhost:5000/api/auth/signup` ❌ (Wrong port!)
- Status: Failed / Network Error

**After Fix:**
- Request URL: `http://localhost:5001/api/auth/signup` ✅ (Correct port!)
- Status: 201 Created
- Response: `{"success":true,"data":{...}}`

## 🔍 Still Not Working?

### Check 1: Verify Environment Variable is Loaded

Add this temporarily to `frontend/src/services/api.js` at the top:

```javascript
console.log('API Base URL:', import.meta.env.VITE_API_URL);
```

Then check the browser console. It should show:
```
API Base URL: http://localhost:5001/api
```

If it shows `undefined` or `http://localhost:5000/api`, the env variable isn't loaded.

### Check 2: Verify Backend is Running

```bash
curl http://localhost:5001/api/health
```

Should return:
```json
{"status":"ok","message":"vShield API is running."}
```

### Check 3: Check Browser Console for Errors

Open DevTools (F12) → Console tab → Look for error messages

Common errors:
- `Network Error` → Backend not running or wrong URL
- `CORS error` → Backend CORS issue (already fixed)
- `400 Bad Request` → Missing fields in form

## 🎯 Quick Test Command

Test the backend directly:

```bash
curl -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"password123","company":"Test Co"}'
```

Should return success with a token.

## 📝 Summary

**The issue:** Frontend is trying to connect to port 5000, but backend is on port 5001.

**The fix:** Restart frontend server to load the `.env` file with `VITE_API_URL=http://localhost:5001/api`

**After restart:** Everything should work! ✨
