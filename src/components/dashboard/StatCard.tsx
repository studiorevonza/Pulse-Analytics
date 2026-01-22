import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'stable';
  className?: string;
}

export const StatCard = ({ title, value, change, icon: Icon, trend, className }: StatCardProps) => {
  return (
    <div className={cn("stat-card group bg-background/30 backdrop-blur-sm rounded-xl border border-border/50 p-4", className)}>
      <div className="flex items-start justify-between">
        <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        {change !== undefined && (
          <span className={cn(
            "text-xs font-medium px-2 py-1 rounded-full",
            trend === 'up' && "bg-success/10 text-success",
            trend === 'down' && "bg-destructive/10 text-destructive",
            trend === 'stable' && "bg-muted text-muted-foreground"
          )}>
            {trend === 'up' && '+'}
            {change}%
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
    </div>
  );
};
