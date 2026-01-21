import { Database, Search, Download, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateStats } from '@/lib/sampleData';

export const DataExplorer = () => {
  const stats = generateStats();
  
  const sampleRows = [
    { month: 'Jan', category: 'Electronics', region: 'North', sales: 32500, units: 285, profit: 8750 },
    { month: 'Jan', category: 'Electronics', region: 'South', sales: 28400, units: 248, profit: 7200 },
    { month: 'Jan', category: 'Clothing', region: 'North', sales: 18200, units: 320, profit: 5800 },
    { month: 'Jan', category: 'Clothing', region: 'East', sales: 21500, units: 385, profit: 6900 },
    { month: 'Feb', category: 'Electronics', region: 'West', sales: 25800, units: 225, profit: 6500 },
    { month: 'Feb', category: 'Food', region: 'North', sales: 12400, units: 520, profit: 2800 },
    { month: 'Feb', category: 'Home', region: 'South', sales: 19800, units: 165, profit: 5200 },
    { month: 'Mar', category: 'Sports', region: 'East', sales: 16500, units: 275, profit: 4500 },
  ];

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-chart-4/10 flex items-center justify-center">
              <Database className="w-5 h-5 text-chart-4" />
            </div>
            Data Explorer
          </h2>
          <p className="text-muted-foreground mt-1">
            Browse, filter, and analyze your raw data
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="glass">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
          <Button variant="glass">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search in data..."
          className="w-full bg-secondary/50 border border-border/50 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      {/* Stats Overview */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-4">Column Statistics</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Column</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Type</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Count</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Unique</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Missing</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Mean</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Std Dev</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Min</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Max</th>
              </tr>
            </thead>
            <tbody>
              {stats.map((stat, i) => (
                <tr key={i} className="border-b border-border/30 hover:bg-secondary/30 transition-colors">
                  <td className="py-3 px-4 font-medium font-mono text-primary">{stat.column}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      stat.type === 'number' ? 'bg-info/10 text-info' : 'bg-chart-4/10 text-chart-4'
                    }`}>
                      {stat.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono">{stat.count}</td>
                  <td className="py-3 px-4 text-right font-mono">{stat.unique}</td>
                  <td className="py-3 px-4 text-right font-mono text-success">{stat.missing}</td>
                  <td className="py-3 px-4 text-right font-mono">
                    {stat.mean ? stat.mean.toLocaleString() : '—'}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-muted-foreground">
                    {stat.std ? stat.std.toLocaleString() : '—'}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-muted-foreground">
                    {stat.min ? stat.min.toLocaleString() : '—'}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-muted-foreground">
                    {stat.max ? stat.max.toLocaleString() : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Data Preview */}
      <div className="chart-container">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Data Preview</h3>
          <span className="text-sm text-muted-foreground">Showing 8 of 240 rows</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Month</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Category</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Region</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Sales</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Units</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Profit</th>
              </tr>
            </thead>
            <tbody>
              {sampleRows.map((row, i) => (
                <tr key={i} className="border-b border-border/30 hover:bg-secondary/30 transition-colors">
                  <td className="py-3 px-4 font-mono">{row.month}</td>
                  <td className="py-3 px-4">{row.category}</td>
                  <td className="py-3 px-4">{row.region}</td>
                  <td className="py-3 px-4 text-right font-mono text-primary">${row.sales.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right font-mono">{row.units}</td>
                  <td className="py-3 px-4 text-right font-mono text-success">${row.profit.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
