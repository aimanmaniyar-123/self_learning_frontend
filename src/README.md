# Self Learning & Self Improvement System

A modern web dashboard for monitoring and managing your self-learning AI agent system.

## Features

- 🤖 **Agent Management** - Create, monitor, and control AI agents
- 📊 **Performance Analytics** - Track metrics, accuracy, and response times
- 🎓 **Training Dashboard** - Monitor training sessions with real-time progress
- 🔄 **Evolution Tracking** - View agent improvements across generations
- 🎯 **Goal Management** - Set and track system objectives
- 🚨 **Anomaly Detection** - Monitor system health and investigate issues
- 🤝 **Multi-Agent Collaboration** - Manage collaborative agent pipelines
- 📝 **Prompt Management** - Create and optimize AI prompts

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn
- FastAPI backend running (default: http://localhost:8000)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```bash
   cp .env.example .env
   ```

4. Update the API URL in `.env`:
   ```
   VITE_API_BASE_URL=http://localhost:8000
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Backend Integration

### Current State
All components currently use **mock data** for demonstration purposes. This allows you to preview the UI without a backend.

### Integrating Your FastAPI Backend

#### Step 1: Update Environment Variables
Edit your `.env` file to point to your backend:
```
VITE_API_BASE_URL=http://localhost:8000
```

#### Step 2: Use the API Client
The project includes a pre-configured API client at `/utils/api.ts` that maps to your FastAPI endpoints:

```typescript
import { api } from '../utils/api';

// Example: Fetch agents
const agents = await api.getAgents();

// Example: Create a new agent
await api.createAgent({ name: 'New Agent', type: 'Classification' });
```

#### Step 3: Replace Mock Data in Components

**Option A: Use the API-Connected Component Example**
- See `/components/AgentsWithAPI.tsx` for a complete example
- This component includes:
  - Loading states
  - Error handling
  - API integration
  - CRUD operations

**Option B: Update Existing Components**
Replace the mock data arrays with API calls using `useEffect`:

```typescript
import { useState, useEffect } from 'react';
import { api } from '../utils/api';

export function MyComponent() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await api.getAgents(); // or other API method
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ... rest of component
}
```

### Available API Methods

The API client (`/utils/api.ts`) includes methods for all your backend endpoints:

**System**
- `api.getHealth()` - Health check
- `api.getRoot()` - Root endpoint

**Agents**
- `api.getAgents()` - List all agents
- `api.getAgent(id)` - Get single agent
- `api.createAgent(data)` - Create agent
- `api.updateAgent(id, data)` - Update agent
- `api.deleteAgent(id)` - Delete agent

**Training**
- `api.getTrainingSessions()` - List sessions
- `api.startTraining(data)` - Start training
- `api.stopTraining(id)` - Stop training

**Performance**
- `api.getPerformanceMetrics()` - Get metrics
- `api.getAgentPerformance(id)` - Agent-specific metrics

**Evolution**
- `api.getEvolutionHistory()` - Evolution history
- `api.triggerEvolution(agentId, data)` - Trigger evolution

**Goals**
- `api.getGoals()` - List goals
- `api.createGoal(data)` - Create goal
- `api.updateGoal(id, data)` - Update goal

**Anomaly Detection**
- `api.getAnomalies()` - List anomalies
- `api.resolveAnomaly(id)` - Resolve anomaly

**Multi-Agent**
- `api.getCollaborations()` - List collaborations
- `api.createCollaboration(data)` - Create collaboration

**Prompts**
- `api.getPrompts()` - List prompts
- `api.createPrompt(data)` - Create prompt
- `api.updatePrompt(id, data)` - Update prompt

**Checkpoints**
- `api.getCheckpoints(agentId?)` - List checkpoints
- `api.createCheckpoint(agentId, data)` - Create checkpoint
- `api.restoreCheckpoint(id)` - Restore checkpoint

### CORS Configuration

Make sure your FastAPI backend allows CORS from your frontend URL. Your backend already has:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:8501"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Add your Vite dev server port (usually 5173):
```python
allow_origins=["http://localhost:3000", "http://localhost:5173", "http://localhost:8501"],
```

## Project Structure

```
├── components/
│   ├── Dashboard.tsx           # Main dashboard
│   ├── Agents.tsx             # Agent management (mock data)
│   ├── AgentsWithAPI.tsx      # Agent management (API-connected example)
│   ├── Training.tsx           # Training sessions
│   ├── Performance.tsx        # Performance analytics
│   ├── Evolution.tsx          # Evolution tracking
│   ├── Goals.tsx              # Goal management
│   ├── AnomalyDetection.tsx   # Anomaly monitoring
│   ├── MultiAgent.tsx         # Multi-agent collaboration
│   ├── Prompts.tsx            # Prompt management
│   └── Sidebar.tsx            # Navigation sidebar
├── utils/
│   └── api.ts                 # API client with all backend endpoints
├── App.tsx                    # Main app component
└── .env.example               # Environment variables template
```

## Development Workflow

1. **Start with mock data** - Test the UI independently
2. **Implement backend endpoints** - Ensure they match the API client
3. **Test endpoints** - Use `/docs` on your FastAPI backend
4. **Update components** - Replace mock data with API calls
5. **Handle errors** - Add loading and error states

## Tips

- Use the browser console to debug API calls
- Check Network tab in DevTools for API requests/responses
- Start with one component (e.g., Agents) before updating all
- The mock data structure shows what your API should return
- Add proper TypeScript types based on your backend models

## Next Steps

- [ ] Create `.env` file with your backend URL
- [ ] Update components to use API instead of mock data
- [ ] Add authentication if needed
- [ ] Implement WebSocket for real-time updates
- [ ] Add data export/import functionality
- [ ] Customize styling and branding
