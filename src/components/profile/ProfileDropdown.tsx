import { useState } from 'react';
import { User, Settings, LogOut, Moon, Sun, ChevronDown, Bell, Shield, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/components/theme/ThemeProvider';
import { toast } from '@/hooks/use-toast';

interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

const defaultProfile: UserProfile = {
  name: 'John Doe',
  email: 'john.doe@company.com',
  role: 'Data Analyst',
};

export const ProfileDropdown = () => {
  const { theme, toggleTheme } = useTheme();
  const [profile] = useState<UserProfile>(defaultProfile);
  const [notifications, setNotifications] = useState(true);

  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const handleNotificationToggle = () => {
    setNotifications(!notifications);
    toast({
      title: notifications ? "Notifications disabled" : "Notifications enabled",
      description: notifications 
        ? "You won't receive notifications anymore." 
        : "You will now receive notifications.",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 px-2 hover:bg-secondary">
          <Avatar className="h-8 w-8">
            <AvatarImage src={profile.avatar} alt={profile.name} />
            <AvatarFallback className="bg-primary/20 text-primary text-sm">
              {profile.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:flex flex-col items-start">
            <span className="text-sm font-medium text-foreground">{profile.name}</span>
            <span className="text-xs text-muted-foreground">{profile.role}</span>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72 bg-card border-border" align="end">
        <DropdownMenuLabel className="p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={profile.avatar} alt={profile.name} />
              <AvatarFallback className="bg-primary/20 text-primary">
                {profile.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold text-foreground">{profile.name}</span>
              <span className="text-sm text-muted-foreground">{profile.email}</span>
              <span className="text-xs text-primary mt-1">{profile.role}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border" />
        
        {/* Theme Toggle */}
        <div className="px-2 py-2">
          <div className="flex items-center justify-between px-2 py-2 rounded-md hover:bg-secondary transition-colors">
            <div className="flex items-center gap-2">
              {theme === 'dark' ? (
                <Moon className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Sun className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="text-sm text-foreground">Dark Mode</span>
            </div>
            <Switch 
              checked={theme === 'dark'} 
              onCheckedChange={toggleTheme}
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </div>

        {/* Notifications Toggle */}
        <div className="px-2 pb-2">
          <div className="flex items-center justify-between px-2 py-2 rounded-md hover:bg-secondary transition-colors">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-foreground">Notifications</span>
            </div>
            <Switch 
              checked={notifications} 
              onCheckedChange={handleNotificationToggle}
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </div>

        <DropdownMenuSeparator className="bg-border" />
        
        <DropdownMenuItem className="px-4 py-2.5 cursor-pointer hover:bg-secondary focus:bg-secondary">
          <User className="mr-3 h-4 w-4 text-muted-foreground" />
          <span className="text-foreground">Edit Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="px-4 py-2.5 cursor-pointer hover:bg-secondary focus:bg-secondary">
          <Settings className="mr-3 h-4 w-4 text-muted-foreground" />
          <span className="text-foreground">Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="px-4 py-2.5 cursor-pointer hover:bg-secondary focus:bg-secondary">
          <Shield className="mr-3 h-4 w-4 text-muted-foreground" />
          <span className="text-foreground">Privacy & Security</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="px-4 py-2.5 cursor-pointer hover:bg-secondary focus:bg-secondary">
          <HelpCircle className="mr-3 h-4 w-4 text-muted-foreground" />
          <span className="text-foreground">Help & Support</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="bg-border" />
        
        <DropdownMenuItem 
          className="px-4 py-2.5 cursor-pointer text-destructive hover:bg-destructive/10 focus:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
