import { useEffect, useState } from 'react';
import { api } from '../utils/api';
import { TrendingUp, Play, RefreshCw } from 'lucide-react';

export function Evolution() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [triggerLoading, setTriggerLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getEvolutionHistory();
      setHistory(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to load evolution history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleTriggerEvolution = async () => {
    try {
      setTriggerLoading(true);
      const res = await api.triggerEvolution(); // optional agent_id
      alert(
        `Evolution triggered. Agents involved: ${res.agents_count}. Estimated duration: ${res.estimated_duration}.`
      );
      loadHistory();
    } catch (err: any) {
      alert('Failed to trigger evolution: ' + err.message);
    } finally {
      setTriggerLoading(false);
    }
  };

  const latest =
    history && history.length > 0 ? history[history.length - 1] : null;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-gray-900 mb-2">Evolution</h1>
          <p className="text-gray-600 text-sm">
            View historical generations and manually trigger evolution cycles.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={loadHistory}
            className="flex items-center gap-2 px-3 py-2 border rounded-lg text-sm text-gray-700 hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={handleTriggerEvolution}
            disabled={triggerLoading}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700"
          >
            <Play className="w-4 h-4" />
            {triggerLoading ? 'Triggering...' : 'Trigger Evolution'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-4 mb-4 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64 text-gray-500">
          Loading evolution history...
        </div>
      ) : history.length === 0 ? (
        <div className="bg-white border rounded-lg p-8 text-center text-gray-500">
          No evolution events recorded yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6">
          {/* Timeline */}
          <div className="bg-white border rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <h2 className="text-gray-900 text-sm font-medium">
                Evolution Timeline
              </h2>
            </div>

            <div className="space-y-4 max-h-[480px] overflow-auto text-xs">
              {history
                .slice()
                .sort(
                  (a, b) =>
                    new Date(a.timestamp).getTime() -
                    new Date(b.timestamp).getTime()
                )
                .map((e) => (
                  <div
                    key={e.generation}
                    className="flex items-start gap-3 border-l-2 border-purple-200 pl-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-semibold">
                      {e.generation}
                    </div>
                    <div>
                      <div className="text-gray-900 text-sm mb-1">
                        Accuracy:{' '}
                        {e.accuracy?.toFixed ? e.accuracy.toFixed(2) : e.accuracy}
                        % · Efficiency:{' '}
                        {e.efficiency?.toFixed
                          ? e.efficiency.toFixed(2)
                          : e.efficiency}
                        %
                      </div>
                      <div className="text-[11px] text-gray-500 mb-1">
                        Agents: {e.agents}
                      </div>
                      <div className="text-[11px] text-gray-400">
                        {new Date(e.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Latest snapshot */}
          <div className="bg-white border rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <h2 className="text-gray-900 text-sm font-medium">
                Latest Generation Snapshot
              </h2>
            </div>

            {!latest ? (
              <p className="text-xs text-gray-500">
                No evolution snapshot available.
              </p>
            ) : (
              <div className="space-y-4 text-sm">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Generation</div>
                  <div className="text-gray-900 text-xl font-semibold">
                    {latest.generation}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500 mb-1">Accuracy</div>
                  <div className="flex items-center gap-3">
                    <div className="text-gray-900 text-lg font-semibold">
                      {latest.accuracy?.toFixed
                        ? latest.accuracy.toFixed(2)
                        : latest.accuracy}
                      %
                    </div>
                    <div className="flex-1 h-2 rounded-full bg-gray-200">
                      <div
                        className="h-2 rounded-full bg-green-500"
                        style={{
                          width: `${Math.max(
                            0,
                            Math.min(100, latest.accuracy || 0)
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500 mb-1">Efficiency</div>
                  <div className="flex items-center gap-3">
                    <div className="text-gray-900 text-lg font-semibold">
                      {latest.efficiency?.toFixed
                        ? latest.efficiency.toFixed(2)
                        : latest.efficiency}
                      %
                    </div>
                    <div className="flex-1 h-2 rounded-full bg-gray-200">
                      <div
                        className="h-2 rounded-full bg-blue-500"
                        style={{
                          width: `${Math.max(
                            0,
                            Math.min(100, latest.efficiency || 0)
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500 mb-1">Agents</div>
                  <div className="text-gray-900 text-lg font-semibold">
                    {latest.agents}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500 mb-1">Last Updated</div>
                  <div className="text-gray-900 text-sm">
                    {new Date(latest.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
