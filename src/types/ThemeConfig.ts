import { Theme } from './Theme';

export interface ThemeConfig {
  theme: Theme;
  setTheme: (theme: Theme) => void;
} 