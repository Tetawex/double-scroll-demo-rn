import {ColorValue, Platform, TextStyle} from 'react-native';

export type AppTheme = {
  colors: {
    primary: ColorValue;
    primaryDark: ColorValue;
    onPrimary: ColorValue;
    secondary: ColorValue;
    secondaryDark: ColorValue;
    background: ColorValue;
    onBackground: ColorValue;
    onBackgroundLight: ColorValue;
    onBackgroundBorder: ColorValue;
  };
  typography: {
    appBar: TextStyle;
    headline2: TextStyle;
    headline2Bold: TextStyle;
    subtitle: TextStyle;
    subtitleBold: TextStyle;
    body: TextStyle;
    button: TextStyle;
  };
};

export const lightAppTheme: AppTheme = {
  colors: {
    primary: Platform.OS === 'ios' ? '#aaaaaa' : '#ffffff',
    primaryDark: Platform.OS === 'ios' ? '#757575' : '#f1f1f1',
    onPrimary: '#212121',
    secondary: '#c3dbee',
    secondaryDark: '#97c3e5',
    background: '#ffffff',
    onBackground: '#212121',
    onBackgroundLight: '#a1a1a1',
    onBackgroundBorder: '#d5d5d5',
  },
  typography: {
    appBar: {
      fontSize: 18,
      lineHeight: 20,
      fontWeight: 'bold',
    },
    headline2: {
      fontSize: 16,
      lineHeight: 18,
    },
    headline2Bold: {
      fontSize: 16,
      lineHeight: 18,
      fontWeight: 'bold',
    },
    body: {
      fontSize: 14,
      lineHeight: 16,
    },
    subtitle: {
      fontSize: 14,
      lineHeight: 16,
    },
    subtitleBold: {
      fontSize: 14,
      lineHeight: 16,
      fontWeight: 'bold',
    },
    button: {
      fontSize: 14,
      lineHeight: 16,
      fontWeight: 'bold',
    },
  },
};
