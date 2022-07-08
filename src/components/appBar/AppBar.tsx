import {AppTheme, useThemedStyles} from '@theme';
import React from 'react';
import {
  Platform,
  StatusBar,
  StatusBarStyle,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';

type Props = {
  style?: StyleProp<ViewStyle>;
  content: React.ReactNode;
};

export const AppBar = (props: Props): React.ReactElement => {
  const platform = Platform.OS;

  switch (platform) {
    case 'ios':
      return <IosAppBar {...props} />;
    case 'android':
      return <AndroidAppBar {...props} />;
    default:
      return <></>;
  }
};

const AndroidAppBar = ({style, content}: Props): React.ReactElement => {
  const styles = useThemedStyles(styleFnAndroid);

  return (
    <View style={[styles.container, style]}>
      <StatusBar
        backgroundColor={styles.statusBar.color}
        barStyle={styles.statusBar.barStyle}
      />
      {content}
    </View>
  );
};

const IosAppBar = ({style, content}: Props): React.ReactElement => {
  const styles = useThemedStyles(styleFnIos);

  return (
    <View style={[styles.container, style]}>
      <StatusBar barStyle={styles.statusBar.barStyle} />
      {content}
      <View style={styles.divider} />
    </View>
  );
};

const styleFnAndroid = (theme: AppTheme) => ({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.primary,
    elevation: 4,
    paddingHorizontal: 16,
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'flex-start',
  } as ViewStyle,
  statusBar: {
    color: theme.colors.primaryDark,
    barStyle: 'dark-content' as StatusBarStyle,
  },
});

const styleFnIos = (theme: AppTheme) => ({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 16,
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  statusBar: {
    barStyle: 'dark-content' as StatusBarStyle,
  },
  divider: {
    alignSelf: 'stretch',
    backgroundColor: theme.colors.primaryDark,
    height: 1,
  } as ViewStyle,
});
