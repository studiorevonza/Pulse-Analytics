import { 
  LayoutDashboard, 
  MessageSquare, 
  BarChart3, 
  TrendingUp, 
  Lightbulb, 
  Database,
  FileSpreadsheet,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Tab = 'dashboard' | 'chat' | 'charts' | 'predictions' | 'insights' | 'data';

interface SidebarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const navItems = [
  { id: 'dashboard' as Tab, icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'chat' as Tab, icon: MessageSquare, label: 'AI Chat' },
  { id: 'charts' as Tab, icon: BarChart3, label: 'Visualizations' },
  { id: 'predictions' as Tab, icon: TrendingUp, label: 'Predictions' },
  { id: 'insights' as Tab, icon: Lightbulb, label: 'Insights' },
  { id: 'data' as Tab, icon: Database, label: 'Data Explorer' },
];

export const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  return (
    <aside className="w-64 border-r border-border bg-card/50 backdrop-blur-sm flex flex-col">
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-primary/10 text-primary border border-primary/30 shadow-sm" 
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive && "text-primary")} />
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-border">
        <div className="glass-card p-4">
          <div className="flex items-center gap-3 mb-3">
            <FileSpreadsheet className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">Active Dataset</span>
          </div>
          <p className="text-xs text-muted-foreground mb-1">Sales Data 2024</p>
          <p className="text-xs text-primary">240 rows • 6 columns</p>
        </div>
      </div>
    </aside>
  );
};
