import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis } from 'recharts';
import { useData } from '@/contexts/DataContext';

const COLORS: Record<string, string> = {
  Electronics: 'hsl(190, 95%, 40%)',
  Clothing: 'hsl(38, 95%, 50%)',
  Food: 'hsl(150, 70%, 40%)',
  Home: 'hsl(280, 70%, 55%)',
  Sports: 'hsl(340, 75%, 50%)',
};

export const CorrelationChart = () => {
  const { currentDataset } = useData();
  
  // Generate chart data from the current dataset if available
  let data: Record<string, string | number | boolean>[] = [];
  let xKey: string = 'x';
  let yKey: string = 'y';
  let categoryKey: string = 'category';
  
  if (currentDataset) {
    // Find numeric columns for scatter plot
    const numericCols = currentDataset.columns.filter(col => col.type === 'number');
    
    if (numericCols.length >= 2) {
      // Use the first two numeric columns
      const xCol = numericCols[0];
      const yCol = numericCols[1];
      
      // Get categorical column for coloring
      const categoricalCols = currentDataset.columns.filter(col => col.type === 'string');
      const catCol = categoricalCols.length > 0 ? categoricalCols[0] : null;
      
      data = [];
      for (let i = 0; i < Math.min(currentDataset.rowCount, 50); i++) { // Limit to 50 points for performance
        const item: Record<string, string | number | boolean> = {};
        item[xKey] = xCol.values[i] ?? 0;
        item[yKey] = yCol.values[i] ?? 0;
        if (catCol) {
          item[categoryKey] = String(catCol.values[i] ?? 'Unknown');
        } else {
          item[categoryKey] = 'Data Point';
        }
        data.push(item);
      }
      
      xKey = xCol.name;
      yKey = yCol.name;
      if (catCol) categoryKey = catCol.name;
    } else {
      // Fallback to synthetic data
      data = Array.from({ length: 30 }, (_, i) => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        category: ['Group A', 'Group B', 'Group C'][i % 3]
      }));
      xKey = 'x';
      yKey = 'y';
      categoryKey = 'category';
    }
  } else {
    // Default data when no dataset is loaded
    data = Array.from({ length: 30 }, (_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      category: ['Group A', 'Group B', 'Group C'][i % 3]
    }));
    xKey = 'x';
    yKey = 'y';
    categoryKey = 'category';
  }
  
  // Generate color mapping for categories
  const uniqueCategories = [...new Set(data.map(item => String(item[categoryKey])))];
  const categoryColors: Record<string, string> = {};
  const colorPalette = [
    'hsl(190, 95%, 40%)',
    'hsl(38, 95%, 50%)',
    'hsl(150, 70%, 40%)',
    'hsl(280, 70%, 55%)',
    'hsl(340, 75%, 50%)',
  ];
  
  uniqueCategories.forEach((category, index) => {
    categoryColors[category] = colorPalette[index % colorPalette.length];
  });

  return (
    <div className="chart-container">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Data Correlation</h3>
        <p className="text-sm text-muted-foreground">Relationship between selected variables</p>
      </div>
      
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis 
              type="number"
              dataKey={xKey} 
              name={xKey}
              className="fill-muted-foreground"
              fontSize={12}
              tickLine={false}
              label={{ value: xKey, position: 'bottom', fontSize: 11, className: 'fill-muted-foreground' }}
            />
            <YAxis 
              type="number"
              dataKey={yKey} 
              name={yKey}
              className="fill-muted-foreground"
              fontSize={12}
              tickLine={false}
              tickFormatter={(value) => value.toLocaleString()}
              label={{ value: yKey, angle: -90, position: 'left', fontSize: 11, className: 'fill-muted-foreground' }}
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
                value,
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
                    fill={categoryColors[payload[categoryKey]] || 'hsl(190, 95%, 40%)'} 
                    fillOpacity={0.8}
                    stroke={categoryColors[payload[categoryKey]] || 'hsl(190, 95%, 40%)'}
                    strokeWidth={2}
                  />
                );
              }}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-border/50">
        {uniqueCategories.map((category) => (
          <div key={category} className="flex items-center gap-2 text-xs">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: categoryColors[category] }} />
            {category}
          </div>
        ))}
      </div>
    </div>
  );
};
