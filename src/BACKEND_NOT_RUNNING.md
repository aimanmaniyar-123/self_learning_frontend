# ⚠️ Backend Not Running

## 🔴 The errors you're seeing mean your FastAPI backend is NOT running.

All the "Cannot connect to backend" errors are because there's no server at `http://localhost:8000`.

---

## ✅ **How to Fix:**

### **Step 1: Start Your Backend**

Navigate to your backend directory and start the FastAPI server:

```bash
# Go to your backend folder
cd /path/to/your/backend

# Start FastAPI
python main.py

# OR if you use uvicorn directly:
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [xxxxx] using StatReload
INFO:     Started server process [xxxxx]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

### **Step 2: Test Backend is Running**

Open a new terminal and test:

```bash
curl http://localhost:8000/health
```

Should return something like:
```json
{"status": "ok", "version": "1.0.0"}
```

### **Step 3: Test in Browser**

1. Go to your frontend app
2. Click **"Backend Test"** in sidebar
3. Click **"Test Connection"**
4. Should now show: ✅ **"Backend Connected Successfully!"**

---

## 🎯 **Quick Test Commands**

Once backend is running, test each endpoint:

### **Test Agents:**
```bash
# List agents
curl http://localhost:8000/api/agents/list

# Create agent
curl -X POST http://localhost:8000/api/agents/create \
  -H "Content-Type: application/json" \
  -d '{"name": "Test", "agent_type": "Classification"}'
```

### **Test Goals:**
```bash
# Get goals summary
curl http://localhost:8000/api/goals/stats/summary
```

### **Test Anomalies:**
```bash
# Get anomaly summary
curl http://localhost:8000/api/anomaly/summary
```

### **Test Evolution:**
```bash
# Get weekly report
curl http://localhost:8000/api/evolution/weekly-report
```

### **Test Performance:**
```bash
# Get system performance
curl http://localhost:8000/api/performance/metrics/system
```

---

## 🔧 **Make Sure CORS is Configured**

Your backend needs CORS enabled. In your `main.py`:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Your routes here...
```

---

## 📋 **Checklist:**

- [ ] Backend server is running (`python main.py`)
- [ ] Backend is accessible at `http://localhost:8000`
- [ ] CORS is configured in backend
- [ ] `/health` endpoint returns 200 OK
- [ ] Frontend can connect (Backend Test shows ✅)

---

## 💡 **Common Issues:**

### **Port 8000 already in use:**
```bash
# Kill existing process
lsof -ti:8000 | xargs kill -9

# Or use a different port
uvicorn main:app --port 8001
# Then update frontend: /utils/api.ts -> API_BASE_URL = 'http://localhost:8001'
```

### **Backend crashes on startup:**
- Check for missing dependencies: `pip install -r requirements.txt`
- Check for syntax errors in your backend code
- Check the terminal output for error messages

### **CORS errors in browser:**
- Make sure CORS middleware is added to FastAPI
- Check browser console for specific CORS error
- Try adding `"*"` to `allow_origins` for testing

---

## 🚀 **Once Backend is Running:**

All these features will work immediately:

✅ **Agents** - Create, list, interact, delete  
✅ **Goals** - Create goals, track progress  
✅ **Anomalies** - View alerts, check health  
✅ **Evolution** - Trigger evolution, view reports  
✅ **Performance** - System metrics  
✅ **Training** - Trigger training  
✅ **Checkpoints** - Save and rollback  
✅ **Prompts** - Create templates  
✅ **Multi-Agent** - Collaboration  

**Your frontend is 100% ready. Just start the backend!** 🎉
