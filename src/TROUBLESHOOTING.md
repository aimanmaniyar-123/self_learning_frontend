# Troubleshooting Guide - "Failed to fetch" Error

## 🔴 Error: "Failed to fetch"

This error means the frontend **cannot connect** to your FastAPI backend. Here's how to fix it:

---

## ✅ Solution Steps

### 1. **Start Your FastAPI Backend**

The most common issue is that the backend is not running.

```bash
# Navigate to your FastAPI project directory
cd /path/to/your/fastapi/project

# Start the backend
python main.py

# OR if using uvicorn directly:
uvicorn main:app --reload --port 8000

# You should see output like:
# INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
```

**Test it:** Open `http://localhost:8000` in your browser. You should see your FastAPI app.

---

### 2. **Enable CORS in Your FastAPI Backend**

If your backend is running but you still get "Failed to fetch", it's likely a CORS issue.

**Add this to your FastAPI `main.py` file:**

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# ⭐ ADD THIS - CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite dev server
        "http://localhost:3000",  # Alternative port
        "*"  # Or use "*" to allow all origins (not recommended for production)
    ],
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Your routes here...
@app.get("/api/agents")
def get_agents():
    return [{"id": "1", "name": "Agent 1"}]
```

**Then restart your backend:**
```bash
# Stop the backend (Ctrl+C)
# Start it again
python main.py
```

---

### 3. **Verify Backend is on Port 8000**

The frontend is configured to connect to `http://localhost:8000`.

If your backend runs on a **different port** (e.g., 5000, 3000, 8080), you need to:

**Option A: Change backend to use port 8000**
```python
# In your FastAPI main.py
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

**Option B: Update frontend to match your backend port**
```typescript
// Edit /utils/api.ts line 2:
const API_BASE_URL = 'http://localhost:5000';  // Change to your port
```

---

### 4. **Test Backend Connection**

#### A. Use the Built-in Backend Test Page

1. Open your browser to the frontend: `http://localhost:5173`
2. Click **"Backend Test"** in the sidebar (first menu item, orange color)
3. Click **"Test Connection"** button
4. Follow the troubleshooting steps shown

#### B. Test Manually in Browser

Open these URLs in your browser:

- `http://localhost:8000` - Should show FastAPI welcome page
- `http://localhost:8000/docs` - Should show FastAPI Swagger docs
- `http://localhost:8000/api/agents` - Should return JSON data

#### C. Test with cURL

```bash
# Test health endpoint
curl http://localhost:8000/health

# Test agents endpoint
curl http://localhost:8000/api/agents

# Should return JSON data, not an error
```

---

### 5. **Check Browser Console for Detailed Errors**

1. Open browser Developer Tools (F12)
2. Go to **Console** tab
3. Look for detailed error messages

**Common errors and solutions:**

#### Error: "net::ERR_CONNECTION_REFUSED"
```
Failed to fetch
```
**Solution:** Backend is not running. Start it with `python main.py`

#### Error: "CORS policy: No 'Access-Control-Allow-Origin' header"
```
Access to fetch at 'http://localhost:8000/api/agents' from origin 'http://localhost:5173' 
has been blocked by CORS policy
```
**Solution:** Add CORS middleware to your FastAPI backend (see Step 2)

#### Error: "net::ERR_NAME_NOT_RESOLVED"
```
Failed to fetch
```
**Solution:** Check the backend URL in `/utils/api.ts` - make sure it's correct

---

### 6. **Firewall / Antivirus Check**

Sometimes firewall or antivirus software blocks local connections.

**Windows:**
- Temporarily disable Windows Firewall
- Add exception for port 8000

**Mac:**
- Check System Preferences → Security & Privacy → Firewall

**Antivirus:**
- Add exception for localhost:8000
- Try temporarily disabling antivirus

---

## 📋 Quick Checklist

Before asking for help, verify:

