import { createContext, useContext, useEffect, useState } from 'react';

// Permanently set theme to light only
const theme = 'light';

type ThemeContextType = {
  theme: 'light';
  setTheme: (theme: 'light') => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // Initialize theme to light and always keep it as light
  const [, setInternalTheme] = useState<'light'>('light');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('dark'); // Ensure dark class is removed
    root.classList.add('light');
    localStorage.setItem('datamind-theme', 'light');
  }, []);

  const setTheme = () => {
    // Do nothing - theme is permanently light
  };

  const toggleTheme = () => {
    // Do nothing - no toggling available
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
