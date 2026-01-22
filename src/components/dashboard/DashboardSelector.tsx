import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useData } from '@/contexts/DataContext';
import { DashboardTemplate1 } from './templates/DashboardTemplate1';
import { DashboardTemplate2 } from './templates/DashboardTemplate2';
import { DashboardTemplate3 } from './templates/DashboardTemplate3';
import { DashboardTemplate4 } from './templates/DashboardTemplate4';
import { ReportGenerator } from '@/components/report/ReportGenerator';

export type DashboardTemplate = 'template1' | 'template2' | 'template3' | 'template4' | 'reports';

export interface DashboardConfig {
  template: DashboardTemplate;
  showStats: boolean;
  showCharts: boolean;
  showInsights: boolean;
  showRecentActivity: boolean;
}

export const DashboardSelector = () => {
  const { currentDataset, stats, insights, predictions } = useData();
  const [selectedTemplate, setSelectedTemplate] = useState<DashboardTemplate>('template1');
  const [config, setConfig] = useState<DashboardConfig>({
    template: 'template1',
    showStats: true,
    showCharts: true,
    showInsights: true,
    showRecentActivity: true,
  });

  // Update template when user changes selection
  useEffect(() => {
    setConfig(prev => ({
      ...prev,
      template: selectedTemplate
    }));
  }, [selectedTemplate]);

  // Render the selected template
  const renderTemplate = () => {
    switch (selectedTemplate) {
      case 'reports':
        return <ReportGenerator />;
      case 'template2':
        return <DashboardTemplate2 config={config} />;
      case 'template3':
        return <DashboardTemplate3 config={config} />;
      case 'template4':
        return <DashboardTemplate4 config={config} />;
      case 'template1':
      default:
        return <DashboardTemplate1 config={config} />;
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Dashboard Designer</h2>
          <p className="text-muted-foreground">
            Choose a template and customize your dashboard
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value as DashboardTemplate)}
            className="px-3 py-2 border border-border rounded-lg bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="template1">Modern Analytics</option>
            <option value="template2">Executive Summary</option>
            <option value="template3">Data Visualization</option>
            <option value="template4">Performance Metrics</option>
            <option value="reports">Reports & Exports</option>
          </select>
          
          <Button 
            variant="outline" 
            onClick={() => {
              // Export functionality would go here
              alert('Report export functionality will be implemented in the full version');
            }}
          >
            Export Report
          </Button>
        </div>
      </div>

      {/* Dashboard Preview */}
      <div className="border border-border rounded-xl overflow-hidden">
        {renderTemplate()}
      </div>

      {/* Configuration Options */}
      {selectedTemplate !== 'reports' && (
        <Card>
          <CardHeader>
            <CardTitle>Dashboard Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showStats"
                  checked={config.showStats}
                  onChange={(e) => setConfig({...config, showStats: e.target.checked})}
                  className="h-4 w-4"
                />
                <label htmlFor="showStats" className="text-sm">Show Statistics</label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showCharts"
                  checked={config.showCharts}
                  onChange={(e) => setConfig({...config, showCharts: e.target.checked})}
                  className="h-4 w-4"
                />
                <label htmlFor="showCharts" className="text-sm">Show Charts</label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showInsights"
                  checked={config.showInsights}
                  onChange={(e) => setConfig({...config, showInsights: e.target.checked})}
                  className="h-4 w-4"
                />
                <label htmlFor="showInsights" className="text-sm">Show Insights</label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showRecentActivity"
                  checked={config.showRecentActivity}
                  onChange={(e) => setConfig({...config, showRecentActivity: e.target.checked})}
                  className="h-4 w-4"
                />
                <label htmlFor="showRecentActivity" className="text-sm">Show Recent Activity</label>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};