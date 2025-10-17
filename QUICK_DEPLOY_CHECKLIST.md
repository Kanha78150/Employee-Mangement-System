# 📝 Quick Deployment Checklist

## Before You Start

- [ ] Push all code to GitHub
- [ ] MongoDB Atlas account ready
- [ ] Render account ready (sign up with GitHub)
- [ ] Vercel account ready (sign up with GitHub)

---

## Step-by-Step Deployment

### ✅ STEP 1: MongoDB Atlas (5 minutes)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Create database user (save username & password!)
4. Whitelist all IPs: `0.0.0.0/0`
5. Get connection string:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/employee-db?retryWrites=true&w=majority
   ```
   ⚠️ **Save this connection string!**

---

### ✅ STEP 2: Deploy Backend to Render (10 minutes)

1. **Go to [Render](https://render.com)** and sign in with GitHub

2. **Create New Web Service**

   - Click "New +" → "Web Service"
   - Connect repository: `Employee-Mangement-System`
   - Name: `employee-dashboard-backend`
   - Root Directory: `Backend`
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Plan: **Free**

3. **Add Environment Variables** (in Render dashboard)

   **IMPORTANT: Generate a secure JWT secret first!**
   Run this command in your terminal:

   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

   Then add these variables:

   ```
   MONGO_URI=<your-mongodb-connection-string-from-step-1>
   JWT_SECRET=<generated-secret-from-above-command>
   JWT_EXPIRES_IN=7d
   PORT=5000
   HOST=0.0.0.0
   NODE_ENV=production
   ADMIN_EMAIL=admin@yourcompany.com
   ADMIN_PASSWORD=YourSecurePassword123!
   ADMIN_NAME=System Administrator
   FRONTEND_URL=https://your-app.vercel.app
   ALLOWED_ORIGINS=https://your-app.vercel.app
   MAX_FILE_SIZE=5242880
   ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,image/webp
   BCRYPT_ROUNDS=12
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=1000
   LOG_LEVEL=info
   LOG_TO_FILE=false
   ```

4. **Click "Create Web Service"**

   - Wait 5-10 minutes for deployment
   - You'll get a URL like: `https://employee-dashboard-backend.onrender.com`
   - ⚠️ **Save this backend URL!**

5. **Test Backend**
   - Visit: `https://your-backend.onrender.com/health`
   - Should see: `{"success":true,"message":"Server is healthy"}`

---

### ✅ STEP 3: Update Frontend Config (2 minutes)

1. **Open `frontend/.env.production` file**

2. **Update with YOUR backend URL:**

   ```env
   VITE_API_URL=https://employee-dashboard-backend.onrender.com/api
   VITE_BACKEND_URL=https://employee-dashboard-backend.onrender.com
   ```

3. **Save and commit:**
   ```bash
   git add frontend/.env.production
   git commit -m "Update production backend URL"
   git push origin main
   ```

---

### ✅ STEP 4: Deploy Frontend to Vercel (5 minutes)

1. **Go to [Vercel](https://vercel.com)** and sign in with GitHub

2. **Import Project**

   - Click "Add New..." → "Project"
   - Select repository: `Employee-Mangement-System`
   - Click "Import"

3. **Configure Project**

   - Framework Preset: **Vite**
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Add Environment Variables**

   ```
   VITE_API_URL=https://employee-dashboard-backend.onrender.com/api
   VITE_BACKEND_URL=https://employee-dashboard-backend.onrender.com
   VITE_NODE_ENV=production
   VITE_APP_NAME=Employee Dashboard
   VITE_APP_VERSION=1.0.0
   ```

5. **Click "Deploy"**
   - Wait 2-5 minutes
   - You'll get a URL like: `https://employee-dashboard-xyz123.vercel.app`
   - ⚠️ **Save this frontend URL!**

---

### ✅ STEP 5: Update Backend CORS (2 minutes)

1. **Go back to Render Dashboard** → Your Backend Service

2. **Update Environment Variables:**

   - `FRONTEND_URL` = `https://your-actual-vercel-url.vercel.app`
   - `ALLOWED_ORIGINS` = `https://your-actual-vercel-url.vercel.app`

3. **Click "Save Changes"**
   - Render will automatically redeploy (wait 2-3 minutes)

---

### ✅ STEP 6: Test Everything! (5 minutes)

1. **Visit your frontend URL**
   `https://your-app.vercel.app`

2. **Login with admin credentials:**

   - Email: `admin@yourcompany.com` (or whatever you set in ADMIN_EMAIL)
   - Password: `YourSecurePassword123!` (or whatever you set in ADMIN_PASSWORD)

3. **Test features:**
   - [ ] Login works
   - [ ] Create an employee
   - [ ] Update employee
   - [ ] Delete employee
   - [ ] Assign a task
   - [ ] Upload an image
   - [ ] View analytics

---

## 🎉 You're Live!

**Your URLs:**

- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-backend.onrender.com`

---

## ⚠️ Important Notes

### Render Free Tier

- Backend sleeps after 15 minutes of inactivity
- First request may take 30-60 seconds to wake up
- This is normal for free tier!

### Image Uploads

- Images stored temporarily on Render
- Files may be lost after 24 hours on free tier
- For permanent storage, upgrade or use Cloudinary

### Security

- Change admin password immediately after first login!
- Keep your JWT secret secure
- Never commit `.env` files to GitHub

---

## 🐛 Troubleshooting

### CORS Error?

- Check `ALLOWED_ORIGINS` in Render matches your Vercel URL exactly
- Include https:// in the URL

### Can't Connect to Database?

- Verify MongoDB connection string is correct
- Check IP whitelist includes `0.0.0.0/0`
- Ensure database user has read/write permissions

### Backend Not Responding?

- Check Render logs for errors
- Verify all environment variables are set
- Test health endpoint: `/health`

### Login Not Working?

- Check admin credentials match environment variables
- Look for errors in browser console
- Check backend logs in Render

---

## 📞 Need Help?

1. Check the full [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
2. Review logs in Vercel/Render dashboards
3. Check browser console for errors
4. Verify all environment variables

---

**Total Time: ~30 minutes**
**Total Cost: $0/month** 🎉

---

_Last Updated: October 17, 2025_
