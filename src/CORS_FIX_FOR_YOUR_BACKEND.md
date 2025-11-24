# 🔧 CORS Fix for Your Backend

## 🔴 Problem Found!

Your backend's CORS is configured to only allow:
- `http://localhost:3000`
- `http://localhost:8501`

But your frontend is running on **`http://localhost:5173`** (Vite default port).

This is why you get connection errors!

---

## ✅ Solution 1: Add Port 5173 to CORS (RECOMMENDED)

### Update your `config.py` file:

```python
class Settings:
    HOST = "0.0.0.0"
    PORT = 8000
    CORS_ORIGINS = [
        "http://localhost:3000",
        "http://localhost:5173",  # ← Add this line!
        "http://localhost:8501",
    ]
    DEBUG = True
```

### Or update `main.py` directly:

```python
# In main.py, change this line:
class MinimalSettings:
    HOST = "0.0.0.0"
    PORT = 8000
    CORS_ORIGINS = [
        "http://localhost:3000",
        "http://localhost:5173",  # ← Add this!
        "http://localhost:8501",
    ]
    DEBUG = True
```

---

## ✅ Solution 2: Allow All Origins (DEV ONLY)

For development, you can allow all origins:

```python
class MinimalSettings:
    HOST = "0.0.0.0"
    PORT = 8000
    CORS_ORIGINS = ["*"]  # ← Allow all origins (dev only!)
    DEBUG = True
```

⚠️ **Warning:** Only use `["*"]` in development. In production, specify exact origins.

---

## 🧪 Test After Fix

### Step 1: Update config
Add `"http://localhost:5173"` to CORS_ORIGINS

### Step 2: Restart backend
```bash
# Stop backend (Ctrl+C)
# Start again:
python main.py
```

You should see:
```
✅ CORS configured: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:8501']
```

### Step 3: Test frontend
1. Refresh frontend in browser
2. Click "Backend Test"
3. Should show ✅ **Connected!**
4. Go to "Agents" page
5. Should load without errors!

---

## 🔍 How to Verify CORS is Fixed

### Check Browser Console (F12):

**Before fix:**
```
Access to fetch at 'http://localhost:8000/api/agents/list' 
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**After fix:**
```
✅ No CORS errors!
```

### Check Network Tab:

**Before fix:**
- Status: (failed)
- Error: CORS error

**After fix:**
- Status: 200 OK
- Response: JSON data

---

## 📋 Complete Fix Checklist

- [ ] Add `"http://localhost:5173"` to CORS_ORIGINS in config.py
- [ ] Restart backend
- [ ] Check terminal shows: `✅ CORS configured: [...'http://localhost:5173'...]`
- [ ] Refresh frontend
- [ ] Click "Backend Test" → Shows ✅ Connected
- [ ] Go to "Agents" → Loads without errors
- [ ] All features work!

---

## 💡 Why This Happened

Vite (your frontend dev server) runs on port **5173** by default.

Your backend CORS only allowed ports **3000** and **8501**, so the browser blocked the requests.

Adding port 5173 to the allowed origins fixes this!

---

## 🎉 After This Fix

Everything will work:
- ✅ Backend Test shows connected
- ✅ Agents page loads
- ✅ Can create agents
- ✅ Can create goals
- ✅ Can view anomalies
- ✅ All features operational!

**Just add the port and restart!** 🚀
