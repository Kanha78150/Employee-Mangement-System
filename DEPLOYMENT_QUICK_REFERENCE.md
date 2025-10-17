# 🎯 DEPLOYMENT QUICK REFERENCE

## 📝 Your Deployment URLs (Fill these in as you go)

```
MongoDB Atlas Connection: mongodb+srv://________________
Backend URL (Render):     https://________________.onrender.com
Frontend URL (Vercel):    https://________________.vercel.app
Admin Email:              ________________@________________
Admin Password:           ________________ (KEEP SECRET!)
JWT Secret:               ________________ (KEEP SECRET!)
```

---

## 🚀 30-Minute Deployment Steps

### 1️⃣ MongoDB Atlas (5 min)

- [ ] Create account at mongodb.com/cloud/atlas
- [ ] Create free M0 cluster
- [ ] Create database user
- [ ] Whitelist IP: `0.0.0.0/0`
- [ ] Copy connection string

### 2️⃣ Deploy Backend (10 min)

- [ ] Sign in to render.com with GitHub
- [ ] New Web Service → Select repo
- [ ] Root: `Backend`, Build: `npm install`, Start: `npm start`
- [ ] Generate JWT: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- [ ] Add environment variables (see below)
- [ ] Deploy & copy backend URL

### 3️⃣ Update Frontend (2 min)

- [ ] Edit `frontend/.env.production`
- [ ] Set `VITE_API_URL=https://YOUR-BACKEND.onrender.com/api`
- [ ] Set `VITE_BACKEND_URL=https://YOUR-BACKEND.onrender.com`
- [ ] Commit & push to GitHub

### 4️⃣ Deploy Frontend (5 min)

- [ ] Sign in to vercel.com with GitHub
- [ ] Import project → Select repo
- [ ] Root: `frontend`, Framework: Vite
- [ ] Add environment variables (see below)
- [ ] Deploy & copy frontend URL

### 5️⃣ Update CORS (2 min)

- [ ] Back to Render → Environment
- [ ] Update `FRONTEND_URL=https://YOUR-APP.vercel.app`
- [ ] Update `ALLOWED_ORIGINS=https://YOUR-APP.vercel.app`
- [ ] Save (auto redeploys)

### 6️⃣ Test (5 min)

- [ ] Visit frontend URL
- [ ] Login with admin credentials
- [ ] Create test employee
- [ ] Assign test task
- [ ] ✅ Done!

---

## 🔑 Environment Variables

### Render (Backend)

```env
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/employee-db
JWT_SECRET=<32+ char random string>
NODE_ENV=production
PORT=5000
ADMIN_EMAIL=admin@yourcompany.com
ADMIN_PASSWORD=YourSecure123!
FRONTEND_URL=https://your-app.vercel.app
ALLOWED_ORIGINS=https://your-app.vercel.app
```

### Vercel (Frontend)

```env
VITE_API_URL=https://your-backend.onrender.com/api
VITE_BACKEND_URL=https://your-backend.onrender.com
VITE_NODE_ENV=production
```

---

## 🛠️ Helpful Commands

Generate JWT Secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Test Backend Health:

```
https://your-backend.onrender.com/health
```

Build Frontend Locally:

```bash
cd frontend
npm run build
```

---

## ⚠️ Common Issues

| Problem        | Solution                                       |
| -------------- | ---------------------------------------------- |
| CORS error     | Check ALLOWED_ORIGINS matches Vercel URL       |
| Can't login    | Verify ADMIN_EMAIL/PASSWORD in Render          |
| Database error | Check MongoDB connection string & IP whitelist |
| Build fails    | Check all env vars are set                     |
| Slow backend   | Normal - free tier sleeps after 15min          |

---

## 📊 Free Tier Limits

- **MongoDB**: 512 MB storage
- **Render**: Sleeps after 15min, wakes in 30-60 sec
- **Vercel**: 100 GB bandwidth/month

---

## 📞 Help

1. **QUICK_DEPLOY_CHECKLIST.md** - Step-by-step guide
2. **DEPLOYMENT_GUIDE.md** - Detailed instructions
3. **PRODUCTION_CHANGES_SUMMARY.md** - What changed

---

**Total Time: ~30 minutes**
**Total Cost: $0/month** 💰✨

_Save this file for reference!_
