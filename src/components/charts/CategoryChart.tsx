import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useData } from '@/contexts/DataContext';

const COLORS = [
  'hsl(190, 95%, 40%)',
  'hsl(38, 95%, 50%)',
  'hsl(150, 70%, 40%)',
  'hsl(280, 70%, 55%)',
  'hsl(340, 75%, 50%)',
];

export const CategoryChart = () => {
  const { currentDataset } = useData();
  
  // Generate chart data from the current dataset if available
  let data: Record<string, string | number>[] = [];
  let dataKey: string = 'value';
  let nameKey: string = 'category';
  
  if (currentDataset) {
    // Find categorical and numeric columns
    const categoricalCols = currentDataset.columns.filter(col => col.type === 'string');
    const numericCols = currentDataset.columns.filter(col => col.type === 'number');
    
    if (categoricalCols.length > 0 && numericCols.length > 0) {
      // Group data by the first categorical column and sum the first numeric column
      const catCol = categoricalCols[0];
      const numCol = numericCols[0];
      
      // Create a map to aggregate values by category
      const aggregationMap = new Map<string, number>();
      
      for (let i = 0; i < currentDataset.rowCount; i++) {
        const catValue = String(catCol.values[i] || 'Unknown');
        const numValue = Number(numCol.values[i]) || 0;
        
        if (aggregationMap.has(catValue)) {
          aggregationMap.set(catValue, aggregationMap.get(catValue)! + numValue);
        } else {
          aggregationMap.set(catValue, numValue);
        }
      }
      
      data = Array.from(aggregationMap.entries()).map(([name, value]) => ({
        [catCol.name]: name,
        [numCol.name]: value
      }));
      
      nameKey = catCol.name;
      dataKey = numCol.name;
    } else {
      // Fallback to synthetic data
      data = [
        { category: 'Data Series 1', value: 45 },
        { category: 'Data Series 2', value: 35 },
        { category: 'Data Series 3', value: 20 },
      ];
      nameKey = 'category';
      dataKey = 'value';
    }
  } else {
    // Default data when no dataset is loaded
    data = [
      { category: 'Data Series 1', value: 45 },
      { category: 'Data Series 2', value: 35 },
      { category: 'Data Series 3', value: 20 },
    ];
    nameKey = 'category';
    dataKey = 'value';
  }

  return (
    <div className="chart-container h-full bg-background/30 backdrop-blur-sm rounded-xl border border-border/50 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-accent animate-pulse" />
          Data Distribution
        </h3>
        <p className="text-sm text-muted-foreground">Categorical breakdown of your dataset</p>
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
              dataKey={dataKey}
              nameKey={nameKey}
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
              formatter={(value: number) => [`$${value.toLocaleString()}`, nameKey]}
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
