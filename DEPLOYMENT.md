# Deployment Guide

This guide covers deploying the vShield Verification Platform to various hosting providers.

## Architecture

- **Frontend**: React + Vite (Static Site)
- **Backend**: Node.js + Express (API Server)
- **Database**: MongoDB Atlas (Cloud Database)

## Option 1: Deploy to Vercel (Recommended for Full Stack)

### Backend Deployment

1. **Push your code to GitHub** (already done ✅)

2. **Set up MongoDB Atlas**:
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster
   - Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/dbname`)

3. **Deploy Backend to Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Configure:
     - **Root Directory**: Leave as root (the api/index.js will handle backend)
     - **Framework Preset**: Other
   - Add Environment Variables:
     ```
     MONGO_URI=mongodb+srv://your-connection-string
     JWT_SECRET=your-super-secret-jwt-key-here
     NODE_ENV=production
     ```
   - Click "Deploy"
   - Note your backend URL (e.g., `https://your-project.vercel.app`)

### Frontend Deployment

1. **Deploy Frontend to Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New" → "Project"
   - Import the same GitHub repository
   - Configure:
     - **Root Directory**: `frontend`
     - **Framework Preset**: Vite
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
   - Add Environment Variable:
     ```
     VITE_API_URL=https://your-backend-project.vercel.app/api
     ```
   - Click "Deploy"

## Option 2: Deploy Backend to Render + Frontend to Vercel

### Backend on Render

1. **Set up MongoDB Atlas** (same as above)

2. **Deploy to Render**:
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: vshield-backend
     - **Root Directory**: `backend`
     - **Runtime**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
   - Add Environment Variables:
     ```
     MONGO_URI=mongodb+srv://your-connection-string
     JWT_SECRET=your-super-secret-jwt-key-here
     NODE_ENV=production
     PORT=5001
     ```
   - Click "Create Web Service"
   - Note your backend URL (e.g., `https://vshield-backend.onrender.com`)

### Frontend on Vercel

1. **Deploy to Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Configure:
     - **Root Directory**: `frontend`
     - **Framework Preset**: Vite
   - Add Environment Variable:
     ```
     VITE_API_URL=https://vshield-backend.onrender.com/api
     ```
   - Click "Deploy"

## Option 3: Deploy Both to Render

### Backend

Follow the "Backend on Render" steps above.

### Frontend

1. **Deploy to Render**:
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New" → "Static Site"
   - Connect your GitHub repository
   - Configure:
     - **Name**: vshield-frontend
     - **Root Directory**: `frontend`
     - **Build Command**: `npm install && npm run build`
     - **Publish Directory**: `dist`
   - Add Environment Variable:
     ```
     VITE_API_URL=https://vshield-backend.onrender.com/api
     ```
   - Click "Create Static Site"

## Post-Deployment Checklist

- [ ] Backend is accessible at `/api/health` endpoint
- [ ] Frontend loads without errors
- [ ] Signup functionality works
- [ ] Login functionality works
- [ ] MongoDB connection is successful
- [ ] CORS is properly configured for your frontend domain

## Troubleshooting

### Backend Issues

**Error: "MONGO_URI environment variable is not set"**
- Make sure you've added the `MONGO_URI` environment variable in your hosting platform

**Error: "MongoServerError: bad auth"**
- Check your MongoDB Atlas connection string
- Ensure the username and password are correct
- Make sure your IP address is whitelisted in MongoDB Atlas (or allow access from anywhere: 0.0.0.0/0)

**Error: "Cannot connect to MongoDB"**
- Verify your MongoDB Atlas cluster is running
- Check if your connection string is correct
- Ensure network access is configured in MongoDB Atlas

### Frontend Issues

**Error: "Network Error" or "Failed to fetch"**
- Check if `VITE_API_URL` environment variable is set correctly
- Verify the backend URL is accessible
- Check CORS configuration in backend

**Blank page after deployment**
- Check browser console for errors
- Verify the build completed successfully
- Check if all routes are configured correctly in `vercel.json` or hosting platform

### CORS Issues

If you see CORS errors, ensure your backend `app.js` has the correct CORS configuration:

```javascript
app.use(cors({
  origin: (origin, callback) => {
    // Allow your frontend domain
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'https://your-frontend.vercel.app'
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

## Environment Variables Reference

### Backend
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `NODE_ENV`: Set to `production`
- `PORT`: Port number (usually 5001 or assigned by platform)

### Frontend
- `VITE_API_URL`: Full URL to your backend API (including `/api`)

## Monitoring

- Check backend logs in your hosting platform dashboard
- Monitor MongoDB Atlas metrics
- Set up error tracking (optional): Sentry, LogRocket, etc.

## Updating Deployment

After making changes:

1. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```

2. Most platforms auto-deploy on push. If not, manually trigger deployment from the dashboard.

## Support

For issues specific to:
- **Vercel**: [Vercel Documentation](https://vercel.com/docs)
- **Render**: [Render Documentation](https://render.com/docs)
- **MongoDB Atlas**: [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
