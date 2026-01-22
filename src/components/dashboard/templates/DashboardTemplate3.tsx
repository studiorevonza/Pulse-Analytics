import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SalesChart } from '../../charts/SalesChart';
import { CategoryChart } from '../../charts/CategoryChart';
import { CorrelationChart } from '../../charts/CorrelationChart';
import { RegionChart } from '../../charts/RegionChart';
import { useData } from '@/contexts/DataContext';
import { DashboardConfig } from '../DashboardSelector';

interface DashboardTemplate3Props {
  config: DashboardConfig;
}

export const DashboardTemplate3: React.FC<DashboardTemplate3Props> = ({ config }) => {
  const { currentDataset } = useData();

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Data Visualization Dashboard</h1>
          <p className="text-muted-foreground">
            {currentDataset ? 
              `Visualizing data from ${currentDataset.name} (${currentDataset.rowCount} records)` : 
              'Upload data to visualize your analytics'
            }
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {config.showCharts && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Trend Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <SalesChart />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Category Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <CategoryChart />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Correlation Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <CorrelationChart />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Regional Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <RegionChart />
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Data Summary */}
      {config.showRecentActivity && (
        <Card>
          <CardHeader>
            <CardTitle>Data Summary</CardTitle>
          </CardHeader>
          <CardContent>
            {currentDataset ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{currentDataset.rowCount}</p>
                  <p className="text-sm text-muted-foreground">Total Records</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{currentDataset.columns.length}</p>
                  <p className="text-sm text-muted-foreground">Total Columns</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">
                    {currentDataset.columns.filter(c => c.type === 'number').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Numeric Fields</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">
                    {currentDataset.columns.filter(c => c.type === 'string').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Text Fields</p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Upload data to see summary statistics
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};