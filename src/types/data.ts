export interface DataColumn {
  name: string;
  type: 'number' | 'string' | 'date' | 'boolean';
  values: (string | number | boolean | null)[];
}

export interface DataSet {
  id: string;
  name: string;
  columns: DataColumn[];
  rowCount: number;
  uploadedAt: Date;
}

export interface DataStats {
  column: string;
  type: string;
  count: number;
  unique: number;
  missing: number;
  mean?: number;
  median?: number;
  std?: number;
  min?: number;
  max?: number;
}

export interface Insight {
  id: string;
  type: 'trend' | 'anomaly' | 'correlation' | 'pattern' | 'prediction';
  title: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high';
  relatedColumns: string[];
  timestamp: Date;
}

export interface Prediction {
  column: string;
  futureValues: { date: string; value: number; confidence: number }[];
  trend: 'up' | 'down' | 'stable';
  accuracy: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  chartData?: any;
  insights?: Insight[];
}

export interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'scatter' | 'area';
  title: string;
  xAxis: string;
  yAxis: string;
  data: any[];
}
