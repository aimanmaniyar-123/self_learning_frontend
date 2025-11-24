# Complete API Endpoints Reference

## 🎯 All Your Backend Endpoints

Based on your actual backend code, here's a complete reference of all available endpoints:

---

## 1. **Agent Routes** (`/api/agents`)

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| `POST` | `/api/agents/create` | Create new agent | `{ name, description?, agent_type?, config? }` | `{ agent_id, name, description, agent_type, config }` |
| `GET` | `/api/agents/list` | List all agents | - | `{ total_agents, agents: [...] }` |
| `GET` | `/api/agents/{agent_id}` | Get agent details | - | `{ agent_id, name, ... }` |
| `DELETE` | `/api/agents/{agent_id}` | Delete agent | - | `{ status: "deleted", agent_id }` |
| `POST` | `/api/agents/interact` | Interact with agent | `{ agent_id, input, context? }` | `{ agent_id, response, success, messages }` |

**Frontend Integration:** ✅ **WORKING**

---

## 2. **Anomaly Detection Routes** (`/api/anomaly`)

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| `POST` | `/api/anomaly/report-metric` | Report single metric | `{ agent_id, metric_name, value, timestamp? }` | `AnomalyAlertResponse` or `null` |
| `POST` | `/api/anomaly/batch-report` | Report multiple metrics | `{ agent_id, metrics: {metric_name: value} }` | `{ agent_id, metrics_processed, anomalies_detected, alerts }` |
| `GET` | `/api/anomaly/alerts` | Get anomaly alerts | Query: `agent_id?, hours?, severity?` | `{ total_alerts, alerts: [...] }` |
| `GET` | `/api/anomaly/alerts/critical` | Get critical alerts only | Query: `hours?` | `{ total_critical_alerts, alerts: [...] }` |
| `GET` | `/api/anomaly/health/{agent_id}/{metric_name}` | Get metric health status | - | `{ status, current_value, baseline_mean, z_score, recent_trend }` |
| `GET` | `/api/anomaly/health/agent/{agent_id}` | Get agent overall health | - | `{ agent_id, overall_status, total_metrics, metrics: {...} }` |
| `GET` | `/api/anomaly/summary` | Get anomaly summary | - | `{ total_alerts_24h, total_alerts_1h, alerts_by_severity, tracked_metrics, critical_alerts }` |
| `GET` | `/api/anomaly/baseline/{agent_id}/{metric_name}` | Get baseline stats | - | `{ mean_value, std_dev, min_threshold, max_threshold }` |
| `POST` | `/api/anomaly/check-anomaly` | Check if value is anomalous | `{ agent_id, metric_name, current_value }` | `{ is_anomalous, z_score, severity, recommendation }` |
| `GET` | `/api/anomaly/stats` | Get detection stats | - | `{ total_metrics_tracked, total_baselines_built, total_alerts_generated, detector_config }` |
| `DELETE` | `/api/anomaly/clear-agent-history/{agent_id}` | Clear agent history | - | `{ status: "cleared", agent_id, metrics_removed }` |
| `GET` | `/api/anomaly/config` | Get detector config | - | `{ baseline_window_size, anomaly_threshold_sigma, min_baseline_points }` |

**Frontend Integration:** ✅ **UPDATED** (uses `/alerts` endpoint)

---

## 3. **Checkpoint/Rollback Routes** (`/api/checkpoint`)

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| `POST` | `/api/checkpoint/save` | Save checkpoint | `{ agent_id, model_version, performance_metrics, ... }` | `{ checkpoint_id, agent_id, ... }` |
| `GET` | `/api/checkpoint/list` | List checkpoints | Query: `agent_id?, checkpoint_type?` | `{ total_checkpoints, checkpoints: [...] }` |
| `GET` | `/api/checkpoint/{checkpoint_id}` | Get checkpoint details | - | `{ checkpoint_id, agent_id, model_version, ... }` |
| `POST` | `/api/checkpoint/rollback` | Rollback to checkpoint | `{ from_checkpoint_id, to_checkpoint_id, reason }` | `{ rollback_id, status, rolled_back_at }` |
| `GET` | `/api/checkpoint/best/{agent_id}` | Get best checkpoint | Query: `metric?` (default: accuracy) | `CheckpointResponse` |
| `DELETE` | `/api/checkpoint/{checkpoint_id}` | Delete checkpoint | - | `{ status: "deleted", checkpoint_id }` |
| `POST` | `/api/checkpoint/cleanup/{agent_id}` | Cleanup old checkpoints | Query: `keep_count?` (default: 5) | `{ agent_id, checkpoints_removed }` |
| `GET` | `/api/checkpoint/stats/{agent_id}` | Get checkpoint stats | - | `{ total_checkpoints, checkpoints_by_type, total_storage_mb, avg_metrics }` |
| `GET` | `/api/checkpoint/compare/{cp1}/{cp2}` | Compare 2 checkpoints | - | `{ checkpoint_1, checkpoint_2, differences }` |
| `GET` | `/api/checkpoint/verify/{checkpoint_id}` | Verify integrity | - | `{ checkpoint_id, is_valid, checksum, status }` |
| `GET` | `/api/checkpoint/rollback-history/{agent_id}` | Get rollback history | Query: `limit?` (default: 10) | `{ total_rollbacks, rollbacks: [...] }` |
| `POST` | `/api/checkpoint/export/{checkpoint_id}` | Export checkpoint | Query: `export_format?` (default: json) | `{ export_format, checkpoint_data }` |

