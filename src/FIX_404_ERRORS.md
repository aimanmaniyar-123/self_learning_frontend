# 🔧 Fix 404 Errors - Routes Not Registered

## 🔴 The Problem

Your backend is running ✅ but returns **404 Not Found** for all API routes ❌

This means the routes aren't registered in your FastAPI app.

---

## ✅ **Solution: Update Your main.py**

Your `main.py` needs to **import and include all the route modules**.

### **Option 1: Use the Template I Created**

I've created a complete `main.py` file for you at `/backend_main.py` in this project.

**Copy it to your backend:**

```bash
# From this frontend project directory:
cp backend_main.py /path/to/your/backend/main.py

# Then restart your backend:
cd /path/to/your/backend
python main.py
```

### **Option 2: Update Your Existing main.py**

Add these imports and route registrations to your `main.py`:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Self Learning & Self Improvement System")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check
@app.get("/health")
async def health_check():
    return {"status": "ok", "version": "1.0.0"}

# ==================== REGISTER ALL ROUTES ====================

# 1. Agents Routes
from routes import agents
app.include_router(agents.router, prefix="/api/agents", tags=["Agents"])

# 2. Training Routes
from routes import training
app.include_router(training.router, prefix="/api/training", tags=["Training"])

# 3. Performance Routes
from routes import performance
app.include_router(performance.router, prefix="/api/performance", tags=["Performance"])

# 4. Evolution Routes
from routes import evolution
app.include_router(evolution.router, prefix="/api/evolution", tags=["Evolution"])

# 5. Anomaly Routes
from routes import anomaly
from anomaly_detection import AnomalyDetector
anomaly.anomaly_detector = AnomalyDetector()
app.include_router(anomaly.router, prefix="/api/anomaly", tags=["Anomaly"])

# 6. Goals Routes
from routes import goals
from goal_settings import GoalManager
goals.goal_manager = GoalManager()
app.include_router(goals.router, prefix="/api/goals", tags=["Goals"])

# 7. Checkpoint Routes
from routes import checkpoint
from checkpoint_rollback import CheckpointManager
checkpoint.checkpoint_manager = CheckpointManager()
app.include_router(checkpoint.router, prefix="/api/checkpoint", tags=["Checkpoint"])

# 8. Multi-Agent Routes
from routes import multi_agent
app.include_router(multi_agent.router, prefix="/api/multi-agent", tags=["Multi-Agent"])

# 9. Prompts Routes
from routes import prompts
app.include_router(prompts.router, prefix="/api/prompts", tags=["Prompts"])

# 10. System Routes (optional)
try:
    from routes import system
    app.include_router(system.router, prefix="/api/system", tags=["System"])
except ImportError:
    pass

# Run
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
```

---

## 📁 **Your Backend File Structure Should Look Like:**

```
your_backend/
├── main.py                    # FastAPI app (main file)
├── routes/
│   ├── __init__.py
│   ├── agents.py             # Agent routes
│   ├── training.py           # Training routes
│   ├── performance.py        # Performance routes
│   ├── evolution.py          # Evolution routes
│   ├── anomaly.py            # Anomaly detection routes
│   ├── goals.py              # Goals routes
│   ├── checkpoint.py         # Checkpoint routes
│   ├── multi_agent.py        # Multi-agent routes
│   ├── prompts.py            # Prompts routes
│   └── system.py             # System routes (optional)
├── anomaly_detection.py      # AnomalyDetector class
├── goal_settings.py          # GoalManager class
├── checkpoint_rollback.py    # CheckpointManager class
└── requirements.txt
```

If your route files are in a different location, adjust the import paths accordingly.

---

## 🧪 **Test After Fixing:**

### **1. Restart Backend:**
```bash
# Stop the backend (Ctrl+C)
# Start it again:
python main.py
```

You should now see:
```
✅ Agents routes loaded
✅ Training routes loaded
✅ Performance routes loaded
✅ Evolution routes loaded
✅ Anomaly routes loaded
✅ Goals routes loaded
✅ Checkpoint routes loaded
✅ Multi-agent routes loaded
✅ Prompts routes loaded
```

### **2. Test Endpoints:**
```bash
# Should return 200 OK (not 404):
curl http://localhost:8000/api/agents/list

# Should return agent list or empty array:
# {"total_agents": 0, "agents": []}
```

### **3. Test in Frontend:**
1. Open frontend
2. Click "Backend Test"
3. Should show ✅ Connected
4. Go to "Agents" page
5. Should load without errors!

---

## 🐛 **Common Issues:**

### **Issue 1: ModuleNotFoundError**
```
ModuleNotFoundError: No module named 'routes'
```

**Fix:** Make sure you have a `routes/` directory with `__init__.py`:
```bash
mkdir routes
touch routes/__init__.py
```

### **Issue 2: Import errors for managers**
```
ImportError: cannot import name 'AnomalyDetector'
```

**Fix:** Create placeholder classes if they don't exist:

```python
# anomaly_detection.py
class AnomalyDetector:
    def __init__(self, baseline_window_size=100, anomaly_threshold_sigma=3.0):
        self.baseline_window_size = baseline_window_size
        self.anomaly_threshold_sigma = anomaly_threshold_sigma
        self.metric_history = {}
        self.baselines = {}
        self.anomaly_alerts = []

# goal_settings.py
class GoalManager:
    def __init__(self):
        self.goals = {}

# checkpoint_rollback.py
class CheckpointManager:
    def __init__(self):
        self.checkpoints = {}
```

### **Issue 3: Still getting 404 after adding routes**
- Make sure you **restarted** the backend after making changes
- Check that the route prefix matches: `/api/agents` not `/agents`
- Check that `router = APIRouter()` is defined in each route file

---

## ✅ **Quick Verification:**

After fixing, these should all work:

```bash
# Health check
curl http://localhost:8000/health
# Returns: {"status": "ok", ...}

# List agents
curl http://localhost:8000/api/agents/list
# Returns: {"total_agents": 0, "agents": []}

# Goals summary
curl http://localhost:8000/api/goals/stats/summary
# Returns: {"total_goals": 0, ...}

# Evolution report
curl http://localhost:8000/api/evolution/weekly-report
# Returns: {"week_start": "...", ...}

# Anomaly summary
curl http://localhost:8000/api/anomaly/summary
# Returns: {"total_alerts_24h": 0, ...}
```

---

## 📚 **Next Steps:**

Once routes are registered:

1. ✅ All 404 errors will be gone
2. ✅ Frontend will connect successfully
3. ✅ You can create agents
4. ✅ You can set goals
5. ✅ You can track performance
6. ✅ Everything will work!

---

## 🆘 **Still Not Working?**

Check your terminal output when starting the backend. You should see:
- ✅ for each route that loaded successfully
- ⚠️ for routes that couldn't be found

If you see ⚠️ warnings, it means those route files don't exist or have import errors.

**Copy the `/backend_main.py` file I created - it has error handling for missing routes!**
