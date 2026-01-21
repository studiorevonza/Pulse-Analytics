import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis } from 'recharts';
import { getCorrelationData } from '@/lib/sampleData';

const COLORS: Record<string, string> = {
  Electronics: 'hsl(190, 95%, 40%)',
  Clothing: 'hsl(38, 95%, 50%)',
  Food: 'hsl(150, 70%, 40%)',
  Home: 'hsl(280, 70%, 55%)',
  Sports: 'hsl(340, 75%, 50%)',
};

export const CorrelationChart = () => {
  const data = getCorrelationData();

  return (
    <div className="chart-container">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Units vs Profit Correlation</h3>
        <p className="text-sm text-muted-foreground">r = 0.89 (strong positive)</p>
      </div>
      
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis 
              type="number"
              dataKey="units" 
              name="Units"
              className="fill-muted-foreground"
              fontSize={12}
              tickLine={false}
              label={{ value: 'Units Sold', position: 'bottom', fontSize: 11, className: 'fill-muted-foreground' }}
            />
            <YAxis 
              type="number"
              dataKey="profit" 
              name="Profit"
              className="fill-muted-foreground"
              fontSize={12}
              tickLine={false}
              tickFormatter={(value) => `$${value / 1000}k`}
              label={{ value: 'Profit', angle: -90, position: 'left', fontSize: 11, className: 'fill-muted-foreground' }}
            />
            <ZAxis range={[100, 100]} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--card-foreground))',
              }}
              formatter={(value: number, name: string) => [
                name === 'Profit' ? `$${value.toLocaleString()}` : value,
                name
              ]}
            />
            <Scatter 
              data={data} 
              fill="hsl(190, 95%, 40%)"
              shape={(props: any) => {
                const { cx, cy, payload } = props;
                return (
                  <circle 
                    cx={cx} 
                    cy={cy} 
                    r={8} 
                    fill={COLORS[payload.category] || 'hsl(190, 95%, 40%)'} 
                    fillOpacity={0.8}
                    stroke={COLORS[payload.category] || 'hsl(190, 95%, 40%)'}
                    strokeWidth={2}
                  />
                );
              }}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-border/50">
        {Object.entries(COLORS).map(([category, color]) => (
          <div key={category} className="flex items-center gap-2 text-xs">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
            {category}
          </div>
        ))}
      </div>
    </div>
  );
};
