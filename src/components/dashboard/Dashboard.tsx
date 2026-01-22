import { DollarSign, TrendingUp, ShoppingCart, Target } from 'lucide-react';
import { StatCard } from './StatCard';
import { SalesChart } from '../charts/SalesChart';
import { CategoryChart } from '../charts/CategoryChart';
import { InsightCard } from '../insight/InsightCard';
import { PredictionMini } from '../prediction/PredictionMini';
import { useData } from '@/contexts/DataContext';

export const Dashboard = () => {
  const { insights, stats, currentDataset } = useData();
  
  // Calculate stats for the stat cards
  const revenueStat = stats.find(stat => stat.column.toLowerCase().includes('sales') || stat.column.toLowerCase().includes('revenue'));
  const profitStat = stats.find(stat => stat.column.toLowerCase().includes('profit'));
  const unitsStat = stats.find(stat => stat.column.toLowerCase().includes('unit') || stat.column.toLowerCase().includes('quantity'));
  
  // Use available insights or default to an empty array
  const displayedInsights = insights.slice(0, 2);

  return (
    <div className="p-6 space-y-6 animate-fade-in bg-transparent">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={revenueStat ? `$${Math.round(revenueStat.mean || 0).toLocaleString()}` : "$0"}
          change={revenueStat ? 5 : 0}
          trend={revenueStat ? "up" : "stable"}
          icon={DollarSign}
        />
        <StatCard
          title="Total Profit"
          value={profitStat ? `$${Math.round(profitStat.mean || 0).toLocaleString()}` : "$0"}
          change={profitStat ? 3 : 0}
          trend={profitStat ? "up" : "stable"}
          icon={TrendingUp}
        />
        <StatCard
          title="Units Sold"
          value={unitsStat ? `${Math.round(unitsStat.mean || 0).toLocaleString()}` : "0"}
          change={unitsStat ? 7 : 0}
          trend={unitsStat ? "up" : "stable"}
          icon={ShoppingCart}
        />
        <StatCard
          title="Avg. Margin"
          value={profitStat && revenueStat ? `${((profitStat.mean || 0) / (revenueStat.mean || 1) * 100).toFixed(1)}%` : "0%"}
          change={2}
          trend="up"
          icon={Target}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesChart />
        </div>
        <div>
          <CategoryChart />
        </div>
      </div>

      {/* Insights & Predictions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            AI Insights
          </h3>
          {displayedInsights.length > 0 ? (
            displayedInsights.map(insight => (
              <InsightCard key={insight.id} insight={insight} />
            ))
          ) : (
            <div className="p-4 bg-secondary/30 backdrop-blur-sm rounded-xl border border-border/50">
              <p className="text-muted-foreground text-center py-4">
                Upload data to generate insights
              </p>
            </div>
          )}
        </div>
        <div>
          <PredictionMini />
        </div>
      </div>
    </div>
  );
};