import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { LightTheme, DarkTheme } from '../constants/themes';
import { Theme } from '../types/theme';
import { Appearance } from 'react-native';
import { storage } from '../utils/Storage';

type ThemeMode = 'light' | 'dark' | 'system';

type ThemeContextType = {
  theme: Theme;
  isDarkMode: boolean;
  themeMode: ThemeMode;
  toggleTheme: (mode?: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: LightTheme,
  isDarkMode: false,
  themeMode: 'light',
  toggleTheme: () => {},
});

const THEME_KEY = 'user-theme'; // 'light' | 'dark' | 'system'

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // React to system theme changes
  useEffect(() => {
    const listener = ({
      colorScheme,
    }: {
      colorScheme: 'light' | 'dark' | null;
    }) => {
      if (themeMode === 'system') {
        setIsDarkMode(colorScheme === 'dark');
      }
    };

    const subscription = Appearance.addChangeListener(listener);
    return () => subscription.remove();
  }, [themeMode]);

  // Load theme preference from local storage
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = storage.getString(THEME_KEY) as ThemeMode | null;
        const systemScheme = Appearance.getColorScheme();

        const modeToUse = savedTheme || 'system';
        setThemeMode(modeToUse);

        if (modeToUse === 'system') {
          setIsDarkMode(systemScheme === 'dark');
        } else {
          setIsDarkMode(modeToUse === 'dark');
        }
      } catch (e) {
        console.error('Failed to load theme from storage', e);
      }
    };
    loadTheme();
  }, []);

  // Allow toggling or setting a specific theme
  const toggleTheme = async (mode?: ThemeMode) => {
    let newMode: ThemeMode;

    if (mode) {
      newMode = mode;
    } else {
      newMode = isDarkMode ? 'light' : 'dark';
    }

    setThemeMode(newMode);

    if (newMode === 'system') {
      const systemScheme = Appearance.getColorScheme();
      setIsDarkMode(systemScheme === 'dark');
    } else {
      setIsDarkMode(newMode === 'dark');
    }

    try {
      storage.set(THEME_KEY, newMode as string);
    } catch (e) {
      console.error('Failed to save theme', e);
    }
  };

  const theme = isDarkMode ? DarkTheme : LightTheme;

  return (
    <ThemeContext.Provider
      value={{ theme, isDarkMode, themeMode, toggleTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
