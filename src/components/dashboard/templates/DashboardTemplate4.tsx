import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '../StatCard';
import { SalesChart } from '../../charts/SalesChart';
import { CategoryChart } from '../../charts/CategoryChart';
import { InsightCard } from '../../insight/InsightCard';
import { DollarSign, TrendingUp, Target, Activity } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { DashboardConfig } from '../DashboardSelector';

interface DashboardTemplate4Props {
  config: DashboardConfig;
}

export const DashboardTemplate4: React.FC<DashboardTemplate4Props> = ({ config }) => {
  const { insights, stats, currentDataset } = useData();

  // Calculate stats for the stat cards
  const revenueStat = stats.find(stat => 
    stat.column.toLowerCase().includes('sales') || 
    stat.column.toLowerCase().includes('revenue')
  );
  const profitStat = stats.find(stat => 
    stat.column.toLowerCase().includes('profit')
  );
  const performanceStat = stats.find(stat => 
    stat.column.toLowerCase().includes('performance') || 
    stat.column.toLowerCase().includes('efficiency')
  );
  const metricStat = stats.find(stat => 
    stat.column.toLowerCase().includes('metric') || 
    stat.column.toLowerCase().includes('score')
  );

  // Use available insights or default to an empty array
  const displayedInsights = insights.slice(0, 4);

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Performance Metrics */}
      {config.showStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Revenue"
            value={revenueStat ? `$${Math.round(revenueStat.mean || 0).toLocaleString()}` : "$0"}
            change={revenueStat ? 10 : 0}
            trend={revenueStat ? "up" : "stable"}
            icon={DollarSign}
          />
          <StatCard
            title="Profit Margin"
            value={profitStat && revenueStat ? `${((profitStat.mean || 0) / (revenueStat.mean || 1) * 100).toFixed(1)}%` : "0%"}
            change={profitStat ? 5 : 0}
            trend={profitStat ? "up" : "stable"}
            icon={TrendingUp}
          />
          <StatCard
            title="Performance"
            value={performanceStat ? `${Math.round(performanceStat.mean || 0)}%` : "N/A"}
            change={performanceStat ? 3 : 0}
            trend={performanceStat ? "up" : "stable"}
            icon={Target}
          />
          <StatCard
            title="Efficiency Score"
            value={metricStat ? `${Math.round(metricStat.mean || 0)}` : "N/A"}
            change={metricStat ? 2 : 0}
            trend={metricStat ? "up" : "stable"}
            icon={Activity}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Charts */}
        {config.showCharts && (
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <SalesChart />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <CategoryChart />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Right Column - Insights */}
        {config.showInsights && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Key Insights</CardTitle>
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
      </div>

      {/* Performance Summary */}
      {config.showRecentActivity && (
        <Card>
          <CardHeader>
            <CardTitle>Performance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            {currentDataset ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">{currentDataset.rowCount}</p>
                  <p className="text-sm text-muted-foreground">Total Records</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">{stats.length}</p>
                  <p className="text-sm text-muted-foreground">Calculated Metrics</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">{insights.length}</p>
                  <p className="text-sm text-muted-foreground">Generated Insights</p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Upload data to see performance summary
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};