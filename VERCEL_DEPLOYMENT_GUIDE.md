# Vercel Deployment Guide - Step by Step

## 🎯 Do Alag Projects Deploy Karne Hain:

1. **Backend** (API) - Root directory se
2. **Frontend** (React App) - `frontend` folder se

---

## 📦 Part 1: Backend Deploy Karo

### Step 1: Vercel Dashboard
1. https://vercel.com/new pe jao
2. **"Import Git Repository"** click karo
3. Apna GitHub repo select karo: `Ayush123-e/Verification-Platform`

### Step 2: Backend Configuration
```
Project Name: verification-platform-backend (ya koi bhi naam)
Framework Preset: Other
Root Directory: . (empty - root level)
Build Command: (empty chod do)
Output Directory: (empty chod do)
Install Command: (empty chod do)
```

### Step 3: Environment Variables Add Karo
**IMPORTANT**: Ye 4 variables add karne ZAROORI hain:

```
MONGO_URI = mongodb+srv://ayushnbt94_db_user:VB5ApjosDmTw04yB@cluster0.96e3l7j.mongodb.net/verification_platform?retryWrites=true&w=majority

NODE_TLS_REJECT_UNAUTHORIZED = 0

JWT_SECRET = supersecretkey_background_verification_xyz

NODE_ENV = production
```

**Kaise add karein:**
- "Environment Variables" section mein
- Name: `MONGO_URI`, Value: (upar wala value paste karo)
- **"Add"** button click karo
- Baaki 3 variables bhi aise hi add karo

### Step 4: Deploy
- **"Deploy"** button click karo
- Wait karo (2-3 minutes)
- Deployment complete hone ke baad **URL copy karo**
  - Example: `https://verification-platform-backend.vercel.app`

### Step 5: Backend Test Karo
Browser mein ye URL kholo:
```
https://your-backend-url.vercel.app/api/health
```

Response aana chahiye:
```json
{"status":"ok","message":"vShield API is running."}
```

---

## 🎨 Part 2: Frontend Deploy Karo

### Step 1: Vercel Dashboard
1. Phir se https://vercel.com/new pe jao
2. **Same GitHub repo** select karo: `Ayush123-e/Verification-Platform`

### Step 2: Frontend Configuration
```
Project Name: verification-platform-frontend (ya koi bhi naam)
Framework Preset: Vite
Root Directory: frontend (IMPORTANT!)
Build Command: npm run build (auto-detect hoga)
Output Directory: dist (auto-detect hoga)
Install Command: npm install (auto-detect hoga)
```

### Step 3: Environment Variable Add Karo
**IMPORTANT**: Backend URL add karna zaroori hai:

```
VITE_API_URL = https://your-backend-url.vercel.app/api
```

**Example:**
```
VITE_API_URL = https://verification-platform-backend.vercel.app/api
```

⚠️ **Dhyan do**: 
- Backend URL ke end mein `/api` zaroori hai
- Apna actual backend URL use karo (Step 4 se copy kiya tha)

### Step 4: Deploy
- **"Deploy"** button click karo
- Wait karo (2-3 minutes)
- Deployment complete!

### Step 5: Frontend Test Karo
Browser mein frontend URL kholo:
```
https://your-frontend-url.vercel.app
```

Signup page khulna chahiye!

---

## ✅ Deployment Success Check Karo

### Backend Check:
```
https://your-backend.vercel.app/api/health
```
✅ Response: `{"status":"ok",...}`

### Frontend Check:
```
https://your-frontend.vercel.app
```
✅ Page load hona chahiye

### Signup Test:
1. Frontend URL pe jao
2. Signup page pe jao
3. Form fill karo
4. Submit karo
5. ✅ Success message aana chahiye!

---

## 🐛 Common Errors & Solutions

### Error 1: "MONGO_URI environment variable is not set"
**Solution**: 
- Vercel dashboard → Project → Settings → Environment Variables
- `MONGO_URI` add karo
- Redeploy karo

### Error 2: "Network Error" frontend mein
**Solution**:
- Frontend environment variable check karo
- `VITE_API_URL` sahi hai ya nahi
- Backend URL ke end mein `/api` hai ya nahi

### Error 3: "Function Timeout"
**Solution**:
- MongoDB Atlas mein IP whitelist check karo (0.0.0.0/0)
- `NODE_TLS_REJECT_UNAUTHORIZED=0` add karo backend mein

### Error 4: "404 Not Found" on API routes
**Solution**:
- `vercel.json` file root mein hai ya nahi check karo
- Routes configuration sahi hai ya nahi

### Error 5: Backend deploy ho gaya but API kaam nahi kar raha
**Solution**:
- Vercel dashboard → Project → Deployments → Latest deployment
- **"View Function Logs"** click karo
- Error messages dekho
- Environment variables missing honge

---

## 🔄 Redeploy Kaise Karein

### Automatic (Recommended):
```bash
git add .
git commit -m "changes"
git push origin main
```
Vercel automatically redeploy kar dega!

### Manual:
1. Vercel dashboard → Project
2. **"Deployments"** tab
3. Latest deployment pe **"..."** menu
4. **"Redeploy"** click karo

---

## 📝 Environment Variables Summary

### Backend (Root Project):
```
MONGO_URI=mongodb+srv://ayushnbt94_db_user:VB5ApjosDmTw04yB@cluster0.96e3l7j.mongodb.net/verification_platform?retryWrites=true&w=majority
NODE_TLS_REJECT_UNAUTHORIZED=0
JWT_SECRET=supersecretkey_background_verification_xyz
NODE_ENV=production
```

### Frontend (frontend folder):
```
VITE_API_URL=https://your-backend-url.vercel.app/api
```

---

## 🎉 Final URLs

After successful deployment:

**Backend API**: `https://verification-platform-backend.vercel.app/api`
**Frontend App**: `https://verification-platform-frontend.vercel.app`

Share kar sakte ho! 🚀

---

## 💡 Pro Tips

1. **Custom Domain**: Vercel dashboard se custom domain add kar sakte ho
2. **Logs**: Function logs dekh sakte ho errors ke liye
3. **Analytics**: Vercel analytics free hai
4. **Preview Deployments**: Har PR ka automatic preview banta hai

---

## 🆘 Help Chahiye?

Agar koi error aa raha hai:
1. Vercel deployment logs screenshot bhejo
2. Browser console error screenshot bhejo
3. Backend URL aur Frontend URL share karo
