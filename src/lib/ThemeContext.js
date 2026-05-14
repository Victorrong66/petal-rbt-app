import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_KEY = 'petal_theme';

export const light = {
  rose:    '#d4785a',
  bud:     '#7aaa88',
  thorn:   '#a094c0',
  bg:      '#faf5ee',
  surface: '#f5ede0',
  card:    '#fffaf4',
  border:  '#e8d5be',
  text:    '#3d2c1e',
  muted:   '#9a7a60',
  header:  '#fffaf4',
};

export const dim = {
  rose:    '#c87060',
  bud:     '#6a9a78',
  thorn:   '#9088b8',
  bg:      '#1c1812',
  surface: '#252018',
  card:    '#2c2618',
  border:  '#3e3225',
  text:    '#f0e4d0',
  muted:   '#8a7055',
  header:  '#252018',
};

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [isDim, setIsDim] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then(v => {
      if (v === 'dim') setIsDim(true);
    });
  }, []);

  function toggleTheme() {
    const next = !isDim;
    setIsDim(next);
    AsyncStorage.setItem(THEME_KEY, next ? 'dim' : 'light');
  }

  return (
    <ThemeContext.Provider value={{ colors: isDim ? dim : light, isDim, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
