import { useState, useEffect } from 'react';
import { Users, Plus, Search, TrendingUp, Layers } from 'lucide-react';
import { api } from '../utils/api';

export function Collaborations() {
  const [searchQuery, setSearchQuery] = useState('');
  const [collabs, setCollabs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch collaborations
  useEffect(() => {
    fetchCollabs();
  }, []);

  const fetchCollabs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getCollaborations();
      setCollabs(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Failed to fetch collaborations:', err);
      setError(err.message || 'Failed to load collaborations');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCollaboration = async () => {
    const name = prompt('Enter collaboration name:');
    if (!name) return;

    const agentIdsInput = prompt('Enter agent IDs (comma-separated):');
    if (!agentIdsInput) return;

    const agentIds = agentIdsInput.split(',').map(a => a.trim());

    const description = prompt('Enter description:') || '';

    try {
      const newCollab = {
        name,
        agent_ids: agentIds,
        description
      };

      console.log('Creating collaboration:', newCollab);
      const response = await api.createCollaboration(newCollab);
      alert(`Collaboration created: ${response.id}`);
      fetchCollabs();
    } catch (err: any) {
      console.error('Creation failed:', err);
      alert('Failed to create collaboration: ' + err.message);
    }
  };

  const filtered = collabs.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Loading state
  if (loading) {
    return (
      <div className="p-8 text-center text-gray-600">
        <div className="animate-spin h-12 w-12 border-b-2 border-blue-600 rounded-full mx-auto mb-4"></div>
        Loading collaborations...
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="bg-red-50 border border-red-200 p-6 inline-block rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-gray-900 mb-2">Collaborations</h1>
          <p className="text-gray-600">Multi-agent coordination and cooperation</p>
        </div>
        <button
          onClick={handleCreateCollaboration}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          New Collaboration
        </button>
      </div>

      {/* Search */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search collaborations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="bg-white p-12 border border-gray-200 rounded-lg text-center">
          <Layers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-gray-900 mb-2">No collaborations found</h3>
          <p className="text-gray-600 mb-4">
            Create your first collaboration to get started
          </p>
          <button
            onClick={handleCreateCollaboration}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create Collaboration
          </button>
        </div>
      )}

      {/* Collaboration Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filtered.map((c) => (
          <div
            key={c.id}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-gray-900 font-medium">{c.name}</div>
                  <div className="text-sm text-gray-500">Created {new Date(c.created_at).toLocaleString()}</div>
                </div>
              </div>

              <span
                className={`px-3 py-1 text-xs rounded-full ${
                  c.status === 'active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {c.status}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-4">{c.description}</p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 text-sm mb-4">
              <div>
                <span className="text-gray-600">Tasks:</span>
                <span className="text-gray-900 ml-1">{c.tasks}</span>
              </div>
              <div>
                <span className="text-gray-600">Efficiency:</span>
                <span className="text-gray-900 ml-1">{c.efficiency}%</span>
              </div>
              <div>
                <span className="text-gray-600">Agents:</span>
                <span className="text-gray-900 ml-1">{c.agents.length}</span>
              </div>
            </div>

            {/* Agents list */}
            <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
              {c.agents.map((agent: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs"
                >
                  {agent}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
