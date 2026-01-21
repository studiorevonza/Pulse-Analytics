import { DollarSign, TrendingUp, ShoppingCart, Target } from 'lucide-react';
import { StatCard } from './StatCard';
import { SalesChart } from '../charts/SalesChart';
import { CategoryChart } from '../charts/CategoryChart';
import { InsightCard } from '../insights/InsightCard';
import { PredictionMini } from '../predictions/PredictionMini';
import { generateInsights } from '@/lib/sampleData';

export const Dashboard = () => {
  const insights = generateInsights().slice(0, 2);

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value="$549,000"
          change={23}
          trend="up"
          icon={DollarSign}
        />
        <StatCard
          title="Total Profit"
          value="$141,700"
          change={18}
          trend="up"
          icon={TrendingUp}
        />
        <StatCard
          title="Units Sold"
          value="4,690"
          change={12}
          trend="up"
          icon={ShoppingCart}
        />
        <StatCard
          title="Avg. Margin"
          value="25.8%"
          change={-2}
          trend="down"
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
          {insights.map(insight => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
        <div>
          <PredictionMini />
        </div>
      </div>
    </div>
  );
};
