import { TrendingUp, AlertTriangle, Link2, Repeat, Zap } from 'lucide-react';
import { Insight } from '@/types/data';
import { cn } from '@/lib/utils';

interface InsightCardProps {
  insight: Insight;
}

const iconMap = {
  trend: TrendingUp,
  anomaly: AlertTriangle,
  correlation: Link2,
  pattern: Repeat,
  prediction: Zap,
};

const colorMap = {
  trend: 'text-success border-l-success',
  anomaly: 'text-warning border-l-warning',
  correlation: 'text-info border-l-info',
  pattern: 'text-chart-4 border-l-chart-4',
  prediction: 'text-primary border-l-primary',
};

export const InsightCard = ({ insight }: InsightCardProps) => {
  const Icon = iconMap[insight.type];

  return (
    <div className={cn(
      "insight-card animate-slide-up bg-background/30 backdrop-blur-sm rounded-xl border border-border/50 p-4",
      colorMap[insight.type].split(' ')[1]
    )}>
      <div className="flex items-start gap-3">
        <div className={cn(
          "p-2 rounded-lg",
          `bg-${insight.type === 'trend' ? 'success' : insight.type === 'anomaly' ? 'warning' : insight.type === 'prediction' ? 'primary' : 'info'}/10`
        )}>
          <Icon className={cn("w-4 h-4", colorMap[insight.type].split(' ')[0])} />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-medium text-sm">{insight.title}</h4>
            <span className={cn(
              "text-xs px-2 py-0.5 rounded-full",
              insight.impact === 'high' && "bg-destructive/10 text-destructive",
              insight.impact === 'medium' && "bg-warning/10 text-warning",
              insight.impact === 'low' && "bg-muted text-muted-foreground"
            )}>
              {insight.impact} impact
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{insight.description}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-muted-foreground">
              {Math.round(insight.confidence * 100)}% confidence
            </span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-primary">
              {insight.relatedColumns.join(', ')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
