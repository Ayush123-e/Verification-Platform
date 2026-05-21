# MongoDB Atlas SSL Error Fix - Hindi Guide

## ⚠️ Problem
SSL/TLS error aa raha hai: `tlsv1 alert internal error`

## ✅ Solution (Step by Step)

### Step 1: IP Whitelist Karo (MOST IMPORTANT!)

1. **MongoDB Atlas Dashboard** kholo: https://cloud.mongodb.com/
2. Login karo
3. Left sidebar mein **"Network Access"** pe click karo
4. **"ADD IP ADDRESS"** button pe click karo
5. **"ALLOW ACCESS FROM ANYWHERE"** select karo
   - Ye automatically `0.0.0.0/0` add kar dega
   - Ye sabhi IPs ko allow karega (development + deployment dono ke liye)
6. **"Confirm"** button click karo
7. **2-3 minutes wait karo** (changes apply hone mein time lagta hai)

### Step 2: Database User Check Karo

1. Left sidebar mein **"Database Access"** pe click karo
2. Check karo ki `ayushnbt94_db_user` exist karta hai
3. User ke paas **"Atlas admin"** ya **"Read and write to any database"** permission honi chahiye
4. Agar password yaad nahi hai:
   - **"EDIT"** button click karo
   - **"Edit Password"** click karo
   - Naya password set karo (simple rakhna jaise: `Password123`)
   - Password copy karke `.env` file mein update karo

### Step 3: Connection String Verify Karo

Tumhara current connection string:
```
mongodb+srv://ayushnbt94_db_user:VB5ApjosDmTw04yB@cluster0.96e3l7j.mongodb.net/verification_platform?retryWrites=true&w=majority
```

Agar password change kiya hai toh update karo:
```
mongodb+srv://ayushnbt94_db_user:NEW_PASSWORD@cluster0.96e3l7j.mongodb.net/verification_platform?retryWrites=true&w=majority
```

### Step 4: Cluster Running Hai Ya Nahi Check Karo

1. **"Database"** section mein jao
2. Cluster status **"Active"** hona chahiye (green dot)
3. Agar paused hai toh **"Resume"** button click karo

### Step 5: Backend Server Restart Karo

Terminal mein:
```bash
cd backend
npm start
```

Ya agar already running hai toh:
1. Ctrl+C se stop karo
2. Phir se `npm start` karo

## 🧪 Test Connection

Terminal mein ye command run karo:
```bash
cd backend
node -e "require('dotenv').config(); const mongoose = require('mongoose'); mongoose.connect(process.env.MONGO_URI).then(() => { console.log('✅ Connected!'); process.exit(0); }).catch(err => { console.error('❌ Error:', err.message); process.exit(1); });"
```

## 🎯 Common Issues & Solutions

### Issue 1: "IP not whitelisted"
**Solution**: Network Access mein 0.0.0.0/0 add karo

### Issue 2: "Authentication failed"
**Solution**: Database Access mein password reset karo

### Issue 3: "Cluster is paused"
**Solution**: Database section mein cluster resume karo

### Issue 4: "SSL/TLS error"
**Solution**: 
- IP whitelist check karo (2-3 min wait karo)
- Connection string mein special characters escape karo
- Password mein special characters (@, :, /) hai toh URL encode karo

## 📝 Password URL Encoding

Agar password mein special characters hain:
- `@` → `%40`
- `:` → `%3A`
- `/` → `%2F`
- `?` → `%3F`
- `#` → `%23`

Example:
- Original: `Pass@123`
- Encoded: `Pass%40123`

## 🚀 Deployment Ke Liye

Jab Vercel/Render pe deploy karo, environment variables mein ye add karna:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
JWT_SECRET=your_secret_key
NODE_ENV=production
```

## ✅ Success Indicators

Agar sab kuch sahi hai toh terminal mein ye dikhega:
```
Attempting to connect to MongoDB...
✅ MongoDB Connected: ac-xxxxx-shard-00-00.xxxxx.mongodb.net
   Database: verification_platform
```

## 🆘 Agar Abhi Bhi Problem Hai

1. MongoDB Atlas dashboard ka screenshot bhejo
2. Terminal error message copy karke bhejo
3. Ya temporarily local MongoDB use karo:
   ```
   MONGO_URI=mongodb://127.0.0.1:27017/verification_platform
   ```

---

**Note**: IP whitelist changes apply hone mein 2-3 minutes lag sakte hain. Patience rakhna!
