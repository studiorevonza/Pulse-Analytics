import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { MouseFollower } from '@/components/ui/MouseFollower';
import { Sidebar } from '@/components/layout/Sidebar';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { AIChatPanel } from '@/components/chat/AIChatPanel';
import { ChartsPanel } from '@/components/charts/ChartsPanel';
import { PredictionsPanel } from '@/components/prediction/PredictionsPanel';
import { InsightsPanel } from '@/components/insight/InsightsPanel';
import { DataExplorer } from '@/components/data/DataExplorer';
import { UploadModal } from '@/components/upload/UploadModal';
import { DashboardGenerator } from '@/components/dashboard/DashboardGenerator';
import { ReportGenerator } from '@/components/report/ReportGenerator';
import { DashboardSelector } from '@/components/dashboard/DashboardSelector';

type Tab = 'dashboard' | 'chat' | 'charts' | 'predictions' | 'insights' | 'data' | 'dashboard-generator' | 'dashboard-selector' | 'report';

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'chat':
        return <AIChatPanel />;
      case 'charts':
        return <ChartsPanel />;
      case 'predictions':
        return <PredictionsPanel />;
      case 'insights':
        return <InsightsPanel />;
      case 'data':
        return <DataExplorer />;
      case 'dashboard-generator':
        return <DashboardGenerator />;
      case 'dashboard-selector':
        return <DashboardSelector />;
      case 'report':
        return <ReportGenerator />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Background Effects - Reduced opacity for transparency */}
      <div className="fixed inset-0 pointer-events-none dark:bg-gradient-dark opacity-10" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-glow opacity-20 dark:opacity-10 pointer-events-none" />
      <MouseFollower />
      
      <div className="relative flex flex-col h-screen">
        <Header onUploadClick={() => setIsUploadOpen(true)} />
        
        <div className="flex flex-1 overflow-hidden">
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
          
          <main className="flex-1 overflow-y-auto">
            {renderContent()}
          </main>
        </div>
      </div>

      <UploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
    </div>
  );
};

export default Index;