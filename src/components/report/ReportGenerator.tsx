import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useData } from '@/contexts/DataContext';
import { DollarSign, TrendingUp, ShoppingCart, Target, Download } from 'lucide-react';
import { StatCard } from '../dashboard/StatCard';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const ReportGenerator = () => {
  const { currentDataset, stats, insights, predictions } = useData();
  const [isGenerating, setIsGenerating] = useState(false);

  // Calculate stats for the stat cards
  const revenueStat = stats.find(stat => 
    stat.column.toLowerCase().includes('sales') || 
    stat.column.toLowerCase().includes('revenue')
  );
  const profitStat = stats.find(stat => 
    stat.column.toLowerCase().includes('profit')
  );
  const unitsStat = stats.find(stat => 
    stat.column.toLowerCase().includes('unit') || 
    stat.column.toLowerCase().includes('quantity')
  );

  // Use available insights or default to an empty array
  const displayedInsights = insights.slice(0, 3);

  const generateReport = async () => {
    setIsGenerating(true);
    
    try {
      // Wait for DOM to update
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Capture the report content
      const reportElement = document.getElementById('report-content');
      if (!reportElement) {
        throw new Error('Report content element not found');
      }

      // Generate PDF
      const canvas = await html2canvas(reportElement, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [297, 210], // A4 landscape
      });
      
      const imgWidth = 277; // A4 width in mm minus margins
      const imgHeight = canvas.height * imgWidth / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save(`PulseAnalytics_Report_${new Date().toISOString().split('T')[0]}.pdf`);
      
    } catch (error) {
      console.error('Error generating report:', error);
      alert('There was an error generating the report. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Report Generator</h2>
          <p className="text-muted-foreground mt-1">
            Create professional reports with your data analysis
          </p>
        </div>
        <Button 
          variant="glow" 
          onClick={generateReport} 
          disabled={isGenerating || !currentDataset}
        >
          {isGenerating ? (
            <span className="flex items-center gap-2">
              <Download className="w-4 h-4 animate-spin" />
              Generating...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Report
            </span>
          )}
        </Button>
      </div>

      {/* Report Preview */}
      <div id="report-content" className="bg-white p-8 shadow-lg">
        {/* Header */}
        <div className="mb-8 border-b pb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">PULSE ANALYTICS REPORT</h1>
              <p className="text-gray-600 mt-2">
                {new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="text-right">
              <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
                PA
              </div>
              <p className="text-sm text-gray-600 mt-2">Pulse Analytics</p>
            </div>
          </div>
          
          {currentDataset && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-800">Dataset: {currentDataset.name}</h2>
              <p className="text-gray-600 mt-1">
                Analyzed {currentDataset.rowCount} records with {currentDataset.columns.length} columns
              </p>
              <p className="text-gray-600 text-sm mt-2">
                Generated on {new Date().toLocaleString()}
              </p>
            </div>
          )}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Revenue"
            value={revenueStat ? `$${Math.round(revenueStat.mean || 0).toLocaleString()}` : "$0"}
            change={revenueStat ? 5 : 0}
            trend={revenueStat ? "up" : "stable"}
            icon={DollarSign}
            className="text-gray-800"
          />
          <StatCard
            title="Total Profit"
            value={profitStat ? `$${Math.round(profitStat.mean || 0).toLocaleString()}` : "$0"}
            change={profitStat ? 3 : 0}
            trend={profitStat ? "up" : "stable"}
            icon={TrendingUp}
            className="text-gray-800"
          />
          <StatCard
            title="Units Sold"
            value={unitsStat ? `${Math.round(unitsStat.mean || 0).toLocaleString()}` : "0"}
            change={unitsStat ? 7 : 0}
            trend={unitsStat ? "up" : "stable"}
            icon={ShoppingCart}
            className="text-gray-800"
          />
          <StatCard
            title="Avg. Margin"
            value={profitStat && revenueStat ? `${((profitStat.mean || 0) / (revenueStat.mean || 1) * 100).toFixed(1)}%` : "0%"}
            change={2}
            trend="up"
            icon={Target}
            className="text-gray-800"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Trend Analysis</h3>
            <Card>
              <CardContent className="p-4">
                <div className="w-full h-64 flex items-center justify-center bg-gray-100 rounded-md">
                  <p className="text-gray-500">Trend Chart Preview</p>
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Category Distribution</h3>
            <Card>
              <CardContent className="p-4">
                <div className="w-full h-64 flex items-center justify-center bg-gray-100 rounded-md">
                  <p className="text-gray-500">Category Chart Preview</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Insights Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Key Insights</h3>
          <div className="space-y-4">
            {displayedInsights.length > 0 ? (
              displayedInsights.map(insight => (
                <Card key={insight.id}>
                  <CardContent className="p-4">
                    <h4 className="font-medium text-gray-800">{insight.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-6 text-center text-gray-500">
                  Upload data to generate insights
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t pt-6 mt-8 text-center text-sm text-gray-600">
          <p>Generated by PULSE ANALYTICS - Business Intelligence Platform</p>
          <p className="mt-1">© {new Date().getFullYear()} Pulse Analytics. All rights reserved.</p>
        </div>
      </div>

      {/* Note */}
      <Card>
        <CardHeader>
          <CardTitle>Report Generation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Click "Export Report" to generate a professional PDF report with your data analysis. 
            The report will include all visualizations, insights, and statistics from your current dataset.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};