- [ ] Backend is running (check terminal output)
- [ ] Backend is on port 8000 (or frontend URL is updated)
- [ ] CORS is configured in FastAPI
- [ ] Can access `http://localhost:8000` in browser
- [ ] Can access `http://localhost:8000/docs` in browser
- [ ] Browser console shows detailed error (F12 → Console tab)
- [ ] Firewall is not blocking port 8000

---

## 🧪 Minimal FastAPI Example

If you're still having issues, try this minimal FastAPI setup:

**File: `test_backend.py`**
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Backend is working!"}

@app.get("/health")
def health():
    return {"status": "ok", "version": "1.0.0"}

@app.get("/api/agents")
def get_agents():
    return [
        {
            "id": "agent-1",
            "name": "Test Agent",
            "status": "active",
            "type": "Classification",
            "version": "1.0",
            "accuracy": 95.5,
            "tasks": 100
        }
    ]

@app.get("/api/training/sessions")
def get_training_sessions():
    return [
        {
            "id": "session-1",
            "agentName": "Test Agent",
            "status": "completed",
            "progress": 100,
            "accuracy": 95.5
        }
    ]

@app.get("/api/goals")
def get_goals():
    return [
        {
            "id": "1",
            "title": "Test Goal",
            "description": "This is a test goal",
            "status": "in_progress",
            "progress": 50,
            "target": 100,
            "current": 50
        }
    ]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

**Run it:**
```bash
python test_backend.py
```

**Test it:**
- Browser: `http://localhost:8000/docs`
- Frontend: Should now connect successfully

---

## 🎯 Next Steps After Fixing Connection

Once the connection works:

1. Go to **Backend Test** page → Should show ✅ "Backend Connected Successfully"
2. Go to **Agents** page → Should load agents from your backend
3. Click **"Create Agent"** → Should call your backend API
4. Check browser console (F12) → Should see logs like "Fetched agents: [...]"

---

## 🆘 Still Not Working?

If you've tried everything above and it's still not working:

1. **Check backend logs** - Look for errors in your FastAPI terminal
2. **Check Network tab** - Browser DevTools (F12) → Network tab → Look for failed requests
3. **Try different browser** - Sometimes browser extensions block requests
4. **Try incognito mode** - Disables extensions that might interfere
5. **Restart everything** - Close all terminals, restart backend and frontend

---

## 📞 Getting Help

When asking for help, provide:

1. **Error message** from browser console (F12 → Console)
2. **Backend logs** from your FastAPI terminal
3. **Network tab screenshot** (F12 → Network → Show failed request)
4. **Your backend code** (CORS configuration)
5. **What port** your backend is running on
6. **Operating system** (Windows, Mac, Linux)

---

## ✅ Expected Behavior When Working

When everything is working correctly:

1. **Backend Test page** shows green ✅ "Backend Connected Successfully"
2. **Browser console** shows logs like:
   ```
   Fetched agents: [{...}]
   Fetched training sessions: [{...}]
   ```
3. **Network tab** shows successful requests (status 200) to `http://localhost:8000/api/...`
4. **All pages load data** from your backend instead of showing errors
5. **Buttons work** - Creating agents, starting training, etc. call your backend

---

## 🔧 Advanced Configuration

### Using HTTPS
If your backend uses HTTPS:
```typescript
// /utils/api.ts
const API_BASE_URL = 'https://your-domain.com';
```

### Using Custom Domain
If your backend is on a different machine:
```typescript
// /utils/api.ts
const API_BASE_URL = 'http://192.168.1.100:8000';  // Local network
const API_BASE_URL = 'https://api.yourdomain.com';  // Production
```

### Using Environment Variables (Optional)
If you want to use .env files instead:

1. Create `.env` file:
   ```
   VITE_API_BASE_URL=http://localhost:8000
   ```

2. Update `/utils/api.ts`:
   ```typescript
   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
   ```

---

## 📚 Additional Resources

- [FastAPI CORS Documentation](https://fastapi.tiangolo.com/tutorial/cors/)
- [MDN: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
