# 📋 Step-by-Step Fix for 404 Errors

## 🎯 Goal: Fix "404 Not Found" errors from your backend

---

## ⚡ **Quick Fix (5 minutes)**

### **Step 1: Copy the Template**

I created a complete `main.py` for you. Copy it to your backend:

```bash
# 1. Find the backend_main.py file in this frontend project
# 2. Copy it to your backend folder as main.py

# Example:
cp backend_main.py ~/your-backend-folder/main.py
```

### **Step 2: Restart Backend**

```bash
# Stop current backend (Ctrl+C in the terminal)

# Go to backend folder
cd ~/your-backend-folder

# Start backend
python main.py
```

### **Step 3: Check Logs**

You should see:
```
✅ Agents routes loaded
✅ Training routes loaded
✅ Performance routes loaded
✅ Evolution routes loaded
✅ Anomaly routes loaded
✅ Goals routes loaded
...
```

If you see ⚠️ warnings, those route files are missing - that's okay! The routes that loaded will work.

### **Step 4: Test**

```bash
# Test an endpoint
curl http://localhost:8000/api/agents/list

# Should return JSON, not 404:
# {"total_agents": 0, "agents": []}
```

### **Step 5: Test Frontend**

1. Open your frontend
2. Click "Backend Test"
3. Should show ✅ Connected
4. Go to "Agents" - should work!

**Done!** 🎉

---

## 🔍 **What Was Wrong?**

Your backend was missing this in `main.py`:

```python
# This registers your routes
app.include_router(agents.router, prefix="/api/agents")
app.include_router(training.router, prefix="/api/training")
# ... etc
```

Without these lines, FastAPI doesn't know about your routes, so it returns 404.

---

## 📁 **Backend File Structure**

Make sure your backend has this structure:

```
your-backend/
├── main.py                 ← Main FastAPI app
├── routes/
│   ├── __init__.py         ← Empty file (important!)
│   ├── agents.py
│   ├── training.py
│   ├── performance.py
│   ├── evolution.py
│   ├── anomaly.py
│   ├── goals.py
│   ├── checkpoint.py
│   ├── multi_agent.py
│   └── prompts.py
└── (other files...)
```

**Important:** The `routes/__init__.py` file must exist (even if empty) for Python to recognize it as a package.

---

## 🧪 **Verify It's Working**

### **Test All Key Endpoints:**

```bash
# 1. Health check
curl http://localhost:8000/health
# ✅ Should return: {"status": "ok"}

# 2. List agents
curl http://localhost:8000/api/agents/list
# ✅ Should return: {"total_agents": 0, "agents": []}

# 3. Create agent
curl -X POST http://localhost:8000/api/agents/create \
  -H "Content-Type: application/json" \
  -d '{"name": "Test", "agent_type": "Classification"}'
# ✅ Should return: {"agent_id": "...", "name": "Test", ...}

# 4. Goals summary
curl http://localhost:8000/api/goals/stats/summary
# ✅ Should return: {"total_goals": 0, ...}

# 5. Anomaly summary
curl http://localhost:8000/api/anomaly/summary
# ✅ Should return: {"total_alerts_24h": 0, ...}

# 6. Evolution report
curl http://localhost:8000/api/evolution/weekly-report
# ✅ Should return: {"week_start": "...", ...}
```

If any return 404, that route isn't loaded.

---

## 🔧 **If Still Not Working**

### **Check 1: Routes Directory Exists**
```bash
ls routes/
# Should show: agents.py, training.py, etc.
```

### **Check 2: __init__.py Exists**
```bash
ls routes/__init__.py
# Should exist
```

If it doesn't exist:
```bash
touch routes/__init__.py
```

### **Check 3: Route Files Have `router = APIRouter()`**

Open `routes/agents.py` and verify it has:
```python
from fastapi import APIRouter
router = APIRouter()

@router.get("/list")
async def list_agents():
    ...
```

### **Check 4: main.py Imports Routes**

Open `main.py` and verify it has:
```python
from routes import agents
app.include_router(agents.router, prefix="/api/agents")
```

---

## 💡 **Pro Tips**

### **1. Use the Swagger Docs**

Once backend is running, go to:
```
http://localhost:8000/docs
```

You'll see ALL available endpoints. If routes are missing from Swagger, they're not registered!

### **2. Check Terminal Output**

When you start the backend, look for:
```
✅ Agents routes loaded
✅ Training routes loaded
...
```

If you see ⚠️ warnings, those routes have import errors.

### **3. Test One Route at a Time**

Comment out all routes except one in `main.py`:
```python
# Test just agents first
from routes import agents
app.include_router(agents.router, prefix="/api/agents")

# Comment out the rest for now
# from routes import training
# app.include_router(training.router, prefix="/api/training")
```

Once agents works, uncomment the rest one by one.

---

## ✅ **Success Checklist**

- [ ] Copied `backend_main.py` to backend folder as `main.py`
- [ ] Restarted backend with `python main.py`
- [ ] Saw "✅ routes loaded" messages in terminal
- [ ] `curl http://localhost:8000/health` returns 200 OK
- [ ] `curl http://localhost:8000/api/agents/list` returns JSON (not 404)
- [ ] Frontend "Backend Test" shows ✅ Connected
- [ ] Frontend "Agents" page loads without errors

---

## 🎉 **Once Fixed**

All these will work in your frontend:

✅ Create agents  
✅ Interact with agents  
✅ Create goals  
✅ View anomalies  
✅ Trigger evolution  
✅ View performance metrics  
✅ Save checkpoints  
✅ Create prompt templates  

**Your entire system will be fully operational!** 🚀

---

## 📞 **Need More Help?**

1. Check `/FIX_404_ERRORS.md` - Detailed troubleshooting
2. Check `/backend_main.py` - Complete working template
3. Check `/API_COMPLETE_REFERENCE.md` - All 71 endpoints
4. Check backend terminal logs for error messages
