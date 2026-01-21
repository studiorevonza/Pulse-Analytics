import { BarChart3, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SalesChart } from './SalesChart';
import { CategoryChart } from './CategoryChart';
import { CorrelationChart } from './CorrelationChart';
import { RegionChart } from './RegionChart';

export const ChartsPanel = () => {
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-info/10 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-info" />
            </div>
            Data Visualizations
          </h2>
          <p className="text-muted-foreground mt-1">
            Interactive charts and visual analytics
          </p>
        </div>
        <Button variant="glow">
          <Plus className="w-4 h-4" />
          Create Chart
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart />
        <CategoryChart />
        <CorrelationChart />
        <RegionChart />
      </div>
    </div>
  );
};
