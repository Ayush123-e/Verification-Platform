# Vercel Deployment Guide - vShield Platform

## Backend Deployment (Vercel Serverless)

### Prerequisites
- Vercel account
- MongoDB Atlas database
- GitHub repository connected

### Step 1: Deploy Backend to Vercel

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Click "Add New" → "Project"**
3. **Import your GitHub repository**
4. **Configure Project**:
   - **Framework Preset**: Other
   - **Root Directory**: Leave as `.` (root)
   - **Build Command**: Leave empty
   - **Output Directory**: Leave empty

### Step 2: Add Environment Variables

In Vercel project settings, add these environment variables:

```
NODE_ENV=production
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key
PORT=5001
```

**Important**: 
- Get `MONGO_URI` from MongoDB Atlas
- Generate a strong `JWT_SECRET` (random string)

### Step 3: Deploy

Click **"Deploy"** and wait for deployment to complete.

Your backend will be available at: `https://your-project-name.vercel.app`

### Step 4: Test Backend

Visit: `https://your-project-name.vercel.app/`

You should see:
```json
{
  "status": "ok",
  "message": "vShield API is running.",
  "endpoints": {
    "health": "/api/health",
    "auth": "/api/auth",
    "candidates": "/api/candidates",
    "verifications": "/api/verifications"
  }
}
```

---

## Frontend Deployment (Vercel)

### Step 1: Update Frontend Environment Variables

In `frontend/.env`:

```
VITE_API_URL=https://your-backend-project.vercel.app
```

### Step 2: Deploy Frontend to Vercel

1. **Go to Vercel Dashboard**
2. **Click "Add New" → "Project"**
3. **Import the same GitHub repository**
4. **Configure Project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Step 3: Add Environment Variables

In Vercel frontend project settings:

```
VITE_API_URL=https://your-backend-project.vercel.app
```

### Step 4: Deploy

Click **"Deploy"** and wait for deployment to complete.

Your frontend will be available at: `https://your-frontend-project.vercel.app`

---

## Update CORS Configuration

After deploying frontend, update the backend CORS configuration:

1. **Note your frontend URL**: `https://your-frontend-project.vercel.app`
2. **Update `backend/app.js`**:

```javascript
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://your-frontend-project.vercel.app"  // Add your actual frontend URL
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'X-JSON'],
  maxAge: 86400
}));
```

3. **Commit and push** - Vercel will auto-redeploy

---

## Troubleshooting

### CORS Errors
- Make sure frontend URL is added to CORS origins in `backend/app.js`
- Check that credentials are enabled
- Verify environment variables are set correctly

### 404 Errors
- Check `vercel.json` routing configuration
- Ensure `api/index.js` exists
- Check Vercel function logs

### Database Connection Issues
- Verify `MONGO_URI` is correct in Vercel environment variables
- Check MongoDB Atlas network access (allow all IPs: `0.0.0.0/0`)
- Ensure database user has correct permissions

### Cold Start Issues
- First request may be slow (serverless cold start)
- Subsequent requests will be faster
- Consider using Vercel Pro for better performance

---

## Local Development

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## Useful Commands

### View Vercel Logs
```bash
vercel logs <deployment-url>
```

### Redeploy
```bash
git push origin main
```
(Vercel auto-deploys on push)

---

## Support

For issues, check:
- Vercel Dashboard → Your Project → Deployments → Logs
- MongoDB Atlas → Network Access
- GitHub repository → Actions (if using CI/CD)
