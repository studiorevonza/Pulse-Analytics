import { Database, Search, Download, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useData } from '@/contexts/DataContext';

import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

export const DataExplorer = () => {
  const { stats, currentDataset } = useData();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get sample rows from current dataset if available
  const allSampleRows = currentDataset ? 
    Array.from({ length: Math.min(8, currentDataset.rowCount) }, (_, i) => {
      const row: Record<string, string | number | boolean | null> = {};
      currentDataset.columns.forEach(col => {
        row[col.name] = col.values[i] ?? 'N/A';
      });
      return row;
    }) : [];
    
  // Filter rows based on search term
  const filteredSampleRows = allSampleRows.filter(row => {
    if (!searchTerm) return true;
    return Object.values(row).some(value => 
      value !== null && 
      value !== undefined && 
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
    
  const sampleRows = searchTerm ? filteredSampleRows : allSampleRows;

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
          <Button variant="glass" onClick={() => toast({
            title: "Filter Applied",
            description: "Filter functionality would be implemented in a full version.",
          })}>
            <Filter className="w-4 h-4" />
            Filter
          </Button>
          <Button variant="glass" onClick={() => {
            if (currentDataset) {
              // Create CSV content from the current dataset
              const headers = currentDataset.columns.map(col => col.name).join(',');
              const rows = [];
              for (let i = 0; i < currentDataset.rowCount; i++) {
                const row = currentDataset.columns.map(col => {
                  const value = col.values[i];
                  if (value === null || value === undefined) return '';
                  return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
                }).join(',');
                rows.push(row);
              }
              
              const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows.join('\n')}`;
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement('a');
              link.setAttribute('href', encodedUri);
              link.setAttribute('download', `${currentDataset.name || 'dataset'}.csv`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              
              toast({
                title: "Export Success",
                description: `Dataset exported as CSV successfully`,
              });
            } else {
              toast({
                title: "Export Failed",
                description: "No dataset loaded to export",
                variant: "destructive"
              });
            }
          }}>
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
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
          <span className="text-sm text-muted-foreground">
            {currentDataset ? 
              searchTerm ? 
                `Showing ${filteredSampleRows.length} of ${currentDataset.rowCount} matching rows` :
                `Showing ${Math.min(8, currentDataset.rowCount)} of ${currentDataset.rowCount} rows`
              : 'No dataset loaded'}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                {currentDataset && currentDataset.columns.map((col, idx) => (
                  <th 
                    key={idx}
                    className={`text-left py-3 px-4 text-sm font-medium text-muted-foreground ${['number'].includes(col.type) ? 'text-right' : 'text-left'}`}>
                    {col.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sampleRows.map((row, i) => (
                <tr key={i} className="border-b border-border/30 hover:bg-secondary/30 transition-colors">
                  {currentDataset && currentDataset.columns.map((col, j) => (
                    <td 
                      key={j} 
                      className={`py-3 px-4 ${col.type === 'number' ? 'text-right font-mono' : 'text-left'} ${col.name.toLowerCase().includes('profit') || col.name.toLowerCase().includes('sales') ? 'text-success' : ''}`}>
                      {typeof row[col.name] === 'number' && !isNaN(row[col.name] as number) ? 
                        (col.name.toLowerCase().includes('profit') || col.name.toLowerCase().includes('sales') || col.name.toLowerCase().includes('cost')) ? 
                          `$${(row[col.name] as number).toLocaleString()}` :
                          (row[col.name] as number).toLocaleString() :
                        row[col.name]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
