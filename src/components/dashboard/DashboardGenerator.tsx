import { useState, useEffect } from 'react';
import { Plus, BarChart3, PieChart, TrendingUp, X, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useData } from '@/contexts/DataContext';
import { SalesChart } from '../charts/SalesChart';
import { CategoryChart } from '../charts/CategoryChart';
import { CorrelationChart } from '../charts/CorrelationChart';
import { RegionChart } from '../charts/RegionChart';
import { DataStats } from '@/types/data';

interface DashboardWidget {
  id: string;
  type: 'stat' | 'chart-line' | 'chart-bar' | 'chart-pie' | 'chart-scatter';
  title: string;
  dataSource: string;
  config: Record<string, unknown>;
}

export const DashboardGenerator = () => {
  const { currentDataset, stats } = useData();
  const [widgets, setWidgets] = useState<DashboardWidget[]>([]);
  const [availableColumns, setAvailableColumns] = useState<string[]>([]);
  const [showAddWidget, setShowAddWidget] = useState(false);

  useEffect(() => {
    if (currentDataset) {
      setAvailableColumns(currentDataset.columns.map(col => col.name));
    } else {
      setAvailableColumns([]);
    }
  }, [currentDataset]);

  const addWidget = (type: DashboardWidget['type']) => {
    const newWidget: DashboardWidget = {
      id: `widget-${Date.now()}`,
      type,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Widget`,
      dataSource: availableColumns[0] || '',
      config: {}
    };
    setWidgets([...widgets, newWidget]);
    setShowAddWidget(false);
  };

  const removeWidget = (id: string) => {
    setWidgets(widgets.filter(widget => widget.id !== id));
  };

  const updateWidget = (id: string, updates: Partial<DashboardWidget>) => {
    setWidgets(widgets.map(widget => 
      widget.id === id ? { ...widget, ...updates } : widget
    ));
  };

  const renderWidget = (widget: DashboardWidget) => {
    switch (widget.type) {
      case 'chart-line':
        return <SalesChart />;
      case 'chart-bar':
        return <SalesChart />; // Using SalesChart as it can render bar charts too
      case 'chart-pie':
        return <CategoryChart />;
      case 'chart-scatter':
        return <CorrelationChart />;
      case 'stat': {
        const stat = stats.find(s => s.column === widget.dataSource);
        return (
          <Card className="h-full">
            <CardContent className="p-4 flex flex-col items-center justify-center h-full">
              <div className="text-3xl font-bold text-primary">
                {stat ? stat.count : 0}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {widget.title}
              </div>
            </CardContent>
          </Card>
        );
      }
      default:
        return (
          <Card>
            <CardContent className="p-4 flex items-center justify-center h-32">
              <div className="text-muted-foreground">Unsupported widget type</div>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-info/10 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-info" />
            </div>
            Dashboard Generator
          </h2>
          <p className="text-muted-foreground mt-1">
            Create custom dashboards with your data
          </p>
        </div>
        <Button variant="glow" onClick={() => setShowAddWidget(true)}>
          <Plus className="w-4 h-4" />
          Add Widget
        </Button>
      </div>

      {/* Add Widget Modal */}
      {showAddWidget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl border border-border/50 w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Add Widget</h3>
                <Button variant="ghost" size="icon" onClick={() => setShowAddWidget(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="flex flex-col items-center p-4 h-24"
                  onClick={() => addWidget('stat')}
                >
                  <TrendingUp className="w-6 h-6 mb-2" />
                  <span>Stat Card</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex flex-col items-center p-4 h-24"
                  onClick={() => addWidget('chart-line')}
                >
                  <TrendingUp className="w-6 h-6 mb-2" />
                  <span>Line Chart</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex flex-col items-center p-4 h-24"
                  onClick={() => addWidget('chart-bar')}
                >
                  <BarChart3 className="w-6 h-6 mb-2" />
                  <span>Bar Chart</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex flex-col items-center p-4 h-24"
                  onClick={() => addWidget('chart-pie')}
                >
                  <PieChart className="w-6 h-6 mb-2" />
                  <span>Pie Chart</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {widgets.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <BarChart3 className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">No widgets added yet</h3>
            <p className="text-muted-foreground mb-4">
              Add widgets to start building your custom dashboard
            </p>
            <Button onClick={() => setShowAddWidget(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Widget
            </Button>
          </div>
        ) : (
          widgets.map(widget => (
            <div key={widget.id} className="relative group">
              <Card className="h-full">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{widget.title}</CardTitle>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeWidget(widget.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pb-4">
                  {renderWidget(widget)}
                </CardContent>
              </Card>
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => updateWidget(widget.id, { ...widget })}
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};