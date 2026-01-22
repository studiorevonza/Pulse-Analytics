import React, { createContext, useContext, useState, useEffect } from 'react';
import { DataSet, DataStats, Insight, Prediction } from '@/types/data';
import Papa from 'papaparse';

interface ParsedCsv {
  data: Record<string, unknown>[];
  errors: Papa.ParseError[];
}

interface DataContextType {
  datasets: DataSet[];
  currentDataset: DataSet | null;
  stats: DataStats[];
  insights: Insight[];
  predictions: Prediction[];
  loading: boolean;
  addDataset: (file: File) => Promise<void>;
  setCurrentDataset: (datasetId: string) => void;
  removeDataset: (datasetId: string) => void;
  analyzeData: (dataset: DataSet) => Promise<{ stats: DataStats[], insights: Insight[], predictions: Prediction[] }>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [datasets, setDatasets] = useState<DataSet[]>([]);
  const [currentDataset, setCurrentDatasetState] = useState<DataSet | null>(null);
  const [stats, setStats] = useState<DataStats[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Load datasets from localStorage on initial load
  useEffect(() => {
    const savedDatasets = localStorage.getItem('pulse-datasets');
    if (savedDatasets) {
      try {
        const parsedDatasets: unknown = JSON.parse(savedDatasets);
        if (Array.isArray(parsedDatasets)) {
          setDatasets(parsedDatasets.map((ds: any) => ({
            ...ds,
            uploadedAt: new Date(ds.uploadedAt)
          } as DataSet)));
        }
      } catch (e) {
        console.error('Failed to load datasets from localStorage', e);
      }
    }
  }, []);

  // Save datasets to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('pulse-datasets', JSON.stringify(datasets));
  }, [datasets]);

  const setCurrentDataset = (datasetId: string) => {
    const dataset = datasets.find(ds => ds.id === datasetId) || null;
    setCurrentDatasetState(dataset);
    
    // If we have a dataset, analyze it
    if (dataset) {
      analyzeData(dataset)
        .then(results => {
          setStats(results.stats);
          setInsights(results.insights);
          setPredictions(results.predictions);
        })
        .catch(err => {
          console.error('Failed to analyze dataset:', err);
          // Set empty arrays as fallback
          setStats([]);
          setInsights([]);
          setPredictions([]);
        });
    } else {
      setStats([]);
      setInsights([]);
      setPredictions([]);
    }
  };

  const addDataset = async (file: File) => {
    setLoading(true);
    try {
      // Parse CSV file using PapaParse
      const parseResult = await new Promise<ParsedCsv>((resolve, reject) => {
        Papa.parse(file, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: resolve,
          error: reject
        });
      });

      if (parseResult.errors && parseResult.errors.length > 0) {
        console.warn('CSV parsing errors:', parseResult.errors);
      }

      const data = parseResult.data;
      if (!data || data.length === 0) {
        throw new Error('CSV file is empty or invalid');
      }

      // Determine column types and extract values
      const firstRow = data[0];
      const columns = Object.keys(firstRow).map(columnName => {
        // Sample a few rows to determine type
        const sampleValues = data.slice(0, Math.min(10, data.length)).map(row => row[columnName]);
        
        // Determine type based on samples
        let type: 'number' | 'string' | 'date' | 'boolean' = 'string';
        const nonNullValues = sampleValues.filter(v => v !== null && v !== undefined && v !== '');
        
        if (nonNullValues.length > 0) {
          const firstNonNull = nonNullValues[0];
          
          if (typeof firstNonNull === 'number') {
            type = 'number';
          } else if (typeof firstNonNull === 'boolean') {
            type = 'boolean';
          } else if (typeof firstNonNull === 'string' && !isNaN(Date.parse(firstNonNull)) && firstNonNull.length > 6) {
            type = 'date';
          } else if (nonNullValues.every(v => !isNaN(Number(v)))) {
            type = 'number';
          }
        }

        // Extract all values for this column
        const values = data.map(row => {
          let val = row[columnName];
          if (val === '' || val === null || val === undefined) return null;
          
          if (type === 'number' && typeof val !== 'number') {
            val = Number(val);
            return isNaN(val as number) ? null : val;
          }
          
          return val;
        });

        return {
          name: columnName,
          type,
          values: values as (string | number | boolean | null)[]
        };
      });

      const newDataset: DataSet = {
        id: `dataset-${Date.now()}`,
        name: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
        columns,
        rowCount: data.length,
        uploadedAt: new Date()
      };

      setDatasets(prev => [...prev, newDataset]);
      setCurrentDatasetState(newDataset);
      
      // Analyze the new dataset
      const results = await analyzeData(newDataset);
      setStats(results.stats);
      setInsights(results.insights);
      setPredictions(results.predictions);
    } catch (error) {
      console.error('Error adding dataset:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeDataset = (datasetId: string) => {
    setDatasets(prev => prev.filter(ds => ds.id !== datasetId));
    if (currentDataset?.id === datasetId) {
      setCurrentDatasetState(null);
      setStats([]);
      setInsights([]);
      setPredictions([]);
    }
  };

  // Simplified analysis function - in a real app this would be more sophisticated
  const analyzeData = async (dataset: DataSet): Promise<{ stats: DataStats[], insights: Insight[], predictions: Prediction[] }> => {
    // Calculate statistics for each column
    const calculatedStats: DataStats[] = dataset.columns.map(column => {
      const nonNullValues = column.values.filter(v => v !== null && v !== undefined) as (number | string)[];
      const missingCount = column.values.length - nonNullValues.length;
      
      let stats: DataStats = {
        column: column.name,
        type: column.type,
        count: column.values.length,
        unique: new Set(nonNullValues).size,
        missing: missingCount,
      };
      
      // Calculate numeric statistics if applicable
      if (column.type === 'number') {
        const numericValues = nonNullValues.filter(v => typeof v === 'number') as number[];
        if (numericValues.length > 0) {
          const sorted = [...numericValues].sort((a, b) => a - b);
          const sum = numericValues.reduce((acc, val) => acc + val, 0);
          const mean = sum / numericValues.length;
          const median = sorted[Math.floor(sorted.length / 2)];
          
          // Calculate standard deviation
          const squaredDiffs = numericValues.map(value => Math.pow(value - mean, 2));
          const avgSquaredDiff = squaredDiffs.reduce((acc, val) => acc + val, 0) / squaredDiffs.length;
          const std = Math.sqrt(avgSquaredDiff);
          
          stats = {
            ...stats,
            mean: parseFloat(mean.toFixed(2)),
            median: parseFloat(median.toFixed(2)),
            std: parseFloat(std.toFixed(2)),
            min: Math.min(...numericValues),
            max: Math.max(...numericValues)
          };
        }
      }
      
      return stats;
    });
    
    // Generate some basic insights based on the data
    const generatedInsights: Insight[] = [
      {
        id: `insight-${Date.now()}-1`,
        type: 'trend',
        title: `${dataset.rowCount} records analyzed`,
        description: `Successfully loaded ${dataset.rowCount} records with ${dataset.columns.length} columns.`,
        confidence: 1.0,
        impact: 'low',
        relatedColumns: dataset.columns.map(col => col.name),
        timestamp: new Date()
      }
    ];
    
    // Generate basic predictions based on numerical columns
    const numericColumns = dataset.columns.filter(col => col.type === 'number');
    const generatedPredictions: Prediction[] = numericColumns.slice(0, 2).map((col, idx) => {
      const numericValues = col.values.filter(v => v !== null && typeof v === 'number') as number[];
      if (numericValues.length === 0) return null;
      
      // Simple average-based prediction
      const avg = numericValues.reduce((sum, val) => sum + val, 0) / numericValues.length;
      const lastValue = numericValues[numericValues.length - 1];
      const trend: 'up' | 'down' | 'stable' = lastValue > avg ? 'up' : lastValue < avg ? 'down' : 'stable';
      
      return {
        column: col.name,
        futureValues: Array.from({ length: 6 }, (_, i) => ({
          date: `Period ${i + 1}`,
          value: parseFloat((avg + (i + 1) * (lastValue - avg) * 0.1).toFixed(2)),
          confidence: 0.85 - (i * 0.05)
        })),
        trend,
        accuracy: 0.8
      };
    }).filter(Boolean) as Prediction[];

    return {
      stats: calculatedStats,
      insights: generatedInsights,
      predictions: generatedPredictions
    };
  };

  const value: DataContextType = {
    datasets,
    currentDataset,
    stats,
    insights,
    predictions,
    loading,
    addDataset,
    setCurrentDataset,
    removeDataset,
    analyzeData
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};