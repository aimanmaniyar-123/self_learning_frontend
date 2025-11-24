import { useState, useEffect } from 'react';
import {
  Bot,
  Plus,
  Search,
  Trash2,
  Send,
  Check,
  X,
  PauseCircle,
  PlayCircle,
  Settings,
  History,
} from 'lucide-react';
import { api } from '../utils/api';

const AGENT_TYPES = [
  'Classification',
  'Generation',
  'Analysis',
  'Extraction',
  'Orchestrator',
  'Tooling',
];

export function Agents() {
  const [searchQuery, setSearchQuery] = useState('');
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create modal
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState('Classification');
  const [newDescription, setNewDescription] = useState('');

  // Config modal
  const [configAgent, setConfigAgent] = useState<any | null>(null);
  const [configName, setConfigName] = useState('');
  const [configType, setConfigType] = useState('Classification');
  const [configDescription, setConfigDescription] = useState('');

  // Interaction states
  const [messages, setMessages] = useState<Record<string, string>>({});
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [loadingResp, setLoadingResp] = useState<Record<string, boolean>>({});
  const [lastUserInput, setLastUserInput] = useState<Record<string, string>>({});

  // History states
  const [history, setHistory] = useState<Record<string, any[]>>({});
  const [showHistory, setShowHistory] = useState<Record<string, boolean>>({});
  const [loadingHistory, setLoadingHistory] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getAgents();
      setAgents(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || 'Failed to load agents');
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // Create agent
  // -------------------------

  const resetCreateForm = () => {
    setNewName('');
    setNewType('Classification');
    setNewDescription('');
  };

  const handleCreateAgent = async () => {
    if (!newName.trim()) return alert('Agent name required');

    try {
      const payload = {
        name: newName.trim(),
        agent_type: newType,
        description: newDescription.trim(),
        config: {},
      };

      await api.createAgent(payload);
      alert('Agent created');
      setShowCreate(false);
      resetCreateForm();
      fetchAgents();
    } catch (err: any) {
      alert('Create failed: ' + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete agent?')) return;
    try {
      await api.deleteAgent(id);
      fetchAgents();
    } catch (err: any) {
      alert('Delete failed: ' + err.message);
    }
  };

  // -------------------------
  // Config modal
  // -------------------------

  const openConfigModal = (agent: any) => {
    setConfigAgent(agent);
    setConfigName(agent.name || '');
    setConfigType(agent.agent_type || 'Classification');
    setConfigDescription(agent.description || '');
  };

  const closeConfigModal = () => {
    setConfigAgent(null);
    setConfigName('');
    setConfigType('Classification');
    setConfigDescription('');
  };

  const handleSaveConfig = async () => {
    if (!configAgent) return;

    try {
      await api.updateAgent(configAgent.id, {
        name: configName,
        agent_type: configType,
        description: configDescription,
      });
      alert('Agent updated');
      closeConfigModal();
      fetchAgents();
    } catch (err: any) {
      alert('Update failed: ' + err.message);
    }
  };

  // -------------------------
  // Pause / Resume
  // -------------------------

  const handleToggleStatus = async (agent: any) => {
    const newStatus = agent.status === 'active' ? 'paused' : 'active';
    try {
      await api.updateAgent(agent.id, { status: newStatus });
      fetchAgents();
    } catch (err: any) {
      alert('Failed to update status: ' + err.message);
    }
  };

  // -------------------------
  // History
  // -------------------------

  const loadHistory = async (agentId: string) => {
    setLoadingHistory((prev) => ({ ...prev, [agentId]: true }));
    try {
      const data = await api.getAgentHistory(agentId);
      setHistory((prev) => ({ ...prev, [agentId]: Array.isArray(data) ? data : [] }));
    } catch (err: any) {
      alert('Failed to load history: ' + err.message);
    } finally {
      setLoadingHistory((prev) => ({ ...prev, [agentId]: false }));
    }
  };

  const toggleHistory = (agentId: string) => {
    setShowHistory((prev) => {
      const next = !prev[agentId];
      if (next && !history[agentId]) {
        // Load on first expand
        loadHistory(agentId);
      }
      return { ...prev, [agentId]: next };
    });
  };

  // -------------------------
  // Interact + Feedback
  // -------------------------

  const handleInteract = async (agentId: string) => {
    const input = messages[agentId];
    if (!input || !input.trim()) return;

    setLoadingResp((prev) => ({ ...prev, [agentId]: true }));

    try {
      const res = await api.interactWithAgent(agentId, input);

      // Save last input for feedback
      setLastUserInput((prev) => ({ ...prev, [agentId]: input }));

      // Save the response
      setResponses((prev) => ({ ...prev, [agentId]: res.response }));

      // Clear input
      setMessages((prev) => ({ ...prev, [agentId]: '' }));

      // Refresh agents + history to see updated tasks, accuracy & conversation
      fetchAgents();
      loadHistory(agentId);
    } catch (err: any) {
      alert('Interaction failed: ' + err.message);
    } finally {
      setLoadingResp((prev) => ({ ...prev, [agentId]: false }));
    }
  };

  const handleFeedback = async (agentId: string, isCorrect: boolean) => {
    const lastInput = lastUserInput[agentId];
    if (!lastInput) {
      alert('Send a message first before giving feedback.');
      return;
    }

    try {
      await api.submitTrainingFeedback({
        agent_id: agentId,
        input_text: lastInput,
        label: isCorrect ? 1 : 0,
      });

      alert(`Feedback recorded as ${isCorrect ? 'correct' : 'incorrect'}.`);
      // Accuracy may have changed
      fetchAgents();
    } catch (err: any) {
      alert('Feedback failed: ' + err.message);
    }
  };

  const filtered = agents.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.agent_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // -------------------------
  // Render
  // -------------------------

  return (
    <>
      <div className="p-8">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-gray-900 mb-1">Agents</h1>
            <p className="text-gray-600 text-sm">
              Manage, configure, and teach self-learning agents.
            </p>
          </div>

          <button
            onClick={() => setShowCreate(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Agent
          </button>
        </div>

        {/* SEARCH */}
        <div className="bg-white border rounded-lg p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm"
              placeholder="Search agents by name or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-4 mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading agents...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-500 bg-white border rounded-lg">
            No agents found. Create one to get started.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((agent) => {
              const isActive = agent.status === 'active';
              const cardHistory = history[agent.id] || [];

              return (
                <div key={agent.id} className="bg-white border rounded-lg p-6 flex flex-col">
                  {/* HEADER */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-lg flex items-center justify-center">
                        <Bot className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-gray-900 font-medium">{agent.name}</div>
                        <div className="text-gray-500 text-xs">{agent.agent_type}</div>
                        <div className="text-gray-400 text-[11px]">
                          Last active: {agent.lastActive}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => handleToggleStatus(agent)}
                        className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg border hover:bg-gray-50"
                      >
                        {isActive ? (
                          <>
                            <PauseCircle className="w-4 h-4 text-orange-500" />
                            <span>Pause</span>
                          </>
                        ) : (
                          <>
                            <PlayCircle className="w-4 h-4 text-green-500" />
                            <span>Resume</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => openConfigModal(agent)}
                        className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg border hover:bg-gray-50"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDelete(agent.id)}
                        className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* STATS */}
                  <div className="grid grid-cols-3 text-center text-xs text-gray-600 mb-4">
                    <div>
                      <div className="text-gray-900 font-semibold">{agent.tasks}</div>
                      tasks
                    </div>
                    <div>
                      <div className="text-gray-900 font-semibold">
                        {agent.accuracy?.toFixed ? agent.accuracy.toFixed(1) : agent.accuracy}
                        %
                      </div>
                      accuracy
                    </div>
                    <div>
                      <div
                        className={`font-semibold ${
                          isActive ? 'text-green-600' : 'text-orange-500'
                        }`}
                      >
                        {agent.status}
                      </div>
                      status
                    </div>
                  </div>

                  {/* INTERACTION */}
                  <div className="mt-2">
                    <textarea
                      className="w-full border rounded-lg p-2 text-xs mb-2"
                      placeholder="Ask this agent something..."
                      value={messages[agent.id] || ''}
                      onChange={(e) =>
                        setMessages((prev) => ({ ...prev, [agent.id]: e.target.value }))
                      }
                    />

                    <button
                      onClick={() => handleInteract(agent.id)}
                      disabled={loadingResp[agent.id]}
                      className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-xs"
                    >
                      <Send className="w-4 h-4" />
                      {loadingResp[agent.id] ? 'Sending...' : 'Send'}
                    </button>
                  </div>

                  {/* RESPONSE + FEEDBACK */}
                  {responses[agent.id] && (
                    <div className="mt-4 p-3 bg-gray-50 border rounded-lg">
                      <div className="text-[11px] text-gray-500 mb-1">Agent Response:</div>
                      <div className="text-xs text-gray-900 whitespace-pre-wrap">
                        {responses[agent.id]}
                      </div>

                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => handleFeedback(agent.id, true)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-[11px]"
                        >
                          <Check className="w-4 h-4" /> Correct
                        </button>
                        <button
                          onClick={() => handleFeedback(agent.id, false)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-[11px]"
                        >
                          <X className="w-4 h-4" /> Incorrect
                        </button>
                      </div>
                    </div>
                  )}

                  {/* HISTORY TOGGLE */}
                  <button
                    onClick={() => toggleHistory(agent.id)}
                    className="mt-4 flex items-center gap-2 text-xs text-gray-600 hover:text-gray-800"
                  >
                    <History className="w-4 h-4" />
                    {showHistory[agent.id] ? 'Hide history' : 'View history'}
                  </button>

                  {/* HISTORY LIST */}
                  {showHistory[agent.id] && (
                    <div className="mt-2 max-h-40 overflow-auto text-[11px] bg-gray-50 border rounded-lg p-2">
                      {loadingHistory[agent.id] ? (
                        <div className="text-gray-500">Loading history...</div>
                      ) : cardHistory.length === 0 ? (
                        <div className="text-gray-500">No interactions yet.</div>
                      ) : (
                        cardHistory.map((m: any, idx: number) => (
                          <div key={idx} className="mb-1">
                            <span
                              className={`font-medium ${
                                m.role === 'user' ? 'text-blue-700' : 'text-purple-700'
                              }`}
                            >
                              {m.role === 'user' ? 'You' : 'Agent'}
                            </span>
                            <span className="text-gray-500 ml-1">
                              · {new Date(m.timestamp).toLocaleTimeString()}
                            </span>
                            <div className="text-gray-800 ml-1">{m.content}</div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CREATE MODAL */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
            <h2 className="text-gray-900 mb-4 text-lg">Create Agent</h2>

            <label className="block text-xs mb-1 text-gray-700">Name</label>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg mb-3 text-sm"
              placeholder="Agent name"
            />

            <label className="block text-xs mb-1 text-gray-700">Type</label>
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg mb-3 text-sm"
            >
              {AGENT_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>

            <label className="block text-xs mb-1 text-gray-700">Description</label>
            <textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg text-sm"
              placeholder="What does this agent do?"
            />

            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setShowCreate(false)}
                className="px-4 py-2 border rounded-lg text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAgent}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIG MODAL */}
      {configAgent && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
            <h2 className="text-gray-900 mb-4 text-lg">Configure Agent</h2>

            <label className="block text-xs mb-1 text-gray-700">Name</label>
            <input
              value={configName}
              onChange={(e) => setConfigName(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg mb-3 text-sm"
            />

            <label className="block text-xs mb-1 text-gray-700">Type</label>
            <select
              value={configType}
              onChange={(e) => setConfigType(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg mb-3 text-sm"
            >
              {AGENT_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>

            <label className="block text-xs mb-1 text-gray-700">Description</label>
            <textarea
              value={configDescription}
              onChange={(e) => setConfigDescription(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg text-sm"
            />

            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={closeConfigModal}
                className="px-4 py-2 border rounded-lg text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveConfig}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
