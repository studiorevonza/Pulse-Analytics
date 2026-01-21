import { TrendingUp, ArrowUpRight, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine } from 'recharts';

const predictionData = [
  { month: 'Oct', actual: 51000, predicted: null },
  { month: 'Nov', actual: 58000, predicted: null },
  { month: 'Dec', actual: 62000, predicted: null },
  { month: 'Jan', actual: null, predicted: 48000 },
  { month: 'Feb', actual: null, predicted: 52000 },
  { month: 'Mar', actual: null, predicted: 58000 },
  { month: 'Apr', actual: null, predicted: 61000 },
  { month: 'May', actual: null, predicted: 65000 },
  { month: 'Jun', actual: null, predicted: 72000 },
];

export const PredictionMini = () => {
  return (
    <div className="chart-container h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Sales Forecast
          </h3>
          <p className="text-sm text-muted-foreground">Next 6 months prediction</p>
        </div>
        <div className="flex items-center gap-1 text-success">
          <ArrowUpRight className="w-4 h-4" />
          <span className="text-sm font-medium">+16.1%</span>
        </div>
      </div>

      <div className="h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={predictionData}>
            <XAxis 
              dataKey="month" 
              className="fill-muted-foreground"
              fontSize={11}
              tickLine={false}
            />
            <YAxis 
              className="fill-muted-foreground"
              fontSize={11}
              tickLine={false}
              tickFormatter={(value) => `$${value / 1000}k`}
              domain={[40000, 80000]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--card-foreground))',
              }}
              formatter={(value: number) => [`$${value?.toLocaleString()}`, '']}
            />
            <ReferenceLine 
              x="Dec" 
              className="stroke-muted-foreground"
              strokeDasharray="3 3"
              label={{ value: 'Now', position: 'top', fontSize: 10, className: 'fill-muted-foreground' }}
            />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="hsl(190, 95%, 40%)"
              strokeWidth={2}
              dot={{ fill: 'hsl(190, 95%, 40%)', strokeWidth: 0, r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="hsl(38, 95%, 50%)"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: 'hsl(38, 95%, 50%)', strokeWidth: 0, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-chart-1" />
            Actual
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-accent" style={{ background: 'repeating-linear-gradient(90deg, hsl(38, 95%, 55%) 0, hsl(38, 95%, 55%) 3px, transparent 3px, transparent 6px)' }} />
            Predicted
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Target className="w-3 h-3" />
          89% accuracy
        </div>
      </div>
    </div>
  );
};
