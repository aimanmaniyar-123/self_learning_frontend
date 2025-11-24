# Backend Endpoints Reference

## ✅ Your Current Backend Endpoints

Based on your agent routes code, here are the endpoints you have:

### **Agent Routes** (`/api/agents`)

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| `POST` | `/api/agents/create` | Create a new agent | `{ name, description?, agent_type?, config? }` | `{ agent_id, name, description, agent_type, config }` |
| `GET` | `/api/agents/list` | List all agents | - | `{ total_agents: number, agents: [...] }` |
| `GET` | `/api/agents/{agent_id}` | Get agent details | - | `{ agent_id, name, description, agent_type, config }` |
| `DELETE` | `/api/agents/{agent_id}` | Delete an agent | - | `{ status: "deleted", agent_id }` |
| `POST` | `/api/agents/interact` | Interact with agent | `{ agent_id, input, context? }` | `{ agent_id, response, success, messages }` |

---

## 🔧 Frontend Integration Status

### ✅ **Working Endpoints:**
- `POST /api/agents/create` → "Create Agent" button
- `GET /api/agents/list` → Loads agents on page load
- `GET /api/agents/{agent_id}` → Get single agent details
- `DELETE /api/agents/{agent_id}` → Delete button
- `POST /api/agents/interact` → "Interact" button

### ⚠️ **Missing Endpoints** (Frontend expects but backend doesn't have):
- `PUT /api/agents/{agent_id}` → Update agent (status, config, etc.)

---

## 📝 Add Missing Endpoint

To support agent updates (like changing status from "active" to "paused"), add this to your backend:

```python
@router.put("/{agent_id}")
async def update_agent(agent_id: str, updates: Dict):
    """Update an agent's properties"""
    if agent_id not in AGENTS:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    # Update only provided fields
    for key, value in updates.items():
        if key in ["name", "description", "agent_type", "config", "status"]:
            AGENTS[agent_id][key] = value
    
    return AGENTS[agent_id]
```

---

## 🧪 Testing Your Backend

### Test with cURL:

```bash
# Create an agent
curl -X POST http://localhost:8000/api/agents/create \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Agent", "agent_type": "Classification", "description": "A test agent"}'

# List all agents
curl http://localhost:8000/api/agents/list

# Get specific agent
curl http://localhost:8000/api/agents/{agent_id}

# Delete agent
curl -X DELETE http://localhost:8000/api/agents/{agent_id}

# Interact with agent
curl -X POST http://localhost:8000/api/agents/interact \
  -H "Content-Type: application/json" \
  -d '{"agent_id": "{agent_id}", "input": "Hello, agent!"}'
```

### Test with Browser:
- `http://localhost:8000/docs` - Swagger UI
- `http://localhost:8000/api/agents/list` - See JSON response

---

## 🎯 Expected Response Formats

### Create Agent Response:
```json
{
  "agent_id": "abc123",
  "name": "Test Agent",
  "description": "A test agent",
  "agent_type": "Classification",
  "config": {}
}
```

### List Agents Response:
```json
{
  "total_agents": 2,
  "agents": [
    {
      "agent_id": "abc123",
      "name": "Agent 1",
      "description": "First agent",
      "agent_type": "default",
      "config": {}
    },
    {
      "agent_id": "def456",
      "name": "Agent 2",
      "description": "Second agent",
      "agent_type": "Classification",
      "config": {}
    }
  ]
}
```

### Interact Response:
```json
{
  "agent_id": "abc123",
  "response": "Hello! How can I help you?",
  "success": true,
  "messages": ["HumanMessage(content='Hello')", "AIMessage(content='Hello! How can I help you?')"]
}
```

---

## 🚀 Complete FastAPI Backend Example

Here's a minimal complete backend that works with the frontend:

