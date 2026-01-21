import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { getChartDataByMonth } from '@/lib/sampleData';

export const SalesChart = () => {
  const data = getChartDataByMonth();

  return (
    <div className="chart-container">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Sales & Profit Trend</h3>
          <p className="text-sm text-muted-foreground">Monthly performance overview</p>
        </div>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-chart-1" />
            Sales
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-chart-3" />
            Profit
          </div>
        </div>
      </div>
      
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(190, 95%, 40%)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(190, 95%, 40%)" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(150, 70%, 40%)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(150, 70%, 40%)" stopOpacity={0.05} />
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
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                color: 'hsl(var(--card-foreground))',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
            />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="hsl(190, 95%, 40%)"
              strokeWidth={2}
              fill="url(#salesGradient)"
            />
            <Area
              type="monotone"
              dataKey="profit"
              stroke="hsl(150, 70%, 40%)"
              strokeWidth={2}
              fill="url(#profitGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
