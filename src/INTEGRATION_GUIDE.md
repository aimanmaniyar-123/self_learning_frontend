# Backend Integration Guide

## ✅ Integration Status

All components are now fully integrated with your FastAPI backend. Every button click and action will call the corresponding backend API endpoint.

## 🔗 Integrated Components

### 1. **Agents** (`/components/Agents.tsx`)
**API Calls:**
- ✅ `GET /api/agents` - Fetch all agents on page load
- ✅ `POST /api/agents` - Create new agent (via "Create Agent" button)
- ✅ `PUT /api/agents/{id}` - Update agent status (Pause/Resume buttons)
- ✅ `DELETE /api/agents/{id}` - Delete agent

**User Actions:**
- Click "Create Agent" → Prompts for name & type → Calls backend
- Click "Pause/Resume" → Updates agent status → Calls backend
- Page loads → Fetches all agents from backend

---

### 2. **Training** (`/components/Training.tsx`)
**API Calls:**
- ✅ `GET /api/training/sessions` - Fetch training sessions on page load
- ✅ `POST /api/training/start` - Start new training (via "Start Training" button)
- ✅ `POST /api/training/stop/{id}` - Stop training session

**User Actions:**
- Click "Start Training" → Prompts for agent ID & epochs → Calls backend
- Page loads → Fetches all training sessions from backend

---

### 3. **Goals** (`/components/Goals.tsx`)
**API Calls:**
- ✅ `GET /api/goals` - Fetch all goals on page load
- ✅ `POST /api/goals` - Create new goal (via "Add Goal" button)
- ✅ `PUT /api/goals/{id}` - Update goal
- ✅ `DELETE /api/goals/{id}` - Delete goal

**User Actions:**
- Click "Add Goal" → Prompts for title, description, target → Calls backend
- Page loads → Fetches all goals from backend

---

### 4. **Performance** (`/components/Performance.tsx`)
**API Calls:**
- ✅ `GET /api/performance/metrics` - Fetch performance metrics
- ✅ Refetches when time range changes (24h, 7d, 30d, 90d)

**User Actions:**
- Page loads → Fetches metrics from backend
- Click time range button → Refetches data

---

### 5. **Evolution** (`/components/Evolution.tsx`)
**API Calls:**
- ✅ `GET /api/evolution/history` - Fetch evolution history on page load
- ✅ `POST /api/evolution/trigger/{agent_id}` - Trigger evolution for an agent

**User Actions:**
- Page loads → Fetches evolution history from backend

---

### 6. **Anomaly Detection** (`/components/AnomalyDetection.tsx`)
**API Calls:**
- ✅ `GET /api/anomaly/list` - Fetch anomalies on page load
- ✅ `POST /api/anomaly/resolve/{id}` - Mark anomaly as resolved

**User Actions:**
- Click "Mark as Resolved" → Updates anomaly status → Calls backend
- Page loads → Fetches all anomalies from backend

---

### 7. **Multi-Agent** (`/components/MultiAgent.tsx`)
**API Calls:**
- ✅ `GET /api/multi-agent/collaborations` - Fetch collaborations on page load
- ✅ `POST /api/multi-agent/collaborations` - Create new collaboration

**User Actions:**
- Page loads → Fetches all collaborations from backend

---

### 8. **Prompts** (`/components/Prompts.tsx`)
**API Calls:**
- ✅ `GET /api/prompts` - Fetch all prompts on page load
- ✅ `POST /api/prompts` - Create new prompt (via "Create Prompt" button)
- ✅ `PUT /api/prompts/{id}` - Update prompt (via "Edit" button)
- ✅ `DELETE /api/prompts/{id}` - Delete prompt (via delete button)

**User Actions:**
- Click "Create Prompt" → Prompts for name, content, category → Calls backend
- Click "Edit" → Updates prompt → Calls backend
- Click delete icon → Deletes prompt → Calls backend
- Page loads → Fetches all prompts from backend

---

### 9. **Dashboard** (`/components/Dashboard.tsx`)
**API Calls:**
- ✅ Fetches data from multiple endpoints in parallel:
  - `GET /api/agents`
  - `GET /api/training/sessions`
  - `GET /api/performance/metrics`
  - `GET /api/goals`
  - `GET /api/anomaly/list`

**User Actions:**
- Page loads → Fetches all dashboard data from backend

