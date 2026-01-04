# Railway Deployment Guide - Construction Transport Dashboard

## Complete Guide for Production Deployment Tomorrow

### Prerequisites
1. Railway account (Sign up at https://railway.app)
2. GitHub account
3. Your code pushed to GitHub

---

## PART 1: Push Code to GitHub

### Step 1: Initialize Git Repository (if not already done)

```bash
cd "/Users/mousbah/Documents/programming/khaled tarraf/construction-transport-dashboard (1)"

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Transport Management System"
```

### Step 2: Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository named `transport-management`
3. DO NOT initialize with README (your code already has files)
4. Click "Create repository"

### Step 3: Push to GitHub

```bash
# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/transport-management.git

# Push code
git branch -M main
git push -u origin main
```

---

## PART 2: Deploy Backend to Railway

### Step 1: Create New Project on Railway

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Connect your GitHub account if not connected
5. Select your `transport-management` repository

### Step 2: Add PostgreSQL Database

1. In your Railway project, click "+ New"
2. Select "Database"
3. Choose "PostgreSQL"
4. Railway will automatically create and provision the database
5. Note: The database will auto-generate connection details

### Step 3: Deploy Backend Service

1. In your project, click "+ New"
2. Select "GitHub Repo"
3. Choose your `transport-management` repository
4. Click on the new service
5. Go to "Settings"
6. Set **Root Directory** to: `backend`
7. Set **Start Command** to: `node src/server.js`

### Step 4: Configure Backend Environment Variables

1. Click on your backend service
2. Go to "Variables" tab
3. Click "+ New Variable"
4. Add the following variables:

```
NODE_ENV=production
PORT=5000
```

5. **IMPORTANT**: Connect PostgreSQL database:
   - Click "Add Reference"
   - Select your PostgreSQL database
   - This will automatically add DATABASE_URL

6. Add additional variables by copying from your PostgreSQL service:
   - Click on PostgreSQL service
   - Copy these variables and paste them in backend service:

```
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_NAME=${{Postgres.PGDATABASE}}
DB_USER=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
```

7. Add FRONTEND_URL (we'll update this after frontend deployment):
```
FRONTEND_URL=*
```

### Step 5: Deploy Backend

1. Backend will automatically deploy
2. Wait for deployment to complete (watch the logs)
3. Once deployed, copy your backend URL (looks like: `https://your-backend.railway.app`)
4. Test it by visiting: `https://your-backend.railway.app/api/health`
5. You should see: `{"status":"ok","message":"Transport API is running"}`

---

## PART 3: Deploy Frontend to Railway

### Step 1: Create Frontend Service

1. In your Railway project, click "+ New"
2. Select "GitHub Repo"
3. Choose your `transport-management` repository again
4. This creates a second service for frontend

### Step 2: Configure Frontend Service

1. Click on the frontend service
2. Go to "Settings"
3. Set **Root Directory** to: `.` (leave empty or put a dot)
4. Build Command: `npm run build`
5. Start Command: `npm run start`

### Step 3: Add Frontend Environment Variables

1. Go to "Variables" tab
2. Add this variable:

```
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app/api
```

**IMPORTANT**: Replace `your-backend-url.railway.app` with your actual backend URL from Part 2

### Step 4: Update Backend CORS

1. Go back to your backend service
2. Go to "Variables"
3. Update `FRONTEND_URL` variable:

```
FRONTEND_URL=https://your-frontend-url.railway.app
```

**IMPORTANT**: Replace with your actual frontend URL after it deploys

4. Alternatively, keep it as `*` to allow all origins (less secure but works)

### Step 5: Deploy Frontend

1. Frontend will automatically deploy
2. Wait for deployment (check logs)
3. Once done, you'll get a URL like: `https://your-app.railway.app`
4. Visit this URL - your app should be live!

---

## PART 4: Verify Everything Works

### Test Checklist:

1. ✅ **Backend Health Check**
   - Visit: `https://your-backend.railway.app/api/health`
   - Should see: `{"status":"ok"}`

2. ✅ **Database Connection**
   - Check backend logs
   - Should see: "✅ Connected to PostgreSQL database"
   - Should see: "✅ Database tables created successfully"

3. ✅ **Frontend Loads**
   - Visit your frontend URL
   - Dashboard should load

4. ✅ **Test Fleet Management**
   - Go to Fleet page
   - Click "Add Driver"
   - Fill in details and save
   - Driver should appear in table
   - Try adding a truck
   - Try deleting

5. ✅ **Test All Pages**
   - Dashboard
   - Input
   - Daily Income
   - Fleet
   - Clients

---

## PART 5: Troubleshooting

### Backend Issues

**Problem**: "Cannot connect to database"
**Solution**:
1. Check PostgreSQL service is running
2. Verify DATABASE_URL is set in backend
3. Check backend logs for errors

**Problem**: "CORS error"
**Solution**:
1. Set FRONTEND_URL=* in backend variables
2. Or set exact frontend URL

**Problem**: "API endpoints returning 404"
**Solution**:
1. Check Root Directory is set to `backend`
2. Verify Start Command: `node src/server.js`
3. Rebuild the service

### Frontend Issues

**Problem**: "Can't connect to API"
**Solution**:
1. Check NEXT_PUBLIC_API_URL is set correctly
2. Make sure it includes `/api` at the end
3. Verify backend URL is accessible

**Problem**: "Page not loading"
**Solution**:
1. Check build logs for errors
2. Verify `npm run build` works locally
3. Check environment variables

---

## PART 6: Going Live Tomorrow

### Before Your Team Uses It:

1. ✅ Test all features yourself
2. ✅ Add 2-3 real drivers
3. ✅ Add 2-3 real trucks
4. ✅ Add 1-2 clients
5. ✅ Create a test trip
6. ✅ Check Daily Income page shows data

### Share with Your Team:

Send them:
- Frontend URL: `https://your-app.railway.app`
- Brief instructions on how to use each page

### Important Notes:

- **Data is permanent** - everything saved to database
- **Accessible from anywhere** - just need internet
- **Mobile friendly** - works on phones
- **No data loss** - even if Railway restarts

---

## Quick Commands Reference

### View Logs
```bash
# In Railway dashboard
- Click on service
- Click "Deployments"
- Click latest deployment
- View logs in real-time
```

### Restart Service
```bash
# In Railway dashboard
- Click on service
- Click three dots (...)
- Click "Restart"
```

### Update Code
```bash
# On your computer
git add .
git commit -m "Update features"
git push

# Railway automatically redeploys!
```

---

## Emergency Contacts

If something breaks tomorrow:
1. Check Railway dashboard for service status
2. View logs to see errors
3. Restart the affected service
4. If database issues, check PostgreSQL service

---

## Success Checklist for Tomorrow

Before you leave today:
- [ ] Backend deployed and healthy
- [ ] Frontend deployed and accessible
- [ ] Database connected and working
- [ ] Can add/edit/delete drivers
- [ ] Can add/edit/delete trucks
- [ ] Can add/edit/delete clients
- [ ] Daily Income page loads
- [ ] All navigation works
- [ ] Tested on mobile device
- [ ] URL shared with team

---

Good luck! Your system will be ready for production use tomorrow! 🚀
