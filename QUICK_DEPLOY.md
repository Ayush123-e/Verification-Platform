# Quick Deployment Checklist

## ✅ What I Fixed

1. **Fixed `api/index.js`** - Now correctly imports the Express app instead of server.js
2. **Updated `vercel.json`** - Proper configuration for serverless deployment
3. **Added `vercel-build` script** to frontend package.json
4. **Updated `.env.example`** with deployment instructions
5. **Created comprehensive `DEPLOYMENT.md`** guide

## 🚀 Deploy Now (Choose One Option)

### Option A: Vercel (Easiest - Recommended)

#### Step 1: Deploy Backend
1. Go to https://vercel.com/new
2. Import your GitHub repo: `Ayush123-e/Verification-Platform`
3. Configure:
   - **Root Directory**: Leave empty (root)
   - **Framework**: Other
4. Add Environment Variables:
   ```
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_secret_key_here_make_it_long_and_random
   NODE_ENV=production
   ```
5. Click **Deploy**
6. **Copy your backend URL** (e.g., `https://verification-platform-xi.vercel.app`)

#### Step 2: Deploy Frontend
1. Go to https://vercel.com/new again
2. Import the SAME GitHub repo
3. Configure:
   - **Root Directory**: `frontend`
   - **Framework**: Vite
4. Add Environment Variable:
   ```
   VITE_API_URL=https://your-backend-url-from-step1.vercel.app/api
   ```
5. Click **Deploy**

### Option B: Render (Backend) + Vercel (Frontend)

#### Step 1: Deploy Backend to Render
1. Go to https://dashboard.render.com/
2. Click **New** → **Web Service**
3. Connect GitHub repo: `Ayush123-e/Verification-Platform`
4. Configure:
   - **Name**: vshield-backend
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add Environment Variables:
   ```
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_secret_key_here
   NODE_ENV=production
   PORT=5001
   ```
6. Click **Create Web Service**
7. **Copy your backend URL** (e.g., `https://vshield-backend.onrender.com`)

#### Step 2: Deploy Frontend to Vercel
1. Go to https://vercel.com/new
2. Import your GitHub repo
3. Configure:
   - **Root Directory**: `frontend`
   - **Framework**: Vite
4. Add Environment Variable:
   ```
   VITE_API_URL=https://vshield-backend.onrender.com/api
   ```
5. Click **Deploy**

## 📋 Before You Deploy - Get MongoDB Atlas Ready

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up / Log in
3. Create a **FREE** cluster (M0)
4. Click **Connect** → **Connect your application**
5. Copy the connection string (looks like):
   ```
   mongodb+srv://username:password@cluster.mongodb.net/verification_platform
   ```
6. **Important**: Replace `<password>` with your actual password
7. Go to **Network Access** → Click **Add IP Address** → **Allow Access from Anywhere** (0.0.0.0/0)

## 🧪 Test Your Deployment

After deployment, test these endpoints:

### Backend Health Check
```bash
curl https://your-backend-url.vercel.app/api/health
```
Should return: `{"status":"ok","message":"vShield API is running."}`

### Frontend
Open your frontend URL in browser and try:
1. Sign up with a new account
2. Log in
3. Submit a candidate

## ❌ Common Errors & Fixes

### Error: "MONGO_URI environment variable is not set"
**Fix**: Add the `MONGO_URI` environment variable in your hosting platform dashboard

### Error: "MongoServerError: bad auth"
**Fix**: 
- Check your MongoDB password in the connection string
- Ensure IP whitelist includes 0.0.0.0/0 in MongoDB Atlas

### Error: "Network Error" in frontend
**Fix**: 
- Verify `VITE_API_URL` is set correctly
- Make sure it ends with `/api`
- Check backend is actually running

### Error: "Cannot GET /api/auth/signup"
**Fix**: Backend routing issue - already fixed in the latest push ✅

## 🔄 Redeploy After Changes

Both Vercel and Render auto-deploy when you push to GitHub:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

## 📞 Need Help?

Check the detailed `DEPLOYMENT.md` file for more information and troubleshooting steps.

## 🎉 You're All Set!

Your code is ready to deploy. Just follow the steps above and you'll be live in minutes!