**Frontend Integration:** ✅ **ADDED** (API client updated, component needs update)

---

## 4. **Evolution Routes** (`/api/evolution`)

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| `GET` | `/api/evolution/agent/{agent_id}` | Get agent evolution metrics | - | `{ agent_id, current_version, previous_version, learning_iterations, performance_improvement, parameters_updated }` |
| `GET` | `/api/evolution/architecture-variations/{agent_id}` | Get A/B test variations | - | `[ { variation_id, changes, success_rate, sample_size, winner } ]` |
| `POST` | `/api/evolution/trigger` | Trigger evolution | Query: `agent_id?` (optional) | `{ status, agents_count, estimated_duration }` |
| `GET` | `/api/evolution/weekly-report` | Get weekly report | - | `{ week_start, week_end, agents_evolved, avg_improvement, best_improvement, recommendations }` |
| `GET` | `/api/evolution/learning-curve/{agent_id}` | Get learning curve | - | `{ agent_id, learning_curve: [{iteration, accuracy, loss}], convergence, final_accuracy }` |
| `POST` | `/api/evolution/hyperparameter-tune` | Tune hyperparameters | `{ agent_id, param_name, new_value }` | `{ agent_id, parameter, new_value, status, expected_improvement }` |

**Frontend Integration:** ✅ **UPDATED** (uses `/weekly-report` and `/trigger`)

---

## 5. **Training Routes** (`/api/training`) - NOT IMPLEMENTED YET

Your frontend expects these but they're not in your backend yet:

| Method | Endpoint | Description | Needed? |
|--------|----------|-------------|---------|
| `GET` | `/api/training/sessions` | List training sessions | ⚠️ Not implemented |
| `POST` | `/api/training/start` | Start training | ⚠️ Not implemented |
| `POST` | `/api/training/stop/{id}` | Stop training | ⚠️ Not implemented |

**Frontend Integration:** ❌ **NEEDS BACKEND**

---

## 6. **Performance Routes** (`/api/performance`) - NOT IMPLEMENTED YET

Your frontend expects these but they're not in your backend yet:

| Method | Endpoint | Description | Needed? |
|--------|----------|-------------|---------|
| `GET` | `/api/performance/metrics` | Get performance metrics | ⚠️ Not implemented |
| `GET` | `/api/performance/agent/{id}` | Get agent performance | ⚠️ Not implemented |
| `GET` | `/api/performance/history` | Get performance history | ⚠️ Not implemented |

**Frontend Integration:** ❌ **NEEDS BACKEND**

---

## 7. **Goals Routes** (`/api/goals`) - NOT IMPLEMENTED YET

Your frontend expects these but they're not in your backend yet:

| Method | Endpoint | Description | Needed? |
|--------|----------|-------------|---------|
| `GET` | `/api/goals` | List goals | ⚠️ Not implemented |
| `POST` | `/api/goals` | Create goal | ⚠️ Not implemented |
| `PUT` | `/api/goals/{id}` | Update goal | ⚠️ Not implemented |
| `DELETE` | `/api/goals/{id}` | Delete goal | ⚠️ Not implemented |

**Frontend Integration:** ❌ **NEEDS BACKEND**

---

## 8. **Multi-Agent Routes** (`/api/multi-agent`) - NOT IMPLEMENTED YET

Your frontend expects these but they're not in your backend yet:

| Method | Endpoint | Description | Needed? |
|--------|----------|-------------|---------|
| `GET` | `/api/multi-agent/collaborations` | List collaborations | ⚠️ Not implemented |
| `POST` | `/api/multi-agent/collaborations` | Create collaboration | ⚠️ Not implemented |

**Frontend Integration:** ❌ **NEEDS BACKEND**

---

## 9. **Prompts Routes** (`/api/prompts`) - NOT IMPLEMENTED YET

Your frontend expects these but they're not in your backend yet:

| Method | Endpoint | Description | Needed? |
|--------|----------|-------------|---------|
| `GET` | `/api/prompts` | List prompts | ⚠️ Not implemented |
| `POST` | `/api/prompts` | Create prompt | ⚠️ Not implemented |
| `PUT` | `/api/prompts/{id}` | Update prompt | ⚠️ Not implemented |
| `DELETE` | `/api/prompts/{id}` | Delete prompt | ⚠️ Not implemented |

**Frontend Integration:** ❌ **NEEDS BACKEND**

---

## 📊 Integration Status Summary

### ✅ **Fully Integrated & Working:**
- **Agents** - Create, list, delete, interact ✅
- **Anomaly Detection** - Get alerts, check anomalies, report metrics ✅
- **Evolution** - Trigger evolution, get weekly report ✅
- **Checkpoints** - Save, list, rollback, compare ✅

### ⚠️ **Partially Integrated** (Frontend ready, backend missing):
- **Training** - Frontend ready, needs backend implementation
- **Performance** - Frontend ready, needs backend implementation
- **Goals** - Frontend ready, needs backend implementation
- **Multi-Agent** - Frontend ready, needs backend implementation
- **Prompts** - Frontend ready, needs backend implementation

---

## 🚀 Quick Test Commands

### Test Agents:
```bash
# Create agent
curl -X POST http://localhost:8000/api/agents/create \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Agent", "agent_type": "Classification"}'

# List agents
curl http://localhost:8000/api/agents/list
```

### Test Anomaly Detection:
```bash
# Report metric
curl -X POST http://localhost:8000/api/anomaly/report-metric \
  -H "Content-Type: application/json" \
  -d '{"agent_id": "agent-1", "metric_name": "accuracy", "value": 95.5}'

# Get alerts
curl http://localhost:8000/api/anomaly/alerts

# Get critical alerts
curl http://localhost:8000/api/anomaly/alerts/critical

# Get anomaly summary
curl http://localhost:8000/api/anomaly/summary
```

### Test Evolution:
```bash
# Trigger evolution
curl -X POST http://localhost:8000/api/evolution/trigger

# Get weekly report
curl http://localhost:8000/api/evolution/weekly-report

# Get agent evolution
curl http://localhost:8000/api/evolution/agent/agent-1
```

### Test Checkpoints:
```bash
# Save checkpoint
curl -X POST http://localhost:8000/api/checkpoint/save \
  -H "Content-Type: application/json" \
  -d '{"agent_id": "agent-1", "model_version": "1.0", "performance_metrics": {"accuracy": 95.5}}'

# List checkpoints
curl http://localhost:8000/api/checkpoint/list

# Get checkpoint stats
curl http://localhost:8000/api/checkpoint/stats/agent-1
```

---

## 🎯 What Works Right Now

1. **Go to Backend Test page** → Should connect ✅
2. **Go to Agents page** → Should load agents ✅
3. **Click "Create Agent"** → Should create agent ✅
4. **Click "Interact"** → Should interact with agent ✅
5. **Click "Delete"** → Should delete agent ✅

Other pages (Training, Performance, Goals, etc.) will show errors because those backend endpoints don't exist yet.

---

## 📝 Next Steps

To make ALL pages work:

1. ✅ **Agents** - Already working
2. ✅ **Anomaly Detection** - Already working
3. ✅ **Evolution** - Already working
4. ✅ **Checkpoints** - API ready, needs UI component
5. ❌ **Training** - Need to implement backend routes
6. ❌ **Performance** - Need to implement backend routes
7. ❌ **Goals** - Need to implement backend routes
8. ❌ **Multi-Agent** - Need to implement backend routes
9. ❌ **Prompts** - Need to implement backend routes

---

## 💡 Pro Tips

- All working endpoints are logged to browser console
- Check Network tab (F12) to see actual HTTP requests
- Backend returns detailed error messages
- Use `/docs` endpoint for Swagger documentation
- Test each endpoint with cURL before using in frontend

Happy coding! 🚀