```python
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Optional
import uuid

app = FastAPI()

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage
AGENTS: Dict[str, Dict] = {}

# Data Models
class CreateAgentRequest(BaseModel):
    name: str
    description: Optional[str] = None
    agent_type: Optional[str] = "default"
    config: Dict = {}

class InteractionRequest(BaseModel):
    agent_id: str
    input: str
    context: Dict = {}

# Health Check
@app.get("/health")
def health_check():
    return {"status": "ok", "version": "1.0.0"}

# Create Agent
@app.post("/api/agents/create")
async def create_agent(request: CreateAgentRequest):
    agent_id = str(uuid.uuid4())[:8]
    
    AGENTS[agent_id] = {
        "agent_id": agent_id,
        "name": request.name,
        "description": request.description,
        "agent_type": request.agent_type,
        "config": request.config
    }
    
    return AGENTS[agent_id]

# List Agents
@app.get("/api/agents/list")
async def list_agents():
    return {
        "total_agents": len(AGENTS),
        "agents": list(AGENTS.values())
    }

# Get Agent
@app.get("/api/agents/{agent_id}")
async def get_agent(agent_id: str):
    if agent_id not in AGENTS:
        raise HTTPException(status_code=404, detail="Agent not found")
    return AGENTS[agent_id]

# Update Agent (NEW - Add this!)
@app.put("/api/agents/{agent_id}")
async def update_agent(agent_id: str, updates: Dict):
    if agent_id not in AGENTS:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    for key, value in updates.items():
        if key in ["name", "description", "agent_type", "config", "status"]:
            AGENTS[agent_id][key] = value
    
    return AGENTS[agent_id]

# Delete Agent
@app.delete("/api/agents/{agent_id}")
async def delete_agent(agent_id: str):
    if agent_id not in AGENTS:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    del AGENTS[agent_id]
    return {"status": "deleted", "agent_id": agent_id}

# Interact with Agent
@app.post("/api/agents/interact")
async def interact_with_agent(request: InteractionRequest):
    if request.agent_id not in AGENTS:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    # Simple echo response for testing
    # Replace with your actual agent logic
    response_text = f"Agent {request.agent_id} received: {request.input}"
    
    return {
        "agent_id": request.agent_id,
        "response": response_text,
        "success": True,
        "messages": [request.input, response_text]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

Save this as `test_backend.py` and run:
```bash
python test_backend.py
```

Then test the frontend - it should work!

---

## 📊 Other Endpoints Frontend Expects

Your frontend also expects these endpoints (but they're not implemented yet):

### Training
- `GET /api/training/sessions` - List training sessions
- `POST /api/training/start` - Start training
- `POST /api/training/stop/{id}` - Stop training

### Performance
- `GET /api/performance/metrics` - Get metrics

### Evolution
- `GET /api/evolution/history` - Get evolution history
- `POST /api/evolution/trigger/{agent_id}` - Trigger evolution

### Goals
- `GET /api/goals` - List goals
- `POST /api/goals` - Create goal
- `PUT /api/goals/{id}` - Update goal
- `DELETE /api/goals/{id}` - Delete goal

### Anomalies
- `GET /api/anomaly/list` - List anomalies
- `POST /api/anomaly/resolve/{id}` - Resolve anomaly

### Multi-Agent
- `GET /api/multi-agent/collaborations` - List collaborations
- `POST /api/multi-agent/collaborations` - Create collaboration

### Prompts
- `GET /api/prompts` - List prompts
- `POST /api/prompts` - Create prompt
- `PUT /api/prompts/{id}` - Update prompt
- `DELETE /api/prompts/{id}` - Delete prompt

---

## 🎯 Next Steps

1. ✅ **Test Agent endpoints** - They should work now!
2. ⚠️ **Add update endpoint** - Add the `PUT /api/agents/{agent_id}` endpoint
3. 📝 **Implement other endpoints** - Add the remaining endpoints as needed
4. 🧪 **Test each feature** - Use the frontend to test each button/action

---

## 💡 Tips

- Use `http://localhost:8000/docs` to see all your endpoints
- Check browser console (F12) to see API requests
- Check Network tab to see HTTP status codes
- All API calls are logged to console with `console.log()`
