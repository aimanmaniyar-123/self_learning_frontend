import { useState, useEffect } from 'react';
import { FileText, Plus, Search, Edit, Trash2, Copy } from 'lucide-react';
import { api } from '../utils/api';

export function Prompts() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [prompts, setPrompts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [modalData, setModalData] = useState<any>({
    name: '',
    content: '',
    category: 'analysis',
    description: '',
  });

  const CATEGORY_SUGGESTIONS: Record<string, string[]> = {
    analysis: [
      "Analyze the following text and provide insights:",
      "Provide a detailed breakdown and reasoning for the input:",
      "Explain the underlying patterns and meaning behind the content:",
    ],
    classification: [
      "Classify the following text into correct category:",
      "Determine the class label of this input:",
      "Categorize the content into one of the predefined labels:",
    ],
    extraction: [
      "Extract all key data points from the following text:",
      "Identify entities, numbers and relevant details:",
      "Pull structured information from the unstructured content:",
    ],
    generation: [
      "Generate a human-quality response for the following:",
      "Write a complete paragraph based on this input:",
      "Create a contextual and meaningful output from the prompt:",
    ],
    general: [
      "Respond intelligently to the user input:",
      "Provide helpful guidance for the following:",
      "Interpret and reply in a conversational manner:",
    ]
  };

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await api.getPrompts();
      setPrompts(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Failed to load prompts:", err);
      setError(err.message || "Failed to load prompts");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setModalMode("create");
    setModalData({
      name: '',
      content: '',
      category: 'analysis',
      description: '',
    });
    setShowModal(true);
  };

  const openEditModal = (prompt: any) => {
    setModalMode("edit");
    setModalData({ ...prompt });
    setShowModal(true);
  };

  const savePrompt = async () => {
    if (!modalData.name || !modalData.content) {
      alert("Name & Content are required.");
      return;
    }

    try {
      if (modalMode === "create") {
        await api.createPrompt(modalData);
        alert("Prompt created successfully!");
      } else {
        await api.updatePrompt(modalData.id, modalData);
        alert("Prompt updated successfully!");
      }

      setShowModal(false);
      fetchPrompts();
    } catch (err: any) {
      alert("Error saving prompt: " + err.message);
    }
  };

  const deletePrompt = async (id: string) => {
    if (!confirm("Delete this prompt?")) return;

    try {
      await api.deletePrompt(id);
      fetchPrompts();
    } catch (err: any) {
      alert("Failed to delete: " + err.message);
    }
  };

  const filteredPrompts = prompts.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory =
      selectedCategory === "all" || p.category === selectedCategory;

    return matchSearch && matchCategory;
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-gray-900 mb-2">Prompts</h1>
          <p className="text-gray-600 text-sm">Create reusable LLM system prompts</p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Create Prompt
        </button>
      </div>

      {/* Search + Filter */}
      <div className="bg-white border rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search prompts..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto">
            {["all", "analysis", "classification", "extraction", "generation", "general"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm ${
                  selectedCategory === cat
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Prompt List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPrompts.map((p) => (
          <div key={p.id} className="bg-white border rounded-lg p-6 hover:shadow-lg transition">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-gray-900 font-medium">{p.name}</div>
                <div className="text-sm text-gray-500">{p.category}</div>
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg mb-3 text-sm font-mono whitespace-pre-wrap break-words">
              {p.content}
            </div>

            <div className="text-sm text-gray-600 mb-4">{p.description}</div>

            <div className="flex gap-2 pt-4 border-t">
              <button
                onClick={() => openEditModal(p)}
                className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center justify-center gap-2"
              >
                <Edit className="w-4 h-4" /> Edit
              </button>

              <button
                onClick={() => navigator.clipboard.writeText(p.content)}
                className="px-3 py-2 border rounded-lg"
              >
                <Copy className="w-4 h-4" />
              </button>

              <button
                onClick={() => deletePrompt(p.id)}
                className="px-3 py-2 border rounded-lg text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-gray-400 mt-3">
              Created: {new Date(p.created_at).toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
            <h2 className="text-lg font-semibold mb-4">
              {modalMode === "create" ? "Create Prompt" : "Edit Prompt"}
            </h2>

            {/* Fields */}
            <div className="space-y-4">
              <input
                value={modalData.name}
                onChange={(e) =>
                  setModalData({ ...modalData, name: e.target.value })
                }
                placeholder="Prompt Name"
                className="w-full border rounded-lg px-3 py-2"
              />

              {/* Category Dropdown */}
              <select
                value={modalData.category}
                onChange={(e) =>
                  setModalData({ ...modalData, category: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2"
              >
                {Object.keys(CATEGORY_SUGGESTIONS).map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>

              {/* Auto Suggestions */}
              <div>
                <p className="text-xs text-gray-500 mb-1">Suggestions</p>
                <div className="space-y-2">
                  {CATEGORY_SUGGESTIONS[modalData.category].map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => setModalData({ ...modalData, content: s })}
                      className="w-full text-left p-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={modalData.content}
                onChange={(e) =>
                  setModalData({ ...modalData, content: e.target.value })
                }
                placeholder="Prompt Content"
                className="w-full border rounded-lg px-3 py-2 h-32"
              />

              <textarea
                value={modalData.description}
                onChange={(e) =>
                  setModalData({ ...modalData, description: e.target.value })
                }
                placeholder="Description"
                className="w-full border rounded-lg px-3 py-2 h-20"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={savePrompt}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {modalMode === "create" ? "Create" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
