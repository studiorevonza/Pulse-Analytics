import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { getChartDataByCategory } from '@/lib/sampleData';

const COLORS = [
  'hsl(190, 95%, 40%)',
  'hsl(38, 95%, 50%)',
  'hsl(150, 70%, 40%)',
  'hsl(280, 70%, 55%)',
  'hsl(340, 75%, 50%)',
];

export const CategoryChart = () => {
  const data = getChartDataByCategory();

  return (
    <div className="chart-container h-full">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Sales by Category</h3>
        <p className="text-sm text-muted-foreground">Revenue distribution</p>
      </div>
      
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={3}
              dataKey="sales"
              nameKey="category"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                  stroke="transparent"
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--card-foreground))',
              }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Sales']}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value) => <span className="text-sm text-muted-foreground">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
