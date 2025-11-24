// =========================================
// API CLIENT - CLEAN + COMPLETE VERSION
// =========================================

const API_BASE_URL = " https://self-learning-backend.onrender.com";

export async function testConnection() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return { success: response.ok, status: response.status };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// =========================================
// API CLIENT CLASS
// =========================================
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T = any>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const res = await fetch(this.baseUrl + endpoint, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
    });

    if (!res.ok) {
      const msg = await res.text();
      throw new Error(`API Error: ${res.status} - ${msg}`);
    }

    return await res.json();
  }

  // =========================================
  // SYSTEM
  // =========================================
  getHealth() {
    return this.request("/health");
  }

  // =========================================
  // AGENTS
  // =========================================
  getAgents() {
    return this.request("/agents");
  }

  getAgent(id: string) {
    return this.request(`/agents/${id}`);
  }

  createAgent(data: any) {
    return this.request("/agents", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  updateAgent(id: string, data: any) {
    return this.request(`/agents/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  deleteAgent(id: string) {
    return this.request(`/agents/${id}`, { method: "DELETE" });
  }

  interactWithAgent(id: string, input: string) {
    return this.request(`/agents/${id}/interact`, {
      method: "POST",
      body: JSON.stringify({ input }),
    });
  }

  // ---- NEW: agent history ----
  getAgentHistory(id: string) {
    return this.request(`/agents/${id}/history`);
  }

  // ---- NEW: feedback for self-learning ----
  submitTrainingFeedback(data: {
    agent_id: string;
    input_text: string;
    label: number;
  }) {
    return this.request("/training/feedback", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // =========================================
  // TRAINING
  // =========================================
  getTrainingSessions() {
    return this.request("/training/sessions");
  }

  startTraining(data: any) {
    return this.request("/training/start", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  stopTraining(sessionId: string) {
    return this.request(`/training/stop/${sessionId}`, {
      method: "POST",
    });
  }

  // =========================================
  // PERFORMANCE
  // =========================================
  getPerformanceMetrics() {
    return this.request("/performance/metrics");
  }

  getSystemPerformance() {
    return this.request("/performance/system");
  }

  // =========================================
  // EVOLUTION
  // =========================================
  getEvolutionHistory() {
    return this.request("/evolution/history");
  }

  triggerEvolution(agentId?: string) {
    return this.request("/evolution/trigger", {
      method: "POST",
      body: JSON.stringify({ agent_id: agentId || null }),
    });
  }

  // =========================================
  // GOALS (COMPLETE)
  // =========================================
  getGoalsSummary() {
    return this.request("/goals/summary");
  }

  getGoals() {
    return this.request("/goals");
  }

  createGoal(body: any) {
    return this.request("/goals", {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  deleteGoal(id: string) {
    return this.request(`/goals/${id}`, {
      method: "DELETE",
    });
  }

  updateGoalProgress(id: string, value: number) {
    return this.request(`/goals/${id}/progress`, {
      method: "PATCH",
      body: JSON.stringify({ current_value: value }),
    });
  }

  // =========================================
  // ANOMALIES
  // =========================================
  getAnomalies() {
    return this.request("/anomalies");
  }

  resolveAnomaly(id: string) {
    return this.request(`/anomalies/${id}/resolve`, {
      method: "PATCH",
    });
  }

  // =========================================
  // COLLABORATIONS
  // =========================================
  getCollaborations() {
    return this.request("/collaborations");
  }

  createCollaboration(data: any) {
    return this.request("/collaborations", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // =========================================
  // PROMPTS
  // =========================================
  getPrompts() {
    return this.request("/prompts");
  }

  createPrompt(data: any) {
    return this.request("/prompts", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  deletePrompt(id: string) {
    return this.request(`/prompts/${id}`, {
      method: "DELETE",
    });
  }

  updatePrompt(id: string, data: any) {
    return this.request(`/prompts/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }
}

// =========================================
// EXPORT INSTANCE
// =========================================
export const api = new ApiClient(API_BASE_URL);
