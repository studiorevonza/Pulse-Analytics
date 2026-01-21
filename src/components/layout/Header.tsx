import { Brain, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProfileDropdown } from '@/components/profile/ProfileDropdown';

interface HeaderProps {
  onUploadClick: () => void;
}

export const Header = ({ onUploadClick }: HeaderProps) => {
  return (
    <header className="h-16 border-b border-border bg-card/90 backdrop-blur-xl sticky top-0 z-50">
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-md">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold gradient-text">DataMind AI</h1>
            <p className="text-xs text-muted-foreground">Intelligent Analytics</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="glass" size="sm" onClick={onUploadClick}>
            <Upload className="w-4 h-4" />
            Upload Data
          </Button>
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
};
