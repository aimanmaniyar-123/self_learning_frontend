import { useState, useEffect } from 'react';
import { Bot, Plus, Search, Pause, Play, Settings, MoreVertical } from 'lucide-react';
import { api } from '../utils/api';

export function AgentsWithAPI() {
  const [searchQuery, setSearchQuery] = useState('');
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await api.getAgents();
      setAgents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError('Failed to load agents');
      setAgents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAgent = async () => {
    const name = prompt('Enter agent name:');
    if (!name) return;

    const response = await api.createAgent({
      name,
      agent_type: 'Classification',
      description: '',
      config: {},
    });

    alert(`Agent created: ${response.id}`);
    fetchAgents();
  };

  const handleToggleAgent = async (id: string, status: string) => {
    const newStatus = status === 'paused' ? 'active' : 'paused';
    await api.updateAgent(id, { status: newStatus });
    fetchAgents();
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin h-12 w-12 border-b-2 border-blue-600 rounded-full mx-auto" />
        <p>Loading agents...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-gray-900 mb-2">Agents</h1>
          <p className="text-gray-600">Manage your AI agents</p>
        </div>

        <button
          onClick={handleCreateAgent}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          <Plus className="w-5 h-5" /> Create Agent
        </button>
      </div>

      {/* Search */}
      <div className="bg-white border rounded-lg p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            placeholder="Search agents..."
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <div key={agent.id} className="bg-white border rounded-lg p-6 hover:shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-lg flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-gray-900">{agent.name}</div>
                  <div className="text-gray-500 text-sm">{agent.agent_type}</div>
                </div>
              </div>

              <MoreVertical className="text-gray-400" />
            </div>

            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={() => handleToggleAgent(agent.id, agent.status)}
                className="flex-1 px-3 py-2 border rounded-lg"
              >
                {agent.status === 'paused' ? (
                  <>
                    <Play className="w-4 h-4 inline mr-1" /> Resume
                  </>
                ) : (
                  <>
                    <Pause className="w-4 h-4 inline mr-1" /> Pause
                  </>
                )}
              </button>
              <button className="flex-1 px-3 py-2 border rounded-lg hover:bg-gray-50">
                <Settings className="w-4 h-4 inline mr-1" /> Configure
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
