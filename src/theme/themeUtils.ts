import {useContext, useMemo} from 'react';
import {AppTheme} from './AppTheme';
import {ThemeContext} from './ThemeContext';

export const useTheme = (): AppTheme => {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw Error('No theme provided');
  }

  return theme;
};

export type ThemedStyleFunction<TStyle> = (theme: AppTheme) => TStyle;

export const useThemedStyles = <TStyle>(
  styleFn: ThemedStyleFunction<TStyle>,
): TStyle => {
  const theme = useTheme();
  return useMemo(() => styleFn(theme), [styleFn, theme]);
};
