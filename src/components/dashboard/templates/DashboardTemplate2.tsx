import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '../StatCard';
import { SalesChart } from '../../charts/SalesChart';
import { CategoryChart } from '../../charts/CategoryChart';
import { InsightCard } from '../../insight/InsightCard';
import { DollarSign, TrendingUp, ShoppingCart, Users } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { DashboardConfig } from '../DashboardSelector';

interface DashboardTemplate2Props {
  config: DashboardConfig;
}

export const DashboardTemplate2: React.FC<DashboardTemplate2Props> = ({ config }) => {
  const { insights, stats, currentDataset } = useData();

  // Calculate stats for the stat cards
  const revenueStat = stats.find(stat => 
    stat.column.toLowerCase().includes('sales') || 
    stat.column.toLowerCase().includes('revenue')
  );
  const profitStat = stats.find(stat => 
    stat.column.toLowerCase().includes('profit')
  );
  const customerStat = stats.find(stat => 
    stat.column.toLowerCase().includes('customer') || 
    stat.column.toLowerCase().includes('client')
  );
  const ordersStat = stats.find(stat => 
    stat.column.toLowerCase().includes('order') || 
    stat.column.toLowerCase().includes('transaction')
  );

  // Use available insights or default to an empty array
  const displayedInsights = insights.slice(0, 3);

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Executive Summary Stats */}
      {config.showStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Revenue"
            value={revenueStat ? `$${Math.round(revenueStat.mean || 0).toLocaleString()}` : "$0"}
            change={revenueStat ? 12 : 0}
            trend={revenueStat ? "up" : "stable"}
            icon={DollarSign}
          />
          <StatCard
            title="Profit"
            value={profitStat ? `$${Math.round(profitStat.mean || 0).toLocaleString()}` : "$0"}
            change={profitStat ? 8 : 0}
            trend={profitStat ? "up" : "stable"}
            icon={TrendingUp}
          />
          <StatCard
            title="Customers"
            value={customerStat ? `${Math.round(customerStat.mean || 0).toLocaleString()}` : "0"}
            change={customerStat ? 5 : 0}
            trend={customerStat ? "up" : "stable"}
            icon={Users}
          />
          <StatCard
            title="Orders"
            value={ordersStat ? `${Math.round(ordersStat.mean || 0).toLocaleString()}` : "0"}
            change={ordersStat ? 15 : 0}
            trend={ordersStat ? "up" : "stable"}
            icon={ShoppingCart}
          />
        </div>
      )}

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Charts */}
        {config.showCharts && (
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <SalesChart />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Segment Analysis</CardTitle>
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

      {/* Recent Activity */}
      {config.showRecentActivity && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentDataset ? (
                <div className="text-center py-4 text-muted-foreground">
                  <p>Last activity: {currentDataset.uploadedAt.toLocaleString()}</p>
                  <p>Dataset: {currentDataset.name}</p>
                  <p>Records: {currentDataset.rowCount}</p>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  Upload data to see recent activity
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};