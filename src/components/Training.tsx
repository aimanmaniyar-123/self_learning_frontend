import { useState, useEffect } from 'react';
import {
  GraduationCap,
  Play,
  StopCircle,
  CheckCircle,
  Clock,
  XCircle,
  BarChart3,
} from 'lucide-react';
import { api } from '../utils/api';

export function Training() {
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [trainingSessions, setTrainingSessions] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedAgentId, setSelectedAgentId] = useState<string>('');
  const [epochs, setEpochs] = useState<number>(10);

  // store last manual training metrics (from /training/start)
  const [lastMetrics, setLastMetrics] = useState<any | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [sessionsRes, agentsRes] = await Promise.all([
        api.getTrainingSessions(),
        api.getAgents(),
      ]);
      setTrainingSessions(Array.isArray(sessionsRes) ? sessionsRes : []);
      setAgents(Array.isArray(agentsRes) ? agentsRes : []);
    } catch (err: any) {
      console.error('Failed to load training data:', err);
      setError(err.message || 'Failed to load training sessions');
    } finally {
      setLoading(false);
    }
  };

  const getAgentLabel = (agentId: string) => {
    const ag = agents.find((a) => a.id === agentId);
    if (!ag) return agentId;
    return `${ag.name} (${ag.agent_type})`;
  };

  const handleStartTraining = async () => {
    if (!selectedAgentId) {
      alert('Please select an agent to train');
      return;
    }
    if (!epochs || epochs <= 0) {
      alert('Epochs must be a positive number');
      return;
    }

    const body = {
      agent_id: selectedAgentId,
      epochs: epochs,
      learning_rate: 0.001,
      batch_size: 32,
    };

    try {
      const res = await api.startTraining(body);
      // Backend now returns: { status, session_id, agent_id, training_metrics }
      setLastMetrics(res.training_metrics || null);

      let msg = `Training started! Session: ${res.session_id}`;
      if (res.training_metrics && typeof res.training_metrics.accuracy !== 'undefined') {
        msg += `\nCurrent accuracy: ${res.training_metrics.accuracy.toFixed(2)}%`;
      }
      alert(msg);

      loadData();
    } catch (err: any) {
      alert('Failed to start training: ' + err.message);
    }
  };

  const handleStopTraining = async (sessionId: string) => {
    if (!confirm('Stop this training session?')) return;

    try {
      await api.stopTraining(sessionId);
      alert('Training stopped!');
      loadData();
    } catch (err: any) {
      alert('Failed to stop session: ' + err.message);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-600 animate-pulse" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'in_progress':
        return 'bg-blue-100 text-blue-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading training sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-gray-900 mb-2">Training</h1>
          <p className="text-gray-600">
            Monitor and manage training sessions for self-learning agents
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-4 mb-4">
          {error}
        </div>
      )}

      {/* Quick launcher + last metrics */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-gray-900 mb-1">Quick Training Launcher</div>
            <p className="text-sm text-gray-600">
              Pick an agent created on the Agents page and start a new training session.
              The backend will also auto-start training for weak agents via the
              autonomous loop.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_auto] gap-4 items-end mb-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Agent</label>
            <select
              value={selectedAgentId}
              onChange={(e) => setSelectedAgentId(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Select an agent</option>
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name} ({agent.agent_type})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Epochs</label>
            <input
              type="number"
              min={1}
              value={epochs}
              onChange={(e) => setEpochs(parseInt(e.target.value || '1', 10))}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <button
            onClick={handleStartTraining}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            <Play className="w-5 h-5" />
            Start Training
          </button>
        </div>

        {/* Last training metrics (from manual /training/start) */}
        {lastMetrics && (
          <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-100 flex items-start gap-3 text-sm">
            <BarChart3 className="w-4 h-4 text-blue-600 mt-0.5" />
            <div>
              <div className="text-gray-900 font-medium mb-1">
                Last Training Metrics
              </div>
              <div className="text-gray-700">
                Samples: {lastMetrics.num_samples?.toFixed?.(0) ?? lastMetrics.num_samples}
                {typeof lastMetrics.accuracy !== 'undefined' && (
                  <>
                    {' '}· Accuracy:{' '}
                    {lastMetrics.accuracy.toFixed
                      ? lastMetrics.accuracy.toFixed(2)
                      : lastMetrics.accuracy}
                    %
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sessions List */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-gray-900 mb-1">Training Sessions</div>
          <p className="text-sm text-gray-600 mb-6">
            Includes both manual and auto-triggered sessions (autonomous loop).
          </p>

          {trainingSessions.length === 0 ? (
            <p className="text-gray-500">No training sessions yet.</p>
          ) : (
            <div className="space-y-4">
              {trainingSessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => setSelectedSession(session.id)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedSession === session.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(session.status)}
                      <div>
                        <div className="text-gray-900">
                          Agent: {getAgentLabel(session.agent)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(session.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${getStatusColor(
                        session.status
                      )}`}
                    >
                      {session.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm mt-2">
                    <div>
                      <span className="text-gray-600">Duration:</span>
                      <span className="ml-2 text-gray-900">
                        {session.duration} epochs
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-600">Session ID:</span>
                      <span className="ml-2 text-gray-900">{session.id}</span>
                    </div>
                  </div>

                  {session.status === 'in_progress' && (
                    <button
                      className="mt-3 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStopTraining(session.id);
                      }}
                    >
                      <StopCircle className="w-4 h-4 inline-block mr-2" />
                      Stop Training
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Session Details */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-gray-900 mb-1">Session Details</div>
          <p className="text-sm text-gray-600 mb-6">
            {selectedSession ? 'Session information' : 'Select a session to view details'}
          </p>

          {!selectedSession ? (
            <div className="flex items-center justify-center h-64 text-gray-400">
              <div className="text-center">
                <GraduationCap className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No session selected</p>
              </div>
            </div>
          ) : (
            (() => {
              const session = trainingSessions.find((s) => s.id === selectedSession);
              if (!session) return <p>Session not found.</p>;

              return (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Agent</div>
                    <div className="text-gray-900">{getAgentLabel(session.agent)}</div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Status</div>
                    <div
                      className={`px-3 py-1 inline-block rounded-full text-xs ${getStatusColor(
                        session.status
                      )}`}
                    >
                      {session.status}
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">
                      Duration (epochs)
                    </div>
                    <div className="text-gray-900">{session.duration}</div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Started At</div>
                    <div className="text-gray-900">
                      {new Date(session.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
              );
            })()
          )}
        </div>
      </div>
    </div>
  );
}
