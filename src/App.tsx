import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Agents } from './components/Agents';
import { Training } from './components/Training';
import { Performance } from './components/Performance';
import { Evolution } from './components/Evolution';
import { Goals } from './components/Goals';
import { AnomalyDetection } from './components/AnomalyDetection';
import { Prompts } from './components/Prompts';
import { BackendTest } from './components/BackendTest';

export default function App() {
  const [currentPage, setCurrentPage] = useState('backend-test');

  const renderPage = () => {
    switch (currentPage) {
      case 'backend-test':
        return <BackendTest />;
      case 'dashboard':
        return <Dashboard currentPage={currentPage} />;
      case 'agents':
        return <Agents />;
      case 'training':
        return <Training />;
      case 'performance':
        return <Performance />;
      case 'evolution':
        return <Evolution />;
      case 'goals':
        return <Goals />;
      case 'anomaly':
        return <AnomalyDetection />;
      case 'prompts':
        return <Prompts />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* Sidebar stays fixed */}
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />

      {/* Content container (no scroll here!) */}
      <div className="flex-1 h-full overflow-hidden">

        {/* Only this inner wrapper scrolls */}
        <div className="h-full overflow-y-auto">
          {renderPage()}
        </div>

      </div>
    </div>
  );
}
