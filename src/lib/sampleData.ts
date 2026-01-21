import { DataSet, Insight, Prediction, DataStats } from '@/types/data';

// Generate sample sales data
export const generateSampleData = (): DataSet => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const categories = ['Electronics', 'Clothing', 'Food', 'Home', 'Sports'];
  const regions = ['North', 'South', 'East', 'West'];
  
  const data: { month: string; category: string; region: string; sales: number; units: number; profit: number }[] = [];
  
  months.forEach((month, monthIndex) => {
    categories.forEach(category => {
      regions.forEach(region => {
        const baseSales = 10000 + Math.random() * 50000;
        const seasonalFactor = 1 + 0.3 * Math.sin((monthIndex / 12) * 2 * Math.PI);
        const sales = Math.round(baseSales * seasonalFactor);
        const units = Math.round(sales / (50 + Math.random() * 150));
        const profit = Math.round(sales * (0.1 + Math.random() * 0.3));
        
        data.push({ month, category, region, sales, units, profit });
      });
    });
  });

  return {
    id: 'sample-1',
    name: 'Sales Data 2024',
    columns: [
      { name: 'month', type: 'string', values: data.map(d => d.month) },
      { name: 'category', type: 'string', values: data.map(d => d.category) },
      { name: 'region', type: 'string', values: data.map(d => d.region) },
      { name: 'sales', type: 'number', values: data.map(d => d.sales) },
      { name: 'units', type: 'number', values: data.map(d => d.units) },
      { name: 'profit', type: 'number', values: data.map(d => d.profit) },
    ],
    rowCount: data.length,
    uploadedAt: new Date(),
  };
};

export const generateTimeSeriesData = () => {
  const data = [];
  let value = 1000;
  const startDate = new Date('2024-01-01');
  
  for (let i = 0; i < 365; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    // Add trend
    value += 2 + Math.random() * 3;
    
    // Add seasonality
    const seasonality = 50 * Math.sin((i / 365) * 2 * Math.PI);
    
    // Add noise
    const noise = (Math.random() - 0.5) * 40;
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(value + seasonality + noise),
      predicted: false,
    });
  }
  
  return data;
};

export const generatePredictions = (): Prediction[] => {
  const futureMonths = ['Jan 2025', 'Feb 2025', 'Mar 2025', 'Apr 2025', 'May 2025', 'Jun 2025'];
  
  return [
    {
      column: 'sales',
      futureValues: futureMonths.map((date, i) => ({
        date,
        value: 45000 + i * 2000 + Math.random() * 5000,
        confidence: 0.95 - i * 0.05,
      })),
      trend: 'up',
      accuracy: 0.89,
    },
    {
      column: 'profit',
      futureValues: futureMonths.map((date, i) => ({
        date,
        value: 12000 + i * 500 + Math.random() * 1500,
        confidence: 0.92 - i * 0.04,
      })),
      trend: 'up',
      accuracy: 0.85,
    },
  ];
};

export const generateInsights = (): Insight[] => [
  {
    id: '1',
    type: 'trend',
    title: 'Strong Upward Sales Trend',
    description: 'Sales have increased by 23% over the last quarter, with Electronics leading at 31% growth.',
    confidence: 0.94,
    impact: 'high',
    relatedColumns: ['sales', 'category'],
    timestamp: new Date(),
  },
  {
    id: '2',
    type: 'anomaly',
    title: 'Unusual Spike in March',
    description: 'March shows a 45% increase compared to the expected trend. This correlates with the spring promotion campaign.',
    confidence: 0.87,
    impact: 'medium',
    relatedColumns: ['sales', 'month'],
    timestamp: new Date(),
  },
  {
    id: '3',
    type: 'correlation',
    title: 'Strong Correlation: Units & Profit',
    description: 'Units sold and profit show a strong positive correlation (r=0.89). Higher volume categories yield better margins.',
    confidence: 0.91,
    impact: 'high',
    relatedColumns: ['units', 'profit'],
    timestamp: new Date(),
  },
  {
    id: '4',
    type: 'pattern',
    title: 'Seasonal Pattern Detected',
    description: 'Sales follow a predictable seasonal pattern with peaks in Q4 and dips in Q1. Plan inventory accordingly.',
    confidence: 0.88,
    impact: 'medium',
    relatedColumns: ['sales', 'month'],
    timestamp: new Date(),
  },
  {
    id: '5',
    type: 'prediction',
    title: 'Q1 2025 Forecast',
    description: 'Based on current trends and seasonality, Q1 2025 sales are predicted to reach $2.3M with 89% confidence.',
    confidence: 0.89,
    impact: 'high',
    relatedColumns: ['sales'],
    timestamp: new Date(),
  },
];

export const generateStats = (): DataStats[] => [
  { column: 'sales', type: 'number', count: 240, unique: 238, missing: 0, mean: 28500, median: 27200, std: 8500, min: 12000, max: 58000 },
  { column: 'units', type: 'number', count: 240, unique: 180, missing: 0, mean: 245, median: 230, std: 85, min: 80, max: 520 },
  { column: 'profit', type: 'number', count: 240, unique: 235, missing: 0, mean: 7200, median: 6800, std: 2100, min: 1800, max: 15600 },
  { column: 'month', type: 'string', count: 240, unique: 12, missing: 0 },
  { column: 'category', type: 'string', count: 240, unique: 5, missing: 0 },
  { column: 'region', type: 'string', count: 240, unique: 4, missing: 0 },
];

export const getChartDataByMonth = () => {
  return [
    { month: 'Jan', sales: 32000, profit: 8500, units: 280 },
    { month: 'Feb', sales: 28000, profit: 7200, units: 245 },
    { month: 'Mar', sales: 45000, profit: 12800, units: 380 },
    { month: 'Apr', sales: 38000, profit: 9800, units: 320 },
    { month: 'May', sales: 42000, profit: 11200, units: 355 },
    { month: 'Jun', sales: 48000, profit: 13500, units: 410 },
    { month: 'Jul', sales: 52000, profit: 14800, units: 445 },
    { month: 'Aug', sales: 49000, profit: 13200, units: 420 },
    { month: 'Sep', sales: 44000, profit: 11800, units: 375 },
    { month: 'Oct', sales: 51000, profit: 14200, units: 435 },
    { month: 'Nov', sales: 58000, profit: 16500, units: 495 },
    { month: 'Dec', sales: 62000, profit: 18200, units: 530 },
  ];
};

export const getChartDataByCategory = () => {
  return [
    { category: 'Electronics', sales: 185000, profit: 52000 },
    { category: 'Clothing', sales: 142000, profit: 48000 },
    { category: 'Food', sales: 98000, profit: 22000 },
    { category: 'Home', sales: 125000, profit: 38000 },
    { category: 'Sports', sales: 108000, profit: 32000 },
  ];
};

export const getCorrelationData = () => {
  return [
    { units: 80, profit: 2100, category: 'Food' },
    { units: 150, profit: 4200, category: 'Clothing' },
    { units: 220, profit: 6800, category: 'Home' },
    { units: 280, profit: 8500, category: 'Electronics' },
    { units: 320, profit: 9200, category: 'Sports' },
    { units: 380, profit: 12000, category: 'Electronics' },
    { units: 420, profit: 13500, category: 'Clothing' },
    { units: 480, profit: 15200, category: 'Electronics' },
    { units: 520, profit: 16800, category: 'Sports' },
  ];
};
