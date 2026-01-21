import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const regionData = [
  { region: 'North', sales: 145000, profit: 42000 },
  { region: 'South', sales: 138000, profit: 38000 },
  { region: 'East', sales: 152000, profit: 45000 },
  { region: 'West', sales: 114000, profit: 28000 },
];

export const RegionChart = () => {
  return (
    <div className="chart-container">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Performance by Region</h3>
        <p className="text-sm text-muted-foreground">Sales & Profit comparison</p>
      </div>
      
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={regionData} barGap={8}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
            <XAxis 
              dataKey="region" 
              className="fill-muted-foreground"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              className="fill-muted-foreground"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--card-foreground))',
              }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
              cursor={{ fill: 'hsl(var(--muted) / 0.3)' }}
            />
            <Legend 
              verticalAlign="top"
              height={36}
              formatter={(value) => <span className="text-sm capitalize">{value}</span>}
            />
            <Bar 
              dataKey="sales" 
              fill="hsl(190, 95%, 40%)" 
              radius={[4, 4, 0, 0]}
              name="Sales"
            />
            <Bar 
              dataKey="profit" 
              fill="hsl(150, 70%, 40%)" 
              radius={[4, 4, 0, 0]}
              name="Profit"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-4 border-t border-border/50">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Best Performer</span>
          <span className="text-success font-medium">East Region (+12%)</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-muted-foreground">Needs Attention</span>
          <span className="text-warning font-medium">West Region (-15%)</span>
        </div>
      </div>
    </div>
  );
};
