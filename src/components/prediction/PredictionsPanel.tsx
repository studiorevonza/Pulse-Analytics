import { TrendingUp, ArrowUpRight, ArrowDownRight, Target, Calendar, Zap } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Button } from '@/components/ui/button';

const forecastData = [
  { month: 'Jul 24', actual: 52000, predicted: null, lower: null, upper: null },
  { month: 'Aug 24', actual: 49000, predicted: null, lower: null, upper: null },
  { month: 'Sep 24', actual: 44000, predicted: null, lower: null, upper: null },
  { month: 'Oct 24', actual: 51000, predicted: null, lower: null, upper: null },
  { month: 'Nov 24', actual: 58000, predicted: null, lower: null, upper: null },
  { month: 'Dec 24', actual: 62000, predicted: null, lower: null, upper: null },
  { month: 'Jan 25', actual: null, predicted: 48000, lower: 42000, upper: 54000 },
  { month: 'Feb 25', actual: null, predicted: 52000, lower: 45000, upper: 59000 },
  { month: 'Mar 25', actual: null, predicted: 58000, lower: 49000, upper: 67000 },
  { month: 'Apr 25', actual: null, predicted: 61000, lower: 51000, upper: 71000 },
  { month: 'May 25', actual: null, predicted: 65000, lower: 54000, upper: 76000 },
  { month: 'Jun 25', actual: null, predicted: 72000, lower: 58000, upper: 86000 },
];

const metrics = [
  { label: 'Predicted Growth', value: '+16.1%', trend: 'up', icon: TrendingUp },
  { label: 'Model Accuracy', value: '89%', trend: 'stable', icon: Target },
  { label: 'Forecast Period', value: '6 months', trend: 'stable', icon: Calendar },
  { label: 'Confidence Level', value: '92%', trend: 'up', icon: Zap },
];

export const PredictionsPanel = () => {
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            Sales Predictions
          </h2>
          <p className="text-muted-foreground mt-1">
            AI-powered forecasting based on historical patterns
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="glass">Configure Model</Button>
          <Button variant="glow">Export Forecast</Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((metric, i) => (
          <div key={i} className="stat-card">
            <div className="flex items-center justify-between">
              <metric.icon className="w-5 h-5 text-primary" />
              {metric.trend === 'up' && <ArrowUpRight className="w-4 h-4 text-success" />}
              {metric.trend === 'down' && <ArrowDownRight className="w-4 h-4 text-destructive" />}
            </div>
            <p className="text-2xl font-bold mt-2">{metric.value}</p>
            <p className="text-sm text-muted-foreground">{metric.label}</p>
          </div>
        ))}
      </div>

      {/* Main Chart */}
      <div className="chart-container">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">6-Month Sales Forecast</h3>
            <p className="text-sm text-muted-foreground">with 95% confidence interval</p>
          </div>
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-chart-1" />
              Actual
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-accent" />
              Predicted
            </div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-3 rounded bg-accent/20" />
              Confidence
            </div>
          </div>
        </div>

        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecastData}>
              <defs>
                <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(190, 95%, 40%)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="hsl(190, 95%, 40%)" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="predictedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(38, 95%, 50%)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="hsl(38, 95%, 50%)" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis 
                dataKey="month" 
                className="fill-muted-foreground"
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                className="fill-muted-foreground"
                fontSize={12}
                tickLine={false}
                tickFormatter={(value) => `$${value / 1000}k`}
                domain={[30000, 90000]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--card-foreground))',
                }}
                formatter={(value: number, name: string) => [
                  value ? `$${value.toLocaleString()}` : 'N/A',
                  name === 'actual' ? 'Actual' : name === 'predicted' ? 'Predicted' : name
                ]}
              />
              <ReferenceLine 
                x="Dec 24" 
                className="stroke-muted-foreground"
                strokeDasharray="5 5"
                label={{ value: 'Forecast Start', position: 'top', fontSize: 11, className: 'fill-muted-foreground' }}
              />
              <Area
                type="monotone"
                dataKey="upper"
                stroke="transparent"
                fill="hsl(38, 95%, 50%)"
                fillOpacity={0.15}
              />
              <Area
                type="monotone"
                dataKey="lower"
                stroke="transparent"
                fill="hsl(var(--card))"
                fillOpacity={1}
              />
              <Area
                type="monotone"
                dataKey="actual"
                stroke="hsl(190, 95%, 40%)"
                strokeWidth={2}
                fill="url(#actualGradient)"
              />
              <Area
                type="monotone"
                dataKey="predicted"
                stroke="hsl(38, 95%, 50%)"
                strokeWidth={2}
                strokeDasharray="5 5"
                fill="url(#predictedGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Forecast Table */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-4">Detailed Forecast</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Month</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Predicted</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Lower Bound</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Upper Bound</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {forecastData.filter(d => d.predicted).map((row, i) => (
                <tr key={i} className="border-b border-border/30 hover:bg-secondary/30 transition-colors">
                  <td className="py-3 px-4 font-medium">{row.month}</td>
                  <td className="py-3 px-4 text-right text-primary font-mono">${row.predicted?.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right text-muted-foreground font-mono">${row.lower?.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right text-muted-foreground font-mono">${row.upper?.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right">
                    <span className="px-2 py-1 rounded-full text-xs bg-success/10 text-success">
                      {92 - i * 2}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
