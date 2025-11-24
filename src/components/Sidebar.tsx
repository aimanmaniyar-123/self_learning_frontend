import {
  LayoutDashboard,
  Bot,
  GraduationCap,
  BarChart3,
  TrendingUp,
  Target,
  AlertTriangle,
  Network,
  FileText,
  Settings,
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  const menuItems = [
    { id: 'backend-test', label: 'Backend Test', icon: Settings, color: 'orange' },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'agents', label: 'Agents', icon: Bot },
    { id: 'training', label: 'Training', icon: GraduationCap },
    { id: 'performance', label: 'Performance', icon: BarChart3 },
    { id: 'evolution', label: 'Evolution', icon: TrendingUp },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'anomaly', label: 'Anomaly Detection', icon: AlertTriangle },
    { id: 'prompts', label: 'Prompts', icon: FileText },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <div>Self Learning & Improvement</div>
            <div className="text-xs text-gray-500">v2.0.0</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          const isBackendTest = item.id === 'backend-test';

          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? isBackendTest
                    ? 'bg-orange-50 text-orange-600'
                    : 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              } ${isBackendTest ? 'border border-orange-200' : ''}`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
              {isBackendTest && (
                <span className="ml-auto text-xs px-2 py-0.5 bg-orange-100 text-orange-700 rounded">
                  Test
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-gray-600">System Operational</span>
        </div>
      </div>
    </aside>
  );
}
