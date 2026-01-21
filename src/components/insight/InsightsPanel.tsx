import { Lightbulb, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InsightCard } from './InsightCard';
import { generateInsights } from '@/lib/sampleData';

export const InsightsPanel = () => {
  const insights = generateInsights();

  return (
    <div className="p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-accent" />
            </div>
            AI-Generated Insights
          </h2>
          <p className="text-muted-foreground mt-1">
            Automatically discovered patterns and recommendations from your data
          </p>
        </div>
        <Button variant="glass">
          <RefreshCw className="w-4 h-4" />
          Refresh Analysis
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {insights.map((insight, index) => (
          <div 
            key={insight.id} 
            style={{ animationDelay: `${index * 100}ms` }}
            className="animate-slide-up"
          >
            <InsightCard insight={insight} />
          </div>
        ))}
      </div>

      <div className="mt-8 glass-card p-6">
        <h3 className="font-semibold mb-4">Summary Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-2xl font-bold text-primary">{insights.length}</p>
            <p className="text-sm text-muted-foreground">Total Insights</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-destructive">
              {insights.filter(i => i.impact === 'high').length}
            </p>
            <p className="text-sm text-muted-foreground">High Impact</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-success">
              {Math.round(insights.reduce((acc, i) => acc + i.confidence, 0) / insights.length * 100)}%
            </p>
            <p className="text-sm text-muted-foreground">Avg Confidence</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-accent">
              {insights.filter(i => i.type === 'prediction').length}
            </p>
            <p className="text-sm text-muted-foreground">Predictions</p>
          </div>
        </div>
      </div>
    </div>
  );
};
