import { useEffect, useState } from 'react';
import { api } from '../utils/api';
import { Target, Plus, Trash2, ArrowUpRight, Activity } from 'lucide-react';

export function Goals() {
  const [summary, setSummary] = useState<any | null>(null);
  const [goals, setGoals] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create form state
  const [agentId, setAgentId] = useState<string>('');
  const [goalTitle, setGoalTitle] = useState('');
  const [goalDescription, setGoalDescription] = useState('');
  const [goalType, setGoalType] = useState('objective');
  const [metricName, setMetricName] = useState('accuracy');
  const [targetValue, setTargetValue] = useState<number>(95);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [daysUntilTarget, setDaysUntilTarget] = useState<number>(30);

  const priorityToInt = (p: 'low' | 'medium' | 'high') =>
    p === 'low' ? 3 : p === 'high' ? 9 : 6;

  const intToPriorityLabel = (v: number) => {
    if (v >= 8) return 'high';
    if (v <= 4) return 'low';
    return 'medium';
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [summaryRes, goalsRes, agentsRes] = await Promise.all([
        api.getGoalsSummary().catch(() => null),
        api.getGoals().catch(() => []),
        api.getAgents().catch(() => []),
      ]);
      setSummary(summaryRes);
      setGoals(Array.isArray(goalsRes) ? goalsRes : []);
      setAgents(Array.isArray(agentsRes) ? agentsRes : []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to load goals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getAgentLabel = (id: string) => {
    const a = agents.find((x) => x.id === id);
    return a ? `${a.name} (${a.agent_type})` : id;
  };

  const handleCreateGoal = async () => {
    if (!agentId) {
      alert('Please select an agent');
      return;
    }
    if (!goalTitle.trim()) {
      alert('Goal title is required');
      return;
    }
    if (!metricName.trim()) {
      alert('Metric name is required');
      return;
    }
    if (!targetValue || targetValue <= 0) {
      alert('Target value must be positive');
      return;
    }

    const body = {
      agent_id: agentId,
      goal_type: goalType,
      goal_name: goalTitle.trim(),
      description: goalDescription.trim(),
      target_value: targetValue,
      metric_name: metricName.trim(),
      priority: priorityToInt(priority),
      days_until_target: daysUntilTarget,
    };

    try {
      await api.createGoal(body);
      alert('Goal created');
      setGoalTitle('');
      setGoalDescription('');
      setTargetValue(95);
      setMetricName('accuracy');
      loadData();
    } catch (err: any) {
      alert('Failed to create goal: ' + err.message);
    }
  };

  const handleDeleteGoal = async (id: string) => {
    if (!confirm('Delete this goal?')) return;
    try {
      await api.deleteGoal(id);
      loadData();
    } catch (err: any) {
      alert('Failed to delete goal: ' + err.message);
    }
  };

  const handleQuickProgressUpdate = async (id: string, newPct: number) => {
    try {
      await api.updateGoalProgress(id, newPct);
      loadData();
    } catch (err: any) {
      alert('Failed to update progress: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading goals...</p>
        </div>
      </div>
    );
  }

  const activeGoals = goals.filter((g) => g.status === 'active');
  const completedGoals = goals.filter((g) => g.status === 'completed');

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-gray-900 mb-2">Goals</h1>
          <p className="text-gray-600 text-sm">
            Define and track learning objectives for each agent.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-4 mb-4 text-sm">
          {error}
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border rounded-lg p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Goals</p>
            <p className="text-lg font-semibold text-gray-900">
              {summary?.total_goals ?? goals.length}
            </p>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Active</p>
            <p className="text-lg font-semibold text-gray-900">
              {summary?.active_goals ?? activeGoals.length}
            </p>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
            <ArrowUpRight className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Completed</p>
            <p className="text-lg font-semibold text-gray-900">
              {summary?.completed_goals ?? completedGoals.length}
            </p>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Avg Progress</p>
            <p className="text-lg font-semibold text-gray-900">
              {Math.round(summary?.average_progress ?? 0)}%
            </p>
          </div>
        </div>
      </div>

      {/* Create goal form */}
      <div className="bg-white border rounded-lg p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Plus className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-medium text-gray-900">
            Create New Goal
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 text-sm">
          <div>
            <label className="block text-xs mb-1 text-gray-600">Agent</label>
            <select
              value={agentId}
              onChange={(e) => setAgentId(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">Select agent</option>
              {agents.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.agent_type})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs mb-1 text-gray-600">
              Goal Title
            </label>
            <input
              value={goalTitle}
              onChange={(e) => setGoalTitle(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Improve classifier accuracy"
            />
          </div>

          <div>
            <label className="block text-xs mb-1 text-gray-600">
              Goal Type
            </label>
            <select
              value={goalType}
              onChange={(e) => setGoalType(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="objective">Objective</option>
              <option value="milestone">Milestone</option>
              <option value="kpi">KPI</option>
            </select>
          </div>

          <div>
            <label className="block text-xs mb-1 text-gray-600">
              Metric Name
            </label>
            <input
              value={metricName}
              onChange={(e) => setMetricName(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="accuracy, f1, latency..."
            />
          </div>

          <div>
            <label className="block text-xs mb-1 text-gray-600">
              Target Value
            </label>
            <input
              type="number"
              value={targetValue}
              onChange={(e) =>
                setTargetValue(parseFloat(e.target.value || '0'))
              }
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-xs mb-1 text-gray-600">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) =>
                setPriority(e.target.value as 'low' | 'medium' | 'high')
              }
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="md:col-span-2 xl:col-span-3">
            <label className="block text-xs mb-1 text-gray-600">
              Goal Description
            </label>
            <textarea
              value={goalDescription}
              onChange={(e) => setGoalDescription(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              rows={2}
              placeholder="Describe what success looks like and how the agent should achieve it..."
            />
          </div>

          <div>
            <label className="block text-xs mb-1 text-gray-600">
              Days Until Target (optional)
            </label>
            <input
              type="number"
              value={daysUntilTarget}
              onChange={(e) =>
                setDaysUntilTarget(parseInt(e.target.value || '30', 10))
              }
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={handleCreateGoal}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Goal
          </button>
        </div>
      </div>

      {/* Goals list */}
      {goals.length === 0 ? (
        <div className="bg-white border rounded-lg p-8 text-center text-gray-500">
          No goals yet. Create one to start guiding your agents.
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {goals.map((g) => {
            const priorityLabel = intToPriorityLabel(g.priority ?? 5);
            const progress = Math.max(
              0,
              Math.min(100, g.progress_percentage || 0)
            );

            return (
              <div
                key={g.id}
                className="bg-white border rounded-xl p-5 shadow-sm flex flex-col gap-3"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 border-b pb-3">
                  <div>
                    <div className="text-sm font-semibold text-gray-900">
                      {g.goal_name}
                    </div>
                    <div className="text-[11px] text-gray-500">
                      Agent: {getAgentLabel(g.agent_id)}
                    </div>
                    <div className="text-[11px] text-gray-400 mt-1">
                      Created:{' '}
                      {new Date(g.created_at).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] ${
                        g.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : g.status === 'failed'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {g.status}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] ${
                        priorityLabel === 'high'
                          ? 'bg-red-100 text-red-700'
                          : priorityLabel === 'low'
                          ? 'bg-gray-100 text-gray-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      Priority: {priorityLabel}
                    </span>
                    <button
                      onClick={() => handleDeleteGoal(g.id)}
                      className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1 mt-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  </div>
                </div>

                {/* Description */}
                {g.description && (
                  <div className="text-[11px] text-gray-600">
                    {g.description}
                  </div>
                )}

                {/* Metric line */}
                <div className="text-[11px] text-gray-500">
                  {g.metric_name}:{' '}
                  {g.current_value?.toFixed
                    ? g.current_value.toFixed(1)
                    : g.current_value}{' '}
                  / {g.target_value}
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className={`h-2 rounded-full ${
                      g.status === 'completed'
                        ? 'bg-green-500'
                        : g.status === 'failed'
                        ? 'bg-red-500'
                        : 'bg-gradient-to-r from-blue-500 to-green-500'
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Footer actions */}
                <div className="flex items-center justify-between mt-1">
                  <div className="text-[11px] text-gray-500">
                    Progress: {progress.toFixed(1)}%
                  </div>
                  <div className="flex gap-2 text-[11px]">
                    <button
                      onClick={() =>
                        handleQuickProgressUpdate(g.id, progress + 10)
                      }
                      className="px-2 py-1 rounded-lg border hover:bg-gray-50"
                    >
                      +10%
                    </button>
                    <button
                      onClick={() => handleQuickProgressUpdate(g.id, 100)}
                      className="px-2 py-1 rounded-lg border hover:bg-gray-50"
                    >
                      Mark 100%
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