---

## 🔧 Backend URL Configuration

The backend URL is hardcoded in `/utils/api.ts`:

```typescript
const API_BASE_URL = 'http://localhost:8000';
```

**To change the backend URL:**
1. Open `/utils/api.ts`
2. Change line 2 to your backend URL:
   ```typescript
   const API_BASE_URL = 'https://your-backend-url.com';
   ```

---

## 🧪 Testing Integration

### 1. **Check Browser Console**
All API calls are logged to the browser console with `console.log()`:
- Open DevTools (F12)
- Go to Console tab
- You'll see logs like:
  - `"Fetched agents:"` followed by the response data
  - `"Creating agent:"` when you create an agent
  - `"Starting training:"` when you start training

### 2. **Check Network Tab**
- Open DevTools (F12)
- Go to Network tab
- Filter by "Fetch/XHR"
- You'll see all HTTP requests to your backend:
  - `GET http://localhost:8000/api/agents`
  - `POST http://localhost:8000/api/training/start`
  - etc.

### 3. **Common Issues**

**❌ CORS Error:**
```
Access to fetch at 'http://localhost:8000/api/agents' from origin 'http://localhost:5173' 
has been blocked by CORS policy
```

**Solution:** Update your FastAPI backend CORS settings:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**❌ Connection Refused:**
```
Failed to fetch
```

**Solution:** Make sure your FastAPI backend is running:
```bash
python main.py  # or however you start your backend
```

**❌ 404 Not Found:**
```
API Error: 404 Not Found
```

**Solution:** The endpoint doesn't exist on your backend. Check that your backend has the endpoint the UI is calling.

---

## 📊 Expected Backend Response Formats

Based on the integration, your backend should return data in these formats:

### Agents
```json
[
  {
    "id": "alpha-7",
    "name": "Alpha-7",
    "version": "2.3",
    "status": "active",
    "accuracy": 95.2,
    "tasks": 1247,
    "lastActive": "2 min ago",
    "type": "Classification"
  }
]
```

### Training Sessions
```json
[
  {
    "id": "session-1",
    "agentName": "Alpha-7",
    "status": "completed",
    "progress": 100,
    "startTime": "2024-11-21 08:30",
    "duration": "2h 15m",
    "accuracy": 95.2,
    "epochs": 150
  }
]
```

### Goals
```json
[
  {
    "id": "1",
    "title": "Achieve 98% Accuracy",
    "description": "Improve overall system accuracy",
    "status": "in_progress",
    "progress": 87,
    "target": 98,
    "current": 94.2,
    "priority": "high"
  }
]
```

### Anomalies
```json
[
  {
    "id": "1",
    "type": "performance",
    "severity": "high",
    "title": "Sudden accuracy drop",
    "description": "Accuracy decreased from 97.1% to 89.3%",
    "timestamp": "2024-11-21 10:23:15",
    "agent": "Gamma-2",
    "status": "investigating"
  }
]
```

### Prompts
```json
[
  {
    "id": "1",
    "name": "Classification Prompt",
    "category": "classification",
    "description": "Standard classification prompt",
    "content": "Analyze the following text...",
    "usage": 1247,
    "rating": 4.8
  }
]
```

---

## 🚀 Quick Start

1. **Start your FastAPI backend:**
   ```bash
   python main.py
   ```

2. **Start the frontend:**
   ```bash
   npm run dev
   ```

3. **Open browser:** http://localhost:5173

4. **Test integration:**
   - Go to Agents page → Should fetch agents from backend
   - Click "Create Agent" → Should call POST /api/agents
   - Check browser console for logs
   - Check Network tab for HTTP requests

---

## 🎯 Next Steps

- [ ] Implement proper loading states for all components
- [ ] Add better error messages
- [ ] Add toast notifications instead of alert()
- [ ] Add real-time updates with WebSocket
- [ ] Add authentication/authorization
- [ ] Add data validation
- [ ] Add TypeScript types for all API responses
- [ ] Add retry logic for failed requests
- [ ] Add request caching

---

## 📝 Notes

- All components show loading spinners while fetching data
- All components handle errors and show error messages
- All API calls are logged to console for debugging
- All create/update/delete actions refresh the data after completion
- The UI uses `alert()` for success/error messages (can be replaced with toast notifications)
