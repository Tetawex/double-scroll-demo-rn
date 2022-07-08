import {AppTheme, useThemedStyles} from '@theme';
import React from 'react';
import {
  ImageStyle,
  Platform,
  StatusBar,
  StatusBarStyle,
  StyleProp,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {BackButton} from './BackButton';

type Props = {
  style?: StyleProp<ViewStyle>;
  title: string;
  onBackPress?: () => void;
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

const AndroidAppBar = ({
  style,
  title,
  onBackPress,
}: Props): React.ReactElement => {
  const styles = useThemedStyles(styleFnAndroid);

  return (
    <View style={[styles.container, style]}>
      <StatusBar
        backgroundColor={styles.statusBar.color}
        barStyle={styles.statusBar.barStyle}
      />
      <BackButton style={styles.backButton} onPress={onBackPress} />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const IosAppBar = ({style, title, onBackPress}: Props): React.ReactElement => {
  const styles = useThemedStyles(styleFnIos);

  return (
    <View style={[styles.container, style]}>
      <StatusBar barStyle={styles.statusBar.barStyle} />
      <View style={styles.horizontalContainer}>
        <View style={styles.leftContainer}>
          <BackButton style={styles.backButton} onPress={onBackPress} />
        </View>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.rightContainer}>
          <View style={styles.divider} />
        </View>
      </View>
    </View>
  );
};

const styleFnCommon = (theme: AppTheme) => ({
  title: {
    ...theme.typography.appBar,
    color: theme.colors.onBackground,
  } as TextStyle,
  backButton: {marginRight: 12} as ImageStyle,
});

const styleFnAndroid = (theme: AppTheme) => ({
  ...styleFnCommon(theme),
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
  ...styleFnCommon(theme),
  container: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 16,
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  horizontalContainer: {
    flex: 1,
  } as ViewStyle,
  statusBar: {
    barStyle: 'dark-content' as StatusBarStyle,
  },
  divider: {
    alignSelf: 'stretch',
    backgroundColor: theme.colors.primaryDark,
    height: 1,
  } as ViewStyle,
  leftContainer: {flex: 1} as ViewStyle,
  rightContainer: {flex: 1} as ViewStyle,
});
