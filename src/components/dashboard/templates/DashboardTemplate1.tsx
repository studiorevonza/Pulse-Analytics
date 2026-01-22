import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '../StatCard';
import { SalesChart } from '../../charts/SalesChart';
import { CategoryChart } from '../../charts/CategoryChart';
import { InsightCard } from '../../insight/InsightCard';
import { PredictionMini } from '../../prediction/PredictionMini';
import { DollarSign, TrendingUp, ShoppingCart, Target } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { DashboardConfig } from '../DashboardSelector';

interface DashboardTemplate1Props {
  config: DashboardConfig;
}

export const DashboardTemplate1: React.FC<DashboardTemplate1Props> = ({ config }) => {
  const { insights, stats, currentDataset } = useData();

  // Calculate stats for the stat cards
  const revenueStat = stats.find(stat => 
    stat.column.toLowerCase().includes('sales') || 
    stat.column.toLowerCase().includes('revenue')
  );
  const profitStat = stats.find(stat => 
    stat.column.toLowerCase().includes('profit')
  );
  const unitsStat = stats.find(stat => 
    stat.column.toLowerCase().includes('unit') || 
    stat.column.toLowerCase().includes('quantity')
  );

  // Use available insights or default to an empty array
  const displayedInsights = insights.slice(0, 2);

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Stats Row */}
      {config.showStats && (
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
      )}

      {/* Charts Row */}
      {config.showCharts && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Trend Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <SalesChart />
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Categorical Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <CategoryChart />
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Insights & Predictions Row */}
      {(config.showInsights || config.showRecentActivity) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {config.showInsights && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>AI Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  {displayedInsights.length > 0 ? (
                    <div className="space-y-4">
                      {displayedInsights.map(insight => (
                        <InsightCard key={insight.id} insight={insight} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">
                      Upload data to generate insights
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
          
          {config.showRecentActivity && (
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <PredictionMini />
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
};