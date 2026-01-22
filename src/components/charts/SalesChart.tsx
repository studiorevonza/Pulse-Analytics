import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useData } from '@/contexts/DataContext';

export const SalesChart = () => {
  const { currentDataset } = useData();
  
  // Generate chart data from the current dataset if available
  let data: Record<string, string | number | boolean>[] = [];
  if (currentDataset) {
    // Find date-like and numeric columns
    const dateColumns = currentDataset.columns.filter(col => col.type === 'date' || col.name.toLowerCase().includes('date') || col.name.toLowerCase().includes('time'));
    const numericColumns = currentDataset.columns.filter(col => col.type === 'number');
    
    if (dateColumns.length > 0 && numericColumns.length >= 2) {
      // Use first date column and first two numeric columns
      const dateCol = dateColumns[0];
      const firstNumCol = numericColumns[0];
      const secondNumCol = numericColumns.length > 1 ? numericColumns[1] : numericColumns[0];
      
      data = currentDataset.columns[0].values.slice(0, 12).map((_, i) => {
        const item: Record<string, string | number | boolean> = {};
        if (dateCol) item[dateCol.name] = dateCol.values[i] ?? `Period ${i + 1}`;
        if (firstNumCol) item[firstNumCol.name] = firstNumCol.values[i] ?? 0;
        if (secondNumCol) item[secondNumCol.name] = secondNumCol.values[i] ?? 0;
        return item;
      });
    } else {
      // Fallback to a simple synthetic dataset
      data = Array.from({ length: 12 }, (_, i) => ({
        month: `Period ${i + 1}`,
        sales: Math.floor(Math.random() * 50000) + 10000,
        profit: Math.floor(Math.random() * 20000) + 5000,
      }));
    }
  } else {
    // Default data when no dataset is loaded
    data = Array.from({ length: 12 }, (_, i) => ({
      month: `Period ${i + 1}`,
      sales: Math.floor(Math.random() * 50000) + 10000,
      profit: Math.floor(Math.random() * 20000) + 5000,
    }));
  }
  
  // Determine which columns to use for the chart
  const dateKey = currentDataset ? 
    (currentDataset.columns.find(col => col.type === 'date' || col.name.toLowerCase().includes('date'))?.name || 'month') : 'month';
  const salesKey = currentDataset ? 
    (currentDataset.columns.find(col => col.name.toLowerCase().includes('sale') || col.name.toLowerCase().includes('revenue'))?.name || 'sales') : 'sales';
  const profitKey = currentDataset ? 
    (currentDataset.columns.find(col => col.name.toLowerCase().includes('profit') || col.name.toLowerCase().includes('earn'))?.name || 'profit') : 'profit';

  return (
    <div className="chart-container bg-background/30 backdrop-blur-sm rounded-xl border border-border/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-primary animate-pulse" />
            Data Trends
          </h3>
          <p className="text-sm text-muted-foreground">Dynamic visualization of your dataset</p>
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
              dataKey={dateKey} 
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
              dataKey={salesKey}
              stroke="hsl(190, 95%, 40%)"
              strokeWidth={2}
              fill="url(#salesGradient)"
            />
            <Area
              type="monotone"
              dataKey={profitKey}
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
