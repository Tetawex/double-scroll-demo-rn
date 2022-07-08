import React from 'react';
import {AppTheme} from './AppTheme';

export const ThemeContext = React.createContext<AppTheme | null>(null);

export const ThemeProvider = ThemeContext.Provider;
